import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const outDir = join(publicDir, "pamphlet");

const CONTACT = {
  phone: "+971 527459432",
  email: "info@peakfront.ae",
  website: "https://peakfront.ae",
  whatsapp: "wa.me/971527459432",
  address: "Mussafah Industrial Area, M-17, Abu Dhabi, UAE",
};

const COMPANY = {
  name: "Peakfront Equipment Rental LLC SPC",
  shortName: "Peakfront",
  tagline: "Heavy Equipment, Transport & Power Rental Across the UAE",
  description:
    "Reliable rental solutions for contractors, infrastructure projects, industrial facilities and commercial developments across all seven emirates.",
};

const heroStats = [
  { value: "100+", label: "Equipment Available" },
  { value: "24 hrs", label: "Fast UAE Delivery" },
  { value: "Trusted", label: "Supplier Network" },
  { value: "24/7", label: "Professional Support" },
];

const equipmentCategories = [
  {
    title: "Heavy Equipment",
    image: "heavy-equipment.webp",
    tags: ["Excavators", "Loaders", "Telehandlers", "Forklifts"],
  },
  {
    title: "Transport",
    image: "transport.webp",
    tags: ["Flatbeds", "Low Beds", "Tankers", "Tippers"],
  },
  {
    title: "Buses",
    image: "buses.webp",
    tags: ["Mini Buses", "Coasters", "Coaches", "Staff Transport"],
  },
  {
    title: "Power Equipment",
    image: "power-equipment.webp",
    tags: ["Generators", "Pumps", "Compressors", "Lighting"],
  },
];

const whyItems = [
  { title: "Supplier Network", text: "Pre-qualified partners across the Emirates." },
  { title: "Competitive Rates", text: "Transparent daily, weekly and monthly pricing." },
  { title: "Fast Delivery", text: "Mobilisation in as little as four hours." },
  { title: "24/7 Support", text: "Live desk for breakdowns and emergency dispatch." },
  { title: "Reliable Fleet", text: "Serviced, inspected and certified machines." },
  { title: "Flexible Terms", text: "Scale units up or down as your programme changes." },
];

const timelineSteps = [
  { step: "01", title: "Send requirement", text: "Phone, WhatsApp or email." },
  { step: "02", title: "Get quotation", text: "Rates and availability within the hour." },
  { step: "03", title: "Equipment delivered", text: "Transport, permits and offloading handled." },
  { step: "04", title: "Project completed", text: "Extend, swap or demobilise on your call." },
];

const industries = [
  "Construction",
  "Oil & Gas",
  "Infrastructure",
  "Events",
  "Manufacturing",
  "Government",
  "Utilities",
  "Logistics",
];

