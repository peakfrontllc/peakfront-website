"use client";

import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

export default function PrintToolbar() {
  return (
    <div className="capability-print-toolbar mx-auto mb-4 max-w-[210mm] px-4 pt-4 print:hidden">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All documents
        </Link>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Capability Statement — A4 portrait. Use Print or Save as PDF for
        procurement submissions.
      </p>
      <button
        type="button"
        onClick={() => window.print()}
        className="mt-3 inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#14365f]"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
        Print / Save as PDF
      </button>
    </div>
  );
}
