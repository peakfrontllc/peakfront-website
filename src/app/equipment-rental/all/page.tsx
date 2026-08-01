import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import QuoteButton from "@/components/QuoteButton";
import RentalBreadcrumbs from "@/components/rental/RentalBreadcrumbs";
import RentalEquipmentCard from "@/components/rental/RentalEquipmentCard";
import {
  getAllEquipmentCatalogSections,
  rentalImages,
  VIEW_ALL_EQUIPMENT_PATH,
} from "@/lib/rental-pages";
import {
  getBreadcrumbJsonLd,
  getEquipmentCatalogJsonLd,
  getViewAllEquipmentMetadata,
} from "@/lib/seo";

export const metadata = getViewAllEquipmentMetadata();

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Equipment List", href: "/equipment-rental" },
  { label: "View All Equipment" },
];

export default function ViewAllEquipmentPage() {
  const sections = getAllEquipmentCatalogSections();
  const machines = sections.flatMap((section) => section.cards);
  const machineCount = machines.length;

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Equipment List", path: "/equipment-rental" },
            { name: "View All Equipment", path: VIEW_ALL_EQUIPMENT_PATH },
          ]),
          getEquipmentCatalogJsonLd(machines),
        ]}
      />

      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <Image
            src={rentalImages.subBanner}
            alt="Heavy equipment rental fleet available across Abu Dhabi and the UAE"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy/75" />
        </div>
        <div className="page-hero mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10 lg:py-28">
          <RentalBreadcrumbs items={breadcrumbItems} />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-amber sm:text-xs">
            Full rental fleet
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.08]">
            View All Equipment for Rent in Abu Dhabi &amp; UAE
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Browse {machineCount} machines and services — excavators, cranes,
            loaders, generators, buses, tankers, lifts and scaffolding — with
            daily, weekly and monthly hire across Abu Dhabi, Dubai and all seven
            emirates.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="equipment-catalog-heading"
        className="section-padding bg-white"
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-amber" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
                Complete Catalog
              </span>
            </div>
            <h2
              id="equipment-catalog-heading"
              className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl"
            >
              All machines for rent
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Jump to a category below or scroll the full list. Every card opens
              a dedicated page with specs, variants, hire terms and a direct
              quote request — mobilised from our Mussafah base across the UAE.
            </p>
          </div>

          <nav
            aria-label="Jump to equipment category"
            className="mt-8 -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="touch-target shrink-0 snap-start border border-navy/10 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-navy transition-colors hover:border-blue/30 hover:bg-white hover:text-blue sm:px-4 sm:text-sm"
              >
                {section.shortTitle}
              </a>
            ))}
          </nav>

          <div className="mt-10 space-y-14 sm:mt-12 sm:space-y-16 lg:space-y-20">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-24"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-2xl">
                    <h3
                      id={`${section.id}-heading`}
                      className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl"
                    >
                      {section.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {section.cards.length}{" "}
                      {section.cards.length === 1 ? "item" : "items"} available
                      for rent
                    </p>
                  </div>
                  {section.hubHref ? (
                    <Link
                      href={section.hubHref}
                      className="touch-target inline-flex items-center gap-1.5 self-start py-1 text-sm font-bold text-blue transition-colors hover:text-navy sm:self-auto"
                    >
                      View category
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>

                <ul className="mt-6 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                  {section.cards.map((card) => (
                    <li key={card.href}>
                      <RentalEquipmentCard
                        href={card.href}
                        title={card.title}
                        image={card.image}
                        imageAlt={card.imageAlt}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-navy/10 bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <h2 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
            Need equipment for your project?
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Tell us what you need — machine type, quantity, duration and site
            location — and our rental desk will confirm availability and pricing,
            usually within one business hour.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <QuoteButton className="touch-target inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-[#e0900d] sm:w-auto">
              Request a Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </QuoteButton>
            <Link
              href="/#contact"
              className="touch-target inline-flex w-full items-center justify-center gap-2 border border-navy/15 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-blue hover:text-blue sm:w-auto"
            >
              Contact Us
            </Link>
            <Link
              href="/equipment-rental"
              className="touch-target inline-flex w-full items-center justify-center gap-2 border border-navy/15 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-blue hover:text-blue sm:w-auto"
            >
              Browse by Category
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
