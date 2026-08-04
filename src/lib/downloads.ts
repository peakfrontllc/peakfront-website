export type DownloadFile = {
  href: string;
  label: string;
  download?: string;
};

export type DownloadItem = {
  title: string;
  description: string;
  tag: string;
  pdfHref?: string;
  pdfLabel?: string;
  files?: DownloadFile[];
  viewHref: string;
  viewLabel: string;
};

export const downloadItems: DownloadItem[] = [
  {
    title: "Company Pamphlet",
    description:
      "Single-page A4 overview of Peakfront services, equipment categories, and contact details for clients and site teams.",
    tag: "Marketing",
    pdfHref: "/docs/pamphlet/Peakfront-Pamphlet.pdf",
    pdfLabel: "Download PDF",
    viewHref: "/pamphlet",
    viewLabel: "View online",
  },
  {
    title: "Capability Statement",
    description:
      "A4 company profile for procurement managers, contractors, and developers — capabilities, equipment, and industries served.",
    tag: "Procurement",
    pdfHref: "/docs/capability-statement/Peakfront-Capability-Statement.pdf",
    pdfLabel: "Download PDF",
    viewHref: "/capability-statement",
    viewLabel: "View online",
  },
  {
    title: "Company Portfolio",
    description:
      "Multi-section portfolio covering company background, equipment fleet, projects, and credentials for tender submissions.",
    tag: "Marketing",
    pdfHref: "/portfolio/Peakfront-Company-Portfolio.pdf",
    pdfLabel: "Download PDF",
    viewHref: "/portfolio",
    viewLabel: "View online",
  },
  {
    title: "Business Card",
    description:
      "Print-ready business cards for Managing Director Irfan Dayan — standard 3.5\" × 2\" landscape format with front contact details and back service mosaic.",
    tag: "Marketing",
    files: [
      {
        href: "/docs/business-card/front.png",
        label: "Download front (PNG)",
        download: "peakfront-card-front.png",
      },
      {
        href: "/docs/business-card/back.png",
        label: "Download back (PNG)",
        download: "peakfront-card-back.png",
      },
    ],
    viewHref: "/docs/business-card/print.html",
    viewLabel: "View print sheet",
  },
];
