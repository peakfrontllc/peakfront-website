"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Boxes,
  Building2,
  FolderKanban,
  FolderTree,
  Handshake,
  Menu,
  Receipt,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { logout } from "@/lib/auth/actions";

const ICONS: Record<string, LucideIcon> = {
  "/manage": FolderKanban,
  "/manage/categories": FolderTree,
  "/manage/suppliers": Building2,
  "/manage/equipment": Boxes,
  "/manage/rates": Receipt,
  "/manage/clients": Handshake,
  "/manage/staff": Users,
  "/manage/account": UserRound,
};

function backTarget(pathname: string) {
  const sections = [
    ["/manage/categories", "categories"],
    ["/manage/suppliers", "suppliers"],
    ["/manage/equipment", "equipment"],
    ["/manage/clients", "clients"],
    ["/manage/rates", "rates"],
  ] as const;
  for (const [href] of sections) {
    if (pathname !== href && pathname.startsWith(`${href}/`)) return href;
  }
  return null;
}

function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("");
  return (letters || "PF").toUpperCase();
}

export function DashboardShell({
  items,
  fullName,
  roleName,
  children,
}: {
  items: { href: string; label: string; group?: string }[];
  fullName: string;
  roleName: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const displayName = fullName || "Staff";
  const backHref = backTarget(pathname);
  const current = items.find((item) => (
    item.href === "/manage"
      ? pathname === "/manage"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  ));
  const CurrentIcon = current ? ICONS[current.href] ?? FolderKanban : null;

  const account = (
    <div className="mt-auto border-t border-white/10 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
          {initials(displayName)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-xs text-white/60">{roleName}</p>
        </div>
      </div>
      <form action={logout} className="mt-3">
        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          Sign out
        </button>
      </form>
    </div>
  );

  const nav = (
    <nav className="flex flex-1 flex-col overflow-y-auto px-3 pb-4">
      {items.reduce<{ name: string; entries: typeof items }[]>((groups, item) => {
        const name = item.group ?? "Menu";
        const current = groups.find((group) => group.name === name);
        if (current) current.entries.push(item);
        else groups.push({ name, entries: [item] });
        return groups;
      }, []).map((group) => (
        <div key={group.name} className="mt-5 first:mt-1">
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">{group.name}</p>
          <div className="flex flex-col gap-0.5">
            {group.entries.map((item) => {
              const active = item.href === "/manage"
                ? pathname === "/manage"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = ICONS[item.href] ?? FolderKanban;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-white/10 text-white shadow-[inset_3px_0_0_0_#f39c12]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-navy">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-navy text-white lg:flex">
        <div className="px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">Peakfront</p>
          <p className="mt-1 text-base font-semibold">Operations</p>
        </div>
        {nav}
        {account}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-navy/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col bg-navy text-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">Peakfront</p>
                <p className="mt-1 text-base font-semibold">Operations</p>
              </div>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/80">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {account}
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-navy hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy shadow-sm hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back
              </Link>
            ) : null}
            {current && CurrentIcon && (
              <p className="hidden min-w-0 items-center gap-2 text-sm font-semibold text-navy sm:flex">
                <CurrentIcon className="h-4 w-4 text-slate-500" aria-hidden />
                <span className="truncate">{current.label}</span>
              </p>
            )}
          </div>
          <p className="ml-auto min-w-0 truncate text-sm text-slate-600">
            <span className="font-semibold text-navy">{displayName}</span>
            <span className="mx-2 hidden text-slate-300 sm:inline">·</span>
            <span className="hidden sm:inline">{roleName}</span>
          </p>
        </header>
        <main id="main-content" className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
