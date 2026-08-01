import Image from "next/image";
import { CircleCheckBig, Globe, Mail, MapPin, Phone } from "lucide-react";
import CapSectionHead from "@/components/capability-statement/CapSectionHead";
import {
  companyStrengths,
  coreCapabilities,
  equipmentCategories,
  industriesServed,
  OVERVIEW,
  TAGLINE,
  whyPeakfront,
} from "@/components/capability-statement/data";
import { CONTACT } from "@/lib/constants";
import { LEGAL_ENTITY_NAME } from "@/lib/license";
import { SITE_URL } from "@/lib/seo";

export default function CapabilityStatement() {
  return (
    <article
      className="capability-statement-page mx-auto flex h-[297mm] min-h-[297mm] w-[210mm] flex-col overflow-hidden bg-white shadow-[0_12px_40px_rgba(11,37,69,0.12)] print:shadow-none"
      aria-label="Peakfront Equipment Rental capability statement"
    >
      <header className="relative shrink-0 bg-navy text-white">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
          sizes="210mm"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/82 to-navy/55"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-[1fr_auto] gap-[6mm] px-[10mm] pb-[6mm] pt-[9mm]">
          <div>
            <Image
              src="/logo-light.svg"
              alt="Peakfront"
              width={200}
              height={48}
              className="mb-[3.5mm] h-[12mm] w-auto"
              priority
            />
            <h1 className="font-display max-w-[118mm] text-[16pt] font-extrabold leading-[1.12]">
              {LEGAL_ENTITY_NAME}
            </h1>
            <p className="mt-[2.5mm] max-w-[118mm] text-[8pt] font-medium uppercase tracking-[0.14em] text-amber">
              {TAGLINE}
            </p>
            <p className="mt-[3mm] flex items-start gap-1 text-[7.5pt] leading-snug text-white/75">
              <MapPin className="mt-[0.5mm] h-3 w-3 shrink-0 text-blue" aria-hidden="true" />
              {CONTACT.address}
            </p>
          </div>

          <address className="min-w-[54mm] not-italic">
            <div className="grid gap-[2.5mm]">
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-[2mm] rounded-md border border-white/15 bg-white/5 px-[2.5mm] py-[2.5mm] text-[7.5pt] text-white/90"
              >
                <Phone className="h-3 w-3 shrink-0 text-amber" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.emailHref}
                className="flex items-center gap-[2mm] rounded-md border border-white/15 bg-white/5 px-[2.5mm] py-[2.5mm] text-[7.5pt] text-white/90"
              >
                <Mail className="h-3 w-3 shrink-0 text-amber" aria-hidden="true" />
                {CONTACT.email}
              </a>
              <a
                href={SITE_URL}
                className="flex items-center gap-[2mm] rounded-md border border-white/15 bg-white/5 px-[2.5mm] py-[2.5mm] text-[7.5pt] text-white/90"
              >
                <Globe className="h-3 w-3 shrink-0 text-amber" aria-hidden="true" />
                www.peakfront.ae
              </a>
            </div>
          </address>
        </div>

        <div className="relative z-10 border-t border-white/10 px-[10mm] py-[3mm]">
          <p className="text-center text-[7pt] font-medium tracking-wide text-white/70">
            Construction equipment rental across all seven emirates
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <section
          className="shrink-0 border-b border-slate-100 px-[10mm] py-[5mm]"
          aria-labelledby="cap-overview"
        >
          <CapSectionHead eyebrow="Company Overview" title="Your equipment rental partner in the UAE" />
          <p
            id="cap-overview"
            className="text-[8pt] leading-[1.5] text-slate-600"
          >
            {OVERVIEW}
          </p>
        </section>

        <div className="grid min-h-0 flex-[1.1] grid-cols-2 gap-x-[5mm] px-[10mm] py-[5mm]">
          <section className="flex min-h-0 flex-col" aria-labelledby="cap-capabilities">
            <CapSectionHead eyebrow="Core Capabilities" title="End-to-end rental support" />
            <ul className="grid min-h-0 flex-1 grid-cols-2 grid-rows-5 gap-[2.5mm]">
              {coreCapabilities.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex h-full items-center gap-[2mm] rounded-md border border-slate-200 bg-slate-50/80 px-[2.5mm] py-[2mm] shadow-sm"
                >
                  <span className="grid h-[5.5mm] w-[5.5mm] shrink-0 place-items-center rounded bg-navy/5">
                    <Icon className="h-[3.2mm] w-[3.2mm] text-blue" aria-hidden="true" />
                  </span>
                  <span className="text-[7pt] font-semibold leading-snug text-navy">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex min-h-0 flex-col" aria-labelledby="cap-equipment">
            <CapSectionHead
              eyebrow="Equipment Categories"
              title="Plant available for hire"
              aside="Excavators to buses — one coordinated supplier."
            />
            <ul className="grid min-h-0 flex-1 grid-cols-3 grid-rows-6 gap-[2.2mm]">
              {equipmentCategories.map((item) => (
                <li
                  key={item}
                  className="flex h-full items-center justify-center rounded-md border border-slate-200 bg-white px-[2mm] py-[2mm] text-center text-[6.8pt] font-medium text-navy shadow-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid min-h-0 flex-[1.15] grid-cols-[42%_58%] gap-x-[5mm] border-t border-slate-100 px-[10mm] py-[5mm]">
          <section className="flex min-h-0 flex-col" aria-labelledby="cap-industries">
            <CapSectionHead eyebrow="Industries Served" title="Sectors we support" />
            <ul className="flex flex-wrap gap-[2mm]">
              {industriesServed.map((industry) => (
                <li
                  key={industry}
                  className="rounded-full border border-blue/20 bg-blue/5 px-[3mm] py-[1.2mm] text-[6.5pt] font-semibold text-navy"
                >
                  {industry}
                </li>
              ))}
            </ul>

            <div className="mt-[5mm] flex min-h-0 flex-1 flex-col">
              <CapSectionHead eyebrow="Company Strengths" title="What sets us apart" />
              <ul className="flex min-h-0 flex-1 flex-col justify-between py-[1mm]">
                {companyStrengths.map((strength) => (
                  <li
                    key={strength}
                    className="flex gap-[2mm] text-[7pt] leading-snug text-slate-600"
                  >
                    <CircleCheckBig
                      className="mt-[0.3mm] h-[3mm] w-[3mm] shrink-0 text-blue"
                      aria-hidden="true"
                    />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="flex min-h-0 flex-col" aria-labelledby="cap-why">
            <CapSectionHead
              eyebrow="Why Peakfront"
              title="Built for contractors and procurement teams"
            />
            <ul className="grid min-h-0 flex-1 grid-cols-2 grid-rows-4 gap-[2.5mm]">
              {whyPeakfront.map(({ title, description, icon: Icon }) => (
                <li
                  key={title}
                  className="flex h-full flex-col justify-center rounded-md border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-[3mm] py-[2.5mm] shadow-sm"
                >
                  <div className="flex items-center gap-[2mm]">
                    <span className="grid h-[5.5mm] w-[5.5mm] place-items-center rounded bg-navy text-white">
                      <Icon className="h-[3.2mm] w-[3.2mm]" aria-hidden="true" />
                    </span>
                    <h3 className="text-[7.5pt] font-bold text-navy">{title}</h3>
                  </div>
                  <p className="mt-[1.5mm] text-[6.8pt] leading-snug text-slate-500">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <footer className="mt-auto shrink-0 border-t-2 border-navy bg-navy px-[10mm] py-[5mm] text-white">
        <div className="flex items-end justify-between gap-[6mm]">
          <div>
            <p className="font-display text-[10pt] font-extrabold tracking-wide">
              PEAKFRONT
            </p>
            <p className="mt-[1mm] text-[6.5pt] text-white/60">
              {LEGAL_ENTITY_NAME} · Abu Dhabi, UAE
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-x-[5mm] gap-y-[1mm] text-[7pt] text-white/85">
            <span>www.peakfront.ae</span>
            <span>{CONTACT.email}</span>
            <span>{CONTACT.phone}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
