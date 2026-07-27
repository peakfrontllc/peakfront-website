import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import QuoteButton from "@/components/QuoteButton";
import { equipmentCategories } from "@/lib/content";

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

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {equipmentCategories.map((cat) => (
            <article
              key={cat.title}
              className="group flex flex-col overflow-hidden border border-navy/10 bg-white transition-all duration-500 hover:border-blue/40 hover:shadow-[0_24px_60px_-30px_rgba(11,37,69,0.35)]"
            >
              <div className="relative h-60 overflow-hidden bg-navy">
                <div className="relative h-full w-full transition-transform duration-[900ms] group-hover:scale-110">
                  <Image
                    src={cat.image}
                    alt={`${cat.title} rental fleet in the UAE`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <h3 className="absolute bottom-5 left-6 text-2xl font-extrabold tracking-tight text-white">
                  {cat.title}
                </h3>
              </div>
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
                <QuoteButton
                  equipmentName={cat.title}
                  className="mt-8 inline-flex items-center gap-2 self-start border-b-2 border-amber pb-1 text-sm font-bold text-navy transition-colors hover:text-blue"
                >
                  Request Quote
                  <ArrowUpRight className="h-4 w-4" />
                </QuoteButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
