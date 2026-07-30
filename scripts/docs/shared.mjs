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
  trn: "[Enter TRN]",
  bankName: "[Enter bank name]",
  bankAccount: "[Enter account number]",
  iban: "[Enter IBAN]",
};

export const CONFIG = {
  lineCount: 10,
  logo: { width: 250, height: 44 },
  margins: { top: 720, right: 720, bottom: 720, left: 720 },
  cellMargins: { top: 80, bottom: 80, left: 100, right: 100 },
  fonts: {
    body: 20,
    label: 18,
    header: 18,
    company: 22,
    tagline: 18,
    contact: 17,
    title: 26,
    subtitle: 18,
    termsHeading: 20,
    terms: 18,
    grand: 22,
    signLabel: 18,
    signName: 20,
    signMeta: 18,
    small: 18,
  },
  spacing: {
    afterLogo: 120,
    afterCompany: 60,
    afterContact: 160,
    afterTitle: 160,
    afterSubtitle: 120,
    betweenTables: 140,
    afterItems: 100,
    afterTotals: 140,
    termsHeading: 80,
    termsLine: 60,
    beforeSign: 160,
    signGap: 100,
    signLine: 40,
    labelAfter: 40,
    valueAfter: 60,
  },
};

export const cellBorder = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
};

export function text(value, options = {}) {
  return new TextRun({
    text: value,
    bold: options.bold,
    size: options.size ?? CONFIG.fonts.body,
    color: options.color,
    italics: options.italics,
  });
}

export function paragraph(children, options = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    alignment: options.alignment,
    spacing: options.spacing ?? { after: 140 },
  });
}

export function labelCell(label, value = "") {
  return new TableCell({
    borders: cellBorder,
    margins: CONFIG.cellMargins,
    shading: { fill: "F8FAFC" },
    children: [
      paragraph(text(label, { bold: true, size: CONFIG.fonts.label, color: "0B2545" }), {
        spacing: { after: CONFIG.spacing.labelAfter },
      }),
      paragraph(text(value, { size: CONFIG.fonts.body }), { spacing: { after: CONFIG.spacing.valueAfter } }),
    ],
  });
}

export function headerCell(content, align = AlignmentType.LEFT) {
  return new TableCell({
    borders: cellBorder,
    margins: CONFIG.cellMargins,
    shading: { fill: "0B2545" },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      paragraph(text(content, { bold: true, size: CONFIG.fonts.header, color: "FFFFFF" }), {
        alignment: align,
        spacing: { after: 0 },
      }),
    ],
  });
}

export function bodyCell(content, align = AlignmentType.LEFT, options = {}) {
  return new TableCell({
    borders: cellBorder,
    margins: CONFIG.cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    shading: options.shading,
    children: [
      paragraph(text(content, { size: CONFIG.fonts.body, color: options.color }), {
        alignment: align,
        spacing: { after: 0 },
      }),
    ],
  });
}

export function companyHeader(publicDir) {
  const logoBuffer = readFileSync(join(publicDir, "logo.png"));
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: CONFIG.spacing.afterLogo },
      children: [
        new ImageRun({
          type: "png",
          data: logoBuffer,
          transformation: CONFIG.logo,
          altText: { title: "Peakfront", description: "Peakfront logo", name: "Peakfront logo" },
        }),
      ],
    }),
    paragraph(text(COMPANY.name, { bold: true, size: CONFIG.fonts.company, color: "0B2545" }), {
      alignment: AlignmentType.CENTER,
      spacing: { after: CONFIG.spacing.afterCompany },
    }),
    paragraph(text(COMPANY.tagline, { bold: true, size: CONFIG.fonts.tagline, color: "F39C12" }), {
      alignment: AlignmentType.CENTER,
      spacing: { after: CONFIG.spacing.afterCompany },
    }),
    paragraph(
      text(`${COMPANY.address} · ${COMPANY.phone} · ${COMPANY.email} · ${COMPANY.website}`, {
        size: CONFIG.fonts.contact,
        color: "64748B",
      }),
      { alignment: AlignmentType.CENTER, spacing: { after: CONFIG.spacing.afterContact } },
    ),
  ];
}

