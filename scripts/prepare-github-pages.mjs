import { readFile, writeFile, readdir, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(project, 'dist');
const requestedBase = process.env.VITE_BASE_PATH?.trim() || '/';
if (!requestedBase.startsWith('/') || requestedBase.startsWith('//') ||
    /[?#\\]/.test(requestedBase) || requestedBase.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('VITE_BASE_PATH must be an absolute URL path, such as /qu-linyi-portfolio/.');
}
const base = requestedBase.replace(/\/+$/, '') + '/';
const requestedSite = process.env.PORTFOLIO_SITE_URL?.trim();
let site;
if (requestedSite) {
  site = new URL(requestedSite);
  if (site.protocol !== 'https:' || site.username || site.password) {
    throw new Error('PORTFOLIO_SITE_URL must be an HTTPS URL without embedded credentials.');
  }
}
if (!(await stat(path.join(dist, 'index.html'))).isFile()) {
  throw new Error('Build dist/index.html before preparing GitHub Pages.');
}

const textExtensions = new Set(['.html', '.css', '.js', '.json']);
const rootResource = /(?<![A-Za-z0-9_./-])\/(?:assets\/|downloads\/|favicon\.svg(?=[?#"'`\s)<]|$))/g;
let updated = 0;

async function prepareDirectory(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) {
      await prepareDirectory(file);
    } else if (item.isFile() && textExtensions.has(path.extname(file))) {
      const original = await readFile(file, 'utf8');
      const prepared = original.replace(rootResource, resource => base + resource.slice(1));
      if (prepared !== original) {
        await writeFile(file, prepared);
        updated += 1;
      }
    }
  }
}

await prepareDirectory(dist);
await writeFile(path.join(dist, '.nojekyll'), '');

const downloads = path.join(dist, 'downloads');
const qrPng = path.join(downloads, 'portfolio-qr.png');
const qrSvg = path.join(downloads, 'portfolio-qr.svg');
if (site) {
  await mkdir(downloads, { recursive: true });
  const options = {
    errorCorrectionLevel: 'M',
    margin: 4,
    color: { dark: '#141414', light: '#ffffff' },
  };
  await QRCode.toFile(qrPng, site.href, { ...options, type: 'png', width: 1024 });
  await writeFile(qrSvg, await QRCode.toString(site.href, { ...options, type: 'svg' }));
  console.log(`Generated QR codes for ${site.href}`);
} else {
  await Promise.all([qrPng, qrSvg].map(file => rm(file, { force: true })));
  console.log('PORTFOLIO_SITE_URL is unset; no QR codes generated.');
}
console.log(`Prepared GitHub Pages at ${base}; updated ${updated} text files.`);
