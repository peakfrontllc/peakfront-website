import EquipmentItemCard from "@/components/EquipmentItemCard";
import { featuredItems } from "@/lib/content";

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
            <EquipmentItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