async function imageDataUri(filename, width = 800) {
  const path = join(publicDir, "images", filename);
  const buffer = await sharp(path)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

async function logoDataUri(light = false) {
  const file = light ? "logo-light.svg" : "logo.svg";
  const svg = readFileSync(join(publicDir, file));
  const buffer = await sharp(svg).resize({ width: 360 }).png().toBuffer();
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildHtml(images) {
  const categoryCards = equipmentCategories
    .map(
      (cat) => `
      <article class="category">
        <img src="${images[cat.image]}" alt="${esc(cat.title)}" />
        <div class="category-body">
          <h3>${esc(cat.title)}</h3>
          <div class="tags">${cat.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>
        </div>
      </article>`,
    )
    .join("");

  const whyCards = whyItems
    .map(
      (item) => `
      <article class="why">
        <h4>${esc(item.title)}</h4>
        <p>${esc(item.text)}</p>
      </article>`,
    )
    .join("");

  const steps = timelineSteps
    .map(
      (item) => `
      <article class="step">
        <div class="step-num">${esc(item.step)}</div>
        <h4>${esc(item.title)}</h4>
        <p>${esc(item.text)}</p>
      </article>`,
    )
    .join("");

  const industryTags = industries.map((name) => `<span>${esc(name)}</span>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(COMPANY.name)} — Company Pamphlet</title>
  <style>
    @page { size: A4; margin: 0; }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #0b2545;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .screen-bar {
      max-width: 210mm;
      margin: 0 auto;
      padding: 1rem 1rem 0;
      font-size: 0.9rem;
      color: #475569;
    }

    .screen-bar button {
      margin-top: 0.75rem;
      border: none;
      background: #0b2545;
      color: #fff;
      padding: 0.6rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }

    .pamphlet {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      overflow: hidden;
      display: grid;
      grid-template-rows: auto auto minmax(0, 1fr) auto;
      background: #fff;
    }

    .hero {
      position: relative;
      background: linear-gradient(135deg, #0b2545 0%, #14365f 100%);
      color: #fff;
      padding: 10mm 12mm 9mm;
      min-height: 78mm;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.28;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        115deg,
        rgba(11, 37, 69, 0.96) 0%,
        rgba(11, 37, 69, 0.78) 55%,
        rgba(11, 37, 69, 0.45) 100%
      );
    }

    .hero-content {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8mm;
      align-items: start;
    }

    .hero-logo {
      width: 52mm;
      margin-bottom: 4mm;
    }

    .hero h1 {
      font-size: 19pt;
      line-height: 1.12;
      font-weight: 800;
      max-width: 118mm;
    }

    .hero .tagline {
      margin-top: 3mm;
      font-size: 8.5pt;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #f39c12;
    }

    .hero .intro {
      margin-top: 3mm;
      max-width: 118mm;
      font-size: 8.5pt;
      line-height: 1.45;
      color: rgba(255, 255, 255, 0.82);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(28mm, 1fr));
      gap: 2.5mm;
      min-width: 58mm;
    }

    .stat {
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.06);
      padding: 3mm;
    }

    .stat strong {
      display: block;
      font-size: 12pt;
      color: #5dadec;
    }

    .stat span {
      display: block;
      margin-top: 1mm;
      font-size: 6.5pt;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      line-height: 1.3;
      opacity: 0.88;
    }

    .section {
      padding: 4mm 12mm 0;
      min-height: 0;
      overflow: hidden;
    }

    .section-main {
      min-height: 0;
      overflow: hidden;
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 4mm;
      margin-bottom: 4mm;
      border-bottom: 1.5px solid #f39c12;
      padding-bottom: 2.5mm;
    }

    .eyebrow {
      font-size: 7pt;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #1565c0;
      margin-bottom: 1mm;
    }

    .section-head h2 {
      font-size: 13pt;
      line-height: 1.1;
    }

    .section-head p {
      font-size: 7.5pt;
      color: #64748b;
      max-width: 70mm;
      text-align: right;
      line-height: 1.35;
    }

    .categories {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 3mm;
    }

    .category {
      border: 1px solid #e2e8f0;
      display: grid;
      grid-template-columns: 24mm 1fr;
      min-height: 24mm;
      overflow: hidden;
    }

    .category img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .category-body {
      padding: 2.5mm 3mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .category h3 {
      font-size: 9pt;
      margin-bottom: 1.5mm;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 1mm;
    }

    .tags span {
      font-size: 5.8pt;
      padding: 0.8mm 1.5mm;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .why-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5mm;
    }

    .why {
      border-left: 2px solid #f39c12;
      padding: 2mm 2.5mm;
      background: #f8fafc;
      min-height: 18mm;
    }

    .why h4 {
      font-size: 8pt;
      margin-bottom: 1mm;
    }

    .why p {
      font-size: 6.8pt;
      line-height: 1.35;
      color: #475569;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.5mm;
      margin-top: 4mm;
    }

    .step {
      border: 1px solid #dbeafe;
      background: linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%);
      padding: 3mm;
      min-height: 22mm;
    }

    .step-num {
      font-size: 11pt;
      font-weight: 800;
      color: #1565c0;
      margin-bottom: 1.5mm;
    }

    .step h4 {
      font-size: 8pt;
      margin-bottom: 1mm;
    }

    .step p {
      font-size: 6.8pt;
      line-height: 1.35;
      color: #475569;
    }

    .industries {
      margin-top: 4mm;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5mm;
    }

    .industries span {
      font-size: 6pt;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 1mm 2mm;
      border: 1px solid #cbd5e1;
      color: #334155;
    }

    .contact {
      flex-shrink: 0;
      background: #0b2545;
      color: #fff;
      padding: 4.5mm 12mm;
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 5mm;
      align-items: center;
    }

    .contact-logo {
      width: 36mm;
      margin-bottom: 2mm;
    }

    .contact h3 {
      font-size: 11pt;
      margin-bottom: 1.5mm;
    }

    .contact .cta {
      font-size: 7pt;
      color: rgba(255, 255, 255, 0.72);
      line-height: 1.4;
      max-width: 88mm;
      margin-bottom: 3mm;
    }

    .contact-website {
      margin-top: 1mm;
    }

    .contact-website strong {
      display: block;
      color: #f39c12;
      font-size: 6pt;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.8mm;
    }

    .contact-website span,
    .contact-website a {
      display: block;
      font-size: 11pt;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.02em;
      text-decoration: none;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5mm;
      font-size: 7.5pt;
      line-height: 1.35;
    }

    .contact-item strong {
      display: block;
      color: #f39c12;
      font-size: 6pt;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.5mm;
    }

    .contact-item span {
      display: block;
      color: #fff;
    }

    @media print {
      .screen-bar { display: none !important; }
      body { background: #fff; }
      .pamphlet { margin: 0; }
    }
  </style>
</head>
<body>
  <div class="screen-bar">
    <strong>${esc(COMPANY.name)}</strong> — single-page A4 pamphlet.
    Open in your browser and use Print → Save as PDF, or run <code>npm run generate:pamphlet</code>.
    <div><button onclick="window.print()">Print / Save as PDF</button></div>
  </div>

  <main class="pamphlet">
    <header class="hero">
      <img class="hero-bg" src="${images.hero}" alt="" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div>
          <img class="hero-logo" src="${images.logoLight}" alt="${esc(COMPANY.shortName)}" />
          <h1>Equipment, Transport &amp; Site Solutions for the UAE</h1>
          <p class="tagline">${esc(COMPANY.tagline)}</p>
          <p class="intro">${esc(COMPANY.description)}</p>
        </div>
        <div class="stats">
          ${heroStats
            .map(
              (stat) => `
            <div class="stat">
              <strong>${esc(stat.value)}</strong>
              <span>${esc(stat.label)}</span>
            </div>`,
            )
            .join("")}
        </div>
      </div>
    </header>

    <section class="section">
      <div class="section-head">
        <div>
          <div class="eyebrow">Our Fleet</div>
          <h2>What We Rent</h2>
        </div>
        <p>Earthmoving, haulage, staff transport and temporary power — delivered across Abu Dhabi, Dubai and all seven emirates.</p>
      </div>
      <div class="categories">${categoryCards}</div>
    </section>

    <section class="section section-main">
      <div class="section-head">
        <div>
          <div class="eyebrow">Why Peakfront</div>
          <h2>Built for Contractors</h2>
        </div>
        <p>One accountable partner with the fleet depth of a network and the responsiveness of a local desk.</p>
      </div>
      <div class="why-grid">${whyCards}</div>

      <div class="section-head" style="margin-top: 4mm;">
        <div>
          <div class="eyebrow">How It Works</div>
          <h2>From Enquiry to Site</h2>
        </div>
      </div>
      <div class="steps">${steps}</div>

      <div class="section-head" style="margin-top: 3mm;">
        <div>
          <div class="eyebrow">Industries</div>
          <h2>Sectors We Serve</h2>
        </div>
      </div>
      <div class="industries">${industryTags}</div>
    </section>

    <footer class="contact">
      <div>
        <img class="contact-logo" src="${images.logoLight}" alt="${esc(COMPANY.shortName)}" />
        <h3>Request a quote today</h3>
        <p class="cta">Call, email or WhatsApp our rental desk. We typically respond with availability and rates within the hour.</p>
        <p class="contact-website">
          <strong>Website</strong>
          <a href="${esc(CONTACT.website)}">${esc(CONTACT.website)}</a>
        </p>
      </div>
      <div class="contact-grid">
        <div class="contact-item">
          <strong>Phone / WhatsApp</strong>
          <span>${esc(CONTACT.phone)}</span>
        </div>
        <div class="contact-item">
          <strong>Email</strong>
          <span>${esc(CONTACT.email)}</span>
        </div>
        <div class="contact-item">
          <strong>Head Office</strong>
          <span>${esc(CONTACT.address)}</span>
        </div>
      </div>
    </footer>
  </main>
</body>
</html>`;
}

async function main() {
  mkdirSync(outDir, { recursive: true });

  const images = {
    hero: await imageDataUri("hero.webp", 1400),
    logoLight: await logoDataUri(true),
    logo: await logoDataUri(false),
  };

  for (const cat of equipmentCategories) {
    images[cat.image] = await imageDataUri(cat.image, 320);
  }

  const html = buildHtml(images);
  const htmlPath = join(outDir, "index.html");
  const pdfPath = join(outDir, "Peakfront-Pamphlet.pdf");

  writeFileSync(htmlPath, html);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();

  writeFileSync(
    join(outDir, "README.txt"),
    `Peakfront Single-Page Pamphlet
===============================

HTML preview:
  Open public/pamphlet/index.html in your browser
  Click "Print / Save as PDF"

PDF (generated):
  public/pamphlet/Peakfront-Pamphlet.pdf

Regenerate:
  npm run generate:pamphlet
`,
  );

  console.log(`Generated ${htmlPath}`);
  console.log(`Generated ${pdfPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
