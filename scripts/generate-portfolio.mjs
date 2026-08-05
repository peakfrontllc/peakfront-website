import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import {
  COMPANY,
  CONTACT,
  SITE_URL,
  equipmentCategories,
  esc,
  getAboutStats,
  getPortfolioProjects,
  heroStats,
  industries,
  licenseListHtml,
  categoryUrl,
  timelineSteps,
  whyItems,
} from "./shared/marketing-data.mjs";
import { LOGO_FILES, logoFile } from "./shared/logo-paths.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const outDir = join(publicDir, "portfolio");

const projects = getPortfolioProjects(4);

async function imageDataUri(filename, width = 1200) {
  const path = join(publicDir, "images", filename);
  const buffer = await sharp(path)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

async function logoDataUri() {
  const svg = readFileSync(logoFile(publicDir, LOGO_FILES.lightSvg));
  const buffer = await sharp(svg).resize({ width: 420 }).png().toBuffer();
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

function buildHtml(images) {
  const { hero, about, logo } = images;
  const aboutStats = getAboutStats();

  const categoryCards = equipmentCategories
    .map(
      (cat) => `
      <article class="category-card">
        <img src="${images[cat.image]}" alt="${esc(cat.imageAlt)}" />
        <div class="category-body">
          <h3>${esc(cat.title)}</h3>
          <p>${esc(cat.description)}</p>
          <p class="category-url">${esc(categoryUrl(cat))}</p>
          <div class="tags">${cat.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        </div>
      </article>`,
    )
    .join("");

  const whyGrid = whyItems
    .map(
      (item) => `
      <article class="why-card">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
      </article>`,
    )
    .join("");

  const timeline = timelineSteps
    .map(
      (step) => `
      <article class="step-card">
        <div class="step-num">${esc(step.step)}</div>
        <div>
          <h3>${esc(step.title)}</h3>
          <p>${esc(step.text)}</p>
        </div>
      </article>`,
    )
    .join("");

  const projectCards = projects
    .map((project) => {
      const status =
        project.status === "ongoing" || project.completionDate === "Running"
          ? "Ongoing"
          : "Completed";
      return `
      <article class="project-card">
        <div class="project-head">
          <h3>${esc(project.projectName)}</h3>
          <span class="badge ${status === "Ongoing" ? "ongoing" : ""}">${status}</span>
        </div>
        <p class="project-meta"><strong>Client:</strong> ${esc(project.client)}</p>
        <p class="project-meta"><strong>Location:</strong> ${esc(project.location || "UAE")}</p>
        <p>${esc(project.scopeOfWork)}</p>
        <div class="tags">${project.equipment.map((e) => `<span>${esc(e)}</span>`).join("")}</div>
        <p class="project-dates">${esc(project.startDate)} - ${esc(project.completionDate)}</p>
      </article>`;
    })
    .join("");

  const statRow = aboutStats
    .map(
      (stat) => `
      <div><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(COMPANY.name)} — Company Portfolio</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #0b2545;
      background: #eef2f6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .screen-bar {
      max-width: 210mm;
      margin: 1rem auto 0.75rem;
      padding: 1rem 1.25rem;
      font-size: 0.9rem;
      line-height: 1.5;
      color: #475569;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(11, 37, 69, 0.08);
    }

    .screen-bar-copy {
      margin: 0;
    }

    .screen-bar-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      margin-top: 1rem;
    }

    .screen-bar .btn {
      appearance: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      border: 1px solid transparent;
      background: #0b2545;
      color: #fff;
      padding: 0.55rem 0.95rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      line-height: 1.25;
      cursor: pointer;
      text-decoration: none;
      font-family: inherit;
      white-space: nowrap;
    }

    .screen-bar .btn.secondary {
      background: #fff;
      color: #0b2545;
      border-color: #e2e8f0;
    }

    @media print {
      .screen-bar { display: none !important; }
      body { background: #fff; }
      .page {
        margin: 0;
        box-shadow: none;
      }
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 1rem;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 2px 12px rgba(11, 37, 69, 0.12);
    }
    .page:last-child { page-break-after: auto; }

    .cover {
      background: linear-gradient(135deg, #0b2545 0%, #14365f 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 297mm;
    }
    .cover-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.34;
    }
    .cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(11,37,69,0.96) 0%, rgba(11,37,69,0.55) 45%, rgba(11,37,69,0.25) 100%);
    }
    .cover-content {
      position: relative;
      z-index: 2;
      padding: 18mm 16mm 16mm;
    }
    .cover-logo { width: 58mm; margin-bottom: 10mm; }
    .cover h1 {
      font-size: 28pt;
      line-height: 1.08;
      font-weight: 800;
      max-width: 150mm;
    }
    .cover .tagline {
      margin-top: 5mm;
      font-size: 11pt;
      color: #f39c12;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .cover-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4mm;
      margin-top: 12mm;
    }
    .cover-stats div {
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.06);
      padding: 4mm;
    }
    .cover-stats strong {
      display: block;
      font-size: 14pt;
      color: #1565c0;
    }
    .cover-stats span {
      display: block;
      margin-top: 1.5mm;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      opacity: 0.85;
    }

    .inner { padding: 14mm 14mm 18mm; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f39c12;
      padding-bottom: 4mm;
      margin-bottom: 8mm;
    }
    .page-header img { height: 10mm; }
    .page-header span {
      font-size: 8pt;
      color: #64748b;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .page-footer {
      position: absolute;
      left: 14mm;
      right: 14mm;
      bottom: 8mm;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 3mm;
    }

    .eyebrow {
      font-size: 8pt;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #1565c0;
      margin-bottom: 3mm;
    }
    h2 {
      font-size: 20pt;
      line-height: 1.15;
      margin-bottom: 5mm;
    }
    .lead {
      font-size: 10.5pt;
      line-height: 1.55;
      color: #475569;
      margin-bottom: 5mm;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 8mm;
      align-items: start;
    }
    .about-grid img {
      width: 100%;
      height: 72mm;
      object-fit: cover;
      border: 2px solid rgba(243,156,18,0.35);
    }
    .stat-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3mm;
      margin-top: 6mm;
    }
    .stat-row div {
      border: 1px solid #dbe3ec;
      padding: 4mm;
      text-align: center;
    }
    .stat-row strong {
      display: block;
      font-size: 16pt;
      color: #1565c0;
    }
    .stat-row span {
      display: block;
      margin-top: 1mm;
      font-size: 7pt;
      text-transform: uppercase;
      color: #64748b;
    }

    .license-box {
      margin-top: 6mm;
      border: 1px solid #dbe3ec;
      background: #f8fafc;
      padding: 4.5mm;
    }
    .license-box h3 {
      font-size: 9pt;
      margin-bottom: 1.5mm;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .license-box .license-sub {
      font-size: 7.5pt;
      color: #64748b;
      margin-bottom: 3mm;
    }
    .license-list {
      list-style: none;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5mm;
    }
    .license-item {
      display: flex;
      gap: 3mm;
      font-size: 7pt;
      line-height: 1.35;
      color: #475569;
    }
    .license-code {
      flex-shrink: 0;
      font-weight: 700;
      color: #1565c0;
      font-family: "Courier New", monospace;
      min-width: 14mm;
    }

    .why-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4mm;
    }
    .why-card {
      border: 1px solid #dbe3ec;
      padding: 4.5mm;
      background: #f8fafc;
    }
    .why-card h3 { font-size: 10pt; margin-bottom: 2mm; }
    .why-card p { font-size: 8.5pt; line-height: 1.45; color: #475569; }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5mm;
    }
    .category-card {
      border: 1px solid #dbe3ec;
      overflow: hidden;
    }
    .category-card img {
      width: 100%;
      height: 38mm;
      object-fit: cover;
    }
    .category-body { padding: 4mm; }
    .category-body h3 { font-size: 11pt; margin-bottom: 2mm; }
    .category-body p { font-size: 8pt; line-height: 1.45; color: #475569; }
    .category-url {
      margin-top: 2mm;
      font-size: 7pt;
      color: #1565c0;
      font-weight: 600;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5mm;
      margin-top: 3mm;
    }
    .tags span {
      font-size: 6.5pt;
      padding: 1mm 2mm;
      background: #eef4fb;
      color: #0b2545;
      border: 1px solid #dbe3ec;
    }

    .industries {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3mm;
      margin-top: 4mm;
    }
    .industries div {
      text-align: center;
      padding: 4mm 2mm;
      border: 1px solid #dbe3ec;
      font-size: 8pt;
      font-weight: 700;
      background: #f8fafc;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4mm;
      margin-top: 4mm;
    }
    .step-card {
      display: flex;
      gap: 4mm;
      border-left: 3px solid #f39c12;
      padding: 3mm 0 3mm 4mm;
    }
    .step-num {
      font-size: 18pt;
      font-weight: 800;
      color: #1565c0;
      line-height: 1;
    }
    .step-card h3 { font-size: 10pt; margin-bottom: 1.5mm; }
    .step-card p { font-size: 8pt; line-height: 1.45; color: #475569; }

    .references-note {
      margin-top: 8mm;
      border-left: 3px solid #f39c12;
      padding: 2mm 0 2mm 5mm;
    }
    .references-note p {
      font-size: 9pt;
      line-height: 1.5;
      color: #475569;
    }
    .references-note a {
      color: #1565c0;
      font-weight: 700;
      text-decoration: none;
    }

    .project-card {
      border: 1px solid #dbe3ec;
      padding: 4.5mm;
      margin-bottom: 4mm;
    }
    .project-head {
      display: flex;
      justify-content: space-between;
      gap: 4mm;
      align-items: start;
      margin-bottom: 2mm;
    }
    .project-head h3 { font-size: 10pt; }
    .badge {
      font-size: 6.5pt;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 1mm 2.5mm;
      background: #0b2545;
      color: #fff;
      white-space: nowrap;
    }
    .badge.ongoing { background: #f39c12; color: #0b2545; }
    .project-meta { font-size: 8pt; color: #475569; margin-bottom: 1.5mm; }
    .project-card p { font-size: 8pt; line-height: 1.45; color: #334155; }
    .project-dates {
      margin-top: 2mm;
      font-size: 7pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .contact-page {
      background: #0b2545;
      color: #fff;
      min-height: 297mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 18mm 16mm;
    }
    .contact-page h2 {
      font-size: 24pt;
      margin-bottom: 4mm;
    }
    .contact-page .lead { color: rgba(255,255,255,0.82); }
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5mm;
      margin-top: 10mm;
    }
    .contact-grid div {
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.05);
      padding: 5mm;
    }
    .contact-grid dt {
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #f39c12;
      margin-bottom: 2mm;
    }
    .contact-grid dd {
      font-size: 10pt;
      line-height: 1.45;
    }
    .contact-logo {
      width: 52mm;
      margin-bottom: 8mm;
    }
    .contact-note {
      margin-top: 10mm;
      font-size: 8.5pt;
      color: rgba(255,255,255,0.7);
      max-width: 130mm;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="screen-bar">
    <p class="screen-bar-copy">
      <strong>${esc(COMPANY.name)}</strong> — 7-page company portfolio.
      Open in your browser and use Print → Save as PDF, or download the HTML file.
    </p>
    <div class="screen-bar-actions">
      <button type="button" class="btn" onclick="window.print()">Print / Save as PDF</button>
      <a class="btn secondary" href="./portfolio.html" download="Peakfront-Company-Portfolio.html">Download HTML</a>
    </div>
  </div>

  <section class="page cover">
    <img class="cover-image" src="${hero}" alt="Crawler excavator working on a construction site in Abu Dhabi at dawn" />
    <div class="cover-overlay"></div>
    <div class="cover-content">
      <img class="cover-logo" src="${logo}" alt="Peakfront" />
      <h1>${esc(COMPANY.name)}</h1>
      <p class="tagline">${esc(COMPANY.tagline)}</p>
      <div class="cover-stats">
        ${heroStats.map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="page">
    <div class="inner">
      <div class="page-header">
        <img src="${logo}" alt="Peakfront" />
        <span>Company Overview</span>
      </div>
      <p class="eyebrow">About Peakfront</p>
      <h2>The foundational rental partner for UAE contractors</h2>
      <div class="about-grid">
        <div>
          <p class="lead">${esc(COMPANY.description)}</p>
          <p class="lead">${esc(COMPANY.extended)}</p>
          <div class="stat-row">${statRow}</div>
          <div class="license-box">
            <h3>Licensed &amp; Regulated</h3>
            <p class="license-sub">${esc(COMPANY.name)} — registered activities with TAMM / ADDED</p>
            <ul class="license-list">${licenseListHtml(false)}</ul>
          </div>
        </div>
        <img src="${about}" alt="Peakfront heavy equipment rental fleet staged in Mussafah, Abu Dhabi" />
      </div>
    </div>
    <div class="page-footer"><span>${esc(COMPANY.shortName)} Portfolio</span><span>Page 2</span></div>
  </section>

  <section class="page">
    <div class="inner">
      <div class="page-header">
        <img src="${logo}" alt="Peakfront" />
        <span>Why Peakfront</span>
      </div>
      <p class="eyebrow">Our Advantage</p>
      <h2>Built for site speed, fleet depth and accountability</h2>
      <div class="why-grid">${whyGrid}</div>
      <p class="eyebrow" style="margin-top:8mm;">Industries Served</p>
      <div class="industries">${industries.map((i) => `<div>${esc(i)}</div>`).join("")}</div>
    </div>
    <div class="page-footer"><span>${esc(COMPANY.shortName)} Portfolio</span><span>Page 3</span></div>
  </section>

  <section class="page">
    <div class="inner">
      <div class="page-header">
        <img src="${logo}" alt="Peakfront" />
        <span>Equipment Fleet</span>
      </div>
      <p class="eyebrow">Rental Categories</p>
      <h2>Four core fleets — one accountable partner</h2>
      <p class="lead">Browse full category listings and indicative rates at ${esc(CONTACT.websiteDisplay)}.</p>
      <div class="category-grid">${categoryCards}</div>
    </div>
    <div class="page-footer"><span>${esc(COMPANY.shortName)} Portfolio</span><span>Page 4</span></div>
  </section>

  <section class="page">
    <div class="inner">
      <div class="page-header">
        <img src="${logo}" alt="Peakfront" />
        <span>How We Work</span>
      </div>
      <p class="eyebrow">Rental Process</p>
      <h2>From enquiry to demobilisation in four steps</h2>
      <div class="steps">${timeline}</div>
      <div class="references-note">
        <p><strong>Client references</strong> — verified testimonials and detailed project case studies are available on request. View our current track record at <a href="${esc(SITE_URL)}/our-project">${esc(CONTACT.websiteDisplay)}/our-project</a>.</p>
      </div>
    </div>
    <div class="page-footer"><span>${esc(COMPANY.shortName)} Portfolio</span><span>Page 5</span></div>
  </section>

  <section class="page">
    <div class="inner">
      <div class="page-header">
        <img src="${logo}" alt="Peakfront" />
        <span>Selected Projects</span>
      </div>
      <p class="eyebrow">Track Record</p>
      <h2>Recent project experience across the UAE</h2>
      ${projectCards}
    </div>
    <div class="page-footer"><span>${esc(COMPANY.shortName)} Portfolio</span><span>Page 6</span></div>
  </section>

  <section class="page contact-page">
    <img class="contact-logo" src="${logo}" alt="Peakfront" />
    <p class="eyebrow" style="color:#f39c12;">Get in Touch</p>
    <h2>Request a quotation or discuss your site requirements</h2>
    <p class="lead">Call, email or WhatsApp our rental desk. We typically respond with availability and rates within the hour.</p>
    <div class="contact-grid">
      <div><dt>Phone / WhatsApp</dt><dd>${esc(CONTACT.phone)}</dd></div>
      <div><dt>Email</dt><dd>${esc(CONTACT.email)}</dd></div>
      <div><dt>Website</dt><dd>${esc(CONTACT.websiteDisplay)}</dd></div>
      <div><dt>Office Hours</dt><dd>${esc(CONTACT.hours)}</dd></div>
      <div style="grid-column: span 2;"><dt>Address</dt><dd>${esc(CONTACT.address)}</dd></div>
      <div style="grid-column: span 2;"><dt>Contact Person</dt><dd>${esc(COMPANY.owner)} — ${esc(COMPANY.ownerTitle)}</dd></div>
    </div>
    <p class="contact-note">${esc(COMPANY.name)} · Heavy equipment, transport, buses and power equipment rental across the United Arab Emirates.</p>
    <div class="page-footer" style="position:absolute; border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.55);">
      <span>${esc(COMPANY.shortName)} Portfolio</span><span>Page 7</span>
    </div>
  </section>
</body>
</html>`;
}

async function main() {
  const imageFiles = [
    "hero.webp",
    "about.webp",
    ...equipmentCategories.map((c) => c.image),
  ];

  const images = {
    hero: await imageDataUri("hero.webp", 1600),
    about: await imageDataUri("about.webp", 1000),
    logo: await logoDataUri(),
  };

  for (const file of imageFiles) {
    if (!images[file]) {
      images[file] = await imageDataUri(file, file === "hero.webp" ? 1600 : 900);
    }
  }

  const html = buildHtml(images);
  const htmlPath = join(outDir, "portfolio.html");
  const indexPath = join(outDir, "index.html");
  const pdfPath = join(outDir, "Peakfront-Company-Portfolio.pdf");

  writeFileSync(htmlPath, html);
  writeFileSync(indexPath, html);

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    await browser.close();
    console.log(`Generated ${pdfPath}`);
  } catch (error) {
    console.warn("PDF generation skipped — open the HTML and Print → Save as PDF.");
    console.warn(error.message);
  }

  console.log(`Generated ${htmlPath}`);
  console.log(`Generated ${indexPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
