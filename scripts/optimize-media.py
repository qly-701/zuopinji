"""Build web-only media derivatives; never overwrite portfolio/PDF source assets.

Run: python scripts/optimize-media.py [--skip-video]
Requires Pillow, ffmpeg and ffprobe. Paths in mediaManifest.json are keyed by
the original public URL so the application can choose a display-size variant.
"""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
import json
from pathlib import Path
import subprocess

from PIL import Image, ImageOps, ImageStat, ImageChops


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
OUTPUT = ASSETS / "optimized"
MANIFEST_PATH = ROOT / "src/mediaManifest.json"
REPORT_PATH = Path("/workspace/work/perf-media.json")


def source_data():
    result = subprocess.run(
        ["node", "--input-type=module", "-e",
         "import {projects,profile} from './src/data.js';"
         "console.log(JSON.stringify({projects,profile}));"],
        cwd=ROOT, capture_output=True, text=True, check=True,
    )
    return json.loads(result.stdout)


def image_inventory(data):
    inventory = {}

    def add(url, role):
        entry = inventory.setdefault(url, {"url": url, "roles": []})
        if role not in entry["roles"]:
            entry["roles"].append(role)

    for project in data["projects"]:
        add(project["image"], "project-cover")
        for panel in project.get("gallery", []):
            add(panel["image"], "project-detail")
    # These are the mounted study panels, not unused PDFs or old placeholder art.
    for name in ("cover", "rear", "platform", "chassis", "cargo"):
        add(f"/assets/robot/{name}.jpg", "project-detail")
    for name in ("principle", "assembly", "drawings", "analysis", "soft-grip"):
        add(f"/assets/drone/{name}.jpg", "project-detail")
    add("/assets/interstellar.jpg", "hero-poster")
    add(data["profile"]["portrait"], "portrait")
    software_media = json.loads((ROOT / "src/softwareMedia.json").read_text())
    for media in software_media.values():
        add(media["image"], "software-screenshot")
    return list(inventory.values())


def url_for(path):
    return "/" + path.relative_to(PUBLIC).as_posix()


def variant_for(path, width, height):
    return {"src": url_for(path), "width": width, "height": height,
            "bytes": path.stat().st_size}


def encode_image(item):
    source = PUBLIC / item["url"].lstrip("/")
    roles = item["roles"]
    with Image.open(source) as opened:
        original = ImageOps.exif_transpose(opened).convert("RGB")
    width, height = original.size
    screenshot = "software-screenshot" in roles or "/lighting/" in item["url"]
    poster = "hero-poster" in roles
    portrait = "portrait" in roles
    # Native WebP screenshots retain their exact original full-resolution file.
    # Resizing text-heavy screenshots is only for small cards; the lightbox gets
    # the untouched source. Nothing is cropped, sharpened, redrawn or upscaled.
    preserve_original_full = source.suffix.lower() == ".webp"
    targets = [800, 1200] if poster else [320, 480, 800] if portrait else [480, 800, 1200]
    targets = sorted(set(min(target, width) for target in targets) | {width})
    variants = []
    rejected = []
    destination = OUTPUT / source.relative_to(ASSETS).parent
    destination.mkdir(parents=True, exist_ok=True)
    quality = 94 if screenshot else 87 if "project-detail" in roles else 85
    quality = 83 if poster else quality
    for target in targets:
        target_height = max(1, round(height * target / width))
        if target == width and preserve_original_full:
            variants.append(variant_for(source, width, height))
            continue
        resized = original if target == width else original.resize(
            (target, target_height), Image.Resampling.LANCZOS)
        encoded = BytesIO()
        resized.save(encoded, "WEBP", quality=quality, method=6)
        # A source that is already smaller wins, rather than generating a larger
        # resource just to change its extension.
        if len(encoded.getvalue()) >= source.stat().st_size:
            rejected.append({"width": target, "encodedBytes": len(encoded.getvalue()),
                             "reason": "original is smaller"})
            continue
        path = destination / f"{source.stem}-{target}.webp"
        path.write_bytes(encoded.getvalue())
        variants.append(variant_for(path, target, target_height))
    if not any(value["width"] == width for value in variants):
        variants.append(variant_for(source, width, height))
    variants.sort(key=lambda value: value["width"])

    def choose(target):
        return next((value for value in variants if value["width"] >= target), variants[-1])

    thumb = choose(320 if portrait else 480)
    card = choose(800)
    full = variants[-1]
    sizes = {"reel": "(max-width: 1148px) 155px, (min-width: 1704px) 230px, 13.5vw",
             "card": "(max-width: 760px) calc(100vw - 40px), (max-width: 1150px) 46vw, (min-width: 1800px) 549px, 32vw",
             "filteredCard": "(max-width: 760px) calc(100vw - 40px), (min-width: 1800px) 837px, 48vw",
             "detail": "(max-width: 760px) calc(100vw - 44px), 1000px"}
    if screenshot:
        sizes["card"] = "(max-width: 760px) 46vw, (max-width: 1150px) 30vw, (min-width: 1800px) 409px, 23vw"
    if poster:
        sizes["card"] = "100vw"
    entry = {"type": "image", "thumb": thumb["src"], "card": card["src"],
             "full": full["src"],
             "srcSet": ", ".join(f"{value['src']} {value['width']}w" for value in variants),
             "sizes": sizes, "dimensions": {"width": width, "height": height},
             "variants": variants, "sourceBytes": source.stat().st_size,
             "roles": roles}
    # Numeric difference is a diagnostic only; visual review of lines, labels
    # and photo details is still required before choosing an encoding.
    with Image.open(PUBLIC / full["src"].lstrip("/")) as result:
        difference = ImageChops.difference(original, result.convert("RGB"))
        mean_error = sum(ImageStat.Stat(difference).mean) / 3
    return item["url"], entry, {"source": item["url"], "sourceBytes": entry["sourceBytes"],
            "thumbBytes": thumb["bytes"], "cardBytes": card["bytes"],
            "fullBytes": full["bytes"], "fullMeanAbsoluteRGBError": round(mean_error, 3),
            "rejectedCandidates": rejected}


