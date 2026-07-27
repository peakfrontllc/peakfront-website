import { timelineSteps } from "@/lib/content";

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

export default function Timeline() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="max-w-2xl">
          <SectionKicker label="The Logistics Timeline" />
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Four steps from enquiry to equipment on site
          </h2>
        </div>

        <div className="relative mt-16 max-w-3xl">
          <div className="absolute bottom-3 left-[27px] top-3 w-[2px] bg-navy/10" />
          {timelineSteps.map((step) => (
            <div
              key={step.step}
              className="relative flex gap-7 pb-12 last:pb-0"
            >
              <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center bg-navy text-white shadow-lg shadow-navy/20">
                <step.icon className="h-6 w-6 text-amber" />
              </div>
              <div className="pt-1">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
                  {step.step}
                </span>
                <h3 className="mt-2 text-xl font-bold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