export function titleBlock(title, subtitle) {
  const blocks = [
    paragraph(text(title, { bold: true, size: CONFIG.fonts.title, color: "0B2545" }), {
      alignment: AlignmentType.CENTER,
      spacing: { after: subtitle ? CONFIG.spacing.afterTitle : CONFIG.spacing.afterSubtitle },
    }),
  ];
  if (subtitle) {
    blocks.push(
      paragraph(text(subtitle, { size: CONFIG.fonts.subtitle, color: "64748B", italics: true }), {
        alignment: AlignmentType.CENTER,
        spacing: { after: CONFIG.spacing.afterSubtitle },
      }),
    );
  }
  return blocks;
}

export function termsBlock(heading, lines) {
  return [
    paragraph(text(heading, { bold: true, size: CONFIG.fonts.termsHeading, color: "0B2545" }), {
      spacing: { after: CONFIG.spacing.termsHeading },
    }),
    ...lines.map((line) =>
      paragraph(text(`• ${line}`, { size: CONFIG.fonts.terms, color: "475569" }), {
        spacing: { after: CONFIG.spacing.termsLine },
      }),
    ),
  ];
}

export function signatureBlock(leftLabel, rightLabel, rightHint = "Signature & stamp") {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorder,
            margins: CONFIG.cellMargins,
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              paragraph(text(leftLabel, { bold: true, size: CONFIG.fonts.signLabel, color: "0B2545" }), {
                spacing: { after: CONFIG.spacing.signGap },
              }),
              paragraph(text(COMPANY.preparedBy, { bold: true, size: CONFIG.fonts.signName }), {
                spacing: { after: CONFIG.spacing.signLine },
              }),
              paragraph(text(COMPANY.title, { size: CONFIG.fonts.signMeta, color: "F39C12" }), {
                spacing: { after: CONFIG.spacing.signLine },
              }),
              paragraph(text(COMPANY.name, { size: CONFIG.fonts.signMeta, color: "64748B" }), {
                spacing: { after: CONFIG.spacing.signLine },
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder,
            margins: CONFIG.cellMargins,
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              paragraph(text(rightLabel, { bold: true, size: CONFIG.fonts.signLabel, color: "0B2545" }), {
                spacing: { after: CONFIG.spacing.signGap },
              }),
              paragraph(text(" ", { size: CONFIG.fonts.body }), { spacing: { after: CONFIG.spacing.signLine } }),
              paragraph(text(" ", { size: CONFIG.fonts.body }), { spacing: { after: CONFIG.spacing.signLine } }),
              paragraph(text(rightHint, { size: CONFIG.fonts.signMeta, color: "64748B" }), {
                spacing: { after: CONFIG.spacing.signLine },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

export function totalsTable(labels = ["Subtotal", "VAT (5%)", "Grand Total (AED)"]) {
  return new Table({
    width: { size: 48, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.RIGHT,
    rows: [
      new TableRow({
        children: [bodyCell(labels[0], AlignmentType.RIGHT), bodyCell("", AlignmentType.RIGHT)],
      }),
      new TableRow({
        children: [bodyCell(labels[1], AlignmentType.RIGHT), bodyCell("", AlignmentType.RIGHT)],
      }),
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorder,
            margins: CONFIG.cellMargins,
            shading: { fill: "FEF3C7" },
            children: [
              paragraph(text(labels[2], { bold: true, size: CONFIG.fonts.grand, color: "0B2545" }), {
                alignment: AlignmentType.RIGHT,
                spacing: { after: 0 },
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder,
            margins: CONFIG.cellMargins,
            shading: { fill: "FEF3C7" },
            children: [
              paragraph(text("", { bold: true, size: CONFIG.fonts.grand, color: "0B2545" }), {
                alignment: AlignmentType.RIGHT,
                spacing: { after: 0 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

export function buildLineTable(headers, rowBuilder, lineCount = CONFIG.lineCount) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map((h) => headerCell(h.label, h.align ?? AlignmentType.LEFT)),
      }),
      ...Array.from({ length: lineCount }, (_, i) => rowBuilder(i)),
    ],
  });
}

export async function writeDocx(publicDir, outPath, title, description, children) {
  const doc = new Document({
    creator: COMPANY.name,
    title,
    description,
    sections: [{ properties: { page: { margin: CONFIG.margins } }, children }],
  });
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(outPath, buffer);
}

export function spacer(after = CONFIG.spacing.betweenTables) {
  return paragraph(text(" ", { size: 8 }), { spacing: { after } });
}
