import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const cardDir = join(publicDir, "business-card");
const imagesDir = join(publicDir, "images");

const WIDTH = 1050;
const HEIGHT = 600;
const LEFT = 530;
const RIGHT = WIDTH - LEFT;
const HALF_H = HEIGHT / 2;

const C = {
  navy: "#0b2545",
  navyDeep: "#081c33",
  navyLight: "#14365f",
  amber: "#f39c12",
  white: "#ffffff",
  soft: "#e8eef5",
  muted: "#8fa3bc",
};

const CONTACT = {
  name: "Irfan Dayan",
  title: "Managing Director",
  company: "Peakfront Equipment Rental LLC SPC",
  phone: "+971 527459432",
  email: "info@peakfront.ae",
  website: "www.peakfront.ae",
  address: "Mussafah 17, Abu Dhabi, United Arab Emirates",
};

const FONT = "Arial, Helvetica, sans-serif";

function escXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function svgBuffer(content) {
  return Buffer.from(content);
}

function frontPanelSvg() {
  return svgBuffer(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="panel" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="${C.navyDeep}"/>
        <stop offset="100%" stop-color="${C.navy}"/>
      </linearGradient>
      <linearGradient id="edgeFade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${C.navy}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${C.navy}" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <rect width="${LEFT}" height="${HEIGHT}" fill="url(#panel)"/>
    <rect width="5" height="${HEIGHT}" fill="${C.amber}"/>

    <text x="44" y="156" fill="${C.amber}" font-family="${FONT}" font-size="10.5" font-weight="700" letter-spacing="0.2em">HEAVY EQUIPMENT &amp; TRANSPORT RENTAL</text>
    <text x="44" y="178" fill="${C.muted}" font-family="${FONT}" font-size="11" letter-spacing="0.08em">Abu Dhabi · Dubai · UAE</text>

    <line x1="44" y1="198" x2="486" y2="198" stroke="${C.amber}" stroke-width="1.5" opacity="0.75"/>

    <text x="44" y="248" fill="${C.white}" font-family="${FONT}" font-size="36" font-weight="700">${escXml(CONTACT.name)}</text>
    <text x="44" y="280" fill="${C.amber}" font-family="${FONT}" font-size="11.5" font-weight="700" letter-spacing="0.18em">${escXml(CONTACT.title.toUpperCase())}</text>
    <text x="44" y="302" fill="${C.muted}" font-family="${FONT}" font-size="11">${escXml(CONTACT.company)}</text>

    <line x1="44" y1="322" x2="486" y2="322" stroke="${C.white}" stroke-opacity="0.12"/>

    <text x="44" y="358" fill="${C.soft}" font-family="${FONT}" font-size="17">${escXml(CONTACT.phone)}</text>
    <text x="44" y="390" fill="${C.soft}" font-family="${FONT}" font-size="17">${escXml(CONTACT.email)}</text>
    <text x="44" y="422" fill="${C.soft}" font-family="${FONT}" font-size="17">${escXml(CONTACT.website)}</text>
    <text x="44" y="456" fill="${C.muted}" font-family="${FONT}" font-size="12.5">${escXml(CONTACT.address)}</text>

    <rect x="${LEFT - 48}" y="0" width="48" height="${HEIGHT}" fill="url(#edgeFade)"/>
  </svg>`);
}

function photoLabelSvg(label, width, height) {
  return svgBuffer(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="labelFade" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="${C.navyDeep}" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="${C.navyDeep}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="72" y="${height - 72}" fill="url(#labelFade)"/>
    <rect x="0" y="${height - 3}" width="${width}" height="3" fill="${C.amber}" opacity="0.9"/>
    <text x="20" y="${height - 22}" fill="${C.white}" font-family="${FONT}" font-size="13" font-weight="700" letter-spacing="0.14em">${escXml(label)}</text>
  </svg>`);
}

