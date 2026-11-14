// Adapted from React Bits ColorBends by David Haz. License: ./LICENSE.md
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ColorBends.css';

const MAX_COLORS = 8;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform float uAspect;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpAmount;
uniform float uWarpBlend;
uniform float uWarpSpare;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

float bandMask(vec2 s, float index, float t, vec2 shift) {
  vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
  float m;
  if (uWarpBlend <= 0.0) {
    m = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + index) / 4.0);
  } else {
    vec2 warped = mix(s, r, uWarpAmount) - shift * uWarpSpare;
    float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + index) / 4.0);
    if (uWarpBlend >= 1.0) m = m1;
    else {
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + index) / 4.0);
      m = mix(m0, m1, uWarpBlend);
    }
  }
  return 1.0 - exp(-uBandWidth * exp(-uBandWidth * m));
}

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * uAspect, rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  float drift = 0.2 * cos(t) - 7.56;
  q += drift;
  vec2 shift = vec2(drift);
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    for (int j = 0; j < 5; j++) {
      if (j >= uIterations - 1) break;
      vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
      q += (rr - q) * 0.15;
      shift *= 0.85;
    }

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            float w = bandMask(s, float(i), t, shift);
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            col[k] = bandMask(s, float(k), t, shift);
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    col *= uIntensity;

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const DEFAULT_COLORS = [];

const colorVector = hex => {
  const value = String(hex).replace('#', '').trim();
  const expanded = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
  if (!/^[a-f\d]{6}$/i.test(expanded)) return null;
  return new THREE.Vector3(parseInt(expanded.slice(0, 2), 16) / 255, parseInt(expanded.slice(2, 4), 16) / 255, parseInt(expanded.slice(4, 6), 16) / 255);
};

