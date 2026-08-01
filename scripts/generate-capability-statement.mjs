import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import sharp from "sharp";
import { CONTACT, esc, LEGAL_ENTITY_NAME, SITE_URL } from "./shared/marketing-data.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const outDir = join(publicDir, "docs", "capability-statement");
const data = JSON.parse(
  readFileSync(join(root, "data", "capability-statement.json"), "utf8"),
);

const PDF_NAME = "Peakfront-Capability-Statement.pdf";

async function imageDataUri(filename, width = 1200) {
  const path = join(publicDir, "images", filename);
  const buffer = await sharp(path)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

async function logoDataUri() {
  const svg = readFileSync(join(publicDir, "logo-light.svg"));
  const buffer = await sharp(svg).resize({ width: 360 }).png().toBuffer();
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

function sectionHead(eyebrow, title, aside = "") {
  return `<div class="section-head">
    <div>
      <p class="eyebrow">${esc(eyebrow)}</p>
      <h2>${esc(title)}</h2>
    </div>
    ${aside ? `<p class="section-aside">${esc(aside)}</p>` : ""}
  </div>`;
}

function buildPrintHtml(images) {
  const capabilities = data.coreCapabilities
    .map(
      (label) =>
        `<li class="cap-item"><span class="cap-dot"></span><span>${esc(label)}</span></li>`,
    )
    .join("");

  const equipment = data.equipmentCategories
    .map((item) => `<li class="equip-item">${esc(item)}</li>`)
    .join("");

  const industries = data.industriesServed
    .map((item) => `<li class="industry-item">${esc(item)}</li>`)
    .join("");

  const strengths = data.companyStrengths
    .map(
      (item) =>
        `<li class="strength-item"><span class="strength-mark">✓</span>${esc(item)}</li>`,
    )
    .join("");

  const whyCards = data.whyPeakfront
    .map(
      (item) => `<li class="why-card">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.description)}</p>
      </li>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(LEGAL_ENTITY_NAME)} — Capability Statement</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #0b2545;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      height: 297mm;
      min-height: 297mm;
      overflow: hidden;
      background: #fff;
      display: flex;
      flex-direction: column;
    }
    .hero {
      position: relative;
      color: #fff;
      background: #0b2545;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.3;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(11,37,69,.96), rgba(11,37,69,.78) 55%, rgba(11,37,69,.55));
    }
    .hero-top {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 6mm;
      padding: 9mm 10mm 6mm;
    }
    .hero-logo { width: 54mm; margin-bottom: 3.5mm; }
    .hero h1 { font-size: 16pt; line-height: 1.12; font-weight: 800; max-width: 118mm; }
    .tagline {
      margin-top: 2.5mm;
      font-size: 8pt;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #f39c12;
      max-width: 118mm;
    }
    .location { margin-top: 3mm; font-size: 7.5pt; line-height: 1.35; color: rgba(255,255,255,.75); max-width: 118mm; }
    .contact { min-width: 54mm; display: grid; gap: 2.5mm; }
    .contact-item {
      border: 1px solid rgba(255,255,255,.15);
      background: rgba(255,255,255,.05);
      border-radius: 4px;
      padding: 2.5mm 2.5mm;
      font-size: 7.5pt;
      color: rgba(255,255,255,.9);
      font-style: normal;
    }
    .hero-note {
      position: relative;
      z-index: 1;
      border-top: 1px solid rgba(255,255,255,.1);
      padding: 3mm 10mm;
      text-align: center;
      font-size: 7pt;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: rgba(255,255,255,.7);
    }
    .overview {
      border-bottom: 1px solid #f1f5f9;
      padding: 5mm 10mm;
      flex-shrink: 0;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 3mm;
      margin-bottom: 2mm;
      border-bottom: 1px solid #f39c12;
      padding-bottom: 1.5mm;
    }
    .eyebrow {
      font-size: 6pt;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #1565c0;
      margin-bottom: 0.5mm;
    }
    .section-head h2 { font-size: 9.5pt; line-height: 1.15; }
    .section-aside {
      max-width: 52mm;
      text-align: right;
      font-size: 6.5pt;
      line-height: 1.35;
      color: #64748b;
    }
    .overview p { font-size: 8pt; line-height: 1.5; color: #475569; }
    .body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5mm;
      padding: 5mm 10mm;
      flex: 1.1;
      min-height: 0;
    }
    .two-col section, .split section {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .cap-grid {
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(5, 1fr);
      gap: 2.5mm;
      flex: 1;
      min-height: 0;
    }
    .cap-item {
      display: flex;
      align-items: center;
      gap: 2mm;
      height: 100%;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 4px;
      padding: 2mm 2.5mm;
      font-size: 7pt;
      font-weight: 600;
      line-height: 1.25;
      box-shadow: 0 1px 2px rgba(11,37,69,.05);
    }
    .cap-dot {
      width: 2mm;
      height: 2mm;
      margin-top: 0.6mm;
      border-radius: 1px;
      background: #1565c0;
      flex-shrink: 0;
    }
    .equip-grid {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(6, 1fr);
      gap: 2.2mm;
      flex: 1;
      min-height: 0;
    }
    .equip-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 2mm;
      text-align: center;
      font-size: 6.8pt;
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(11,37,69,.05);
    }
    .split {
      display: grid;
      grid-template-columns: 42% 58%;
      gap: 5mm;
      border-top: 1px solid #f1f5f9;
      padding: 5mm 10mm;
      flex: 1.15;
      min-height: 0;
    }
    .industries {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 2mm;
    }
    .industry-item {
      border: 1px solid rgba(21,101,192,.2);
      background: rgba(21,101,192,.05);
      border-radius: 999px;
      padding: 1.2mm 3mm;
      font-size: 6.5pt;
      font-weight: 600;
    }
    .strengths {
      list-style: none;
      margin-top: 0;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1mm 0;
    }
    .strength-item {
      display: flex;
      gap: 2mm;
      font-size: 7pt;
      line-height: 1.35;
      color: #475569;
    }
    .strength-mark { color: #1565c0; font-size: 6.5pt; line-height: 1.6; }
    .why-grid {
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 1fr);
      gap: 2.5mm;
      flex: 1;
      min-height: 0;
    }
    .why-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      background: linear-gradient(135deg, #f8fafc, #fff);
      padding: 2.5mm 3mm;
      box-shadow: 0 1px 2px rgba(11,37,69,.05);
    }
    .why-card h3 { font-size: 7.5pt; margin-bottom: 1.5mm; }
    .why-card p { font-size: 6.8pt; line-height: 1.35; color: #64748b; }
    .strengths-block {
      margin-top: 5mm;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 6mm;
      border-top: 2px solid #0b2545;
      background: #0b2545;
      color: #fff;
      padding: 5mm 10mm;
      margin-top: auto;
      flex-shrink: 0;
    }
    .footer-brand { font-size: 10pt; font-weight: 800; letter-spacing: 0.04em; }
    .footer-sub { margin-top: 1mm; font-size: 6.5pt; color: rgba(255,255,255,.6); }
    .footer-links {
      font-size: 7pt;
      color: rgba(255,255,255,.85);
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5mm;
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="hero">
      <img class="hero-bg" src="${images.hero}" alt="" />
      <div class="hero-overlay"></div>
      <div class="hero-top">
        <div>
          <img class="hero-logo" src="${images.logo}" alt="Peakfront" />
          <h1>${esc(LEGAL_ENTITY_NAME)}</h1>
          <p class="tagline">${esc(data.tagline)}</p>
          <p class="location">${esc(CONTACT.address)}</p>
        </div>
        <address class="contact">
          <div class="contact-item">${esc(CONTACT.phone)}</div>
          <div class="contact-item">${esc(CONTACT.email)}</div>
          <div class="contact-item">www.peakfront.ae</div>
        </address>
      </div>
      <p class="hero-note">Construction equipment rental across all seven emirates</p>
    </header>

    <div class="body">
    <section class="overview">
      ${sectionHead("Company Overview", "Your equipment rental partner in the UAE")}
      <p>${esc(data.overview)}</p>
    </section>

    <div class="two-col">
      <section>
        ${sectionHead("Core Capabilities", "End-to-end rental support")}
        <ul class="cap-grid">${capabilities}</ul>
      </section>
      <section>
        ${sectionHead("Equipment Categories", "Plant available for hire", "Excavators to buses — one coordinated supplier.")}
        <ul class="equip-grid">${equipment}</ul>
      </section>
    </div>

    <div class="split">
      <section>
        ${sectionHead("Industries Served", "Sectors we support")}
        <ul class="industries">${industries}</ul>
        <div class="strengths-block">
          ${sectionHead("Company Strengths", "What sets us apart")}
          <ul class="strengths">${strengths}</ul>
        </div>
      </section>
      <section>
        ${sectionHead("Why Peakfront", "Built for contractors and procurement teams")}
        <ul class="why-grid">${whyCards}</ul>
      </section>
    </div>
    </div>

    <footer class="footer">
      <div>
        <p class="footer-brand">PEAKFRONT</p>
        <p class="footer-sub">${esc(LEGAL_ENTITY_NAME)} · Abu Dhabi, UAE</p>
      </div>
      <div class="footer-links">
        <span>www.peakfront.ae</span>
        <span>${esc(CONTACT.email)}</span>
        <span>${esc(CONTACT.phone)}</span>
      </div>
    </footer>
  </main>
</body>
</html>`;
}

function buildLauncherHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Peakfront — Capability Statement</title>
  <style>
    :root { --navy:#0b2545; --amber:#f39c12; --line:#e2e8f0; --muted:#64748b; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Arial,Helvetica,sans-serif; background:#eef2f6; color:var(--navy); }
    .toolbar { position:sticky; top:0; z-index:10; display:flex; flex-wrap:wrap; gap:.75rem; align-items:center; padding:1rem 1.25rem; background:white; border-bottom:1px solid var(--line); }
    .toolbar h1 { margin:0; font-size:1rem; flex:1; min-width:200px; }
    a.btn { appearance:none; border:none; cursor:pointer; text-decoration:none; background:var(--navy); color:white; padding:.55rem .95rem; border-radius:6px; font-size:.9rem; font-weight:600; }
    a.btn.secondary { background:white; color:var(--navy); border:1px solid var(--line); }
    .wrap { max-width:720px; margin:0 auto; padding:2.5rem 1.25rem 3rem; }
    .panel { background:white; border:1px solid var(--line); border-radius:10px; padding:1.75rem 1.5rem; box-shadow:0 8px 24px rgba(11,37,69,.06); }
    .tag { display:inline-block; font-size:.7rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--amber); margin-bottom:.6rem; }
    h2 { margin:0 0 .75rem; font-size:1.35rem; }
    p, li { line-height:1.55; color:var(--muted); }
    ul { margin:.75rem 0 0 1.2rem; padding:0; }
    .actions { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:1.25rem; }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>Capability Statement</h1>
    <a class="btn" href="./${PDF_NAME}" download>Download PDF</a>
    <a class="btn secondary" href="./print.html" target="_blank">HTML preview</a>
    <a class="btn secondary" href="/capability-statement">Live document</a>
    <a class="btn secondary" href="../">← All documents</a>
  </div>
  <div class="wrap">
    <div class="panel">
      <span class="tag">Marketing</span>
      <h2>Peakfront Capability Statement</h2>
      <p>Single-page A4 profile for procurement managers, project teams, and contractors. Covers equipment categories, industries served, and company strengths.</p>
      <ul>
        <li>Download the pre-generated PDF for email and procurement submissions.</li>
        <li>Or open the live document and use <strong>Print / Save as PDF</strong>.</li>
        <li>Enable <strong>Background graphics</strong> in print settings.</li>
      </ul>
      <div class="actions">
        <a class="btn" href="./${PDF_NAME}" download>Download PDF</a>
        <a class="btn secondary" href="/capability-statement">Open live document</a>
        <a class="btn secondary" href="../">Back to all documents</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  mkdirSync(outDir, { recursive: true });

  const images = {
    hero: await imageDataUri("hero.webp", 1400),
    logo: await logoDataUri(),
  };

  const printHtml = buildPrintHtml(images);
  const printPath = join(outDir, "print.html");
  const indexPath = join(outDir, "index.html");
  const pdfPath = join(outDir, PDF_NAME);

  writeFileSync(printPath, printHtml);
  writeFileSync(indexPath, buildLauncherHtml());

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(printHtml, { waitUntil: "domcontentloaded" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await browser.close();
    console.log(`Generated ${pdfPath}`);
  } catch (error) {
    console.warn("PDF generation skipped — open print.html and Print → Save as PDF.");
    console.warn(error.message);
  }

  writeFileSync(
    join(outDir, "README.txt"),
    `Peakfront Capability Statement
==============================

PDF (generated):
  public/docs/capability-statement/${PDF_NAME}

HTML preview:
  public/docs/capability-statement/print.html

Live document (Next.js):
  /capability-statement

Docs launcher:
  public/docs/capability-statement/index.html

Regenerate:
  npm run generate:capability-statement
`,
  );

  console.log(`Generated ${printPath}`);
  console.log(`Generated ${indexPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
