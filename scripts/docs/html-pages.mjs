import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE_CSS = `
    :root { --navy:#0b2545; --amber:#f39c12; --line:#e2e8f0; --muted:#64748b; --supplier:#fffbeb; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Arial,Helvetica,sans-serif; background:#eef2f6; color:var(--navy); }
    .toolbar { position:sticky; top:0; z-index:10; display:flex; flex-wrap:wrap; gap:.75rem; align-items:center; padding:1rem 1.25rem; background:white; border-bottom:1px solid var(--line); }
    .toolbar h1 { margin:0; font-size:1rem; flex:1; min-width:200px; }
    button, a.btn { appearance:none; border:none; cursor:pointer; text-decoration:none; background:var(--navy); color:white; padding:.55rem .95rem; border-radius:6px; font-size:.9rem; font-weight:600; }
    button.secondary, a.btn.secondary { background:white; color:var(--navy); border:1px solid var(--line); }
    .page { width:210mm; min-height:297mm; margin:1.5rem auto; background:white; box-shadow:0 12px 40px rgba(11,37,69,.08); padding:14mm; }
    .header { text-align:center; border-bottom:3px solid var(--amber); padding-bottom:10px; margin-bottom:16px; }
    .header img { width:220px; margin-bottom:8px; }
    .header p { margin:4px 0; font-size:10pt; color:var(--muted); }
    .title { margin:16px 0 12px; text-align:center; font-size:14pt; font-weight:700; letter-spacing:.12em; }
    .subtitle { text-align:center; font-size:9.5pt; color:var(--muted); font-style:italic; margin:-6px 0 16px; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:10px 16px; margin-bottom:16px; }
    label { display:block; font-size:8pt; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin-bottom:4px; }
    input, textarea { width:100%; border:1px solid var(--line); border-radius:4px; padding:8px 10px; font:inherit; color:var(--navy); background:#fbfdff; }
    textarea { min-height:70px; resize:vertical; }
    table { width:100%; border-collapse:collapse; margin:12px 0; font-size:9.5pt; }
    th { background:var(--navy); color:white; padding:8px 6px; text-align:left; font-size:8pt; letter-spacing:.06em; text-transform:uppercase; }
    th.supplier { background:#92400e; }
    td { border:1px solid var(--line); padding:4px; vertical-align:top; }
    td input, td textarea { border:none; background:transparent; padding:6px 4px; min-height:auto; }
    .terms { margin-top:18px; padding-top:12px; border-top:1px solid var(--line); font-size:9pt; color:var(--muted); }
    .terms h3 { margin:0 0 8px; font-size:9pt; color:var(--navy); text-transform:uppercase; letter-spacing:.1em; }
    .signatures { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:24px; font-size:10pt; }
    .signatures .box { border-top:1px solid var(--line); padding-top:10px; min-height:70px; }
    .signatures .supplier-box { background:var(--supplier); border-radius:4px; padding:10px; min-height:70px; }
    .back { margin-left:auto; }
    @media print { body{background:white;} .toolbar,.no-print{display:none!important;} .page{width:auto;margin:0;box-shadow:none;padding:0;} input,textarea{border:none;background:transparent;} }
`;

function shell(title, toolbarExtra, body, script = "") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Peakfront — ${title}</title>
  <style>${BASE_CSS}</style>
</head>
<body>
  <div class="toolbar">
    <h1>${title}</h1>
    ${toolbarExtra}
    <button type="button" onclick="window.print()">Print / Save PDF</button>
    <a class="btn secondary back" href="../">← All documents</a>
  </div>
  <main class="page">
    <header class="header">
      <img src="/logo.svg" alt="Peakfront" />
      <p><strong>Peakfront Equipment Rental LLC SPC</strong></p>
      <p>Heavy Equipment &amp; Transport Rental</p>
      <p>Mussafah 17, Abu Dhabi, United Arab Emirates · +971 527459432 · info@peakfront.ae · www.peakfront.ae</p>
    </header>
    ${body}
  </main>
  ${script}
