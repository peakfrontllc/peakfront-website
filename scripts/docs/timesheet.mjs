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
  writeDocx,
} from "./shared.mjs";

export async function buildTimesheetDocx(publicDir, outPath) {
  await writeDocx(publicDir, outPath, "Peakfront Timesheet", "Daily equipment timesheet", [
    ...companyHeader(publicDir),
    ...titleBlock("DAILY EQUIPMENT TIME SHEET"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("Timesheet No.", "PTS-2026-001"), labelCell("Date", "[Enter date]")] }),
        new TableRow({ children: [labelCell("Client / Company", "[Enter client name]"), labelCell("Project / Site", "[Enter project]")] }),
        new TableRow({ children: [labelCell("Site Location", "[Enter location]"), labelCell("Agreement / Quote Ref.", "[Enter reference]")] }),
      ],
    }),
    spacer(),
    buildLineTable(
      [
        { label: "#", align: AlignmentType.CENTER },
        { label: "Equipment" },
        { label: "Asset / Reg. No.", align: AlignmentType.CENTER },
        { label: "Operator", align: AlignmentType.CENTER },
        { label: "Start", align: AlignmentType.CENTER },
        { label: "End", align: AlignmentType.CENTER },
        { label: "Break (hrs)", align: AlignmentType.CENTER },
        { label: "Total Hrs", align: AlignmentType.CENTER },
      ],
      (i) =>
        new TableRow({
          children: [
            bodyCell(String(i + 1), AlignmentType.CENTER),
            bodyCell(i === 0 ? "20T Crawler Excavator (example)" : ""),
            bodyCell("", AlignmentType.CENTER),
            bodyCell("", AlignmentType.CENTER),
            bodyCell("", AlignmentType.CENTER),
            bodyCell("", AlignmentType.CENTER),
            bodyCell("", AlignmentType.CENTER),
            bodyCell("", AlignmentType.CENTER),
          ],
        }),
      6,
    ),
    spacer(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [labelCell("Work Description / Location on Site", "[Enter activities performed]")] }),
        new TableRow({ children: [labelCell("Standby / Breakdown Hours (if any)", "[Enter details]")] }),
      ],
    }),
    spacer(),
    ...termsBlock("Notes", [
      "Times recorded are for billing and site records.",
      "Client representative confirms hours and equipment usage for the date above.",
      "Disputes must be noted in writing on the day of work.",
    ]),
    spacer(160),
    signatureBlock("Operator / Peakfront Rep:", "Approved by (Client):", "Name, signature & date"),
  ]);
}
