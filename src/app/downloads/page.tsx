import { Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { downloadItems } from "@/lib/downloads";
import { LEGAL_ENTITY_NAME } from "@/lib/license";

export const metadata: Metadata = {
  title: "Downloads",
  description: `Download the Peakfront company pamphlet, capability statement, portfolio PDFs, and business card files from ${LEGAL_ENTITY_NAME}.`,
  alternates: {
    canonical: "/downloads",
  },
};

export default function DownloadsPage() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.18em] text-blue hover:text-navy"
        >
          ← Back to home
        </Link>

        <div className="mt-8 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
              Downloads
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Company documents
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Download Peakfront marketing and procurement documents as PDF or PNG,
            or open the online version in your browser.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {downloadItems.map((item) => (
            <article
              key={item.title}
              className="flex flex-col border border-navy/10 bg-white p-6 shadow-[0_8px_24px_rgba(11,37,69,0.06)]"
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-amber">
                {item.tag}
              </span>
              <h2 className="mt-3 text-xl font-bold text-navy">{item.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {item.files ? (
                  item.files.map((file) => (
                    <a
                      key={file.href}
                      href={file.href}
                      download={file.download}
                      className="inline-flex items-center justify-center gap-2 bg-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14365f]"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {file.label}
                    </a>
                  ))
                ) : (
                  <a
                    href={item.pdfHref}
                    download
                    className="inline-flex items-center justify-center gap-2 bg-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14365f]"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {item.pdfLabel}
                  </a>
                )}
                <a
                  href={item.viewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-navy/15 bg-white px-4 py-3 text-sm font-semibold text-navy transition-colors hover:border-amber hover:text-navy"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {item.viewLabel}
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-slate-500">
          For internal templates such as quotations, invoices, and delivery
          notes, visit the{" "}
          <Link href="/docs" className="font-medium text-blue hover:text-navy">
            official documents hub
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
