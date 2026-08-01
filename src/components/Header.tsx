"use client";

import { ChevronDown, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/content";
import { CONTACT } from "@/lib/constants";
import { getEquipmentNavItems, getViewAllEquipmentNavItem } from "@/lib/rental-pages";
import { useQuoteDrawer } from "./QuoteDrawerProvider";

const equipmentNavItems = getEquipmentNavItems();
const viewAllEquipmentItem = getViewAllEquipmentNavItem();

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [mobileEquipmentOpen, setMobileEquipmentOpen] = useState(false);
  const equipmentRef = useRef<HTMLDivElement>(null);
  const { openQuoteDrawer, setTriggerElement } = useQuoteDrawer();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (
        equipmentRef.current &&
        !equipmentRef.current.contains(e.target as Node)
      ) {
        setEquipmentOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const handleQuoteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setTriggerElement(e.currentTarget);
      setMobileOpen(false);
      openQuoteDrawer();
    },
    [openQuoteDrawer, setTriggerElement],
  );

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileEquipmentOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "bg-navy shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-5 sm:py-4 lg:px-10">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-2.5 sm:flex-none sm:gap-3"
          aria-label="Peakfront Equipment Rental — home"
        >
          <Image
            src="/logo-mark.svg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0"
            priority
          />
          <span className="min-w-0 text-base font-extrabold leading-none tracking-tight text-white sm:text-lg">
            <span className="block truncate">PEAKFRONT</span>
            <span className="mt-1 block font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-amber sm:text-[10px] sm:tracking-[0.18em]">
              Equipment Rental
            </span>
          </span>
        </Link>

        <nav
          className="ml-auto hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          <div ref={equipmentRef} className="relative">
            <button
              type="button"
              aria-expanded={equipmentOpen}
              aria-haspopup="true"
              onClick={() => setEquipmentOpen((prev) => !prev)}
              className="inline-flex items-center gap-1 text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              Equipment
              <ChevronDown
                className={`h-4 w-4 transition-transform ${equipmentOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {equipmentOpen ? (
              <div className="absolute left-0 top-full z-50 mt-3 w-64 border border-white/10 bg-navy py-2 shadow-xl shadow-black/30">
                {equipmentNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setEquipmentOpen(false)}
                    className="block px-4 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-1 border-t border-white/10 pt-1">
                  <Link
                    href={viewAllEquipmentItem.href}
                    onClick={() => setEquipmentOpen(false)}
                    className="block px-4 py-2.5 text-sm font-semibold text-amber transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {viewAllEquipmentItem.label}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-0">
          <a
            href={CONTACT.phoneHref}
            className="touch-target hidden items-center gap-2 text-sm font-semibold text-white md:flex"
            aria-label={`Call Peakfront at ${CONTACT.phone}`}
          >
            <Phone className="h-4 w-4 text-amber" aria-hidden="true" />
            {CONTACT.phone}
          </a>
          <button
            type="button"
            onClick={handleQuoteClick}
            className="touch-target inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md bg-amber px-3 text-xs font-bold text-navy shadow transition-colors hover:bg-[#e0900d] sm:h-10 sm:px-4 sm:text-sm"
          >
            Get a Quote
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="touch-target grid place-items-center text-white lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 bg-navy px-4 py-4 sm:px-5 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <button
              type="button"
              aria-expanded={mobileEquipmentOpen}
              onClick={() => setMobileEquipmentOpen((prev) => !prev)}
              className="touch-target flex items-center justify-between rounded-sm px-2 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
            >
              Equipment
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileEquipmentOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {mobileEquipmentOpen ? (
              <div className="mb-2 flex flex-col gap-1 border-l border-white/10 pl-4">
                {equipmentNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="touch-target rounded-sm px-2 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={viewAllEquipmentItem.href}
                  onClick={closeMobile}
                  className="touch-target rounded-sm px-2 py-2.5 text-sm font-semibold text-amber transition-colors hover:bg-white/5 hover:text-white"
                >
                  {viewAllEquipmentItem.label}
                </Link>
              </div>
            ) : null}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="touch-target flex items-center rounded-sm px-2 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={CONTACT.phoneHref}
              className="touch-target flex items-center gap-2 px-2 py-3 text-base font-semibold text-amber"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {CONTACT.phone}
            </a>
            <button
              type="button"
              onClick={handleQuoteClick}
              className="touch-target mt-2 w-full bg-amber py-3.5 text-center text-sm font-bold text-navy transition-colors hover:bg-[#e0900d]"
            >
              Get a Free Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
