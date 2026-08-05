import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDeliveryDocx } from "./docs/delivery.mjs";
import {
  buildInvoiceWorkbook,
  buildPurchaseOrderWorkbook,
  buildQuotationWorkbook,
  buildRfqWorkbook,
  buildTimesheetWorkbook,
} from "./docs/excel.mjs";
import { buildInspectionDocx } from "./docs/inspection.mjs";
import { buildInvoiceDocx } from "./docs/invoice.mjs";
import { buildPurchaseOrderDocx } from "./docs/purchase-order.mjs";
import { buildQuotationDocx } from "./docs/quotation.mjs";
import { buildRentalAgreementDocx } from "./docs/rental-agreement.mjs";
import { buildRfqDocx } from "./docs/rfq.mjs";
import { buildTimesheetDocx } from "./docs/timesheet.mjs";
import { writeDocHtmlPages } from "./docs/html-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const docsDir = join(publicDir, "docs");

const DOC_TYPES = [
  { id: "quotation", name: "Quotation", docx: "Peakfront-Quotation-Template.docx", xlsx: "Peakfront-Quotation-Template.xlsx", buildDocx: buildQuotationDocx, buildXlsx: buildQuotationWorkbook },
  { id: "rfq", name: "Request For Quotation", docx: "Peakfront-RFQ-Template.docx", xlsx: "Peakfront-RFQ-Template.xlsx", buildDocx: buildRfqDocx, buildXlsx: buildRfqWorkbook },
  { id: "rental-agreement", name: "Rental Agreement", docx: "Peakfront-Rental-Agreement-Template.docx", buildDocx: buildRentalAgreementDocx },
  { id: "purchase-order", name: "Purchase Order", docx: "Peakfront-Purchase-Order-Template.docx", xlsx: "Peakfront-Purchase-Order-Template.xlsx", buildDocx: buildPurchaseOrderDocx, buildXlsx: buildPurchaseOrderWorkbook },
  { id: "delivery", name: "Delivery Note", docx: "Peakfront-Delivery-Note-Template.docx", buildDocx: buildDeliveryDocx },
  { id: "timesheet", name: "Daily Timesheet", docx: "Peakfront-Timesheet-Template.docx", xlsx: "Peakfront-Timesheet-Template.xlsx", buildDocx: buildTimesheetDocx, buildXlsx: buildTimesheetWorkbook },
  { id: "inspection", name: "Inspection Report", docx: "Peakfront-Inspection-Report-Template.docx", buildDocx: buildInspectionDocx },
  { id: "invoice", name: "Invoice", docx: "Peakfront-Invoice-Template.docx", xlsx: "Peakfront-Invoice-Template.xlsx", buildDocx: buildInvoiceDocx, buildXlsx: buildInvoiceWorkbook },
];

async function main() {
  mkdirSync(docsDir, { recursive: true });

  for (const doc of DOC_TYPES) {
    const outDir = join(docsDir, doc.id);
    mkdirSync(outDir, { recursive: true });

    const docxPath = join(outDir, doc.docx);
    await doc.buildDocx(publicDir, docxPath);
    console.log(`Generated ${docxPath}`);

    if (doc.buildXlsx) {
      const workbook = await doc.buildXlsx();
      const xlsxPath = join(outDir, doc.xlsx);
      await workbook.xlsx.writeFile(xlsxPath);
      console.log(`Generated ${xlsxPath}`);
    }
  }

  writeDocHtmlPages(docsDir, DOC_TYPES);
  writeCapabilityStatementPage(docsDir);
  writeHubIndex(docsDir);
  writeReadme(docsDir);
  console.log(`Generated ${join(docsDir, "index.html")}`);
}

function writeCapabilityStatementPage(docsDir) {
  const outDir = join(docsDir, "capability-statement");
  mkdirSync(outDir, { recursive: true });

  const pdfName = "Peakfront-Capability-Statement.pdf";

  writeFileSync(
    join(outDir, "index.html"),
    `<!DOCTYPE html>
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
    <a class="btn" href="./${pdfName}" download>Download PDF</a>
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
        <a class="btn" href="./${pdfName}" download>Download PDF</a>
        <a class="btn secondary" href="/capability-statement">Open live document</a>
        <a class="btn secondary" href="../">Back to all documents</a>
      </div>
    </div>
  </div>
</body>
</html>`,
  );

  writeFileSync(
    join(outDir, "README.txt"),
    `Peakfront Capability Statement
==============================

PDF (generated):
  public/docs/capability-statement/${pdfName}

HTML preview:
  public/docs/capability-statement/print.html

Live document (Next.js):
  /capability-statement

Regenerate PDF + print HTML:
  npm run generate:capability-statement
`,
  );

  console.log(`Generated ${join(outDir, "index.html")}`);
}

