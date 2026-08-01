import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import QuoteButton from "@/components/QuoteButton";
import RentalBreadcrumbs from "@/components/rental/RentalBreadcrumbs";
import RentalEquipmentCard from "@/components/rental/RentalEquipmentCard";
import RentalMarqueeStrip from "@/components/rental/RentalMarqueeStrip";
import {
  getAllRentalSlugs,
  getPagesForHub,
  getRentalHub,
  getRentalHubPath,
  getRentalPage,
  getRentalPagePath,
  isRentalHub,
  rentalHubs,
  type RentalHub,
  type RentalPage,
} from "@/lib/rental-pages";
import { getBreadcrumbJsonLd, getRentalPageMetadata } from "@/lib/seo";

type RentalSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllRentalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: RentalSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hub = getRentalHub(slug);
  const page = getRentalPage(slug);

  if (hub) {
    return getRentalPageMetadata(hub.seo, getRentalHubPath(hub.slug));
  }
  if (page) {
    return getRentalPageMetadata(page.seo, getRentalPagePath(page.slug));
  }
  return {};
}

function getItemBreadcrumbItems(
  page: RentalPage,
  hub: RentalHub | undefined,
): { label: string; href?: string }[] {
  const isFamilyHub =
    page.layout === "bus-hub" || page.layout === "tanker-hub";
  const isFamilyVariant =
    page.layout === "bus-variant" || page.layout === "tanker-variant";
  const isFamilyPage = isFamilyHub || isFamilyVariant;
  const hubIsPage = hub?.slug === page.slug;

  const items: { label: string; href?: string }[] = [{ label: "Home", href: "/" }];

  if (hub && !(isFamilyHub && hubIsPage)) {
    items.push({
      label: hub.cardTitle,
      href: getRentalHubPath(hub.slug),
    });
  }

  if (page.familyRoot && isFamilyPage) {
    if (isFamilyVariant) {
      items.push({
        label: page.familyRoot.label,
        href: getRentalPagePath(page.familyRoot.slug),
      });
    }
    items.push({
      label:
        isFamilyHub && page.slug === page.familyRoot.slug
          ? page.familyRoot.label
          : page.cardTitle,
    });
  } else {
    items.push({ label: page.cardTitle });
  }

  return items;
}

function getItemBreadcrumbJsonLd(
  page: RentalPage,
  hub: RentalHub | undefined,
) {
  const items = getItemBreadcrumbItems(page, hub);
  return items.map((item, index) => ({
    name: item.label,
    path:
      item.href ??
      (index === items.length - 1 ? getRentalPagePath(page.slug) : "/"),
  }));
}

