import type { MetadataRoute } from "next";
import { equipmentCategories } from "@/lib/content";
import { getAllRentalSlugs, getRentalPagePath } from "@/lib/rental-pages";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const equipmentPages = equipmentCategories.map((category) => ({
    url: `${SITE_URL}/equipment/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const rentalPages = [
    {
      url: `${SITE_URL}/equipment-rental`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.95,
    },
    ...getAllRentalSlugs().map((slug) => ({
      url: `${SITE_URL}${getRentalPagePath(slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...rentalPages,
    ...equipmentPages,
    {
      url: `${SITE_URL}/our-project`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/scaffolding-suppliers-abu-dhabi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/downloads`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
