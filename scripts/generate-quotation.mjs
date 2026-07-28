import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";
import { buildQuotationDocx } from "./quotation-docx.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const outDir = join(publicDir, "quotation");

const COMPANY = {
  name: "Peakfront Equipment Rental LLC SPC",
  tagline: "Heavy Equipment & Transport Rental",
  address: "Mussafah 17, Abu Dhabi, United Arab Emirates",
  phone: "+971 527459432",
  email: "info@peakfront.ae",
  website: "www.peakfront.ae",
  preparedBy: "Irfan Dayan",
  title: "Managing Director",
};

const NAVY = "FF0B2545";
const AMBER = "FFF39C12";
const LIGHT = "FFF8FAFC";
const BORDER = "FFE2E8F0";

const LINE_START = 20;
const LINE_COUNT = 12;
const LINE_END = LINE_START + LINE_COUNT - 1;
const SUBTOTAL_ROW = LINE_END + 2;
const VAT_ROW = SUBTOTAL_ROW + 1;
const TOTAL_ROW = VAT_ROW + 1;

function styleHeader(cell, options = {}) {
  cell.font = { bold: true, color: { argb: options.color ?? "FFFFFFFF" }, size: options.size ?? 11 };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: options.fill ?? NAVY },
  };
  cell.alignment = { vertical: "middle", horizontal: options.align ?? "left", wrapText: true };
}

function styleLabel(cell) {
  cell.font = { bold: true, color: { argb: NAVY }, size: 10 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT } };
}

function styleInput(cell) {
  cell.border = {
    top: { style: "thin", color: { argb: BORDER } },
    left: { style: "thin", color: { argb: BORDER } },
    bottom: { style: "thin", color: { argb: BORDER } },
    right: { style: "thin", color: { argb: BORDER } },
  };
  cell.alignment = { vertical: "middle", wrapText: true };
}

