"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

export function StaffNav({
  items,
  fullName,
  roleName,
}: {
  items: { href: string; label: string }[];
  fullName: string;
  roleName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="relative z-40 border-b border-navy/10 bg-white pt-32 sm:pt-28">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <nav className="flex flex-wrap gap-2">
          {items.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${
                  active ? "bg-navy text-white" : "text-navy hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-navy">{fullName || "Staff"}</span>
            <span className="mx-2 text-slate-300">/</span>
            {roleName}
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="cursor-pointer border border-navy/15 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy hover:border-amber"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