function writeHubIndex(docsDir) {
  const cards = [
    { href: "./quotation/", title: "Quotation", desc: "Send quotes to clients", tag: "Sales" },
    { href: "./rfq/", title: "Request For Quotation", desc: "Request pricing from suppliers", tag: "Procurement" },
    { href: "./rental-agreement/", title: "Rental Agreement", desc: "Equipment lease contract with client", tag: "Legal" },
    { href: "./purchase-order/", title: "Purchase Order", desc: "Official PO to suppliers", tag: "Procurement" },
    { href: "./delivery/", title: "Delivery Note", desc: "Equipment handover on delivery/collection", tag: "Operations" },
    { href: "./timesheet/", title: "Daily Timesheet", desc: "Record equipment hours on site", tag: "Operations" },
    { href: "./inspection/", title: "Inspection Report", desc: "Pre/post rental equipment checklist", tag: "Operations" },
    { href: "./invoice/", title: "Invoice", desc: "Tax invoice for clients", tag: "Finance" },
    { href: "./pamphlet/", title: "Company Pamphlet", desc: "Single-page A4 marketing PDF", tag: "Marketing" },
    { href: "./capability-statement/", title: "Capability Statement", desc: "A4 company profile for procurement teams", tag: "Marketing" },
    { href: "./business-card/", title: "Business Card", desc: "Print-ready business cards", tag: "Marketing" },
  ];

  writeFileSync(
    join(docsDir, "index.html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Peakfront — Official Documents</title>
  <style>
    :root { --navy:#0b2545; --amber:#f39c12; --line:#e2e8f0; --muted:#64748b; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Arial,Helvetica,sans-serif; background:#eef2f6; color:var(--navy); }
    .wrap { max-width:980px; margin:0 auto; padding:2rem 1.25rem 3rem; }
    header { text-align:center; margin-bottom:2rem; }
    header img { width:240px; margin-bottom:1rem; }
    header p { color:var(--muted); margin:.35rem 0; }
    h1 { margin:.5rem 0 .25rem; font-size:1.6rem; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem; }
    a.card { display:block; background:white; border:1px solid var(--line); border-radius:10px; padding:1.1rem 1.2rem; text-decoration:none; color:inherit; box-shadow:0 8px 24px rgba(11,37,69,.06); transition:transform .15s,border-color .15s; }
    a.card:hover { transform:translateY(-2px); border-color:var(--amber); }
    .tag { display:inline-block; font-size:.7rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--amber); margin-bottom:.45rem; }
    .card h2 { margin:0 0 .35rem; font-size:1.05rem; }
    .card p { margin:0; font-size:.92rem; color:var(--muted); line-height:1.45; }
    footer { margin-top:2rem; text-align:center; font-size:.85rem; color:var(--muted); }
    code { background:#f8fafc; padding:.1rem .35rem; border-radius:4px; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <img src="/logo/logo.svg" alt="Peakfront" />
      <h1>Official Documents</h1>
      <p>Peakfront Equipment Rental LLC SPC — templates for sales, procurement, operations and finance.</p>
      <p>Regenerate all files: <code>npm run generate:docs</code></p>
    </header>
    <div class="grid">
      ${cards.map((c) => `<a class="card" href="${c.href}"><span class="tag">${c.tag}</span><h2>${c.title}</h2><p>${c.desc}</p></a>`).join("\n      ")}
    </div>
    <footer>Open any template in your browser, or download Word / Excel versions from each page.</footer>
  </div>
</body>
</html>`,
  );
}

function writeReadme(docsDir) {
  writeFileSync(
    join(docsDir, "README.txt"),
    `Peakfront Official Documents
==========================

Hub page: public/docs/index.html  (or /docs in the browser)

Sales & client documents:
  quotation/          — Client quotations
  rental-agreement/   — Equipment rental / lease agreement
  invoice/            — Tax invoices

Procurement:
  rfq/                — Request for quotation (to suppliers)
  purchase-order/     — Purchase orders

Operations:
  delivery/           — Equipment delivery / handover notes
  timesheet/          — Daily equipment time sheets
  inspection/         — Equipment inspection reports

Marketing:
  pamphlet/               — Company pamphlet (PDF)
  capability-statement/   — A4 capability statement for procurement
  business-card/          — Business card print files

Regenerate all templates:
  npm run generate:docs

Individual generators still available:
  npm run generate:pamphlet
  npm run generate:capability-statement
  npm run generate:business-card
`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
