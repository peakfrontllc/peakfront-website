import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const outDir = join(publicDir, "portfolio");
const projectsData = JSON.parse(
  readFileSync(join(root, "data", "projects.json"), "utf8"),
);

const CONTACT = {
  phone: "+971 52 745 9432",
  email: "info@peakfront.ae",
  website: "www.peakfront.ae",
  address: "Mussafah Industrial Area, M-17, Abu Dhabi, United Arab Emirates",
  hours: "Sat - Thu: 7:00 - 19:00 | Fri: On call",
};

const COMPANY = {
  name: "Peakfront Equipment Rental LLC SPC",
  shortName: "Peakfront",
  tagline: "Heavy Equipment, Transport & Power Rental Across the UAE",
  owner: "Irfan Dayan",
  ownerTitle: "Managing Director",
  description:
    "Peakfront Equipment Rental LLC provides heavy equipment, transport vehicles, buses, generators, pumps and construction machinery across the UAE.",
  extended:
    "We work with trusted suppliers to provide reliable rental solutions for contractors, infrastructure projects, industrial facilities and commercial developments — combining depth of fleet with the responsiveness of a single accountable partner.",
};

const heroStats = [
  { value: "500+", label: "Equipment Available" },
  { value: "24 hrs", label: "Fast UAE Delivery" },
  { value: "Trusted", label: "Supplier Network" },
  { value: "24/7", label: "Professional Support" },
];

const equipmentCategories = [
  {
    title: "Heavy Equipment",
    image: "heavy-equipment.webp",
    description:
      "Earthmoving and lifting fleet for excavation, grading, compaction and material handling on large-scale sites.",
    tags: [
      "Excavators",
      "Wheel Loaders",
      "Bulldozers",
      "Backhoe Loaders",
      "Telehandlers",
      "Forklifts",
    ],
  },
  {
    title: "Transport",
    image: "transport.webp",
    description:
      "Haulage and site logistics — from pickups to low bed trailers moving plant across all seven emirates.",
    tags: [
      "Pickup Trucks",
      "Flatbed Trucks",
      "Low Bed Trailers",
      "Water Tankers",
      "Tipper Trucks",
    ],
  },
  {
    title: "Buses",
    image: "buses.webp",
    description:
      "Staff mobility solutions with licensed drivers, scheduled routes and fully air-conditioned cabins.",
    tags: ["Mini Buses", "Coaster Buses", "Luxury Coaches", "Staff Transportation"],
  },
  {
    title: "Power Equipment",
    image: "power-equipment.webp",
    description:
      "Temporary power, dewatering and site utilities — serviced, fuelled and delivered ready to run.",
    tags: ["Generators", "Diesel Pumps", "Air Compressors", "Lighting Towers"],
  },
];

const whyItems = [
  {
    title: "Professional Supplier Network",
    description:
      "Pre-qualified partners across the Emirates giving you depth of fleet on short notice.",
  },
  {
    title: "Competitive Prices",
    description:
      "Direct-source pricing with transparent daily, weekly and monthly structures.",
  },
  {
    title: "Fast Delivery",
    description:
      "Mobilisation in as little as four hours within Abu Dhabi and Dubai.",
  },
  {
    title: "24/7 Support",
    description:
      "A live rental desk for breakdowns, extensions and emergency dispatch.",
  },
  {
    title: "Reliable Equipment",
    description: "Serviced, inspected and third-party certified machines only.",
  },
  {
    title: "Flexible Rental Terms",
    description:
      "Scale units up or down as your programme changes — no rigid lock-ins.",
  },
];

const timelineSteps = [
  {
    step: "01",
    title: "Send your requirement",
    description:
      "Share equipment type, quantity, duration and site location — by form, phone or WhatsApp.",
  },
  {
    step: "02",
    title: "Receive quotation",
    description:
      "A detailed rate breakdown with availability, mobilisation cost and terms, typically within the hour.",
  },
  {
    step: "03",
    title: "Equipment delivered",
    description:
      "We schedule transport, permits and offloading so the machine is working on arrival.",
  },
  {
    step: "04",
    title: "Project completed",
    description:
      "Extend, swap or demobilise on your call, with servicing handled throughout.",
  },
];

const industries = [
  "Construction",
  "Oil & Gas",
  "Infrastructure",
  "Events",
  "Manufacturing",
  "Government Projects",
  "Utilities",
  "Logistics",
];

const testimonials = [
  {
    quote:
      "Peakfront mobilised three excavators and a low bed to our Al Ain site inside a day. Their coordination kept our earthworks programme on schedule.",
    name: "Rashid Al Mansoori",
    role: "Project Manager, Infrastructure Contractor",
  },
  {
    quote:
      "We needed staff buses on short notice for a 400-worker camp move. Peakfront had coaster buses on site the next morning, drivers included.",
    name: "Fatima Al Suwaidi",
    role: "Operations Lead, Facilities Management",
  },
  {
    quote:
      "Our dewatering pump failed at 11pm mid-pour. Peakfront had a replacement unit running by 2am. That's the kind of support that keeps us calling them first.",
    name: "Ahmed Al Hashimi",
    role: "Construction Manager, Government Projects",
  },
];

const projects = projectsData.projects
  .filter((p) => !p.id.includes("test"))
  .slice(0, 4);

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
  const buffer = await sharp(svg).resize({ width: 420 }).png().toBuffer();
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
  const { hero, about, logo } = images;

  const categoryCards = equipmentCategories
    .map(
      (cat) => `
      <article class="category-card">
        <img src="${images[cat.image]}" alt="${esc(cat.title)}" />
        <div class="category-body">
          <h3>${esc(cat.title)}</h3>
          <p>${esc(cat.description)}</p>
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
        <p>${esc(item.description)}</p>
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
          <p>${esc(step.description)}</p>
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

  const testimonialCards = testimonials
    .map(
      (t) => `
      <blockquote class="quote-card">
        <p>"${esc(t.quote)}"</p>
        <footer><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></footer>
      </blockquote>`,
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
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      page-break-after: always;
      position: relative;
      overflow: hidden;
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

    .quotes {
      display: grid;
      grid-template-columns: 1fr;
      gap: 4mm;
    }
    .quote-card {
      border-left: 3px solid #f39c12;
      padding: 2mm 0 2mm 5mm;
    }
    .quote-card p {
      font-size: 9pt;
      line-height: 1.5;
      color: #334155;
      font-style: italic;
    }
    .quote-card footer {
      margin-top: 2mm;
      font-size: 8pt;
    }
    .quote-card footer span {
      display: block;
      color: #64748b;
      margin-top: 0.5mm;
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
  <section class="page cover">
    <img class="cover-image" src="${hero}" alt="" />
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
          <div class="stat-row">
            <div><strong>500+</strong><span>Units in network</span></div>
            <div><strong>7</strong><span>Emirates covered</span></div>
            <div><strong>24/7</strong><span>Rental desk</span></div>
          </div>
        </div>
        <img src="${about}" alt="Peakfront fleet" />
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
      <p class="eyebrow" style="margin-top:8mm;">Client Feedback</p>
      <div class="quotes">${testimonialCards}</div>
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
      <div><dt>Website</dt><dd>${esc(CONTACT.website)}</dd></div>
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
  const pdfPath = join(outDir, "Peakfront-Company-Portfolio.pdf");

  writeFileSync(htmlPath, html);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();

  console.log(`Generated ${pdfPath}`);
  console.log(`Preview HTML: ${htmlPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
