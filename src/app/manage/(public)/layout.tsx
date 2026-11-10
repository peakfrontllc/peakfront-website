import type { ReactNode } from "react";

export default function StaffAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber">Peakfront</p>
          <p className="mt-2 text-2xl font-semibold">Operations</p>
        </div>
        <main id="main-content" className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">{children}</main>
      </div>
    </div>
  );
}
