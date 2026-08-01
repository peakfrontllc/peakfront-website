import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import QuoteButton from "@/components/QuoteButton";
import RentalEquipmentCard from "@/components/rental/RentalEquipmentCard";
import { equipmentCategories, getCategoryPath } from "@/lib/content";
import { getEquipmentBrowseCards } from "@/lib/rental-pages";

function SectionKicker({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-[2px] w-8 bg-amber" />
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
        {label}
      </span>
    </div>
  );
}

export default function EquipmentMatrix() {
  return (
    <section id="equipment" className="section-padding border-t border-navy/10 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="max-w-2xl">
          <SectionKicker label="The Equipment Matrix" />
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            A complete fleet for every phase of your project
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Earthmoving, haulage, staff mobility and site power — sourced
            through a vetted supplier network and delivered where the work is.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {equipmentCategories.map((cat) => (
            <article
              key={cat.slug}
              className="group flex flex-col overflow-hidden border border-navy/10 bg-white transition-all duration-500 hover:border-blue/40 hover:shadow-[0_24px_60px_-30px_rgba(11,37,69,0.35)]"
            >
              <Link
                href={getCategoryPath(cat.slug)}
                className="relative block h-60 overflow-hidden bg-navy"
              >
                <div className="relative h-full w-full transition-transform duration-[900ms] group-hover:scale-110">
                  <Image
                    src={cat.image}
                    alt={cat.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <h3 className="absolute bottom-5 left-6 text-2xl font-extrabold tracking-tight text-white">
                  {cat.title}
                </h3>
              </Link>
              <div className="flex flex-1 flex-col p-7">
                <p className="text-sm leading-relaxed text-slate-600">
                  {cat.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {cat.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-navy/10 bg-slate-50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-navy/75"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href={getCategoryPath(cat.slug)}
                    className="touch-target inline-flex w-full items-center justify-center gap-2 border border-navy/15 bg-slate-50 px-5 py-3 text-sm font-bold text-navy transition-colors hover:border-blue hover:text-blue sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pb-1 sm:border-b-2 sm:border-navy/20"
                  >
                    View {cat.title}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <QuoteButton
                    equipmentName={cat.title}
                    className="touch-target inline-flex w-full items-center justify-center gap-2 bg-amber px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white sm:w-auto sm:bg-transparent sm:px-0 sm:py-0 sm:pb-1 sm:text-navy sm:hover:text-blue sm:border-b-2 sm:border-amber"
                  >
                    Request Quote
                    <ArrowUpRight className="h-4 w-4" />
                  </QuoteButton>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div id="equipment-list" className="mt-20 border-t border-navy/10 pt-16">
          <div className="max-w-2xl">
            <SectionKicker label="Equipment List for Rent" />
            <h3 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Browse equipment categories
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Select a category to browse equipment — each links to a full list
              with sub-types, variants and rental details. Scaffolding services
              are also available across Abu Dhabi and the UAE.
            </p>
            <Link
              href="/equipment-rental"
              className="touch-target mt-5 inline-flex items-center gap-2 py-1 text-sm font-bold text-blue transition-colors hover:text-navy"
            >
              View full equipment list
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
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
      </div>
    </section>
  );
}
