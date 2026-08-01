export type ServiceSeo = {
  title: string;
  description: string;
  h1: string;
};

export type ServiceFeatureSection = {
  heading: string;
  items: { label: string; text: string }[];
};

export type ServicePage = {
  slug: string;
  path: string;
  cardTitle: string;
  heroTitle: string;
  heroBanner: string;
  mainImage: string;
  secondaryImage: string;
  imageAlt: string;
  marqueeText: string;
  seo: ServiceSeo;
  body: string[];
  featureSections: ServiceFeatureSection[];
};

export const scaffoldingService: ServicePage = {
  slug: "scaffolding-suppliers-abu-dhabi",
  path: "/scaffolding-suppliers-abu-dhabi",
  cardTitle: "Scaffolding",
  heroTitle: "Scaffolding Suppliers Abu Dhabi",
  heroBanner: "/images/services/scaffolding-sub-banner.webp",
  mainImage: "/images/services/service-scaffolding.webp",
  secondaryImage: "/images/services/service-scaffolding1.webp",
  imageAlt: "Scaffolding structures on a construction site in Abu Dhabi",
  marqueeText: "Scaffolding Suppliers Abu Dhabi, Dubai, Sharjah",
  seo: {
    title: "Scaffolding Suppliers Abu Dhabi | Peakfront",
    description:
      "Scaffolding supply, erection and dismantling for construction and maintenance projects in Abu Dhabi and across the UAE. Safe, compliant access at height.",
    h1: "Scaffolding Suppliers Abu Dhabi",
  },
  body: [
    "Scaffolding services provide temporary access structures for construction, renovation, maintenance and repair work at height. Peakfront supplies scaffolding systems and support for contractors who need safe, efficient platforms for workers, materials and equipment on active UAE sites.",
    "Properly erected and maintained scaffolding is essential for project safety and productivity. Our team helps you select the right system, plan erection and dismantling, and keep your programme moving across Abu Dhabi, Dubai and Sharjah.",
  ],
  featureSections: [
    {
      heading: "Primary characteristics of our scaffolding services",
      items: [
        {
          label: "Scaffolding types",
          text: "Tube and clamp, frame, system, suspended and mobile scaffolding — matched to your project layout and working height.",
        },
        {
          label: "Erection and dismantling",
          text: "Professional assembly and removal with stable anchoring, bracing and handover aligned to your site programme.",
        },
        {
          label: "Customised solutions",
          text: "Scaffold design and configuration tailored to facades, industrial structures, tanks and confined work areas.",
        },
        {
          label: "Safety standards",
          text: "Structures built to UAE safety requirements with regular inspection and maintenance throughout the hire period.",
        },
      ],
    },
    {
      heading: "Advantages of scaffolding rental in Abu Dhabi",
      items: [
        {
          label: "Enhanced safety",
          text: "Compliant scaffolding reduces fall risk and gives crews stable access for work at elevation.",
        },
        {
          label: "Project-fit design",
          text: "Configurations sized for your scope — from short-term maintenance to long-running construction programmes.",
        },
        {
          label: "Regulatory compliance",
          text: "Systems erected to local codes, supporting safer sites and smoother inspections.",
        },
        {
          label: "Efficient site access",
          text: "Workers reach elevated areas faster for painting, cladding, MEP, maintenance and installation tasks.",
        },
      ],
    },
  ],
};

export const servicePages: ServicePage[] = [scaffoldingService];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
