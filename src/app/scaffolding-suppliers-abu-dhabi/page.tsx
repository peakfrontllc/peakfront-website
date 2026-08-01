import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import QuoteButton from "@/components/QuoteButton";
import RentalBreadcrumbs from "@/components/rental/RentalBreadcrumbs";
import RentalMarqueeStrip from "@/components/rental/RentalMarqueeStrip";
import { scaffoldingService } from "@/lib/service-pages";
import { getBreadcrumbJsonLd, getRentalPageMetadata } from "@/lib/seo";

const page = scaffoldingService;

export const metadata: Metadata = getRentalPageMetadata(page.seo, page.path);

export default function ScaffoldingSuppliersPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: page.cardTitle, path: page.path },
        ])}
      />

      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <Image
            src={page.heroBanner}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
        </div>
        <div className="page-hero mx-auto max-w-[1400px] px-4 text-left sm:text-center lg:py-24">
          <RentalBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: page.cardTitle },
            ]}
            align="center"
          />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {page.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:mx-auto sm:text-lg">
            {page.seo.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <QuoteButton
              equipmentName="Scaffolding"
              className="touch-target inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-white sm:w-auto"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </QuoteButton>
            <Link
              href="/#contact"
              className="touch-target inline-flex w-full items-center justify-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <RentalMarqueeStrip text={page.marqueeText} />

      <section className="section-padding border-t border-navy/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden bg-navy">
              <Image
                src={page.mainImage}
                alt={page.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                {page.seo.h1}
              </h2>
              <div className="mt-6 space-y-5">
                {page.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-slate-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-navy/10 bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden bg-navy lg:order-2">
              <Image
                src={page.secondaryImage}
                alt={page.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="lg:order-1">
              <p className="text-base leading-relaxed text-slate-600">
                Scaffolding is a fundamental part of safe construction and
                maintenance work in the UAE. Peakfront supports contractors with
                reliable supply and site-ready systems — request a quote for your
                next project in Abu Dhabi, Dubai or Sharjah.
              </p>
              <QuoteButton
                equipmentName="Scaffolding"
                className="touch-target mt-8 inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white sm:w-auto"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </QuoteButton>
            </div>
          </div>
        </div>
      </section>

      {page.featureSections.map((section, index) => (
        <section
          key={section.heading}
          className={`border-t border-navy/10 py-14 sm:py-16 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
        >
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <h2 className="text-center text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
              {section.heading}
            </h2>
            <div className="mx-auto mt-10 max-w-3xl space-y-6">
              {section.items.map((item, itemIndex) => (
                <div key={item.label}>
                  <h3 className="text-sm font-bold text-navy">
                    {itemIndex + 1}. {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-navy/10 bg-navy py-14 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-5 text-center lg:px-10">
          <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            Need scaffolding for your site?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            Contact Peakfront for scaffolding supply and rental support across
            the UAE. Share your project scope, height requirements and schedule
            — our team will respond quickly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <QuoteButton
              equipmentName="Scaffolding"
              className="touch-target inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-white sm:w-auto"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" />
            </QuoteButton>
            <Link
              href="/#contact"
              className="touch-target inline-flex w-full items-center justify-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