</body>
</html>`;
}

function companyFields(fields) {
  return `<section class="grid">${fields
    .map(([id, label, type = "text", placeholder = ""]) => `<div><label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${placeholder}" /></div>`)
    .join("")}</section>`;
}

const PAGES = {
  "rental-agreement": (doc) =>
    shell(
      "Rental Agreement — editable",
      `<a class="btn secondary" href="./${doc.docx}" download>Download Word</a>`,
      `<div class="title">EQUIPMENT RENTAL AGREEMENT</div>
      ${companyFields([
        ["agreementNo", "Agreement No.", "text", "PRA-2026-001"],
        ["agreementDate", "Date", "date"],
        ["lessee", "Lessee / Client"],
        ["contact", "Contact Person"],
        ["project", "Project / Site"],
        ["location", "Site Location"],
        ["startDate", "Rental Start", "date"],
        ["endDate", "Rental End", "date"],
        ["quoteRef", "Quote / Ref No."],
        ["lesseeTrn", "TRN (Lessee)"],
      ])}
      <section class="terms"><h3>Schedule A — Equipment</h3>
      <div class="grid">
        <div><label for="equipment">Equipment Description</label><input id="equipment" placeholder="Type, model, capacity" /></div>
        <div><label for="assetNo">Asset / Reg. No.</label><input id="assetNo" /></div>
        <div><label for="rate">Daily / Monthly Rate (AED)</label><input id="rate" /></div>
        <div><label for="inclusions">Operator / Fuel Included?</label><input id="inclusions" placeholder="Yes / No — specify" /></div>
      </div></section>
      <section class="terms"><h3>Special Conditions</h3><textarea id="special">Enter any project-specific terms, mobilisation details or exclusions.</textarea></section>
      <section class="signatures">
        <div><strong>Lessor (Peakfront)</strong><div class="box">Irfan Dayan<br/>Managing Director<br/>Peakfront Equipment Rental LLC SPC</div></div>
        <div><strong>Lessee (Client)</strong><div class="supplier-box"></div></div>
      </section>`,
    ),

  "purchase-order": (doc) =>
    shell(
      "Purchase Order — editable",
      `<button type="button" class="secondary" onclick="recalc()">Recalculate</button><a class="btn secondary" href="./${doc.docx}" download>Download Word</a><a class="btn secondary" href="./${doc.xlsx}" download>Download Excel</a>`,
      `<div class="title">PURCHASE ORDER</div>
      ${companyFields([
        ["poNo", "PO No.", "text", "PPO-2026-001"],
        ["poDate", "Date", "date"],
        ["supplier", "Supplier / Vendor"],
        ["contact", "Contact Person"],
        ["email", "Email", "email"],
        ["phone", "Phone"],
        ["quoteRef", "RFQ / Quote Ref."],
        ["requiredBy", "Required By", "date"],
        ["shipTo", "Ship To / Delivery"],
        ["project", "Project / Site"],
      ])}
      <table><thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody id="rows"></tbody></table>
      <div style="margin-left:auto;width:280px;font-size:10pt"><div style="display:flex;justify-content:space-between;padding:6px 0"><span>Subtotal</span><span id="subtotal">0.00</span></div><div style="display:flex;justify-content:space-between;padding:6px 0"><span>VAT (5%)</span><span id="vat">0.00</span></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid var(--amber);font-weight:700"><span>Grand Total (AED)</span><span id="total">0.00</span></div></div>
      <section class="signatures"><div><strong>Authorized by (Peakfront)</strong><div class="box">Irfan Dayan · Managing Director</div></div><div><strong>Accepted by (Supplier)</strong><div class="supplier-box"></div></div></section>`,
      `<script>
