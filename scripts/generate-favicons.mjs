import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const markSvg = readFileSync(join(publicDir, "logo-mark.svg"));

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(markSvg).resize(size, size).png().toFile(join(publicDir, name));
}

const icoBuffer = await pngToIco([
  join(publicDir, "favicon-16x16.png"),
  join(publicDir, "favicon-32x32.png"),
]);

writeFileSync(join(publicDir, "favicon.ico"), icoBuffer);

console.log("Generated favicon.ico, PNG icons in public/");
