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

export async function buildPurchaseOrderDocx(publicDir, outPath) {
  await writeDocx(publicDir, outPath, "Peakfront Purchase Order", "Purchase order template", [
    ...companyHeader(publicDir),
    ...titleBlock("PURCHASE ORDER"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("PO No.", "PPO-2026-001"), labelCell("Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Supplier / Vendor", "[Enter supplier name]"), labelCell("Contact Person", "[Enter contact name]")] }),
        new TableRow({ children: [labelCell("Email", "[Enter email]"), labelCell("Phone", "[Enter phone]")] }),
        new TableRow({ children: [labelCell("RFQ / Quote Ref.", "[Enter reference]"), labelCell("Required By", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Ship To / Delivery", "[Enter delivery address]"), labelCell("Project / Site", "[Enter project]")] }),
      ],
    }),
    spacer(),
    buildLineTable(
      [
        { label: "#", align: AlignmentType.CENTER },
        { label: "Description" },
        { label: "Qty", align: AlignmentType.CENTER },
        { label: "Unit", align: AlignmentType.CENTER },
        { label: "Unit Price (AED)", align: AlignmentType.RIGHT },
        { label: "Amount (AED)", align: AlignmentType.RIGHT },
      ],
      (i) =>
        new TableRow({
          children: [
            bodyCell(String(i + 1), AlignmentType.CENTER),
            bodyCell(i === 0 ? "20T Crawler Excavator (example)" : ""),
            bodyCell(i === 0 ? "1" : "", AlignmentType.CENTER),
            bodyCell(i === 0 ? "Unit" : "", AlignmentType.CENTER),
            bodyCell("", AlignmentType.RIGHT),
            bodyCell("", AlignmentType.RIGHT),
          ],
        }),
      8,
    ),
    spacer(100),
    totalsTable(),
    spacer(140),
    ...termsBlock("Purchase Order Terms", [
      "This PO constitutes an offer to purchase subject to supplier acceptance.",
      "Deliver goods/services to the address above by the required date.",
      "Invoice must reference this PO number. Payment terms as agreed.",
      "Peakfront TRN must appear on all tax invoices.",
    ]),
    spacer(160),
    signatureBlock("Authorized by (Peakfront):", "Accepted by (Supplier):", "Signature, stamp & date"),
  ]);
}