const rows=document.getElementById('rows');
function fmt(n){return Number(n||0).toLocaleString('en-AE',{minimumFractionDigits:2,maximumFractionDigits:2});}
function addRow(d={}){const i=rows.children.length+1;const tr=document.createElement('tr');tr.innerHTML=\`<td>\${i}</td><td><input value="\${d.desc||''}"></td><td><input type="number" min="0" class="qty" value="\${d.qty??''}"></td><td><input value="\${d.unit||''}"></td><td><input type="number" min="0" step="0.01" class="price" value="\${d.price??''}"></td><td class="amt">0.00</td>\`;tr.querySelectorAll('input').forEach(el=>el.oninput=recalc);rows.appendChild(tr);recalc();}
function recalc(){let s=0;[...rows.children].forEach(r=>{const q=parseFloat(r.querySelector('.qty').value)||0;const p=parseFloat(r.querySelector('.price').value)||0;const a=q*p;r.querySelector('.amt').textContent=fmt(a);s+=a;});document.getElementById('subtotal').textContent=fmt(s);document.getElementById('vat').textContent=fmt(s*0.05);document.getElementById('total').textContent=fmt(s*1.05);}
addRow({desc:'20T Crawler Excavator (example)',qty:1,unit:'Unit'});for(let i=0;i<4;i++)addRow();
document.getElementById('poDate').value=new Date().toISOString().slice(0,10);
</script>`,
    ),

  delivery: (doc) =>
    shell(
      "Delivery Note — editable",
      `<a class="btn secondary" href="./${doc.docx}" download>Download Word</a>`,
      `<div class="title">EQUIPMENT DELIVERY NOTE</div><p class="subtitle">Handover record — delivery or collection</p>
      ${companyFields([
        ["dnNo", "Delivery Note No.", "text", "PDN-2026-001"],
        ["dnDate", "Date", "date"],
        ["client", "Client / Company"],
        ["contact", "Contact Person"],
        ["project", "Project / Site"],
        ["location", "Site Location"],
        ["ref", "Agreement / Quote Ref."],
        ["type", "Type", "text", "Delivery / Collection"],
      ])}
      <table><thead><tr><th>#</th><th>Equipment</th><th>Asset / Reg.</th><th>Hour / ODO</th><th>Condition</th><th>Remarks</th></tr></thead><tbody id="rows"></tbody></table>
      <section class="terms"><h3>Accessories &amp; Notes</h3><textarea id="accessories">Buckets, keys, documents, fuel level, etc.</textarea></section>
      <section class="signatures"><div><strong>Delivered by (Peakfront)</strong><div class="box">Irfan Dayan · Managing Director</div></div><div><strong>Received by (Client)</strong><div class="supplier-box"></div></div></section>`,
      `<script>
const rows=document.getElementById('rows');
function addRow(d={}){const i=rows.children.length+1;const tr=document.createElement('tr');tr.innerHTML=\`<td>\${i}</td><td><input value="\${d.eq||''}"></td><td><input></td><td><input></td><td><input placeholder="Good / Fair"></td><td><input></td>\`;rows.appendChild(tr);}
addRow({eq:'20T Crawler Excavator (example)'});for(let i=0;i<4;i++)addRow();
document.getElementById('dnDate').value=new Date().toISOString().slice(0,10);
</script>`,
    ),

  timesheet: (doc) =>
    shell(
      "Daily Timesheet — editable",
      `<a class="btn secondary" href="./${doc.docx}" download>Download Word</a><a class="btn secondary" href="./${doc.xlsx}" download>Download Excel</a>`,
      `<div class="title">DAILY EQUIPMENT TIME SHEET</div>
      ${companyFields([
        ["tsNo", "Timesheet No.", "text", "PTS-2026-001"],
        ["tsDate", "Date", "date"],
        ["client", "Client / Company"],
        ["project", "Project / Site"],
        ["location", "Site Location"],
        ["ref", "Agreement / Quote Ref."],
      ])}
      <table><thead><tr><th>#</th><th>Equipment</th><th>Asset / Reg.</th><th>Operator</th><th>Start</th><th>End</th><th>Break</th><th>Total Hrs</th></tr></thead><tbody id="rows"></tbody></table>
      <section class="terms"><h3>Work Description</h3><textarea id="work">Activities performed and location on site.</textarea></section>
      <section class="signatures"><div><strong>Operator / Peakfront Rep</strong><div class="box"></div></div><div><strong>Approved by (Client)</strong><div class="supplier-box"></div></div></section>`,
      `<script>
const rows=document.getElementById('rows');
function calc(r){const s=parseFloat(r.querySelector('.start').value)||0;const e=parseFloat(r.querySelector('.end').value)||0;const b=parseFloat(r.querySelector('.break').value)||0;r.querySelector('.total').textContent=Math.max(0,e-s-b).toFixed(2);}
function addRow(d={}){const i=rows.children.length+1;const tr=document.createElement('tr');tr.innerHTML=\`<td>\${i}</td><td><input value="\${d.eq||''}"></td><td><input></td><td><input></td><td><input type="number" step="0.25" class="start"></td><td><input type="number" step="0.25" class="end"></td><td><input type="number" step="0.25" class="break"></td><td class="total">0.00</td>\`;tr.querySelectorAll('.start,.end,.break').forEach(el=>el.oninput=()=>calc(tr));rows.appendChild(tr);}
addRow({eq:'20T Crawler Excavator (example)'});for(let i=0;i<4;i++)addRow();
document.getElementById('tsDate').value=new Date().toISOString().slice(0,10);
</script>`,
    ),

  inspection: (doc) =>
    shell(
      "Inspection Report — editable",
      `<a class="btn secondary" href="./${doc.docx}" download>Download Word</a>`,
      `<div class="title">EQUIPMENT INSPECTION REPORT</div>
      ${companyFields([
        ["reportNo", "Report No.", "text", "PIR-2026-001"],
        ["reportDate", "Date", "date"],
        ["equipment", "Equipment"],
        ["assetNo", "Asset / Reg. No."],
        ["client", "Client / Site"],
        ["inspType", "Inspection Type", "text", "Pre-rental / Post-rental / Periodic"],
        ["inspector", "Inspector"],
        ["meter", "Hour / ODO Meter"],
      ])}
      <table><thead><tr><th>#</th><th>Item</th><th>Pass</th><th>Fail</th><th>N/A</th><th>Remarks</th></tr></thead><tbody id="rows"></tbody></table>
      <section class="terms"><h3>Overall Result &amp; Actions</h3>
      <div class="grid"><div><label for="result">Overall Result</label><input id="result" placeholder="Pass / Fail / Conditional" /></div><div><label for="action">Action Required</label><input id="action" /></div></div>
      <textarea id="notes" style="margin-top:10px">Additional notes / damage report</textarea></section>
      <section class="signatures"><div><strong>Inspected by (Peakfront)</strong><div class="box"></div></div><div><strong>Acknowledged by (Client)</strong><div class="supplier-box"></div></div></section>`,
      `<script>
const items=["General appearance & cleanliness","Engine / power train","Hydraulic system & hoses","Tracks / tyres / undercarriage","Lights, horn & alarms","Safety devices & fire extinguisher","Cab / ROPS / FOPS","Attachments, pins & couplers","Fluid levels","Controls & instruments","Hour / ODO meter reading","Overall operational condition"];
const rows=document.getElementById('rows');
items.forEach((item,i)=>{const tr=document.createElement('tr');tr.innerHTML=\`<td>\${i+1}</td><td>\${item}</td><td>☐</td><td>☐</td><td>☐</td><td><input></td>\`;rows.appendChild(tr);});
document.getElementById('reportDate').value=new Date().toISOString().slice(0,10);
</script>`,
    ),

  invoice: (doc) =>
    shell(
      "Invoice — editable",
      `<button type="button" class="secondary" onclick="recalc()">Recalculate</button><a class="btn secondary" href="./${doc.docx}" download>Download Word</a><a class="btn secondary" href="./${doc.xlsx}" download>Download Excel</a>`,
      `<div class="title">TAX INVOICE</div>
      ${companyFields([
        ["invNo", "Invoice No.", "text", "PINV-2026-001"],
        ["invDate", "Date", "date"],
        ["billTo", "Bill To"],
        ["contact", "Contact Person"],
        ["clientTrn", "Client TRN"],
        ["dueDate", "Due Date", "date"],
        ["project", "Project / Site"],
        ["ref", "Quote / Agreement Ref."],
      ])}
      <table><thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Days</th><th>Amount</th></tr></thead><tbody id="rows"></tbody></table>
      <div style="margin-left:auto;width:280px;font-size:10pt"><div style="display:flex;justify-content:space-between;padding:6px 0"><span>Subtotal</span><span id="subtotal">0.00</span></div><div style="display:flex;justify-content:space-between;padding:6px 0"><span>VAT (5%)</span><span id="vat">0.00</span></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid var(--amber);font-weight:700"><span>Grand Total (AED)</span><span id="total">0.00</span></div></div>
      <section class="terms"><h3>Payment Details</h3><textarea id="payment">Bank: [Enter bank name]\\nAccount: [Enter account number]\\nIBAN: [Enter IBAN]\\nPlease quote invoice number on remittance.</textarea></section>`,
      `<script>
const rows=document.getElementById('rows');
function fmt(n){return Number(n||0).toLocaleString('en-AE',{minimumFractionDigits:2,maximumFractionDigits:2});}
function addRow(d={}){const i=rows.children.length+1;const tr=document.createElement('tr');tr.innerHTML=\`<td>\${i}</td><td><input value="\${d.desc||''}"></td><td><input type="number" min="0" class="qty" value="\${d.qty??''}"></td><td><input value="\${d.unit||''}"></td><td><input type="number" min="0" step="0.01" class="rate" value="\${d.rate??''}"></td><td><input type="number" min="0" class="days" value="\${d.days??1}"></td><td class="amt">0.00</td>\`;tr.querySelectorAll('input').forEach(el=>el.oninput=recalc);rows.appendChild(tr);recalc();}
function recalc(){let s=0;[...rows.children].forEach(r=>{const q=parseFloat(r.querySelector('.qty').value)||0;const rate=parseFloat(r.querySelector('.rate').value)||0;const days=parseFloat(r.querySelector('.days').value)||1;const a=q*rate*days;r.querySelector('.amt').textContent=fmt(a);s+=a;});document.getElementById('subtotal').textContent=fmt(s);document.getElementById('vat').textContent=fmt(s*0.05);document.getElementById('total').textContent=fmt(s*1.05);}
addRow({desc:'20T Crawler Excavator — rental (example)',qty:1,unit:'Unit',rate:950,days:1});for(let i=0;i<4;i++)addRow();
const d=new Date();document.getElementById('invDate').value=d.toISOString().slice(0,10);const due=new Date(d);due.setDate(due.getDate()+30);document.getElementById('dueDate').value=due.toISOString().slice(0,10);
</script>`,
    ),
};

export function writeDocHtmlPages(docsDir, docTypes) {
  for (const doc of docTypes) {
    if (!PAGES[doc.id]) continue;
    writeFileSync(join(docsDir, doc.id, "index.html"), PAGES[doc.id](doc));
  }

  for (const id of ["quotation", "rfq"]) {
    const indexPath = join(docsDir, id, "index.html");
    try {
      let html = readFileSync(indexPath, "utf8");
      if (!html.includes('href="../"')) {
        html = html.replace(
          `<button type="button" onclick="window.print()">Print / Save PDF</button>`,
          `<button type="button" onclick="window.print()">Print / Save PDF</button>\n    <a class="btn secondary back" href="../">← All documents</a>`,
        );
        writeFileSync(indexPath, html);
      }
    } catch {
      // index may not exist yet before move
    }
  }
}
