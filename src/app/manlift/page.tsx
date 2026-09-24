import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import QuoteButton from "@/components/QuoteButton";
import RentalBreadcrumbs from "@/components/rental/RentalBreadcrumbs";
import { buildWhatsAppUrl, CONTACT } from "@/lib/constants";
import { LEGAL_ENTITY_NAME } from "@/lib/license";
import {
  getManliftPageJsonLd,
  manliftAnswer,
  manliftAreas,
  manliftFaqs,
  manliftImages,
  manliftReasons,
  manliftSeo,
  manliftServices,
  manliftSpotlights,
  manliftSteps,
  manliftWork,
  MANLIFT_PATH,
} from "@/lib/manlift-page";
import { companyStats } from "@/lib/stats";

const WHATSAPP_HREF = buildWhatsAppUrl(
  "Hello Peakfront, I need a manlift for my project.",
);

const counters = [
  companyStats.unitsInNetwork,
  companyStats.emiratesCovered,
  companyStats.rentalDesk,
  companyStats.fastDelivery,
] as const;

const serviceLoop = [0, 1, 2] as const;

export const metadata: Metadata = {
  title: { absolute: manliftSeo.title },
  description: manliftSeo.description,
  keywords: [...manliftSeo.keywords],
  alternates: { canonical: MANLIFT_PATH },
  openGraph: {
    title: manliftSeo.title,
    description: manliftSeo.description,
    url: MANLIFT_PATH,
    type: "website",
    images: [{ url: manliftImages.truckReach, alt: "Truck-mounted manlift set up beside a solar lighting tower" }],
  },
  twitter: {
    card: "summary_large_image",
    title: manliftSeo.title,
    description: manliftSeo.description,
    images: [manliftImages.truckReach],
  },
  robots: { index: true, follow: true },
};

function SectionHead({
  kicker,
  title,
  text,
  light = false,
}: {
  kicker: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber">{kicker}</p>
      <h2
        className={`mt-2 text-2xl font-extrabold uppercase tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      <span className="mx-auto mt-4 block h-1 w-16 bg-amber" />
      {text ? (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/80" : "text-slate-600"}`}>
          {text}
        </p>
      ) : null}
    </div>
  );
}

