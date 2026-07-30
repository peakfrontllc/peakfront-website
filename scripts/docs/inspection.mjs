import { AlignmentType, Table, TableRow, WidthType } from "docx";
import {
  bodyCell,
  buildLineTable,
  companyHeader,
  labelCell,
  paragraph,
  signatureBlock,
  spacer,
  text,
  titleBlock,
  writeDocx,
} from "./shared.mjs";

const CHECKLIST = [
  "General appearance & cleanliness",
  "Engine / power train",
  "Hydraulic system & hoses",
  "Tracks / tyres / undercarriage",
  "Lights, horn & alarms",
  "Safety devices & fire extinguisher",
  "Cab / ROPS / FOPS",
  "Attachments, pins & couplers",
  "Fluid levels (oil, coolant, hydraulic)",
  "Controls & instruments",
  "Hour / ODO meter reading",
  "Overall operational condition",
];

export async function buildInspectionDocx(publicDir, outPath) {
  await writeDocx(publicDir, outPath, "Peakfront Inspection Report", "Equipment inspection checklist", [
    ...companyHeader(publicDir),
    ...titleBlock("EQUIPMENT INSPECTION REPORT"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("Report No.", "PIR-2026-001"), labelCell("Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Equipment", "[Enter type & model]"), labelCell("Asset / Reg. No.", "[Enter number]")] }),
        new TableRow({ children: [labelCell("Client / Site", "[Enter client / site]"), labelCell("Inspection Type", "Pre-rental / Post-rental / Periodic")] }),
        new TableRow({ children: [labelCell("Inspector", "[Enter name]"), labelCell("Hour / ODO Meter", "[Enter reading]")] }),
      ],
    }),
    spacer(),
    buildLineTable(
      [
        { label: "#", align: AlignmentType.CENTER },
        { label: "Inspection Item" },
        { label: "Pass", align: AlignmentType.CENTER },
        { label: "Fail", align: AlignmentType.CENTER },
        { label: "N/A", align: AlignmentType.CENTER },
        { label: "Remarks" },
      ],
      (i) => {
        const item = CHECKLIST[i];
        if (!item) {
          return new TableRow({
            children: [
              bodyCell(String(i + 1), AlignmentType.CENTER),
              bodyCell(""),
              bodyCell("", AlignmentType.CENTER),
              bodyCell("", AlignmentType.CENTER),
              bodyCell("", AlignmentType.CENTER),
              bodyCell(""),
            ],
          });
        }
        return new TableRow({
          children: [
            bodyCell(String(i + 1), AlignmentType.CENTER),
            bodyCell(item),
            bodyCell("☐", AlignmentType.CENTER),
            bodyCell("☐", AlignmentType.CENTER),
            bodyCell("☐", AlignmentType.CENTER),
            bodyCell(""),
          ],
        });
      },
      12,
    ),
    spacer(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            labelCell("Overall Result", "[Pass / Fail / Conditional]"),
            labelCell("Action Required", "[Enter corrective actions if any]"),
          ],
        }),
        new TableRow({ children: [labelCell("Additional Notes / Damage Report", "[Enter details]")] }),
      ],
    }),
    spacer(),
    paragraph(text("Photos attached: ☐ Yes  ☐ No", { size: 18, color: "64748B" }), { spacing: { after: 120 } }),
    spacer(80),
    signatureBlock("Inspected by (Peakfront):", "Acknowledged by (Client):", "Name, signature & date"),
  ]);
}