def probe(path):
    result = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
        "format=duration,size,bit_rate:stream=codec_type,codec_name,width,height,avg_frame_rate,nb_frames",
        "-of", "json", str(path)], capture_output=True, text=True, check=True)
    return json.loads(result.stdout)


def encode_video(manifest, skip):
    source = ASSETS / "interstellar-loop.mp4"
    original = probe(source)
    candidates = []
    for crf in (28, 30):
        path = OUTPUT / f"interstellar-loop-1280-crf{crf}.mp4"
        if not skip:
            subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(source), "-an", "-vf", "scale=1280:-2:flags=lanczos,fps=24",
                "-c:v", "libx264", "-preset", "slow", "-tune", "film", "-crf", str(crf),
                "-pix_fmt", "yuv420p", "-profile:v", "high", "-g", "96",
                "-movflags", "+faststart", "-threads", "2", str(path)], check=True)
        if not path.exists():
            continue
        metadata = probe(path)
        stream = next(value for value in metadata["streams"] if value["codec_type"] == "video")
        candidates.append({"src": url_for(path), "bytes": path.stat().st_size,
            "width": stream["width"], "height": stream["height"], "fps": 24,
            "duration": float(metadata["format"]["duration"]), "crf": crf,
            "audio": False, "faststart": True})
    # CRF28 is the default: retain fine cinematic texture and smooth downscaled
    # movement. CRF30 remains a smaller reviewed candidate, not an automatic swap.
    if candidates:
        selected = candidates[0]
        manifest["/assets/interstellar-loop.mp4"] = {"type": "video", **selected,
            "sourceBytes": source.stat().st_size, "poster": manifest["/assets/interstellar.jpg"]["full"],
            "candidates": candidates}
    return {"source": "/assets/interstellar-loop.mp4", "original": original,
            "selected": candidates[0] if candidates else None, "candidates": candidates}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skip-video", action="store_true", help="reuse existing video candidates")
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    data = source_data()
    inventory = image_inventory(data)
    manifest, image_report = {}, []
    with ThreadPoolExecutor(max_workers=4) as executor:
        for url, entry, record in executor.map(encode_image, inventory):
            manifest[url] = entry
            image_report.append(record)
    video_report = encode_video(manifest, args.skip_video)
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    runtime = {}
    for url, item in manifest.items():
        if item["type"] == "image":
            runtime[url] = {key: item[key] for key in ("thumb", "card", "full", "srcSet", "sizes")}
            runtime[url].update(item["dimensions"])
        else:
            runtime[url] = {key: item[key] for key in ("src", "width", "height", "poster")}
    (ROOT / "src/mediaSources.json").write_text(json.dumps(runtime, ensure_ascii=False, indent=2) + "\n")
    records = {value["source"]: value for value in image_report}
    cover_urls = [project["image"] for project in data["projects"]]
    cover_original = sum(records[url]["sourceBytes"] for url in cover_urls)
    cover_thumb = sum(records[url]["thumbBytes"] for url in cover_urls)
    cover_card = sum(records[url]["cardBytes"] for url in cover_urls)
    poster = records["/assets/interstellar.jpg"]
    video_original = (ASSETS / "interstellar-loop.mp4").stat().st_size
    video_selected = video_report["selected"]["bytes"] if video_report["selected"] else video_original
    totals = {"coverOriginalBytes": cover_original, "coverThumbBytes": cover_thumb,
              "coverCardBytes": cover_card, "videoOriginalBytes": video_original,
              "videoSelectedBytes": video_selected,
              "firstScreenOriginalBytes": cover_original + poster["sourceBytes"] + video_original,
              "firstScreenThumbBytes": cover_thumb + poster["fullBytes"] + video_selected,
              "firstScreenCardBytes": cover_card + poster["fullBytes"] + video_selected,
              "allReferencedImagesOriginalBytes": sum(value["sourceBytes"] for value in image_report),
              "allReferencedImagesCardBytes": sum(value["cardBytes"] for value in image_report)}
    report = {"generatedBy": "scripts/optimize-media.py", "imageCount": len(image_report),
        "manifest": "src/mediaManifest.json", "coverUrls": cover_urls,
        "totals": totals, "images": image_report, "video": video_report,
        "sourcePreservation": "All original images and videos remain unchanged for PDFs and provenance.",
        "measurementScope": "Unique URL payloads, not 24 duplicated carousel img nodes. Only currently referenced project covers/study panels/gallery, poster, portrait and softwareMedia entries. Excludes old hero.mp4, hero.jpg, robot.jpg, drone.jpg and unused PDFs/source art. Payload estimates exclude JS, CSS, fonts and HTTP cache overhead.",
        "visualReview": {"status": "pending", "notes": []}}
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"imageCount": len(image_report), "totals": totals}, indent=2))


if __name__ == "__main__":
    main()
