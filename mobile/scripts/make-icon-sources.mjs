#!/usr/bin/env node
// Renders the icon and splash sources in assets/ from the site's brand mark (assets/images/favicon.svg):
// the joint-and-limb mark on the volt tile. `npm run assets` then makes every Android and iOS size from them.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(dirname(fileURLToPath(import.meta.url))), 'assets');
mkdirSync(out, { recursive: true });

const VOLT = '#D7FF3A', INK = '#0A0C0F', BG = '#0A0C0F';
// The mark from favicon.svg (32-unit box), centred on (16, 16) at the given scale
const mark = (scale) => `<g transform="translate(16 16) scale(${scale}) translate(-16.25 -17.25)">
  <path d="M12.4 16.6a4.4 4.4 0 0 0 6.4-2.2" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>
  <path d="M8 23 15 11.5 24.5 17" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="8" cy="23" r="2.7" fill="${INK}"/><circle cx="15" cy="11.5" r="2.7" fill="${INK}"/><circle cx="24.5" cy="17" r="2.7" fill="${INK}"/>
</g>`;
const svg = (body, size = 32) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${body}</svg>`);
const png = (body, px, file, size) => sharp(svg(body, size), { density: 72 * px / (size || 32) }).resize(px, px).png().toFile(join(out, file));

// iOS and legacy Android: full-bleed volt square (the system rounds the corners)
await png(`<rect width="32" height="32" fill="${VOLT}"/>${mark(0.9)}`, 1024, 'icon-only.png');
// Android adaptive icon: the mark inside the 66% safe circle, on a volt background layer
await png(mark(0.72), 1024, 'icon-foreground.png');
await png(`<rect width="32" height="32" fill="${VOLT}"/>`, 1024, 'icon-background.png');
// Splash: the rounded volt tile, small, centred on the app's dark background
const splash = `<rect width="320" height="320" fill="${BG}"/><g transform="translate(136 136) scale(1.5)"><rect width="32" height="32" rx="9" fill="${VOLT}"/>${mark(1)}</g>`;
await png(splash, 2732, 'splash.png', 320);
await png(splash, 2732, 'splash-dark.png', 320);
console.log('icon and splash sources written to assets/');