export default function ManliftPage() {
  return (
    <>
      <JsonLd data={getManliftPageJsonLd()} />

      <section className="bg-navy lg:relative lg:flex lg:min-h-[92vh] lg:items-center lg:overflow-hidden">
        <div className="relative aspect-[3/4] max-h-[70vh] sm:aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto lg:max-h-none">
          <Image
            src={manliftImages.truckReach}
            alt="Truck-mounted manlift set up beside a solar lighting tower in Abu Dhabi"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 100vw"
            className="object-cover object-[center_55%] lg:object-[center_62%]"
          />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-navy via-navy/75 to-navy/25 lg:block" />
        </div>
        <div className="relative mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-5 sm:py-12 lg:px-8 lg:py-28">
          <div className="max-w-xl">
            <RentalBreadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Manlift Rental" }]}
            />
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-amber">
              Manlift rental UAE
            </p>
            <h1 className="mt-3 text-[1.65rem] font-extrabold uppercase leading-[1.12] tracking-tight text-white sm:text-5xl sm:leading-[1.05] lg:text-6xl">
              {manliftSeo.h1}
            </h1>
            <p id="manlift-answer" className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
              {manliftAnswer}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <QuoteButton
                equipmentName="Manlift"
                className="touch-target inline-flex w-full items-center justify-center gap-2 bg-amber px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-navy transition-colors hover:bg-white sm:w-auto"
              >
                Get a Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </QuoteButton>
              <a
                href={CONTACT.phoneHref}
                className="touch-target inline-flex w-full items-center justify-center gap-2 border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy sm:w-auto"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex w-full items-center justify-center gap-2 border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy sm:w-auto"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 sm:px-5 lg:grid-cols-2 lg:px-8">
          <div className="relative">
            <div className="absolute -left-4 top-6 hidden h-[88%] w-full bg-amber/90 sm:block" aria-hidden="true" />
            <div className="relative aspect-[4/3] overflow-hidden bg-navy shadow-xl">
              <Image
                src={manliftImages.truckReach}
                alt="Truck-mounted manlift set up beside a solar lighting tower"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_60%]"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber">Welcome to Peakfront</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase sm:text-4xl tracking-tight text-navy sm:text-4xl">
              About us
            </h2>
            <span className="mt-4 block h-1 w-16 bg-amber" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                <strong className="text-navy">{LEGAL_ENTITY_NAME}</strong> supplies manlifts,
                truck-mounted manlifts, boom lifts, scissor lifts and cherry pickers for
                construction, maintenance and industrial sites across the UAE.
              </p>
              <p>
                The machines are hired from Mussafah, Abu Dhabi. Daily, weekly and monthly
                bookings. Working height and basket load are confirmed on the quote.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-5">
              <p className="grid h-24 w-24 place-items-center rounded-full border-4 border-amber text-2xl font-extrabold text-navy">
                {companyStats.unitsInNetwork.value}
              </p>
              <p className="text-sm font-semibold text-navy">
                {companyStats.unitsInNetwork.label}
                <span className="mt-1 block font-normal text-slate-600">
                  Based in Mussafah, covering all seven emirates.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-[#f6f7f9] py-14">
        <dl className="mx-auto grid max-w-[1100px] grid-cols-2 gap-8 px-4 sm:px-5 lg:grid-cols-4">
          {counters.map((item) => (
            <div key={item.label} className="border-t-4 border-amber pt-4 text-center">
              <dd className="text-3xl font-extrabold text-navy sm:text-5xl">{item.value}</dd>
              <dt className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="overflow-hidden bg-white py-8" aria-label="Rental services">
        <div className="animate-marquee flex w-max">
          {serviceLoop.map((copy) => (
            <div
              key={copy}
              className={`flex ${copy > 0 ? "pointer-events-none" : ""}`}
              aria-hidden={copy > 0}
            >
              {manliftServices.map((service) => (
                <Link
                  key={`${copy}-${service.title}`}
                  href={service.href}
                  tabIndex={copy > 0 ? -1 : undefined}
                  className="mx-3 flex w-36 flex-col items-center text-center sm:w-44"
                >
                  <span className="relative h-28 w-full overflow-hidden bg-navy">
                    {service.image ? (
                      <Image src={service.image} alt="" fill sizes="176px" className="object-cover object-center" />
                    ) : null}
                  </span>
                  <span className="mt-2 text-xs font-bold uppercase tracking-wide text-navy">
                    {service.title}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="scroll-mt-24 bg-[#f6f7f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-5 lg:px-8">
          <SectionHead
            kicker="Our services"
            title="Access equipment you can book"
            text="Pick the machine, then send the height, the site and the dates."
          />
          <div className="mt-8 text-center">
            <QuoteButton
              equipmentName="Manlift"
              className="touch-target inline-flex items-center justify-center gap-2 bg-amber px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy hover:bg-navy hover:text-white"
            >
              Get in touch with us
            </QuoteButton>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {manliftServices.map((service) => (
              <article key={service.title} className="flex flex-col bg-white shadow-[0_8px_30px_rgba(11,37,69,0.08)]">
                <Link href={service.href} className="relative block aspect-[16/10] bg-navy">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className={service.fit === "contain" ? "object-contain p-4" : "object-cover object-center"}
                    />
                  ) : null}
                </Link>
                <div className="flex flex-1 flex-col px-5 py-6 text-center">
                  <h3 className="text-lg font-extrabold uppercase text-navy">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{service.text}</p>
                  <QuoteButton
                    equipmentName={service.equipmentName}
                    className="mt-4 text-sm font-bold uppercase tracking-wide text-amber hover:text-navy"
                  >
                    Contact us
                  </QuoteButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-16 text-white">
        <Image
          src={manliftImages.latticeWide}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative mx-auto grid max-w-[1100px] gap-8 px-4 text-center sm:grid-cols-3 sm:px-5">
          {["24/7 rental desk", "Fast UAE delivery", "Day, week or month"].map((item) => (
            <p key={item} className="text-lg font-extrabold uppercase tracking-[0.12em]">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 sm:px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber">Our commitment</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase sm:text-4xl tracking-tight text-navy sm:text-4xl">
              How Peakfront handles the hire
            </h2>
            <span className="mt-4 block h-1 w-16 bg-amber" />
            <ul className="mt-6 space-y-4">
              {manliftReasons.map((reason) => (
                <li key={reason.title} className="border-b border-navy/10 pb-4">
                  <p className="font-bold text-navy">{reason.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{reason.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden bg-navy shadow-xl sm:aspect-[4/5]">
            <Image
              src={manliftImages.truckTower}
              alt="Truck-mounted manlift boom raised beside a solar lighting tower"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section id="latest-projects" className="scroll-mt-24 bg-[#f6f7f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-5 lg:px-8">
          <SectionHead
            kicker="Our work"
            title="Recent tower and mast jobs"
            text="Lattice towers, a monopole mast and a solar lighting tower in Abu Dhabi."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {manliftWork.map((photo) => (
              <figure key={photo.src} className="group relative aspect-[3/4] overflow-hidden bg-navy">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/80 to-transparent px-4 py-5 text-white">
                  <p className="text-sm font-bold uppercase">{photo.caption}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/70">{photo.place}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-5 lg:px-8">
          <SectionHead kicker="Work process" title="How do you rent a manlift?" />
          <ol className="mt-12 grid gap-8 lg:grid-cols-3">
            {manliftSteps.map((step, index) => (
              <li key={step.title} className="text-center">
                <p className="text-5xl font-extrabold text-amber">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-lg font-extrabold uppercase text-navy">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {manliftSpotlights.map((spotlight, index) => (
        <section
          key={spotlight.id}
          id={spotlight.id}
          className={`scroll-mt-24 py-16 sm:py-20 ${index % 2 === 0 ? "bg-[#f6f7f9]" : "bg-white"}`}
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 sm:px-5 lg:grid-cols-2 lg:gap-14 lg:px-8">
            <div className={`relative aspect-[3/4] overflow-hidden bg-navy shadow-lg ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <Image
                src={spotlight.image}
                alt={spotlight.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={spotlight.fit === "contain" ? "object-contain p-8" : "object-cover object-center"}
              />
            </div>
            <div className={index % 2 === 1 ? "lg:order-1" : ""}>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber">
                {String(index + 1).padStart(2, "0")} — services
              </p>
              <h2 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-navy sm:text-4xl">
                {spotlight.title}
              </h2>
              <span className="mt-4 block h-1 w-16 bg-amber" />
              <div className="mt-5 space-y-4">
                {spotlight.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
              <ul className="mt-5 space-y-2">
                {spotlight.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <QuoteButton
                  equipmentName={spotlight.equipmentName}
                  className="touch-target inline-flex items-center justify-center bg-amber px-5 py-3.5 text-sm font-bold uppercase text-navy hover:bg-navy hover:text-white"
                >
                  Contact us
                </QuoteButton>
                <Link
                  href={spotlight.href}
                  className="touch-target inline-flex items-center justify-center gap-2 border border-navy/20 px-5 py-3.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
                >
                  {spotlight.linkLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="manlift-faq" className="scroll-mt-24 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-5">
          <SectionHead kicker="FAQ" title="Manlift rental questions" />
          <div className="mt-10">
            {manliftFaqs.map((faq, index) => (
              <details key={faq.question} className="group border-b border-navy/10">
                <summary className="flex cursor-pointer list-none items-start gap-4 py-5 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-extrabold text-amber">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="min-w-0 flex-1 text-base font-bold text-navy">{faq.question}</h3>
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-slate-400 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pb-5 pl-10 text-sm leading-relaxed text-slate-600 sm:pl-12">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="manlift-contact" className="scroll-mt-24 bg-[#f6f7f9] py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-4 sm:px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber">Get in touch</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase sm:text-4xl text-navy sm:text-4xl">Book a manlift</h2>
            <span className="mt-4 block h-1 w-16 bg-amber" />
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Send the height, the site and the dates. We cover {manliftAreas.join(", ")}.
            </p>
            <QuoteButton
              equipmentName="Manlift"
              className="touch-target mt-8 inline-flex items-center justify-center gap-2 bg-amber px-7 py-3.5 text-sm font-bold uppercase text-navy hover:bg-navy hover:text-white"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </QuoteButton>
          </div>
          <div className="grid gap-4">
            <a href={CONTACT.phoneHref} className="flex items-center gap-4 bg-white p-5 shadow-sm">
              <Phone className="h-5 w-5 text-amber" aria-hidden="true" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Call us</span>
                <span className="font-bold text-navy">{CONTACT.phone}</span>
              </span>
            </a>
            <a href={CONTACT.emailHref} className="flex items-center gap-4 bg-white p-5 shadow-sm">
              <Mail className="h-5 w-5 text-amber" aria-hidden="true" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Email us</span>
                <span className="font-bold text-navy">{CONTACT.email}</span>
              </span>
            </a>
            <div className="flex items-center gap-4 bg-white p-5 shadow-sm">
              <MapPin className="h-5 w-5 text-amber" aria-hidden="true" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Location</span>
                <span className="font-bold text-navy">Mussafah, M-17, Abu Dhabi</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
