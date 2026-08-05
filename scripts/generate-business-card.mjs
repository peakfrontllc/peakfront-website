import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { LOGO_FILES, logoFile } from "./shared/logo-paths.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const cardDir = join(publicDir, "docs", "business-card");
const imagesDir = join(publicDir, "images");

const W = 1050;
const H = 600;

const C = {
  navy: "#0b2545",
  navyDeep: "#060e1a",
  amber: "#f39c12",
  white: "#ffffff",
  soft: "#475569",
  muted: "#64748b",
  card: "#fafbfc",
};

const CONTACT = {
  name: "Irfan Dayan",
  title: "Managing Director",
  company: "Peakfront Equipment Rental LLC SPC",
  phone: "+971 527459432",
  email: "info@peakfront.ae",
  website: "www.peakfront.ae",
  address: "Mussafah 17, Abu Dhabi, UAE",
};

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

function esc(v) {
  return String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function svg(s) {
  return Buffer.from(s);
}

/* ═══ FRONT: full-bleed machine photo + floating contact card ═══ */

function frontVignetteSvg() {
  return svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="vig" cx="35%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#000" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
      </radialGradient>
      <linearGradient id="left" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${C.navyDeep}" stop-opacity="0.5"/>
        <stop offset="45%" stop-color="${C.navyDeep}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#vig)"/>
    <rect width="${W}" height="${H}" fill="url(#left)"/>
    <rect x="0" y="0" width="6" height="${H}" fill="${C.amber}"/>
    <text x="36" y="42" fill="${C.amber}" font-family="${FONT}" font-size="9" font-weight="700" letter-spacing="0.28em">ABU DHABI · UAE</text>
  </svg>`);
}

function frontCardSvg() {
  const cw = 500;
  const ch = 430;
  return svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">
    <defs>
      <filter id="sh" x="-8%" y="-8%" width="116%" height="116%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect x="0" y="0" width="${cw}" height="${ch}" rx="14" ry="14" fill="${C.card}" filter="url(#sh)"/>
    <rect x="0" y="0" width="${cw}" height="6" rx="14" ry="14" fill="${C.amber}"/>
    <rect x="0" y="4" width="${cw}" height="4" fill="${C.amber}"/>

    <text x="36" y="108" fill="${C.soft}" font-family="${FONT}" font-size="9.5" font-weight="600" letter-spacing="0.22em">HEAVY EQUIPMENT &amp; TRANSPORT</text>
    <line x1="36" y1="122" x2="110" y2="122" stroke="${C.amber}" stroke-width="2.5" stroke-linecap="round"/>

    <text x="36" y="178" fill="${C.navy}" font-family="${FONT}" font-size="36" font-weight="700" letter-spacing="-0.02em">${esc(CONTACT.name)}</text>
    <text x="36" y="210" fill="${C.amber}" font-family="${FONT}" font-size="11" font-weight="700" letter-spacing="0.2em">${esc(CONTACT.title.toUpperCase())}</text>
    <text x="36" y="236" fill="${C.muted}" font-family="${FONT}" font-size="12">${esc(CONTACT.company)}</text>

    <line x1="36" y1="258" x2="${cw - 36}" y2="258" stroke="#e2e8f0" stroke-width="1"/>

    <text x="36" y="296" fill="${C.navy}" font-family="${FONT}" font-size="16" font-weight="600">${esc(CONTACT.phone)}</text>
    <text x="36" y="328" fill="${C.navy}" font-family="${FONT}" font-size="16">${esc(CONTACT.email)}</text>
    <text x="36" y="360" fill="${C.navy}" font-family="${FONT}" font-size="16">${esc(CONTACT.website)}</text>
    <text x="36" y="396" fill="${C.muted}" font-family="${FONT}" font-size="12">${esc(CONTACT.address)}</text>
  </svg>`);
}

