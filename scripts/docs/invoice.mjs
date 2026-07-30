import { AlignmentType, Table, TableRow, WidthType } from "docx";
import {
  bodyCell,
  buildLineTable,
  COMPANY,
  companyHeader,
  labelCell,
  paragraph,
  spacer,
  termsBlock,
  text,
  titleBlock,
  totalsTable,
  writeDocx,
} from "./shared.mjs";

export async function buildInvoiceDocx(publicDir, outPath) {
  await writeDocx(publicDir, outPath, "Peakfront Invoice", "Tax invoice template", [
    ...companyHeader(publicDir),
    ...titleBlock("TAX INVOICE"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("Invoice No.", "PINV-2026-001"), labelCell("Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Bill To", "[Enter client name]"), labelCell("Contact Person", "[Enter contact name]")] }),
        new TableRow({ children: [labelCell("Client TRN", "[Enter TRN]"), labelCell("Due Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Project / Site", "[Enter project]"), labelCell("Quote / Agreement Ref.", "[Enter reference]")] }),
        new TableRow({ children: [labelCell("Lessor TRN", COMPANY.trn), labelCell("Payment Terms", "[Enter terms]")] }),
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
      (i) =>
        new TableRow({
          children: [
            bodyCell(String(i + 1), AlignmentType.CENTER),
            bodyCell(i === 0 ? "20T Crawler Excavator — rental (example)" : ""),
            bodyCell(i === 0 ? "1" : "", AlignmentType.CENTER),
            bodyCell(i === 0 ? "Unit" : "", AlignmentType.CENTER),
            bodyCell(i === 0 ? "950" : "", AlignmentType.RIGHT),
            bodyCell(i === 0 ? "1" : "", AlignmentType.CENTER),
            bodyCell(i === 0 ? "950.00" : "", AlignmentType.RIGHT),
          ],
        }),
      8,
    ),
    spacer(100),
    totalsTable(),
    spacer(140),
    paragraph(text("Payment Details", { bold: true, size: 20, color: "0B2545" }), { spacing: { after: 60 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            labelCell("Bank", COMPANY.bankName),
            labelCell("Account Name", COMPANY.name),
          ],
        }),
        new TableRow({
          children: [
            labelCell("Account No.", COMPANY.bankAccount),
            labelCell("IBAN", COMPANY.iban),
          ],
        }),
      ],
    }),
    spacer(),
    ...termsBlock("Notes", [
      "All amounts in AED. VAT charged at 5% where applicable.",
      "Please quote invoice number on all remittances.",
      "Equipment rental subject to signed agreement and timesheets.",
    ]),
  ]);
}