export default function ColorBends({
  className = '', style, rotation = 90, speed = 0.2, colors = DEFAULT_COLORS,
  transparent = true, autoRotate = 0, scale = 1, frequency = 1,
  warpStrength = 1, mouseInfluence = 1, parallax = 0.5, noise = 0.15,
  iterations = 1, intensity = 1.5, bandWidth = 6,
  active = true, reducedMotion = false, maxFps = 30, maxDpr = 1
}) {
  const containerRef = useRef(null);
  const runtimeRef = useRef(null);
  const settingsRef = useRef(null);
  settingsRef.current = { rotation, speed, colors, transparent, autoRotate, scale, frequency, warpStrength,
    mouseInfluence, parallax, noise, iterations, intensity, bandWidth, active, reducedMotion, maxFps, maxDpr };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || (!window.WebGLRenderingContext && !window.WebGL2RenderingContext)) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag,
      uniforms: {
        uAspect: { value: 1 }, uTime: { value: 0 }, uSpeed: { value: 0.2 },
        uRot: { value: new THREE.Vector2(1, 0) }, uColorCount: { value: 0 },
        uColors: { value: Array.from({ length: MAX_COLORS }, () => new THREE.Vector3()) },
        uTransparent: { value: 1 }, uScale: { value: 1 }, uFrequency: { value: 1 },
        uWarpAmount: { value: 1 }, uWarpBlend: { value: 1 }, uWarpSpare: { value: 0 },
        uPointer: { value: new THREE.Vector2() }, uMouseInfluence: { value: 1 },
        uParallax: { value: 0.5 }, uNoise: { value: 0.15 }, uIterations: { value: 1 },
        uIntensity: { value: 1.5 }, uBandWidth: { value: 6 }
      },
      premultipliedAlpha: true, transparent: true, depthTest: false, depthWrite: false
    });
    scene.add(new THREE.Mesh(geometry, material));
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power', alpha: true }); }
    catch { geometry.dispose(); material.dispose(); return; }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    container.appendChild(canvas);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    let disposed = false, contextLost = false, raf = null, elapsed = 0, lastTime = null;
    let visible = !('IntersectionObserver' in window), dirty = true, pendingSize = true;
    let width = Math.max(1, container.clientWidth), height = Math.max(1, container.clientHeight), pixelRatio = 0;
    let pointerListening = false, pointerBounds = null, boundsDirty = true;
    const reduced = () => motionQuery.matches || settingsRef.current.reducedMotion;
    const allowed = () => !disposed && !contextLost && visible && !document.hidden && settingsRef.current.active;
    const animating = () => !reduced() && (settingsRef.current.speed !== 0 || settingsRef.current.autoRotate !== 0 || settingsRef.current.noise > 0 || pointerCurrent.distanceToSquared(pointerTarget) > 0.000001);
    const stop = () => { if (raf !== null) cancelAnimationFrame(raf); raf = null; lastTime = null; };
    const wake = () => { if (raf === null && allowed() && (dirty || animating())) raf = requestAnimationFrame(draw); };
    const invalidate = () => { dirty = true; wake(); };
    const resize = (nextWidth, nextHeight) => {
      const nextDpr = Math.min(window.devicePixelRatio || 1, Math.max(0.5, Math.min(1.5, settingsRef.current.maxDpr || 1)));
      nextWidth = Math.max(1, Math.round(nextWidth)); nextHeight = Math.max(1, Math.round(nextHeight));
      if (width === nextWidth && height === nextHeight && pixelRatio === nextDpr) return;
      width = nextWidth; height = nextHeight; pixelRatio = nextDpr; pendingSize = true; boundsDirty = true;
      invalidate();
    };
    function draw(now) {
      raf = null;
      if (!allowed()) return;
      const staticFrame = reduced();
      const interval = 1000 / Math.min(60, Math.max(1, settingsRef.current.maxFps || 30));
      if (!staticFrame && lastTime !== null && now - lastTime < interval - 0.5) { wake(); return; }
      const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (pendingSize) {
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height, false);
        material.uniforms.uAspect.value = width / height;
        pendingSize = false;
      }
      if (!staticFrame) elapsed += dt;
      const time = staticFrame ? 12 : elapsed;
      material.uniforms.uTime.value = time;
      const radians = ((settingsRef.current.rotation % 360) + settingsRef.current.autoRotate * time) * Math.PI / 180;
      material.uniforms.uRot.value.set(Math.cos(radians), Math.sin(radians));
      if (!staticFrame) pointerCurrent.lerp(pointerTarget, 1 - Math.exp(-dt * 8));
      material.uniforms.uPointer.value.copy(pointerCurrent);
      renderer.render(scene, camera);
      dirty = false;
      wake();
    }

    const onPointerMove = event => {
      if (!pointerBounds || boundsDirty) { pointerBounds = container.getBoundingClientRect(); boundsDirty = false; }
      pointerTarget.set((event.clientX - pointerBounds.left) / Math.max(1, pointerBounds.width) * 2 - 1,
        -((event.clientY - pointerBounds.top) / Math.max(1, pointerBounds.height) * 2 - 1));
      invalidate();
    };
    const invalidateBounds = () => { boundsDirty = true; };
    const syncPointer = () => {
      const needed = !reduced() && (settingsRef.current.mouseInfluence !== 0 || settingsRef.current.parallax !== 0);
      if (needed === pointerListening) return;
      pointerListening = needed;
      if (needed) {
        container.addEventListener('pointermove', onPointerMove, { passive: true });
        container.addEventListener('pointerenter', invalidateBounds, { passive: true });
        window.addEventListener('scroll', invalidateBounds, { passive: true });
      } else {
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerenter', invalidateBounds);
        window.removeEventListener('scroll', invalidateBounds);
        pointerTarget.set(0, 0); pointerCurrent.set(0, 0);
      }
    };
    const sync = () => {
      const values = settingsRef.current, uniforms = material.uniforms;
      for (const key of ['speed', 'scale', 'frequency', 'mouseInfluence', 'parallax', 'noise', 'intensity', 'bandWidth']) {
        uniforms['u' + key[0].toUpperCase() + key.slice(1)].value = values[key];
      }
      const below = Math.min(1, Math.max(0, values.warpStrength));
      const amount = below * (1 + Math.max(values.warpStrength - 1, 0));
      uniforms.uWarpAmount.value = amount; uniforms.uWarpBlend.value = Math.pow(below, 0.3); uniforms.uWarpSpare.value = 1 - amount;
      uniforms.uIterations.value = Math.min(6, Math.max(1, Math.floor(values.iterations)));
      uniforms.uTransparent.value = values.transparent ? 1 : 0;
      const palette = (values.colors || []).filter(Boolean).map(colorVector).filter(Boolean).slice(0, MAX_COLORS);
      for (let index = 0; index < MAX_COLORS; index++) {
        if (palette[index]) uniforms.uColors.value[index].copy(palette[index]);
        else uniforms.uColors.value[index].set(0, 0, 0);
      }
      uniforms.uColorCount.value = palette.length;
      renderer.setClearColor(0x000000, values.transparent ? 0 : 1);
      syncPointer();
      resize(width, height);
      stop(); invalidate();
    };
    const onVisibility = () => { if (document.hidden) stop(); else { lastTime = null; wake(); } };
    const onMotionChange = () => { syncPointer(); stop(); invalidate(); };
    const onWindowResize = () => {
      boundsDirty = true;
      if (resizeObserver) resize(width, height);
      else resize(container.clientWidth, container.clientHeight);
    };
    const onContextLost = event => { event.preventDefault(); contextLost = true; stop(); };
    const onContextRestored = () => { contextLost = false; pendingSize = true; invalidate(); };
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(entries => {
      const entry = entries.find(item => item.target === container);
      if (entry) resize(entry.contentRect.width, entry.contentRect.height);
    }) : null;
    resizeObserver?.observe(container);
    const intersectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      const entry = entries.find(item => item.target === container);
      if (!entry) return;
      visible = entry.isIntersecting && (entry.intersectionRatio === undefined || entry.intersectionRatio > 0);
      if (visible) wake(); else stop();
    }) : null;
    intersectionObserver?.observe(container);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener?.('change', onMotionChange);
    window.addEventListener('resize', onWindowResize, { passive: true });
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);
    runtimeRef.current = { sync };
    sync();

    return () => {
      disposed = true; stop(); runtimeRef.current = null;
      resizeObserver?.disconnect(); intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener?.('change', onMotionChange);
      window.removeEventListener('resize', onWindowResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerenter', invalidateBounds);
      window.removeEventListener('scroll', invalidateBounds);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  useEffect(() => { runtimeRef.current?.sync(); }, [rotation, speed, colors, transparent, autoRotate, scale,
    frequency, warpStrength, mouseInfluence, parallax, noise, iterations, intensity, bandWidth,
    active, reducedMotion, maxFps, maxDpr]);

  return <div ref={containerRef} className={`color-bends-container ${className}`} style={style} />;
}
