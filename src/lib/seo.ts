import { CONTACT } from "@/lib/constants";

// TODO: Set NEXT_PUBLIC_SITE_URL to your production domain before launch.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://peakfront.ae";

export const siteConfig = {
  name: "Peakfront Equipment Rental LLC",
  shortName: "Peakfront",
  title: "Heavy Equipment Rental UAE | Peakfront Equipment Rental LLC, Abu Dhabi",
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

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: SITE_URL,
    image: `${SITE_URL}${siteConfig.ogImage}`,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mussafah Industrial Area, M-17",
      addressLocality: "Abu Dhabi",
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
    sameAs: [
      "https://www.facebook.com/profile.php?id=61592219567182",
      "https://www.linkedin.com",
      "https://www.instagram.com/peakfrontae/",
    ],
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteConfig.name,
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
