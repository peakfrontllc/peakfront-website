/**
 * Compress and convert site hero/category images to optimised WebP.
 *
 * Usage:
 *   1. Drop source files (PNG/JPG/WebP) into scripts/images/source/
 *   2. Name them: hero, heavy-equipment, transport, buses, power-equipment
 *   3. Run: npm run optimize:images
 *
 * Output overwrites public/images/*.webp at quality 82.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "scripts/images/source");
const OUTPUT_DIR = path.join(ROOT, "public/images");

const TARGETS = [
  { name: "hero", maxWidth: 2400 },
  { name: "heavy-equipment", maxWidth: 1600 },
  { name: "transport", maxWidth: 1600 },
  { name: "buses", maxWidth: 1600 },
  { name: "power-equipment", maxWidth: 1600 },
];

const EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"];

async function findSource(name) {
  for (const ext of EXTENSIONS) {
    const filePath = path.join(SOURCE_DIR, `${name}${ext}`);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      // try next extension
    }
  }
  return null;
}

async function optimizeImage({ name, maxWidth }) {
  const source = await findSource(name);
  if (!source) {
    console.log(`  skip ${name} — no source file in scripts/images/source/`);
    return;
  }

  const output = path.join(OUTPUT_DIR, `${name}.webp`);
  const meta = await sharp(source).metadata();

  await sharp(source)
    .resize({
      width: meta.width && meta.width > maxWidth ? maxWidth : undefined,
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  const outMeta = await sharp(output).metadata();
  const outStat = await fs.stat(output);
  console.log(
    `  ✓ ${name}.webp — ${outMeta.width}×${outMeta.height}, ${Math.round(outStat.size / 1024)} KB`,
  );
}

await fs.mkdir(SOURCE_DIR, { recursive: true });
console.log("Optimising site images…\n");

for (const target of TARGETS) {
  await optimizeImage(target);
}

console.log("\nDone. Source files: scripts/images/source/");
