import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";

export const COMPANY = {
  name: "Peakfront Equipment Rental LLC SPC",
  tagline: "Heavy Equipment & Transport Rental",
  address: "Mussafah 17, Abu Dhabi, United Arab Emirates",
  phone: "+971 527459432",
  email: "info@peakfront.ae",
  website: "www.peakfront.ae",
  preparedBy: "Irfan Dayan",
  title: "Managing Director",
};

const LINE_COUNT = 10;

const cellBorder = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
};

function text(value, options = {}) {
  return new TextRun({
    text: value,
    bold: options.bold,
    size: options.size ?? 20,
    color: options.color,
    italics: options.italics,
  });
}

function paragraph(children, options = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    alignment: options.alignment,
    spacing: options.spacing ?? { after: 120 },
  });
}

function labelCell(label, value = "") {
  return new TableCell({
    borders: cellBorder,
    width: { size: 2400, type: WidthType.DXA },
    shading: { fill: "F8FAFC" },
    children: [
      paragraph(text(label, { bold: true, size: 18, color: "0B2545" }), { spacing: { after: 40 } }),
      paragraph(text(value, { size: 20 }), { spacing: { after: 60 } }),
    ],
  });
}

function headerCell(content, align = AlignmentType.LEFT) {
  return new TableCell({
    borders: cellBorder,
    shading: { fill: "0B2545" },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      paragraph(text(content, { bold: true, size: 18, color: "FFFFFF" }), {
        alignment: align,
        spacing: { after: 0 },
      }),
    ],
  });
}

function bodyCell(content, align = AlignmentType.LEFT) {
  return new TableCell({
    borders: cellBorder,
    verticalAlign: VerticalAlign.CENTER,
    children: [
      paragraph(text(content, { size: 20 }), {
        alignment: align,
        spacing: { after: 0 },
      }),
    ],
  });
}

function emptyCell(align = AlignmentType.LEFT) {
  return new TableCell({
    borders: cellBorder,
    verticalAlign: VerticalAlign.CENTER,
    children: [paragraph(text(" ", { size: 20 }), { alignment: align, spacing: { after: 0 } })],
  });
}

function buildLineRows() {
  const samples = [
    ["1", "20T Crawler Excavator", "1", "Unit", "950", "1", "950.00"],
    ["2", "Low Bed Trailer", "1", "Trip", "1,200", "1", "1,200.00"],
  ];

  const rows = [];
  for (let i = 0; i < LINE_COUNT; i += 1) {
    const sample = samples[i];
    const cells = sample
      ? sample
      : [String(i + 1), "", "", "", "", "", ""];
    rows.push(
      new TableRow({
        children: [
          bodyCell(cells[0], AlignmentType.CENTER),
          bodyCell(cells[1]),
          bodyCell(cells[2], AlignmentType.CENTER),
          bodyCell(cells[3], AlignmentType.CENTER),
          bodyCell(cells[4], AlignmentType.RIGHT),
          bodyCell(cells[5], AlignmentType.CENTER),
          bodyCell(cells[6], AlignmentType.RIGHT),
        ],
      }),
    );
  }
  return rows;
}

