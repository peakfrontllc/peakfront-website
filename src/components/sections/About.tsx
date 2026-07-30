import Image from "next/image";
import LicensedSection from "@/components/LicensedSection";
import { ABOUT_IMAGE, ABOUT_IMAGE_ALT } from "@/lib/content";
import { LEGAL_ENTITY_NAME } from "@/lib/license";
import { companyStats, getProjectStats } from "@/lib/stats";

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

export default function About() {
  const { contractsDeliveredLabel, projectsRunningLabel } = getProjectStats();

  const aboutStats = [
    companyStats.unitsInNetwork,
    {
      value: contractsDeliveredLabel,
      label: "Contracts delivered",
    },
    {
      value: projectsRunningLabel,
      label: "Projects running",
    },
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div>
          <div className="max-w-2xl">
            <SectionKicker label="About Peakfront" />
            <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              The foundational rental partner for UAE contractors
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {LEGAL_ENTITY_NAME} provides heavy equipment, transport
              vehicles, buses, generators, pumps and construction machinery
              across the UAE.
            </p>
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
            We work with trusted suppliers to provide reliable rental solutions
            for contractors, infrastructure projects, industrial facilities and
            commercial developments — combining depth of fleet with the
            responsiveness of a single accountable partner.
          </p>
          <div className="mt-10 grid gap-px border border-navy/10 bg-navy/10 sm:grid-cols-3">
            {aboutStats.map((stat) => (
              <div key={stat.label} className="bg-white p-6">
                <div className="font-mono text-2xl font-bold text-blue">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -bottom-5 -right-5 hidden h-full w-full border-2 border-amber/40 lg:block" />
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={ABOUT_IMAGE}
              alt={ABOUT_IMAGE_ALT}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-[1400px] px-5 lg:px-10">
        <LicensedSection variant="light" />
      </div>
    </section>
  );
}
