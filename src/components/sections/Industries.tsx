import { industries } from "@/lib/content";

function SectionKicker({ label, centered }: { label: string; centered?: boolean }) {
  return (
    <div
      className={`mb-4 flex items-center gap-3 ${centered ? "justify-center" : ""}`}
    >
      <span className="h-[2px] w-8 bg-amber" />
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
        {label}
      </span>
    </div>
  );
}

export default function Industries() {
  return (
    <section id="industries" className="section-padding bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionKicker label="Industries Served" centered />
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Powering the sectors that build the UAE
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="group flex flex-col items-center gap-4 border border-navy/10 bg-white px-4 py-10 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber/60 hover:shadow-xl hover:shadow-navy/5"
            >
              <industry.icon className="h-7 w-7 text-blue transition-colors group-hover:text-amber" />
              <span className="text-sm font-bold text-navy">{industry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
