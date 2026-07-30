import ExcelJS from "exceljs";
import { COMPANY } from "./shared.mjs";

const NAVY = "FF0B2545";
const AMBER = "FFF39C12";
const LIGHT = "FFF8FAFC";
const SUPPLIER_FILL = "FFFFFBEB";
const BORDER = "FFE2E8F0";

function styleHeader(cell, options = {}) {
  cell.font = { bold: true, color: { argb: options.color ?? "FFFFFFFF" }, size: options.size ?? 11 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: options.fill ?? NAVY } };
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

function styleSupplierCell(cell) {
  styleInput(cell);
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SUPPLIER_FILL } };
}

function addCompanyHeader(sheet, title, subtitle) {
  sheet.mergeCells("A1:G1");
  sheet.getCell("A1").value = COMPANY.name;
  styleHeader(sheet.getCell("A1"), { size: 16, align: "center" });
  sheet.mergeCells("A2:G2");
  sheet.getCell("A2").value = COMPANY.tagline;
  sheet.getCell("A2").font = { bold: true, color: { argb: AMBER }, size: 10 };
  sheet.getCell("A2").alignment = { horizontal: "center" };
  sheet.mergeCells("A3:G3");
  sheet.getCell("A3").value = `${COMPANY.address} · ${COMPANY.phone} · ${COMPANY.email} · ${COMPANY.website}`;
  sheet.getCell("A3").font = { size: 9, color: { argb: "FF475569" } };
  sheet.getCell("A3").alignment = { horizontal: "center", wrapText: true };
  sheet.mergeCells("A5:G5");
  sheet.getCell("A5").value = title;
  styleHeader(sheet.getCell("A5"), { size: 13, align: "center", fill: AMBER, color: "FF0B2545" });
  if (subtitle) {
    sheet.mergeCells("A6:G6");
    sheet.getCell("A6").value = subtitle;
    sheet.getCell("A6").font = { size: 9, italic: true, color: { argb: "FF64748B" } };
    sheet.getCell("A6").alignment = { horizontal: "center" };
  }
}

function addMetaRows(sheet, startRow, meta) {
  let row = startRow;
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
  return row;
}

function addTotals(sheet, subtotalRow, vatRow, totalRow, amountCol = "G") {
  sheet.mergeCells(`E${subtotalRow}:F${subtotalRow}`);
  sheet.getCell(`E${subtotalRow}`).value = "Subtotal";
  styleLabel(sheet.getCell(`E${subtotalRow}`));
  sheet.getCell(`${amountCol}${subtotalRow}`).numFmt = "#,##0.00";
  styleInput(sheet.getCell(`${amountCol}${subtotalRow}`));

  sheet.mergeCells(`E${vatRow}:F${vatRow}`);
  sheet.getCell(`E${vatRow}`).value = "VAT (5%)";
  styleLabel(sheet.getCell(`E${vatRow}`));
  sheet.getCell(`${amountCol}${vatRow}`).value = { formula: `${amountCol}${subtotalRow}*0.05` };
  sheet.getCell(`${amountCol}${vatRow}`).numFmt = "#,##0.00";
  styleInput(sheet.getCell(`${amountCol}${vatRow}`));

  sheet.mergeCells(`E${totalRow}:F${totalRow}`);
  sheet.getCell(`E${totalRow}`).value = "Grand Total (AED)";
  styleHeader(sheet.getCell(`E${totalRow}`), { fill: AMBER, color: "FF0B2545", align: "right" });
  sheet.getCell(`${amountCol}${totalRow}`).value = { formula: `${amountCol}${subtotalRow}+${amountCol}${vatRow}` };
  sheet.getCell(`${amountCol}${totalRow}`).numFmt = "#,##0.00";
  sheet.getCell(`${amountCol}${totalRow}`).font = { bold: true, size: 12, color: { argb: NAVY } };
  styleInput(sheet.getCell(`${amountCol}${totalRow}`));
}

