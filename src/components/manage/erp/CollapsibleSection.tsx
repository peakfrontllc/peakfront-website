"use client";

import { ChevronDown } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

const JoinedSections = createContext(false);

export function SectionStack({ children }: { children: ReactNode }) {
  return (
    <JoinedSections.Provider value={true}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">{children}</div>
      </div>
    </JoinedSections.Provider>
  );
}

export function CollapsibleSection({
  title,
  subtitle,
  children,
  nested = false,
  defaultOpen = false,
  id,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  nested?: boolean;
  defaultOpen?: boolean;
  id?: string;
}) {
  const joined = useContext(JoinedSections) && !nested;
  const [open, setOpen] = useState(defaultOpen);
  const Heading = nested ? "h3" : "h2";

  return (
    <section id={id} className={nested ? "mb-3 rounded-lg border border-slate-200 bg-white last:mb-0" : joined ? "scroll-mt-20" : "scroll-mt-20 rounded-xl border border-slate-200 bg-white shadow-sm"}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
        onClick={() => setOpen((value) => !value)}
        className={nested
          ? "flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          : "flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-slate-50 sm:px-6"}
      >
        <span className="min-w-0">
          <Heading className={nested ? "text-sm font-bold text-navy" : "text-sm font-semibold text-navy"}>{title}</Heading>
          {subtitle && <span className="mt-0.5 block text-xs text-slate-500">{subtitle}</span>}
        </span>
        <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${open ? "bg-navy text-white" : "bg-slate-100 text-slate-600"}`}>
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
        </span>
      </button>
      <div className={open ? (nested ? "border-t border-slate-100 px-4 pb-4 pt-3" : "border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6") : "hidden"}>
        {children}
      </div>
    </section>
  );
}
