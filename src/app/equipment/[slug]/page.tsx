import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EquipmentItemCard from "@/components/EquipmentItemCard";
import JsonLd from "@/components/JsonLd";
import QuoteButton from "@/components/QuoteButton";
import {
  equipmentCategories,
  getCategoryBySlug,
  getEquipmentByCategory,
} from "@/lib/content";
import {
  getBreadcrumbJsonLd,
  getCategoryPageMetadata,
  getProductJsonLd,
} from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return equipmentCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return getCategoryPageMetadata(category);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const items = getEquipmentByCategory(slug);

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: category.title, path: `/equipment/${slug}` },
          ]),
          ...items.map(getProductJsonLd),
        ]}
      />

      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <Image
            src={category.image}
            alt={category.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 py-20 sm:px-5 lg:px-10 lg:py-28">
          <Link
            href="/#equipment"
            className="font-mono text-xs uppercase tracking-[0.18em] text-white/60 hover:text-amber"
          >
            ← All equipment
          </Link>
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {category.seo.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {category.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <QuoteButton
              equipmentName={category.title}
              className="inline-flex items-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-white"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" />
            </QuoteButton>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
                Available Fleet
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              {category.title} with indicative rental rates
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Rates exclude VAT and mobilisation. Operators, fuel and long-term
              discounts quoted on request.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <EquipmentItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-navy/10 bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
            Also available in this category
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {category.tags.map((tag) => (
              <li
                key={tag}
                className="border border-navy/10 bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-navy/75"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