async function buildFront() {
  const bg = await photo("hero.webp", W, H, "centre");
  const vignette = await sharp(frontVignetteSvg()).png().toBuffer();
  const card = await sharp(frontCardSvg()).png().toBuffer();
  const logo = await logoPng(LOGO_FILES.svg, 230);

  return sharp(bg)
    .composite([
      { input: vignette, left: 0, top: 0 },
      { input: card, left: 48, top: 85 },
      { input: logo, left: 84, top: 108 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/* ═══ BACK: 2×2 machine mosaic + centre brand bar ═══ */

const CELL_W = W / 2;
const CELL_H = H / 2;

function backCentreBarSvg() {
  return svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="112" viewBox="0 0 ${W} 112">
    <rect width="${W}" height="112" fill="${C.navyDeep}" fill-opacity="0.94"/>
    <rect x="0" y="0" width="${W}" height="3" fill="${C.amber}"/>
    <rect x="0" y="109" width="${W}" height="3" fill="${C.amber}"/>

    <text x="200" y="44" fill="${C.amber}" font-family="${FONT}" font-size="9" font-weight="700" letter-spacing="0.2em">HEAVY MACHINES</text>
    <text x="200" y="68" fill="${C.white}" font-family="${FONT}" font-size="13">Excavators · Loaders · Dozers · Telehandlers</text>
    <text x="200" y="92" fill="${C.white}" font-family="${FONT}" font-size="13">Compactors · Rollers · Forklifts · Cranes</text>

    <line x1="525" y1="20" x2="525" y2="92" stroke="${C.white}" stroke-opacity="0.15"/>

    <text x="560" y="44" fill="${C.amber}" font-family="${FONT}" font-size="9" font-weight="700" letter-spacing="0.2em">TRANSPORT</text>
    <text x="560" y="68" fill="${C.white}" font-family="${FONT}" font-size="13">Low Beds · Flatbeds · Tankers · Tippers</text>
    <text x="560" y="92" fill="${C.white}" font-family="${FONT}" font-size="13">Buses · Mobilisation · UAE Wide</text>

    <text x="${W - 36}" y="58" text-anchor="end" fill="${C.white}" font-family="${FONT}" font-size="20" font-weight="700">${esc(CONTACT.website)}</text>
    <text x="${W - 36}" y="82" text-anchor="end" fill="${C.muted}" font-family="${FONT}" font-size="11">${esc(CONTACT.phone)} · ${esc(CONTACT.email)}</text>
  </svg>`);
}

async function buildBack() {
  const photos = [
    { file: "crawler-excavator.webp", pos: "centre" },
    { file: "telehandler.webp", pos: "centre" },
    { file: "heavy-equipment.webp", pos: "centre" },
    { file: "transport.webp", pos: "centre" },
  ];

  const cells = await Promise.all(
    photos.map((p) => photo(p.file, CELL_W, CELL_H, p.pos)),
  );

  const bar = await sharp(backCentreBarSvg()).png().toBuffer();
  const logo = await logoPng(LOGO_FILES.lightSvg, 180);

  const barY = H / 2 - 56;

  return sharp({
    create: { width: W, height: H, channels: 3, background: C.navyDeep },
  })
    .composite([
      { input: cells[0], left: 0, top: 0 },
      { input: cells[1], left: CELL_W, top: 0 },
      { input: cells[2], left: 0, top: CELL_H },
      { input: cells[3], left: CELL_W, top: CELL_H },
      { input: bar, left: 0, top: barY },
      { input: logo, left: 24, top: barY + 16 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function logoPng(file, width) {
  return sharp(readFileSync(logoFile(publicDir, file))).resize({ width }).png().toBuffer();
}

async function photo(file, width, height, position) {
  return sharp(join(imagesDir, file))
    .modulate({ brightness: 0.93, saturation: 1.1 })
    .resize(width, height, { fit: "cover", position })
    .jpeg({ quality: 93 })
    .toBuffer();
}

async function main() {
  writeFileSync(join(cardDir, "front.png"), await buildFront());
  writeFileSync(join(cardDir, "back.png"), await buildBack());
  console.log("Generated business cards (floating card front · 2×2 mosaic back).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