export async function buildQuotationDocx(publicDir, outPath) {
  const logoBuffer = readFileSync(join(publicDir, "logo.png"));

  const doc = new Document({
    creator: COMPANY.name,
    title: "Peakfront Quotation",
    description: "Editable quotation template",
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new ImageRun({
                type: "png",
                data: logoBuffer,
                transformation: { width: 250, height: 44 },
                altText: {
                  title: "Peakfront",
                  description: "Peakfront Equipment Rental logo",
                  name: "Peakfront logo",
                },
              }),
            ],
          }),
          paragraph(text(COMPANY.name, { bold: true, size: 22, color: "0B2545" }), {
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
          }),
          paragraph(text(COMPANY.tagline, { bold: true, size: 18, color: "F39C12" }), {
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
          }),
          paragraph(
            text(
              `${COMPANY.address} · ${COMPANY.phone} · ${COMPANY.email} · ${COMPANY.website}`,
              { size: 17, color: "64748B" },
            ),
            { alignment: AlignmentType.CENTER, spacing: { after: 200 } },
          ),
          paragraph(text("QUOTATION", { bold: true, size: 26, color: "0B2545" }), {
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  labelCell("Quote No.", "PFQ-2026-001"),
                  labelCell("Date", "[Enter date]"),
                ],
              }),
              new TableRow({
                children: [
                  labelCell("Client / Company", "[Enter client name]"),
                  labelCell("Contact Person", "[Enter contact name]"),
                ],
              }),
              new TableRow({
                children: [
                  labelCell("Project / Site", "[Enter project]"),
                  labelCell("Location", "[Enter location]"),
                ],
              }),
              new TableRow({
                children: [
                  labelCell("Rental Period", "[Enter period]"),
                  labelCell("Valid Until", "[Enter validity date]"),
                ],
              }),
            ],
          }),
          paragraph(text(" ", { size: 8 }), { spacing: { after: 160 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  headerCell("#", AlignmentType.CENTER),
                  headerCell("Description"),
                  headerCell("Qty", AlignmentType.CENTER),
                  headerCell("Unit", AlignmentType.CENTER),
                  headerCell("Rate (AED)", AlignmentType.RIGHT),
                  headerCell("Days", AlignmentType.CENTER),
                  headerCell("Amount (AED)", AlignmentType.RIGHT),
                ],
              }),
              ...buildLineRows(),
            ],
          }),
          paragraph(text(" ", { size: 8 }), { spacing: { after: 120 } }),
          new Table({
            width: { size: 42, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.RIGHT,
            rows: [
              new TableRow({
                children: [
                  bodyCell("Subtotal", AlignmentType.RIGHT),
                  bodyCell("2,150.00", AlignmentType.RIGHT),
                ],
              }),
              new TableRow({
                children: [
                  bodyCell("VAT (5%)", AlignmentType.RIGHT),
                  bodyCell("107.50", AlignmentType.RIGHT),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorder,
                    shading: { fill: "FEF3C7" },
                    children: [
                      paragraph(text("Grand Total (AED)", { bold: true, size: 22, color: "0B2545" }), {
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 0 },
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: cellBorder,
                    shading: { fill: "FEF3C7" },
                    children: [
                      paragraph(text("2,257.50", { bold: true, size: 22, color: "0B2545" }), {
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 0 },
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          paragraph(text(" ", { size: 8 }), { spacing: { after: 160 } }),
          paragraph(text("Terms & Conditions", { bold: true, size: 20, color: "0B2545" }), {
            spacing: { after: 80 },
          }),
          ...[
            "Rates are in AED and exclude fuel, operator and mobilisation unless stated.",
            "Delivery, permits and offloading quoted separately where applicable.",
            "Equipment supplied subject to availability and standard rental agreement.",
            "Payment terms: as agreed. Quote valid for 7 days from date above.",
          ].map((line) =>
            paragraph(text(`• ${line}`, { size: 18, color: "475569" }), { spacing: { after: 60 } }),
          ),
          paragraph(text(" ", { size: 8 }), { spacing: { after: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorder,
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      paragraph(text("Prepared by:", { bold: true, size: 18, color: "0B2545" }), {
                        spacing: { after: 120 },
                      }),
                      paragraph(text(COMPANY.preparedBy, { bold: true, size: 20 }), { spacing: { after: 40 } }),
                      paragraph(text(COMPANY.title, { size: 18, color: "F39C12" }), { spacing: { after: 40 } }),
                      paragraph(text(COMPANY.name, { size: 18, color: "64748B" }), { spacing: { after: 60 } }),
                    ],
                  }),
                  new TableCell({
                    borders: cellBorder,
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      paragraph(text("Accepted by (Client):", { bold: true, size: 18, color: "0B2545" }), {
                        spacing: { after: 120 },
                      }),
                      paragraph(text(" ", { size: 20 }), { spacing: { after: 40 } }),
                      paragraph(text(" ", { size: 20 }), { spacing: { after: 40 } }),
                      paragraph(text("Signature & stamp", { size: 18, color: "64748B" }), { spacing: { after: 60 } }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  writeFileSync(outPath, buffer);
}
