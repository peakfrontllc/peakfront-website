import Image from "next/image";
import { MessageCircle } from "lucide-react";
import QuoteButton from "@/components/QuoteButton";
import { featuredItems } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/constants";

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

export default function FeaturedEquipment() {
  return (
    <section
      id="featured"
      className="section-padding border-t border-navy/10 bg-slate-50"
    >
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="max-w-2xl">
          <SectionKicker label="Featured Equipment" />
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Available now with indicative rental rates
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Rates shown exclude VAT and mobilisation. Operators, fuel and
            long-term discounts quoted on request.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((item) => (
            <article
              key={item.name}
              className="group flex flex-col border border-navy/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-32px_rgba(11,37,69,0.4)]"
            >
              <div className="relative h-44 overflow-hidden bg-navy">
                <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <span className="absolute left-4 top-4 bg-amber px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-navy">
                  Available
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue">
                  {item.category}
                </span>
                <h3 className="mt-2 text-lg font-bold leading-snug text-navy">
                  {item.name}
                </h3>
                <dl className="mt-4 space-y-1.5 border-y border-slate-100 py-4">
                  {item.specs.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-3 text-xs"
                    >
                      <dt className="text-slate-500">{key}</dt>
                      <dd className="font-mono font-medium text-navy">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <dl className="mt-4 space-y-1.5">
                  {item.rates.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-3 text-xs"
                    >
                      <dt className="uppercase tracking-wider text-slate-500">
                        {key}
                      </dt>
                      <dd className="font-mono font-bold text-navy">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 space-y-2">
                  <QuoteButton
                    equipmentName={item.name}
                    className="block w-full bg-navy py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue min-h-11"
                  >
                    Request Quote
                  </QuoteButton>
                  <a
                    href={buildWhatsAppUrl(
                      `Hello Peakfront, I need equipment for my project. Item: ${item.name}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full min-h-11 items-center justify-center gap-2 border border-navy/15 py-3.5 text-xs font-bold uppercase tracking-wider text-navy transition-colors hover:border-whatsapp hover:text-whatsapp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
