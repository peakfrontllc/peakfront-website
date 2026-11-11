"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export function CollapsibleSection({
  title,
  children,
  id,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  id?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!id) return;
    const openIfTargeted = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    openIfTargeted();
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [id]);

  return (
    <section id={id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center gap-2.5 bg-navy px-5 py-3 text-left text-sm font-semibold text-white"
        >
          <span className="h-4 w-1 rounded-full bg-amber" aria-hidden />
          <span className="min-w-0 flex-1">{title}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </h2>
      {open && <div className="px-5 py-4">{children}</div>}
    </section>
  );
}
