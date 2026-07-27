import { whyItems } from "@/lib/content";

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

export default function WhyPeakfront() {
  return (
    <section id="why" className="section-padding relative overflow-hidden bg-navy">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="max-w-2xl">
          <SectionKicker label="Why Peakfront" />
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Built on precision, uptime and accountability
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Contractors return to Peakfront because the equipment arrives on
            time, works as specified, and is backed by people who answer the
            phone.
          </p>
        </div>

        <div className="mt-16 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item) => (
            <div
              key={item.title}
              className="group bg-navy p-8 transition-colors duration-500 hover:bg-[#0d2c53]"
            >
              <item.icon className="h-6 w-6 text-blue transition-colors duration-300 group-hover:text-amber" />
              <h3 className="mt-6 text-base font-bold leading-snug text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