function RentalHubView({ slug }: { slug: string }) {
  const hub = getRentalHub(slug);
  if (!hub) notFound();

  const items = getPagesForHub(slug);

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: hub.cardTitle, path: getRentalHubPath(hub.slug) },
        ])}
      />

      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <Image
            src={hub.image}
            alt={hub.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
        </div>
        <div className="page-hero mx-auto max-w-[1400px] px-4 lg:py-28">
          <RentalBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: hub.cardTitle },
            ]}
          />
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {hub.seo.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {hub.intro}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <QuoteButton
              equipmentName={hub.title}
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

      <section className="section-padding border-t border-navy/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-amber" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
                Equipment List for Rent
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Browse {hub.cardTitle.toLowerCase()} equipment
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Select an equipment type for full details, available variants and
              rental information across Abu Dhabi, Dubai and the UAE.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <RentalEquipmentCard
                key={item.slug}
                slug={item.slug}
                title={item.cardTitle}
                image={item.image}
                imageAlt={item.imageAlt}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-navy/10 bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
            Other rental categories
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {rentalHubs
              .filter((other) => other.slug !== hub.slug)
              .map((other) => (
                <li key={other.slug}>
                  <Link
                    href={getRentalHubPath(other.slug)}
                    className="touch-target inline-flex items-center border border-navy/10 bg-white px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-navy/75 transition-colors hover:border-blue hover:text-blue"
                  >
                    {other.cardTitle}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function RentalItemHero({
  page,
  hub,
}: {
  page: RentalPage;
  hub: ReturnType<typeof getRentalHub>;
}) {
  const heroImage = page.heroBanner ?? page.image;

  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
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
          items={getItemBreadcrumbItems(page, hub)}
          align="center"
        />
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {page.heroTitle ?? page.seo.h1}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:mx-auto sm:text-lg">
          {page.intro}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <QuoteButton
            equipmentName={page.title}
            className="touch-target inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-white sm:w-auto"
          >
            Request a Quote
            <ArrowRight className="h-4 w-4" />
          </QuoteButton>
          {hub ? (
            <Link
              href={getRentalHubPath(hub.slug)}
              className="touch-target inline-flex w-full items-center justify-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              All {hub.cardTitle}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function RentalItemView({ slug }: { slug: string }) {
  const page = getRentalPage(slug);
  if (!page) notFound();

  const hub = getRentalHub(page.hubSlug);
  const related =
    page.relatedSlugs
      ?.map((s) => getRentalPage(s))
      .filter((p): p is NonNullable<typeof p> => p !== undefined) ?? [];

  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd(getItemBreadcrumbJsonLd(page, hub))} />

      <RentalItemHero page={page} hub={hub} />

      {page.layout === "bus-hub" || page.layout === "tanker-hub" ? (
        <>
          <section className="section-padding border-t border-navy/10 bg-white">
            <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <Image
                    src={page.image}
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
                    {page.body.slice(0, 2).map((paragraph, index) => (
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

          {page.body[2] ? (
            <section className="border-t border-navy/10 bg-slate-50 py-12 sm:py-16">
              <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
                <h2 className="text-center text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
                  {page.layout === "tanker-hub"
                    ? "Water Tanker Rental Abu Dhabi"
                    : "Passenger Bus Rental Abu Dhabi"}
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-slate-600">
                  {page.body[2]}
                </p>
              </div>
            </section>
          ) : null}

          {page.featureSections?.map((section, index) => (
            <section
              key={section.heading}
              className={`border-t border-navy/10 py-14 sm:py-16 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
            >
              <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
                <h2 className="text-center text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mx-auto mt-10 max-w-3xl space-y-6">
                  {section.items.map((item) => (
                    <div key={item.label}>
                      <h3 className="text-sm font-bold text-navy">
                        {item.label}
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

          {page.body[3] ? (
            <section className="border-t border-navy/10 bg-white py-14 sm:py-16">
              <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
                <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600">
                  {page.body[3]}
                </p>
              </div>
            </section>
          ) : null}

          {page.variantCards && page.variantCards.length > 0 ? (
            <section className="border-t border-navy/10 bg-slate-50 py-12 sm:py-16">
              <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {page.variantCards.map((card) => (
                    <RentalEquipmentCard
                      key={card.slug}
                      slug={card.slug}
                      title={card.title}
                      image={card.image}
                      imageAlt={card.imageAlt}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {page.layout === "bus-variant" || page.layout === "tanker-variant" ? (
        <>
          <section className="section-padding border-t border-navy/10 bg-white">
            <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
              <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <Image
                    src={page.image}
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
                  <QuoteButton
                    equipmentName={page.title}
                    className="touch-target mt-8 inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white sm:w-auto"
                  >
                    Request a Quote
                    <ArrowRight className="h-4 w-4" />
                  </QuoteButton>
                </div>
              </div>
            </div>
          </section>

          {page.otherProducts && page.otherProducts.length > 0 ? (
            <section className="border-t border-navy/10 bg-slate-50 py-12 sm:py-16">
              <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
                <h2 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
                  Other products
                </h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {page.otherProducts.map((card) => (
                    <RentalEquipmentCard
                      key={card.slug}
                      slug={card.slug}
                      title={card.title}
                      image={card.image}
                      imageAlt={card.imageAlt}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {!page.layout || page.layout === "default" ? (
        <section className="section-padding border-t border-navy/10 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-16">
              <div>
                <div className="relative mb-8 aspect-[16/10] overflow-hidden bg-navy lg:hidden">
                  <Image
                    src={page.image}
                    alt={page.imageAlt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div className="mb-8 border border-navy/10 bg-navy p-5 text-white sm:p-6 lg:hidden">
                  <h3 className="text-lg font-bold">Ready to hire?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    Call our 24/7 rental desk for availability, rates and
                    mobilisation across Abu Dhabi, Dubai and the UAE.
                  </p>
                  <QuoteButton
                    equipmentName={page.title}
                    className="touch-target mt-5 block w-full bg-amber py-3.5 text-center text-sm font-bold text-navy transition-colors hover:bg-white"
                  >
                    Get a Quote
                  </QuoteButton>
                </div>
                <p className="mb-5 text-base leading-relaxed text-slate-600">
                  {page.intro}
                </p>
                {page.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-5 text-base leading-relaxed text-slate-600 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
                {page.highlights.length > 0 ? (
                  <>
                    <h2 className="mt-10 text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
                      Why choose {page.cardTitle.toLowerCase()} rental with
                      Peakfront?
                    </h2>
                    <ul className="mt-6 space-y-3">
                      {page.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-3 text-sm leading-relaxed text-slate-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-amber" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
              <aside className="space-y-6">
                <div className="relative hidden aspect-[4/3] overflow-hidden bg-navy lg:block">
                  <Image
                    src={page.image}
                    alt={page.imageAlt}
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                </div>
                {page.variants && page.variants.length > 0 ? (
                  <div className="border border-navy/10 bg-slate-50 p-6">
                    <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-blue">
                      Available variants
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {page.variants.map((variant) => (
                        <li
                          key={variant}
                          className="border border-navy/10 bg-white px-3 py-2 text-sm font-medium text-navy"
                        >
                          {variant}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="hidden border border-navy/10 bg-navy p-6 text-white lg:block">
                  <h3 className="text-lg font-bold">Ready to hire?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    Call our 24/7 rental desk for availability, rates and
                    mobilisation across Abu Dhabi, Dubai and the UAE.
                  </p>
                  <QuoteButton
                    equipmentName={page.title}
                    className="touch-target mt-5 block w-full bg-amber py-3.5 text-center text-sm font-bold text-navy transition-colors hover:bg-white"
                  >
                    Get a Quote
                  </QuoteButton>
                </div>
              </aside>
            </div>
          </div>
        </section>
      ) : null}

      {page.marqueeText ? <RentalMarqueeStrip text={page.marqueeText} /> : null}

      {related.length > 0 &&
      page.layout !== "bus-variant" &&
      page.layout !== "tanker-variant" ? (
        <section className="border-t border-navy/10 bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <h2 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
              Related equipment for rent
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RentalEquipmentCard
                  key={item.slug}
                  slug={item.slug}
                  title={item.cardTitle}
                  image={item.image}
                  imageAlt={item.imageAlt}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-navy/10 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <h2 className="text-xl font-extrabold tracking-tight text-navy">
            Contact us now
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            Ready to elevate your project capabilities? Choose Peakfront for
            reliable {page.cardTitle.toLowerCase()} rental in Musaffah, Abu
            Dhabi and across the UAE. Request a quote and experience working
            with a trusted equipment partner.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <QuoteButton
              equipmentName={page.title}
              className="touch-target inline-flex w-full items-center justify-center gap-2 bg-navy px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue sm:w-auto"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </QuoteButton>
            <Link
              href="/#contact"
              className="touch-target inline-flex w-full items-center justify-center gap-2 border border-navy/15 px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-blue hover:text-blue sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function RentalSlugPage({ params }: RentalSlugPageProps) {
  const { slug } = await params;
  const page = getRentalPage(slug);

  if (isRentalHub(slug)) {
    if (page?.layout === "bus-hub" || page?.layout === "tanker-hub") {
      return <RentalItemView slug={slug} />;
    }
    return <RentalHubView slug={slug} />;
  }

  return <RentalItemView slug={slug} />;
}