async function buildWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = COMPANY.name;
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Quotation", {
    views: [{ showGridLines: false }],
    pageSetup: {
      paperSize: 9,
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    },
  });

  sheet.columns = [
    { width: 5 },
    { width: 34 },
    { width: 8 },
    { width: 10 },
    { width: 12 },
    { width: 10 },
    { width: 14 },
  ];

  sheet.mergeCells("A1:G1");
  sheet.getCell("A1").value = COMPANY.name;
  styleHeader(sheet.getCell("A1"), { size: 16, align: "center" });
  sheet.getRow(1).height = 28;

  sheet.mergeCells("A2:G2");
  sheet.getCell("A2").value = COMPANY.tagline;
  sheet.getCell("A2").font = { bold: true, color: { argb: AMBER }, size: 10 };
  sheet.getCell("A2").alignment = { horizontal: "center" };
  sheet.getRow(2).height = 18;

  sheet.mergeCells("A3:G3");
  sheet.getCell("A3").value =
    `${COMPANY.address} · ${COMPANY.phone} · ${COMPANY.email} · ${COMPANY.website}`;
  sheet.getCell("A3").font = { size: 9, color: { argb: "FF475569" } };
  sheet.getCell("A3").alignment = { horizontal: "center", wrapText: true };
  sheet.getRow(3).height = 24;

  sheet.mergeCells("A5:G5");
  sheet.getCell("A5").value = "QUOTATION";
  styleHeader(sheet.getCell("A5"), { size: 13, align: "center", fill: AMBER, color: "FF0B2545" });
  sheet.getRow(5).height = 24;

  const meta = [
    ["Quote No.", "PFQ-2026-001", "Date", ""],
    ["Client / Company", "", "Contact Person", ""],
    ["Project / Site", "", "Location", ""],
    ["Rental Period", "", "Valid Until", ""],
  ];

  let row = 7;
  for (const [label1, value1, label2, value2] of meta) {
    sheet.getCell(`A${row}`).value = label1;
    styleLabel(sheet.getCell(`A${row}`));
    sheet.mergeCells(`B${row}:C${row}`);
    sheet.getCell(`B${row}`).value = value1;
    styleInput(sheet.getCell(`B${row}`));

    sheet.getCell(`E${row}`).value = label2;
    styleLabel(sheet.getCell(`E${row}`));
    sheet.mergeCells(`F${row}:G${row}`);
    sheet.getCell(`F${row}`).value = value2;
    styleInput(sheet.getCell(`F${row}`));
    sheet.getRow(row).height = 22;
    row += 1;
  }

  sheet.getCell(`F7`).value = { formula: "TODAY()", result: new Date() };
  sheet.getCell(`F7`).numFmt = "dd mmm yyyy";

  const headers = ["#", "Description", "Qty", "Unit", "Rate (AED)", "Days", "Amount (AED)"];
  headers.forEach((header, index) => {
    const cell = sheet.getCell(18, index + 1);
    cell.value = header;
    styleHeader(cell, { align: index >= 2 ? "center" : "left", size: 10 });
  });
  sheet.getRow(18).height = 22;

  for (let line = 0; line < LINE_COUNT; line += 1) {
    const r = LINE_START + line;
    sheet.getCell(`A${r}`).value = line + 1;
    sheet.getCell(`A${r}`).alignment = { horizontal: "center", vertical: "middle" };
    sheet.getCell(`A${r}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT } };

    ["B", "C", "D", "E", "F"].forEach((col) => styleInput(sheet.getCell(`${col}${r}`)));

    sheet.getCell(`C${r}`).alignment = { horizontal: "center", vertical: "middle" };
    sheet.getCell(`E${r}`).numFmt = "#,##0.00";
    sheet.getCell(`F${r}`).alignment = { horizontal: "center", vertical: "middle" };
    sheet.getCell(`G${r}`).value = { formula: `IF(OR(C${r}="",E${r}=""),"",C${r}*E${r}*IF(F${r}="",1,F${r}))` };
    sheet.getCell(`G${r}`).numFmt = "#,##0.00";
    styleInput(sheet.getCell(`G${r}`));

    if (line === 0) {
      sheet.getCell(`B${r}`).value = "20T Crawler Excavator (example — edit or delete)";
      sheet.getCell(`C${r}`).value = 1;
      sheet.getCell(`D${r}`).value = "Unit";
      sheet.getCell(`E${r}`).value = 950;
      sheet.getCell(`F${r}`).value = 1;
    }
    if (line === 1) {
      sheet.getCell(`B${r}`).value = "Low Bed Trailer (example — edit or delete)";
      sheet.getCell(`C${r}`).value = 1;
      sheet.getCell(`D${r}`).value = "Trip";
      sheet.getCell(`E${r}`).value = 1200;
      sheet.getCell(`F${r}`).value = 1;
    }

    sheet.getRow(r).height = 22;
  }

  sheet.mergeCells(`E${SUBTOTAL_ROW}:F${SUBTOTAL_ROW}`);
  sheet.getCell(`E${SUBTOTAL_ROW}`).value = "Subtotal";
  styleLabel(sheet.getCell(`E${SUBTOTAL_ROW}`));
  sheet.getCell(`G${SUBTOTAL_ROW}`).value = { formula: `SUM(G${LINE_START}:G${LINE_END})` };
  sheet.getCell(`G${SUBTOTAL_ROW}`).numFmt = "#,##0.00";
  styleInput(sheet.getCell(`G${SUBTOTAL_ROW}`));

  sheet.mergeCells(`E${VAT_ROW}:F${VAT_ROW}`);
  sheet.getCell(`E${VAT_ROW}`).value = "VAT (5%)";
  styleLabel(sheet.getCell(`E${VAT_ROW}`));
  sheet.getCell(`G${VAT_ROW}`).value = { formula: `G${SUBTOTAL_ROW}*0.05` };
  sheet.getCell(`G${VAT_ROW}`).numFmt = "#,##0.00";
  styleInput(sheet.getCell(`G${VAT_ROW}`));

  sheet.mergeCells(`E${TOTAL_ROW}:F${TOTAL_ROW}`);
  sheet.getCell(`E${TOTAL_ROW}`).value = "Grand Total (AED)";
  styleHeader(sheet.getCell(`E${TOTAL_ROW}`), { fill: AMBER, color: "FF0B2545", align: "right" });
  sheet.getCell(`G${TOTAL_ROW}`).value = { formula: `G${SUBTOTAL_ROW}+G${VAT_ROW}` };
  sheet.getCell(`G${TOTAL_ROW}`).numFmt = "#,##0.00";
  sheet.getCell(`G${TOTAL_ROW}`).font = { bold: true, size: 12, color: { argb: NAVY } };
  styleInput(sheet.getCell(`G${TOTAL_ROW}`));

  const termsRow = TOTAL_ROW + 2;
  sheet.mergeCells(`A${termsRow}:G${termsRow}`);
  sheet.getCell(`A${termsRow}`).value = "Terms & Conditions";
  styleHeader(sheet.getCell(`A${termsRow}`), { size: 10 });

  const terms = [
    "Rates are in AED and exclude fuel, operator and mobilisation unless stated.",
    "Delivery, permits and offloading quoted separately where applicable.",
    "Equipment supplied subject to availability and standard rental agreement.",
    "Payment terms: as agreed. Quote valid for 7 days from date above.",
  ];

  terms.forEach((text, index) => {
    const r = termsRow + 1 + index;
    sheet.mergeCells(`A${r}:G${r}`);
    sheet.getCell(`A${r}`).value = `• ${text}`;
    sheet.getCell(`A${r}`).font = { size: 9, color: { argb: "FF334155" } };
    sheet.getCell(`A${r}`).alignment = { wrapText: true };
    sheet.getRow(r).height = 18;
  });

  const signRow = termsRow + 6;
  sheet.mergeCells(`A${signRow}:C${signRow}`);
  sheet.getCell(`A${signRow}`).value = "Prepared by:";
  sheet.getCell(`A${signRow}`).font = { bold: true, size: 10, color: { argb: NAVY } };
  sheet.mergeCells(`A${signRow + 1}:C${signRow + 2}`);
  sheet.getCell(`A${signRow + 1}`).value = `${COMPANY.preparedBy}\n${COMPANY.title}\n${COMPANY.name}`;
  sheet.getCell(`A${signRow + 1}`).alignment = { wrapText: true, vertical: "top" };
  sheet.getCell(`A${signRow + 1}`).font = { size: 10 };

  sheet.mergeCells(`E${signRow}:G${signRow}`);
  sheet.getCell(`E${signRow}`).value = "Accepted by (Client):";
  sheet.getCell(`E${signRow}`).font = { bold: true, size: 10, color: { argb: NAVY } };
  sheet.mergeCells(`E${signRow + 1}:G${signRow + 2}`);
  styleInput(sheet.getCell(`E${signRow + 1}`));

  return workbook;
}

async function main() {
  mkdirSync(outDir, { recursive: true });

  const docxPath = join(outDir, "Peakfront-Quotation-Template.docx");
  await buildQuotationDocx(publicDir, docxPath);
  console.log(`Generated ${docxPath}`);

  const workbook = await buildWorkbook();
  const xlsxPath = join(outDir, "Peakfront-Quotation-Template.xlsx");
  await workbook.xlsx.writeFile(xlsxPath);
  console.log(`Generated ${xlsxPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
