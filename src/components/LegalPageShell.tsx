import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export default function LegalPageShell({
  title,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.18em] text-blue hover:text-navy"
        >
          ← Back to home
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {lastUpdated}</p>

        <div className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-slate-600">
          {children}
        </div>
      </div>
    </section>
  );
}
