export type DownloadItem = {
  title: string;
  description: string;
  tag: string;
  pdfHref: string;
  pdfLabel: string;
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
];