export async function buildQuotationWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = COMPANY.name;
  const sheet = wb.addWorksheet("Quotation", { views: [{ showGridLines: false }] });
  sheet.columns = [{ width: 5 }, { width: 34 }, { width: 8 }, { width: 10 }, { width: 12 }, { width: 10 }, { width: 14 }];
  addCompanyHeader(sheet, "QUOTATION");
  addMetaRows(sheet, 7, [
    ["Quote No.", "PFQ-2026-001", "Date", ""],
    ["Client / Company", "", "Contact Person", ""],
    ["Project / Site", "", "Location", ""],
    ["Rental Period", "", "Valid Until", ""],
  ]);
  sheet.getCell("F7").value = { formula: "TODAY()" };
  sheet.getCell("F7").numFmt = "dd mmm yyyy";
  const headers = ["#", "Description", "Qty", "Unit", "Rate (AED)", "Days", "Amount (AED)"];
  const lineStart = 18;
  const lineCount = 10;
  headers.forEach((h, i) => {
    styleHeader(sheet.getCell(17, i + 1), { align: i >= 2 ? "center" : "left", size: 10 });
    sheet.getCell(17, i + 1).value = h;
  });
  for (let i = 0; i < lineCount; i++) {
    const r = lineStart + i;
    sheet.getCell(`A${r}`).value = i + 1;
    ["B", "C", "D", "E", "F", "G"].forEach((c) => styleInput(sheet.getCell(`${c}${r}`)));
    sheet.getCell(`G${r}`).value = { formula: `IF(OR(C${r}="",E${r}=""),"",C${r}*E${r}*IF(F${r}="",1,F${r}))` };
    sheet.getCell(`G${r}`).numFmt = "#,##0.00";
    if (i === 0) {
      sheet.getCell(`B${r}`).value = "20T Crawler Excavator (example)";
      sheet.getCell(`C${r}`).value = 1;
      sheet.getCell(`D${r}`).value = "Unit";
      sheet.getCell(`E${r}`).value = 950;
      sheet.getCell(`F${r}`).value = 1;
    }
  }
  const sub = lineStart + lineCount + 1;
  sheet.getCell(`G${sub}`).value = { formula: `SUM(G${lineStart}:G${lineStart + lineCount - 1})` };
  addTotals(sheet, sub, sub + 1, sub + 2);
  return wb;
}

export async function buildRfqWorkbook() {
  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet("RFQ", { views: [{ showGridLines: false }] });
  sheet.columns = [{ width: 4 }, { width: 28 }, { width: 7 }, { width: 9 }, { width: 24 }, { width: 12 }, { width: 12 }];
  addCompanyHeader(sheet, "REQUEST FOR QUOTATION", "Please provide your best quotation for the items below");
  addMetaRows(sheet, 8, [
    ["RFQ No.", "PFRQ-2026-001", "Date", ""],
    ["Supplier / Vendor", "", "Contact Person", ""],
    ["Email", "", "Phone", ""],
    ["Project / Reference", "", "Delivery / Site Location", ""],
    ["Required By", "", "Duration / Period", ""],
  ]);
  sheet.getCell("F8").value = { formula: "TODAY()" };
  const lineStart = 20;
  const lineCount = 8;
  ["#", "Description", "Qty", "Unit", "Specifications / Notes", "Unit Price (AED)", "Lead Time"].forEach((h, i) => {
    sheet.getCell(19, i + 1).value = h;
    styleHeader(sheet.getCell(19, i + 1), { size: 9, align: i === 0 || i >= 2 ? "center" : "left" });
  });
  for (let i = 0; i < lineCount; i++) {
    const r = lineStart + i;
    sheet.getCell(`A${r}`).value = i + 1;
    ["B", "C", "D", "E"].forEach((c) => styleInput(sheet.getCell(`${c}${r}`)));
    ["F", "G"].forEach((c) => styleSupplierCell(sheet.getCell(`${c}${r}`)));
    if (i === 0) {
      sheet.getCell(`B${r}`).value = "20T Crawler Excavator (example)";
      sheet.getCell(`C${r}`).value = 1;
      sheet.getCell(`D${r}`).value = "Unit";
      sheet.getCell(`E${r}`).value = "With operator, minimum 10 hr/day";
    }
  }
  const sub = lineStart + lineCount + 1;
  sheet.getCell(`G${sub}`).value = { formula: `SUMPRODUCT(C${lineStart}:C${lineStart + lineCount - 1},F${lineStart}:F${lineStart + lineCount - 1})` };
  addTotals(sheet, sub, sub + 1, sub + 2);
  return wb;
}

export async function buildPurchaseOrderWorkbook() {
  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet("Purchase Order", { views: [{ showGridLines: false }] });
  sheet.columns = [{ width: 4 }, { width: 32 }, { width: 8 }, { width: 10 }, { width: 12 }, { width: 14 }];
  addCompanyHeader(sheet, "PURCHASE ORDER");
  addMetaRows(sheet, 7, [
    ["PO No.", "PPO-2026-001", "Date", ""],
    ["Supplier / Vendor", "", "Contact Person", ""],
    ["Email", "", "Phone", ""],
    ["RFQ / Quote Ref.", "", "Required By", ""],
    ["Ship To / Delivery", "", "Project / Site", ""],
  ]);
  sheet.getCell("F7").value = { formula: "TODAY()" };
  const lineStart = 18;
  const lineCount = 8;
  ["#", "Description", "Qty", "Unit", "Unit Price (AED)", "Amount (AED)"].forEach((h, i) => {
    sheet.getCell(17, i + 1).value = h;
    styleHeader(sheet.getCell(17, i + 1), { size: 10, align: i >= 2 ? "center" : "left" });
  });
  for (let i = 0; i < lineCount; i++) {
    const r = lineStart + i;
    sheet.getCell(`A${r}`).value = i + 1;
    ["B", "C", "D", "E"].forEach((c) => styleInput(sheet.getCell(`${c}${r}`)));
    styleInput(sheet.getCell(`F${r}`));
    sheet.getCell(`F${r}`).value = { formula: `IF(OR(C${r}="",E${r}=""),"",C${r}*E${r})` };
    sheet.getCell(`F${r}`).numFmt = "#,##0.00";
  }
  const sub = lineStart + lineCount + 1;
  sheet.getCell(`F${sub}`).value = { formula: `SUM(F${lineStart}:F${lineStart + lineCount - 1})` };
  addTotals(sheet, sub, sub + 1, sub + 2, "F");
  return wb;
}

