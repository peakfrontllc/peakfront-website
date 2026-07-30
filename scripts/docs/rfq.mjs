import { AlignmentType, Table, TableRow, WidthType } from "docx";
import {
  bodyCell,
  buildLineTable,
  companyHeader,
  labelCell,
  signatureBlock,
  spacer,
  termsBlock,
  titleBlock,
  totalsTable,
  writeDocx,
} from "./shared.mjs";

export async function buildRfqDocx(publicDir, outPath) {
  const samples = [
    ["1", "20T Crawler Excavator", "1", "Unit", "With operator, minimum 10 hr/day"],
    ["2", "Low Bed Trailer (40T)", "1", "Trip", "Abu Dhabi to site — include loading"],
  ];

  await writeDocx(publicDir, outPath, "Peakfront RFQ", "Request for quotation template", [
    ...companyHeader(publicDir),
    ...titleBlock("REQUEST FOR QUOTATION", "Please provide your best quotation for the items below"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("RFQ No.", "PFRQ-2026-001"), labelCell("Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Supplier / Vendor", "[Enter supplier name]"), labelCell("Contact Person", "[Enter contact name]")] }),
        new TableRow({ children: [labelCell("Email", "[Enter email]"), labelCell("Phone", "[Enter phone]")] }),
        new TableRow({ children: [labelCell("Project / Reference", "[Enter project]"), labelCell("Delivery / Site Location", "[Enter location]")] }),
        new TableRow({ children: [labelCell("Required By", "[Enter date]"), labelCell("Duration / Period", "[Enter period]")] }),
      ],
    }),
    spacer(),
    buildLineTable(
      [
        { label: "#", align: AlignmentType.CENTER },
        { label: "Description" },
        { label: "Qty", align: AlignmentType.CENTER },
        { label: "Unit", align: AlignmentType.CENTER },
        { label: "Specifications / Notes" },
        { label: "Unit Price (AED)", align: AlignmentType.RIGHT },
        { label: "Lead Time", align: AlignmentType.CENTER },
      ],
      (i) => {
        const s = samples[i];
        const c = s ?? [String(i + 1), "", "", "", ""];
        return new TableRow({
          children: [
            bodyCell(c[0], AlignmentType.CENTER),
            bodyCell(c[1]),
            bodyCell(c[2], AlignmentType.CENTER),
            bodyCell(c[3], AlignmentType.CENTER),
            bodyCell(c[4]),
            bodyCell("", AlignmentType.RIGHT, { shading: { fill: "FFFBEB" } }),
            bodyCell("", AlignmentType.CENTER, { shading: { fill: "FFFBEB" } }),
          ],
        });
      },
      8,
    ),
    spacer(100),
    totalsTable(["Subtotal (AED)", "VAT (5%)", "Grand Total (AED)"]),
    spacer(140),
    ...termsBlock("Instructions to Supplier", [
      "Quote all prices in AED. State whether VAT is included or excluded.",
      "Include mobilisation, delivery and offloading charges separately where applicable.",
      "Confirm equipment availability, condition and any operator/fuel inclusions.",
      "State quote validity period and payment terms offered.",
    ]),
    spacer(160),
    signatureBlock("Requested by:", "Quoted by (Supplier):", "Signature, stamp & date"),
  ]);
}
