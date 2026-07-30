import { AlignmentType, Table, TableRow, WidthType } from "docx";
import {
  bodyCell,
  buildLineTable,
  companyHeader,
  labelCell,
  paragraph,
  signatureBlock,
  spacer,
  termsBlock,
  text,
  titleBlock,
  writeDocx,
} from "./shared.mjs";

export async function buildDeliveryDocx(publicDir, outPath) {
  await writeDocx(publicDir, outPath, "Peakfront Delivery Note", "Equipment delivery / handover note", [
    ...companyHeader(publicDir),
    ...titleBlock("EQUIPMENT DELIVERY NOTE", "Handover record — delivery or collection"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("Delivery Note No.", "PDN-2026-001"), labelCell("Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Client / Company", "[Enter client name]"), labelCell("Contact Person", "[Enter contact name]")] }),
        new TableRow({ children: [labelCell("Project / Site", "[Enter project]"), labelCell("Site Location", "[Enter location]")] }),
        new TableRow({ children: [labelCell("Agreement / Quote Ref.", "[Enter reference]"), labelCell("Type", "Delivery / Collection")] }),
      ],
    }),
    spacer(),
    buildLineTable(
      [
        { label: "#", align: AlignmentType.CENTER },
        { label: "Equipment Description" },
        { label: "Asset / Reg. No.", align: AlignmentType.CENTER },
        { label: "Hour / ODO Meter", align: AlignmentType.CENTER },
        { label: "Condition", align: AlignmentType.CENTER },
        { label: "Remarks" },
      ],
      (i) =>
        new TableRow({
          children: [
            bodyCell(String(i + 1), AlignmentType.CENTER),
            bodyCell(i === 0 ? "20T Crawler Excavator (example)" : ""),
            bodyCell("", AlignmentType.CENTER),
            bodyCell("", AlignmentType.CENTER),
            bodyCell("", AlignmentType.CENTER),
            bodyCell(""),
          ],
        }),
      6,
    ),
    spacer(),
    paragraph(text("Accessories & Attachments", { bold: true, size: 20, color: "0B2545" }), { spacing: { after: 60 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [labelCell("Items Included", "[Enter buckets, keys, documents, etc.]"), labelCell("Fuel Level", "[Enter level]")],
        }),
      ],
    }),
    spacer(),
    ...termsBlock("Handover Notes", [
      "Equipment handed over in the condition noted above.",
      "Client representative confirms receipt and safe access for delivery/offloading.",
      "Any damage or missing items must be noted before signing.",
      "Photographs taken at handover (attach if available).",
    ]),
    spacer(160),
    signatureBlock("Delivered by (Peakfront):", "Received by (Client):", "Name, signature, stamp & date"),
  ]);
}
