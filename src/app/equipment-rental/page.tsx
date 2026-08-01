import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import RentalEquipmentCard from "@/components/rental/RentalEquipmentCard";
import { getEquipmentBrowseCards, rentalImages } from "@/lib/rental-pages";
import { LEGAL_ENTITY_NAME } from "@/lib/license";

export const metadata: Metadata = {
  title: "Equipment List | Abu Dhabi & UAE",
  description: `${LEGAL_ENTITY_NAME} — browse rental equipment categories and scaffolding services for material handling, earthmoving, lifting, transport, power and passenger buses across the UAE.`,
  alternates: {
    canonical: "/equipment-rental",
  },
};

export default function EquipmentRentalIndexPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <Image
            src={rentalImages.subBanner}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy/75" />
        </div>
        <div className="page-hero mx-auto max-w-[1400px] px-4 lg:py-28">
          <Link
            href="/"
            className="touch-target inline-flex items-center py-1 font-mono text-xs uppercase tracking-[0.18em] text-white/60 hover:text-amber"
          >
            ← Home
          </Link>
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Equipment List for Rent
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Explore every category we rent in Abu Dhabi, Dubai and across the
            UAE — select a category to view equipment types and sub-pages.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-amber" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
                All Categories
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Browse equipment by category
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Each category opens a hub page with the full equipment list. Buses,
              tankers and other families show sub-types on their hub page.
              Scaffolding hire is listed as a separate service below.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getEquipmentBrowseCards().map((card) => (
              <RentalEquipmentCard
                key={card.href}
                href={card.href}
                title={card.title}
                image={card.image}
                imageAlt={card.imageAlt}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
