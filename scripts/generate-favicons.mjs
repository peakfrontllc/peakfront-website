import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import {
  LOGO_FILES,
  logoFile,
  logoPublicDir,
} from "./shared/logo-paths.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const logoDir = logoPublicDir(publicDir);

const markSvg = readFileSync(logoFile(publicDir, LOGO_FILES.markSvg));

const sizes = [
  { name: LOGO_FILES.favicon16, size: 16 },
  { name: LOGO_FILES.favicon32, size: 32 },
  { name: LOGO_FILES.appleTouch, size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(markSvg).resize(size, size).png().toFile(logoFile(publicDir, name));
}

const icoBuffer = await pngToIco([
  logoFile(publicDir, LOGO_FILES.favicon16),
  logoFile(publicDir, LOGO_FILES.favicon32),
]);

writeFileSync(logoFile(publicDir, LOGO_FILES.faviconIco), icoBuffer);

console.log(`Generated favicon assets in public/logo/`);
