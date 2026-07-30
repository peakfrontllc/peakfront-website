import type { EquipmentItem } from "@/lib/content";
import { CONTACT } from "@/lib/constants";
import { LEGAL_ENTITY_NAME } from "@/lib/license";

// TODO: Set NEXT_PUBLIC_SITE_URL to your production domain before launch.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://peakfront.ae";

export const siteConfig = {
  name: LEGAL_ENTITY_NAME,
  shortName: "Peakfront",
  title: "Heavy Equipment Rental UAE | Peakfront Equipment Rental LLC SPC, Abu Dhabi",
  description:
    "Heavy equipment, transport, buses and power equipment rental across the UAE. Fast delivery, competitive pricing, 24/7 support. Based in Mussafah, Abu Dhabi.",
  keywords: [
    "heavy equipment rental UAE",
    "equipment rental Abu Dhabi",
    "excavator rental Dubai",
    "construction equipment hire UAE",
    "transport rental Mussafah",
    "generator rental Abu Dhabi",
    "bus rental UAE",
    "Peakfront Equipment Rental",
  ],
  locale: "en_AE",
  ogImage: "/images/hero.webp",
  twitterHandle: "@peakfront",
} as const;

const SOCIAL_PROFILES = [
  "https://www.facebook.com/profile.php?id=61592219567182",
  "https://www.instagram.com/peakfrontae/",
  "https://www.tiktok.com/@peakfrontae",
  "https://www.youtube.com/@peakfrontae",
] as const;

export function parseDailyRateAed(
  rates: readonly [string, string][],
): number | undefined {
  const daily = rates.find(([label]) => label.toLowerCase() === "daily");
  if (!daily) return undefined;

  const match = daily[1].match(/[\d,]+/);
  if (!match) return undefined;

  return Number.parseInt(match[0].replace(/,/g, ""), 10);
}

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: LEGAL_ENTITY_NAME,
    legalName: LEGAL_ENTITY_NAME,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: SITE_URL,
    image: `${SITE_URL}${siteConfig.ogImage}`,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mussafah Industrial Area, M-17",
      addressLocality: "Abu Dhabi",
      addressRegion: "Abu Dhabi",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.3635,
      longitude: 54.4834,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "07:00",
        closes: "19:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "United Arab Emirates",
    },
    priceRange: "$$",
    sameAs: [...SOCIAL_PROFILES],
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: LEGAL_ENTITY_NAME,
    description: siteConfig.description,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-AE",
  };
}

export function getFaqJsonLd(
  faqs: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getProductJsonLd(item: EquipmentItem) {
  const dailyRate = parseDailyRateAed(item.rates);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/equipment/${item.categorySlug}#${item.id}`,
    name: item.name,
    description: `${item.name} rental in Abu Dhabi and across the UAE. ${item.category} available for daily, weekly and monthly hire.`,
    category: item.category,
    image: `${SITE_URL}${item.image}`,
    brand: {
      "@type": "Brand",
      name: siteConfig.shortName,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/equipment/${item.categorySlug}`,
      priceCurrency: "AED",
      ...(dailyRate !== undefined ? { price: dailyRate } : {}),
      priceSpecification: dailyRate
        ? {
            "@type": "UnitPriceSpecification",
            price: dailyRate,
            priceCurrency: "AED",
            unitText: "DAY",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: 1,
              unitCode: "DAY",
            },
          }
        : undefined,
      availability: "https://schema.org/InStock",
      seller: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  };
}

export function getBreadcrumbJsonLd(
  items: readonly { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function getCategoryPageMetadata(category: {
  slug: string;
  seo: { title: string; description: string };
}) {
  return {
    title: category.seo.title,
    description: category.seo.description,
    alternates: {
      canonical: `/equipment/${category.slug}`,
    },
    openGraph: {
      title: category.seo.title,
      description: category.seo.description,
      url: `/equipment/${category.slug}`,
    },
  };
}