function backOverlaySvg() {
  return svgBuffer(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <rect x="44" y="108" width="962" height="384" rx="6" fill="${C.navyDeep}" fill-opacity="0.88" stroke="${C.amber}" stroke-width="1" stroke-opacity="0.35"/>

    <text x="525" y="318" text-anchor="middle" fill="${C.amber}" font-family="${FONT}" font-size="10" font-weight="700" letter-spacing="0.18em">HEAVY EQUIPMENT</text>
    <text x="262" y="346" text-anchor="middle" fill="${C.soft}" font-family="${FONT}" font-size="12.5">Excavators · Loaders · Dozers</text>
    <text x="262" y="368" text-anchor="middle" fill="${C.soft}" font-family="${FONT}" font-size="12.5">Telehandlers · Forklifts · Cranes</text>

    <line x1="525" y1="288" x2="525" y2="388" stroke="${C.white}" stroke-opacity="0.15"/>

    <text x="788" y="318" text-anchor="middle" fill="${C.amber}" font-family="${FONT}" font-size="10" font-weight="700" letter-spacing="0.18em">TRANSPORT &amp; HAULAGE</text>
    <text x="788" y="346" text-anchor="middle" fill="${C.soft}" font-family="${FONT}" font-size="12.5">Flatbeds · Low Bed Trailers</text>
    <text x="788" y="368" text-anchor="middle" fill="${C.soft}" font-family="${FONT}" font-size="12.5">Tankers · Tippers · Buses</text>

    <line x1="120" y1="402" x2="930" y2="402" stroke="${C.white}" stroke-opacity="0.14"/>

    <text x="525" y="436" text-anchor="middle" fill="${C.white}" font-family="${FONT}" font-size="26" font-weight="700">${escXml(CONTACT.website)}</text>
    <text x="525" y="464" text-anchor="middle" fill="${C.muted}" font-family="${FONT}" font-size="13">${escXml(CONTACT.address)}</text>
    <text x="525" y="488" text-anchor="middle" fill="${C.soft}" font-family="${FONT}" font-size="14">${escXml(CONTACT.phone)} · ${escXml(CONTACT.email)}</text>

    <rect x="0" y="${HEIGHT - 5}" width="${WIDTH}" height="5" fill="${C.amber}"/>
  </svg>`);
}

function splitLabelsSvg() {
  return svgBuffer(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
    <rect x="${LEFT}" y="${HALF_H - 2}" width="${RIGHT}" height="4" fill="${C.amber}"/>
    <text x="${LEFT + 20}" y="36" fill="${C.white}" font-family="${FONT}" font-size="9.5" font-weight="700" letter-spacing="0.16em">HEAVY MACHINES</text>
    <text x="${LEFT + RIGHT - 20}" y="36" text-anchor="end" fill="${C.white}" font-family="${FONT}" font-size="9.5" font-weight="700" letter-spacing="0.16em">TRANSPORT FLEET</text>
  </svg>`);
}

async function coverImage(filename, width, height, position = "centre") {
  return sharp(join(imagesDir, filename))
    .modulate({ brightness: 0.95, saturation: 0.92 })
    .resize(width, height, { fit: "cover", position })
    .jpeg({ quality: 93 })
    .toBuffer();
}

async function logoLight(width) {
  const svg = readFileSync(join(publicDir, "logo-light.svg"));
  return sharp(svg).resize({ width }).png().toBuffer();
}

async function buildFront() {
  const heavyPhoto = await coverImage("crawler-excavator.webp", RIGHT, HALF_H, "centre");
  const transportPhoto = await coverImage("transport.webp", RIGHT, HALF_H, "centre");

  const heavyLabel = await sharp(photoLabelSvg("HEAVY EQUIPMENT", RIGHT, HALF_H)).png().toBuffer();
  const transportLabel = await sharp(
    photoLabelSvg("TRANSPORT & HAULAGE", RIGHT, HALF_H),
  ).png().toBuffer();

  const panel = await sharp(frontPanelSvg()).png().toBuffer();
  const labels = await sharp(splitLabelsSvg()).png().toBuffer();
  const logo = await logoLight(270);

  return sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: C.navy },
  })
    .composite([
      { input: heavyPhoto, left: LEFT, top: 0 },
      { input: transportPhoto, left: LEFT, top: HALF_H },
      { input: heavyLabel, left: LEFT, top: 0 },
      { input: transportLabel, left: LEFT, top: HALF_H },
      { input: panel, left: 0, top: 0 },
      { input: labels, left: 0, top: 0 },
      { input: logo, left: 44, top: 42 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function buildBack() {
  const left = await coverImage("heavy-equipment.webp", WIDTH / 2, HEIGHT, "centre");
  const right = await coverImage("transport.webp", WIDTH / 2, HEIGHT, "centre");
  const overlay = await sharp(backOverlaySvg()).png().toBuffer();
  const logo = await logoLight(340);

  const photo = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: C.navy },
  })
    .composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: WIDTH / 2, top: 0 },
    ])
    .jpeg({ quality: 93 })
    .toBuffer();

  return sharp(photo)
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: logo, left: 355, top: 138 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const front = await buildFront();
  const back = await buildBack();

  writeFileSync(join(cardDir, "front.png"), front);
  writeFileSync(join(cardDir, "back.png"), back);

  console.log(`Generated ${join(cardDir, "front.png")}`);
  console.log(`Generated ${join(cardDir, "back.png")}`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
