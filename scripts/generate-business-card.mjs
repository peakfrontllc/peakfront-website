import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cardDir = join(root, "public", "business-card");

const WIDTH = 1050;
const HEIGHT = 600;

const COLORS = {
  navy: "#1a2634",
  navyLight: "#243447",
  gold: "#c9a227",
  goldLight: "#dbb84a",
  white: "#ffffff",
  blueDark: "#1e4a72",
  blueMid: "#2a6a9a",
  blueLight: "#3d8fc4",
};

function textureSvg(width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <filter id="grain" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed="8" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="
          0.35 0 0 0 0.08
          0 0.35 0 0 0.08
          0 0 0.35 0 0.1
          0 0 0 0.22 0"/>
      </filter>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.navy}"/>
        <stop offset="100%" stop-color="${COLORS.navyLight}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" filter="url(#grain)"/>
  </svg>`;
}

function mountainLogoSvg({ x, y, scale = 1, showTagline = false }) {
  const s = scale;
  return `<g transform="translate(${x}, ${y}) scale(${s})">
    <defs>
      <linearGradient id="mountGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="${COLORS.blueDark}"/>
        <stop offset="55%" stop-color="${COLORS.blueMid}"/>
        <stop offset="100%" stop-color="${COLORS.blueLight}"/>
      </linearGradient>
      <filter id="emboss" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <circle cx="70" cy="68" r="66" fill="none" stroke="${COLORS.blueMid}" stroke-width="2.2" opacity="0.9" filter="url(#emboss)"/>
    <path d="M14 96 L34 58 L50 72 L66 42 L82 56 L98 36 L118 52 L126 96 Z" fill="url(#mountGrad)"/>
    <path d="M34 96 L50 72 L66 96 Z" fill="${COLORS.blueDark}" opacity="0.55"/>
    <path d="M66 96 L82 56 L98 96 Z" fill="${COLORS.blueDark}" opacity="0.4"/>
    <path d="M58 96 C62 86 66 80 70 76 C74 80 78 86 82 96" fill="${COLORS.blueDark}" opacity="0.65"/>
    <path d="M58 96 C62 86 66 80 70 76" stroke="${COLORS.blueMid}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <path d="M70 76 C74 80 78 86 82 96" stroke="${COLORS.gold}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <path d="M70 76 L70 96" stroke="${COLORS.white}" stroke-width="1.2" opacity="0.25"/>
    <text x="70" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17.5" font-weight="700" letter-spacing="1.2">
      <tspan fill="${COLORS.white}">PEAK</tspan><tspan fill="${COLORS.gold}">FRONT</tspan>
    </text>
    ${
      showTagline
        ? `<g transform="translate(70, 134)">
            <line x1="-108" y1="0" x2="-68" y2="0" stroke="${COLORS.white}" stroke-width="0.9" opacity="0.5"/>
            <text x="0" y="4" text-anchor="middle" fill="${COLORS.white}" font-family="Arial, Helvetica, sans-serif" font-size="7.2" font-weight="400" letter-spacing="2.4" opacity="0.88">EQUIPMENT &#8226; TRANSPORT &#8226; SOLUTIONS</text>
            <line x1="68" y1="0" x2="108" y2="0" stroke="${COLORS.white}" stroke-width="0.9" opacity="0.5"/>
          </g>`
        : ""
    }
  </g>`;
}

function frontSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    ${mountainLogoSvg({ x: 72, y: 145, scale: 1.55 })}

    <text x="430" y="210" fill="${COLORS.gold}" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="700">Irfan Dayan</text>
    <text x="430" y="252" fill="${COLORS.white}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="300" letter-spacing="0.5" opacity="0.92">Managing Director</text>

    <line x1="430" y1="278" x2="980" y2="278" stroke="${COLORS.gold}" stroke-width="2" opacity="0.85"/>

    <text x="430" y="330" fill="${COLORS.white}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" opacity="0.95">+971 52 745 9432</text>
    <text x="430" y="372" fill="${COLORS.white}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" opacity="0.95">peakfrontuae@gmail.com</text>
    <text x="430" y="414" fill="${COLORS.white}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" opacity="0.95">peakfrontuae.com</text>

    <text x="525" y="548" text-anchor="middle" fill="${COLORS.white}" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="300" letter-spacing="0.4" opacity="0.75">Musafa 23, Building Zila, Office 34</text>
  </svg>`;
}

function backSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    ${mountainLogoSvg({ x: 455, y: 95, scale: 2.15, showTagline: true })}
  </svg>`;
}

async function renderCard(name, overlaySvg) {
  const texture = await sharp(Buffer.from(textureSvg(WIDTH, HEIGHT))).png().toBuffer();
  const overlay = await sharp(Buffer.from(overlaySvg)).png().toBuffer();
  const out = join(cardDir, `${name}.png`);

  await sharp(texture)
    .composite([{ input: overlay, blend: "over" }])
    .png({ compressionLevel: 9 })
    .toFile(out);

  console.log(`Generated ${out}`);
}

await renderCard("front", frontSvg());
await renderCard("back", backSvg());

writeFileSync(join(cardDir, "front.svg"), frontSvg());
writeFileSync(join(cardDir, "back.svg"), backSvg());

console.log("Done.");
