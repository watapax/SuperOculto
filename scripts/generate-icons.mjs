import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, 'icon.svg');
const svg = readFileSync(svgPath);
const outDir = path.join(__dirname, '..', 'public', 'icons');

const sizes = [64, 192, 512];

for (const size of sizes) {
  const outPath = path.join(outDir, `icon-${size}.png`);
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(outPath);
  console.log('wrote', outPath);
}

// Maskable icon with safe-zone padding (icon content within inner 80%)
const maskableSize = 512;
const padded = await sharp(svg, { density: 384 })
  .resize(Math.round(maskableSize * 0.7), Math.round(maskableSize * 0.7))
  .extend({
    top: Math.round(maskableSize * 0.15),
    bottom: Math.round(maskableSize * 0.15),
    left: Math.round(maskableSize * 0.15),
    right: Math.round(maskableSize * 0.15),
    background: '#7a1010',
  })
  .png()
  .toFile(path.join(outDir, 'icon-maskable-512.png'));
console.log('wrote maskable', padded);

// Apple touch icon
await sharp(svg, { density: 384 })
  .resize(180, 180)
  .png()
  .toFile(path.join(outDir, 'apple-touch-icon.png'));
console.log('wrote apple touch icon');
