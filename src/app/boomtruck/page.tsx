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
  BOOMTRUCK_PATH,
  boomtruckAnswer,
  boomtruckAreas,
  boomtruckFaqs,
  boomtruckImages,
  boomtruckReasons,
  boomtruckSeo,
  boomtruckServices,
  boomtruckSpotlights,
  boomtruckSteps,
  boomtruckWork,
  getBoomtruckPageJsonLd,
} from "@/lib/boomtruck-page";
import { companyStats } from "@/lib/stats";

const WHATSAPP_HREF = buildWhatsAppUrl(
  "Hello Peakfront, I need a boom truck crane for my project.",
);

const counters = [
  companyStats.unitsInNetwork,
  companyStats.emiratesCovered,
  companyStats.rentalDesk,
  companyStats.fastDelivery,
] as const;

const serviceLoop = [0, 1, 2] as const;

export const metadata: Metadata = {
  title: { absolute: boomtruckSeo.title },
  description: boomtruckSeo.description,
  keywords: [...boomtruckSeo.keywords],
  alternates: { canonical: BOOMTRUCK_PATH },
  openGraph: {
    title: boomtruckSeo.title,
    description: boomtruckSeo.description,
    url: BOOMTRUCK_PATH,
    type: "website",
    images: [
      {
        url: boomtruckImages.hero,
        alt: "White boom truck crane with a flatbed in Abu Dhabi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: boomtruckSeo.title,
    description: boomtruckSeo.description,
    images: [boomtruckImages.hero],
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

export default function BoomtruckPage() {
  return (
    <>
      <JsonLd data={getBoomtruckPageJsonLd()} />

      <section className="bg-navy lg:relative lg:flex lg:min-h-[92vh] lg:items-center lg:overflow-hidden">
        <div className="relative aspect-[3/2] max-h-[70vh] lg:absolute lg:inset-0 lg:aspect-auto lg:max-h-none">
          <Image
            src={boomtruckImages.hero}
            alt="White boom truck crane with a flatbed parked in Abu Dhabi"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-navy via-navy/75 to-navy/25 lg:block" />
        </div>
        <div className="relative mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-5 sm:py-12 lg:px-8 lg:py-28">
          <div className="max-w-xl">
            <RentalBreadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Boom Truck Rental" }]}
            />
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-amber">
              Boom truck crane rental UAE
            </p>
            <h1 className="mt-3 text-[1.65rem] font-extrabold uppercase leading-[1.12] tracking-tight text-white sm:text-5xl sm:leading-[1.05] lg:text-6xl">
              {boomtruckSeo.h1}
            </h1>
            <p id="boomtruck-answer" className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
              {boomtruckAnswer}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <QuoteButton
                equipmentName="Boom Truck"
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
            <div className="relative aspect-[3/2] overflow-hidden bg-navy shadow-xl">
              <Image
                src={boomtruckImages.blueCrane}
                alt="Blue boom truck with the knuckle boom crane unfolded over the bed"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber">Welcome to Peakfront</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-navy sm:text-4xl">
              About us
            </h2>
            <span className="mt-4 block h-1 w-16 bg-amber" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                <strong className="text-navy">{LEGAL_ENTITY_NAME}</strong> hires boom truck
                cranes with a flatbed. The knuckle boom lifts the load, and the bed carries
                it to the next site.
              </p>
              <p>
                Hire is from Mussafah, Abu Dhabi, for daily, weekly and monthly bookings.
                Lift weight and radius are confirmed on the quote. For people working at
                height, see{" "}
                <Link href="/manlift" className="font-semibold text-navy underline">
                  manlift rental
                </Link>
                .
              </p>
            </div>
            <div className="mt-8 flex items-center gap-5">
              <p className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 border-amber text-2xl font-extrabold text-navy">
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

      <section className="overflow-hidden bg-white py-8" aria-label="Boom truck services">
        <div className="animate-marquee flex w-max">
          {serviceLoop.map((copy) => (
            <div
              key={copy}
              className={`flex ${copy > 0 ? "pointer-events-none" : ""}`}
              aria-hidden={copy > 0}
            >
              {boomtruckServices.map((service) => (
                <Link
                  key={`${copy}-${service.title}`}
                  href={service.href}
                  tabIndex={copy > 0 ? -1 : undefined}
                  className="mx-3 flex w-36 flex-col items-center text-center sm:w-44"
                >
                  <span className="relative h-28 w-full overflow-hidden bg-navy">
                    <Image src={service.image} alt="" fill sizes="176px" className="object-cover object-center" />
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
            title="Boom truck cranes you can book"
            text="Send the load, the site and the dates. We confirm the truck before it leaves Mussafah."
          />
          <div className="mt-8 text-center">
            <QuoteButton
              equipmentName="Boom Truck"
              className="touch-target inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy hover:bg-navy hover:text-white sm:w-auto"
            >
              Get in touch with us
            </QuoteButton>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boomtruckServices.map((service) => (
              <article key={service.title} className="flex flex-col bg-white shadow-[0_8px_30px_rgba(11,37,69,0.08)]">
                <Link href={service.href} className="relative block aspect-[16/10] bg-navy">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
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
          src={boomtruckImages.blueFront}
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
            <h2 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-navy sm:text-4xl">
              How Peakfront handles the hire
            </h2>
            <span className="mt-4 block h-1 w-16 bg-amber" />
            <ul className="mt-6 space-y-4">
              {boomtruckReasons.map((reason) => (
                <li key={reason.title} className="border-b border-navy/10 pb-4">
                  <p className="font-bold text-navy">{reason.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{reason.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[3/2] overflow-hidden bg-navy shadow-xl">
            <Image
              src={boomtruckImages.whiteBed}
              alt="White boom truck crane with the crane folded behind the cab"
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
            title="Recent boom truck jobs"
            text="Flatbed boom truck cranes and generator lifts in Abu Dhabi."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boomtruckWork.map((photo) => (
              <figure key={photo.src} className="group relative aspect-[3/2] overflow-hidden bg-navy">
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
          <SectionHead kicker="Work process" title="How do you rent a boom truck crane?" />
          <ol className="mt-12 grid gap-8 lg:grid-cols-3">
            {boomtruckSteps.map((step, index) => (
              <li key={step.title} className="text-center">
                <p className="text-5xl font-extrabold text-amber">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-lg font-extrabold uppercase text-navy">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {boomtruckSpotlights.map((spotlight, index) => (
        <section
          key={spotlight.id}
          id={spotlight.id}
          className={`scroll-mt-24 py-16 sm:py-20 ${index % 2 === 0 ? "bg-[#f6f7f9]" : "bg-white"}`}
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 sm:px-5 lg:grid-cols-2 lg:gap-14 lg:px-8">
            <div className={`relative aspect-[3/2] overflow-hidden bg-navy shadow-lg ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <Image
                src={spotlight.image}
                alt={spotlight.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
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
                  className="touch-target inline-flex w-full items-center justify-center bg-amber px-5 py-3.5 text-sm font-bold uppercase text-navy hover:bg-navy hover:text-white sm:w-auto"
                >
                  Contact us
                </QuoteButton>
                <Link
                  href={spotlight.href}
                  className="touch-target inline-flex w-full items-center justify-center gap-2 border border-navy/20 px-5 py-3.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white sm:w-auto"
                >
                  {spotlight.linkLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="boomtruck-faq" className="scroll-mt-24 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-5">
          <SectionHead kicker="FAQ" title="Boom truck crane questions" />
          <div className="mt-10">
            {boomtruckFaqs.map((faq, index) => (
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

      <section id="boomtruck-contact" className="scroll-mt-24 bg-[#f6f7f9] py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-4 sm:px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber">Get in touch</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase text-navy sm:text-4xl">
              Book a boom truck crane
            </h2>
            <span className="mt-4 block h-1 w-16 bg-amber" />
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Send the load, the site and the dates. We cover {boomtruckAreas.join(", ")}.
            </p>
            <QuoteButton
              equipmentName="Boom Truck"
              className="touch-target mt-8 inline-flex w-full items-center justify-center gap-2 bg-amber px-7 py-3.5 text-sm font-bold uppercase text-navy hover:bg-navy hover:text-white sm:w-auto"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </QuoteButton>
          </div>
          <div className="grid gap-4">
            <a href={CONTACT.phoneHref} className="flex items-center gap-4 bg-white p-5 shadow-sm">
              <Phone className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Call us</span>
                <span className="font-bold text-navy">{CONTACT.phone}</span>
              </span>
            </a>
            <a href={CONTACT.emailHref} className="flex items-center gap-4 bg-white p-5 shadow-sm">
              <Mail className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Email us</span>
                <span className="break-all font-bold text-navy">{CONTACT.email}</span>
              </span>
            </a>
            <div className="flex items-center gap-4 bg-white p-5 shadow-sm">
              <MapPin className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
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
