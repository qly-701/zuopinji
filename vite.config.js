import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const requestedBase = process.env.VITE_BASE_PATH?.trim() || '/';
if (!requestedBase.startsWith('/') || requestedBase.startsWith('//') ||
    /[?#\\]/.test(requestedBase) || requestedBase.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('VITE_BASE_PATH must be an absolute URL path, such as /qu-linyi-portfolio/.');
}
const base = requestedBase.replace(/\/+$/, '') + '/';

export default defineConfig({ base, plugins: [react()] });