export async function buildInvoiceWorkbook() {
  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet("Invoice", { views: [{ showGridLines: false }] });
  sheet.columns = [{ width: 4 }, { width: 32 }, { width: 8 }, { width: 10 }, { width: 12 }, { width: 8 }, { width: 14 }];
  addCompanyHeader(sheet, "TAX INVOICE");
  addMetaRows(sheet, 7, [
    ["Invoice No.", "PINV-2026-001", "Date", ""],
    ["Bill To", "", "Contact Person", ""],
    ["Client TRN", "", "Due Date", ""],
    ["Project / Site", "", "Quote / Agreement Ref.", ""],
    ["Lessor TRN", COMPANY.trn, "Payment Terms", ""],
  ]);
  sheet.getCell("F7").value = { formula: "TODAY()" };
  const lineStart = 18;
  const lineCount = 8;
  ["#", "Description", "Qty", "Unit", "Rate (AED)", "Days", "Amount (AED)"].forEach((h, i) => {
    sheet.getCell(17, i + 1).value = h;
    styleHeader(sheet.getCell(17, i + 1), { size: 10, align: i >= 2 ? "center" : "left" });
  });
  for (let i = 0; i < lineCount; i++) {
    const r = lineStart + i;
    sheet.getCell(`A${r}`).value = i + 1;
    ["B", "C", "D", "E", "F", "G"].forEach((c) => styleInput(sheet.getCell(`${c}${r}`)));
    sheet.getCell(`G${r}`).value = { formula: `IF(OR(C${r}="",E${r}=""),"",C${r}*E${r}*IF(F${r}="",1,F${r}))` };
    sheet.getCell(`G${r}`).numFmt = "#,##0.00";
    if (i === 0) {
      sheet.getCell(`B${r}`).value = "20T Crawler Excavator — rental (example)";
      sheet.getCell(`C${r}`).value = 1;
      sheet.getCell(`D${r}`).value = "Unit";
      sheet.getCell(`E${r}`).value = 950;
      sheet.getCell(`F${r}`).value = 1;
    }
  }
  const sub = lineStart + lineCount + 1;
  sheet.getCell(`G${sub}`).value = { formula: `SUM(G${lineStart}:G${lineStart + lineCount - 1})` };
  addTotals(sheet, sub, sub + 1, sub + 2);
  return wb;
}

export async function buildTimesheetWorkbook() {
  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet("Timesheet", { views: [{ showGridLines: false }] });
  sheet.columns = [{ width: 4 }, { width: 24 }, { width: 12 }, { width: 14 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }];
  addCompanyHeader(sheet, "DAILY EQUIPMENT TIME SHEET");
  addMetaRows(sheet, 7, [
    ["Timesheet No.", "PTS-2026-001", "Date", ""],
    ["Client / Company", "", "Project / Site", ""],
    ["Site Location", "", "Agreement / Quote Ref.", ""],
  ]);
  sheet.getCell("F7").value = { formula: "TODAY()" };
  const lineStart = 16;
  const lineCount = 8;
  ["#", "Equipment", "Asset / Reg. No.", "Operator", "Start", "End", "Break (hrs)", "Total Hrs"].forEach((h, i) => {
    sheet.getCell(15, i + 1).value = h;
    styleHeader(sheet.getCell(15, i + 1), { size: 9, align: "center" });
  });
  for (let i = 0; i < lineCount; i++) {
    const r = lineStart + i;
    sheet.getCell(`A${r}`).value = i + 1;
    ["B", "C", "D", "E", "F", "G"].forEach((c) => styleInput(sheet.getCell(`${c}${r}`)));
    styleInput(sheet.getCell(`H${r}`));
    sheet.getCell(`H${r}`).value = { formula: `IF(OR(E${r}="",F${r}=""),"",MAX(0,F${r}-E${r}-IF(G${r}="",0,G${r})))` };
    sheet.getCell(`H${r}`).numFmt = "0.00";
    if (i === 0) sheet.getCell(`B${r}`).value = "20T Crawler Excavator (example)";
  }
  return wb;
}
