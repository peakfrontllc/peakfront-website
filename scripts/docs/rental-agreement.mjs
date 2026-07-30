import { Table, TableRow, WidthType } from "docx";
import { COMPANY, labelCell, paragraph, signatureBlock, spacer, termsBlock, text, titleBlock, writeDocx, companyHeader } from "./shared.mjs";

export async function buildRentalAgreementDocx(publicDir, outPath) {
  const clauses = [
    "PARTIES — Peakfront Equipment Rental LLC SPC (\"Lessor\") agrees to rent equipment to the client named below (\"Lessee\").",
    "EQUIPMENT — Lessor shall supply the equipment described in Schedule A in good working condition, subject to availability.",
    "RENTAL PERIOD — Rental commences on the start date and continues until the end date or return of equipment, whichever is earlier.",
    "RATES & PAYMENT — Lessee shall pay rental rates as per the agreed quotation/contract. Invoices are payable within the agreed credit period. Late payment may incur suspension of service.",
    "OPERATOR & FUEL — Unless stated in Schedule A, equipment is supplied without operator and fuel. Lessee is responsible for licensed operators and daily fuel where applicable.",
    "USE & SITE — Equipment shall be used only by competent operators for intended purposes on the designated site. Lessee shall not sub-rent or relocate equipment without Lessor's written approval.",
    "MAINTENANCE & DAMAGE — Lessee shall report faults immediately. Damage beyond normal wear, theft or loss shall be charged to Lessee at repair/replacement cost.",
    "INSURANCE — Lessee shall maintain adequate third-party and equipment insurance covering the rental period unless otherwise agreed in writing.",
    "MOBILISATION — Delivery, permits, offloading and demobilisation charges apply as quoted. Lessee shall provide safe access and lifting support at site.",
    "TERMINATION — Either party may terminate for material breach with written notice. Lessor may recover equipment upon non-payment or unsafe use.",
    "GOVERNING LAW — This agreement is governed by the laws of the United Arab Emirates. Courts of Abu Dhabi shall have jurisdiction.",
  ];

  await writeDocx(publicDir, outPath, "Peakfront Rental Agreement", "Equipment rental agreement template", [
    ...companyHeader(publicDir),
    ...titleBlock("EQUIPMENT RENTAL AGREEMENT"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("Agreement No.", "PRA-2026-001"), labelCell("Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Lessee / Client", "[Enter client name]"), labelCell("Contact Person", "[Enter contact name]")] }),
        new TableRow({ children: [labelCell("Project / Site", "[Enter project]"), labelCell("Site Location", "[Enter location]")] }),
        new TableRow({ children: [labelCell("Rental Start", "[Enter date]"), labelCell("Rental End", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Quote / Ref No.", "[Enter reference]"), labelCell("TRN (Lessee)", "[Enter TRN]")] }),
      ],
    }),
    spacer(),
    paragraph(text("Schedule A — Equipment", { bold: true, size: 22, color: "0B2545" }), { spacing: { after: 80 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            labelCell("Equipment Description", "[Enter equipment type & model]"),
            labelCell("Asset / Reg. No.", "[Enter number]"),
          ],
        }),
        new TableRow({
          children: [
            labelCell("Daily / Monthly Rate (AED)", "[Enter rate]"),
            labelCell("Operator / Fuel Included?", "[Yes / No — specify]"),
          ],
        }),
      ],
    }),
    spacer(),
    paragraph(text("Terms & Conditions", { bold: true, size: 22, color: "0B2545" }), { spacing: { after: 80 } }),
    ...clauses.map((line, i) =>
      paragraph(text(`${i + 1}. ${line}`, { size: 18, color: "475569" }), { spacing: { after: 50 } }),
    ),
    spacer(120),
    ...termsBlock("Special Conditions (if any)", ["[Enter any project-specific terms, mobilisation details or exclusions]"]),
    spacer(160),
    signatureBlock("Lessor (Peakfront):", "Lessee (Client):", "Name, signature, stamp & date"),
  ]);
}
