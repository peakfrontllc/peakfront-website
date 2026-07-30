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

export async function buildQuotationDocx(publicDir, outPath) {
  const samples = [
    ["1", "20T Crawler Excavator", "1", "Unit", "950", "1", "950.00"],
    ["2", "Low Bed Trailer", "1", "Trip", "1,200", "1", "1,200.00"],
  ];

  await writeDocx(publicDir, outPath, "Peakfront Quotation", "Editable quotation template", [
    ...companyHeader(publicDir),
    ...titleBlock("QUOTATION"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("Quote No.", "PFQ-2026-001"), labelCell("Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Client / Company", "[Enter client name]"), labelCell("Contact Person", "[Enter contact name]")] }),
        new TableRow({ children: [labelCell("Project / Site", "[Enter project]"), labelCell("Location", "[Enter location]")] }),
        new TableRow({ children: [labelCell("Rental Period", "[Enter period]"), labelCell("Valid Until", "[Enter validity date]")] }),
      ],
    }),
    spacer(),
    buildLineTable(
      [
        { label: "#", align: AlignmentType.CENTER },
        { label: "Description" },
        { label: "Qty", align: AlignmentType.CENTER },
        { label: "Unit", align: AlignmentType.CENTER },
        { label: "Rate (AED)", align: AlignmentType.RIGHT },
        { label: "Days", align: AlignmentType.CENTER },
        { label: "Amount (AED)", align: AlignmentType.RIGHT },
      ],
      (i) => {
        const s = samples[i];
        const c = s ?? [String(i + 1), "", "", "", "", "", ""];
        return new TableRow({
          children: [
            bodyCell(c[0], AlignmentType.CENTER),
            bodyCell(c[1]),
            bodyCell(c[2], AlignmentType.CENTER),
            bodyCell(c[3], AlignmentType.CENTER),
            bodyCell(c[4], AlignmentType.RIGHT),
            bodyCell(c[5], AlignmentType.CENTER),
            bodyCell(c[6], AlignmentType.RIGHT),
          ],
        });
      },
    ),
    spacer(100),
    totalsTable(),
    spacer(140),
    ...termsBlock("Terms & Conditions", [
      "Rates are in AED and exclude fuel, operator and mobilisation unless stated.",
      "Delivery, permits and offloading quoted separately where applicable.",
      "Equipment supplied subject to availability and standard rental agreement.",
      "Payment terms: as agreed. Quote valid for 7 days from date above.",
    ]),
    spacer(160),
    signatureBlock("Prepared by:", "Accepted by (Client):"),
  ]);
}
