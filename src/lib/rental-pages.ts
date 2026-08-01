export type RentalSeo = {
  title: string;
  description: string;
  h1: string;
};

export type RentalHub = {
  slug: string;
  title: string;
  cardTitle: string;
  image: string;
  imageAlt: string;
  intro: string;
  seo: RentalSeo;
  itemSlugs: string[];
};

export type RentalVariantCard = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
};

export type RentalFeatureSection = {
  heading: string;
  items: { label: string; text: string }[];
};

export type RentalPageLayout = "default" | "bus-hub" | "bus-variant" | "tanker-hub" | "tanker-variant";

export type RentalPageFamily = {
  slug: string;
  label: string;
};

export type RentalPage = {
  slug: string;
  hubSlug: string;
  title: string;
  cardTitle: string;
  image: string;
  imageAlt: string;
  intro: string;
  seo: RentalSeo;
  highlights: string[];
  body: string[];
  variants?: string[];
  relatedSlugs?: string[];
  heroBanner?: string;
  heroTitle?: string;
  marqueeText?: string;
  layout?: RentalPageLayout;
  familyRoot?: RentalPageFamily;
  variantCards?: RentalVariantCard[];
  featureSections?: RentalFeatureSection[];
  otherProducts?: RentalVariantCard[];
};

const WATER_TANKER_FAMILY = {
  slug: "water-tanker-rental-abu-dhabi",
  label: "Water Tanker",
} as const;

const PASSENGER_BUS_FAMILY = {
  slug: "passenger-bus-rental-abu-dhabi",
  label: "Passenger Bus",
} as const;

const LOCATION =
  "Abu Dhabi, Dubai and across the UAE";

/** Equipment photos sourced for rental catalog pages. */
export const rentalImages = {
  forklift: "/images/rental/equipment-equipment-1.webp",
  wheelLoader: "/images/rental/equipment-equipment-2.webp",
  backhoe: "/images/rental/equipment-equipment-3.webp",
  boomLift: "/images/rental/equipment-equipment-4.webp",
  miniExcavator: "/images/rental/equipment-equipment-5.webp",
  crane: "/images/rental/equipment-equipment-6.webp",
  manlift: "/images/rental/equipment-diesel-e450aj-articulated.webp",
  scissorLift: "/images/rental/equipment-scissor-lift.webp",
  roller: "/images/rental/equipment-equipment-8.webp",
  generator: "/images/rental/equipment-generator.webp",
  compressor: "/images/rental/equipment-compressor.webp",
  dewateringPump: "/images/rental/equipment-dewatering-pump.webp",
  powerEquipmentBanner: "/images/rental/power-equipment-banner.webp",
  generatorBanner: "/images/rental/generator-sub-banner.webp",
  compressorBanner: "/images/rental/compressor-sub-banner.webp",
  passengerBus: "/images/rental/equipment-equipment-11.webp",
  skidSteer: "/images/rental/equipment-equipment-12.webp",
  bigExcavator: "/images/rental/home-big-excavator.webp",
  telehandler: "/images/rental/home-telehandler.webp",
  siteDumper: "/images/rental/home-site-dumper.webp",
  subBanner: "/images/rental/equipment-sub-banner.webp",
  passengerMain: "/images/rental/equipment-passenger.webp",
  passenger14: "/images/rental/passenger-14-seater-van.webp",
  passenger34: "/images/rental/equipment-passenger2.webp",
  passenger66: "/images/rental/equipment-passenger3.webp",
  passenger14Main: "/images/rental/passenger-14-seater-van.webp",
  passenger66Main: "/images/rental/equipment-66-seater-passenger-bus.webp",
  passengerBanner: "/images/rental/passenger-sub-banner.webp",
  recoveryTruck: "/images/rental/equipment-truck.webp",
  waterTanker: "/images/rental/water-tanker-supply.webp",
  waterTankerSalt: "/images/rental/water-tanker-salt.webp",
  waterTankerSweet: "/images/rental/water-tanker-supply.webp",
  waterTankerDrainage: "/images/rental/water-tanker-drainage.webp",
  lowBedTrailer: "/images/rental/equipment-truck.webp",
} as const;

const rentalSlugImages: Record<string, string> = {
  "forklift-rental-abu-dhabi": rentalImages.forklift,
  "wheel-loader-rental-abu-dhabi": rentalImages.wheelLoader,
  "telehandler-rental-abu-dhabi": rentalImages.telehandler,
  "skid-steer-rental-abu-dhabi": rentalImages.skidSteer,
  "backhoe-loader-rental-abu-dhabi": rentalImages.backhoe,
  "mini-excavator-rental-abu-dhabi": rentalImages.miniExcavator,
  "crawler-excavator-rental-abu-dhabi": rentalImages.bigExcavator,
  "roller-rental-abu-dhabi": rentalImages.roller,
  "mobile-crane-rental-abu-dhabi": rentalImages.crane,
  "boom-lift-rental-abu-dhabi": rentalImages.boomLift,
  "scissor-lift-rental-abu-dhabi": rentalImages.scissorLift,
  "manlift-rental-abu-dhabi": rentalImages.manlift,
  "water-tanker-rental-abu-dhabi": rentalImages.waterTanker,
  "salt-water-tanker-rental-abu-dhabi": rentalImages.waterTankerSalt,
  "sweet-water-tanker-rental-abu-dhabi": rentalImages.waterTankerSweet,
  "drainage-water-tanker-rental-abu-dhabi": rentalImages.waterTankerDrainage,
  "low-bed-trailer-rental-abu-dhabi": rentalImages.lowBedTrailer,
  "generator-rental-abu-dhabi": rentalImages.generator,
  "compressor-rental-abu-dhabi": rentalImages.compressor,
  "dewatering-pump-rental-abu-dhabi": rentalImages.dewateringPump,
  "passenger-bus-rental-abu-dhabi": rentalImages.passengerMain,
  "14-seater-passenger-bus-rental-abu-dhabi": rentalImages.passenger14Main,
  "34-seater-passenger-bus-rental-abu-dhabi": rentalImages.passenger34,
  "66-seater-passenger-bus-rental-abu-dhabi": rentalImages.passenger66Main,
};

const rentalSlugHeroBanners: Record<string, string> = {
  "passenger-bus-rental-abu-dhabi": rentalImages.passengerBanner,
  "14-seater-passenger-bus-rental-abu-dhabi": rentalImages.passenger14Main,
  "34-seater-passenger-bus-rental-abu-dhabi": rentalImages.passengerBanner,
  "66-seater-passenger-bus-rental-abu-dhabi": rentalImages.passengerBanner,
  "water-tanker-rental-abu-dhabi": rentalImages.waterTanker,
  "salt-water-tanker-rental-abu-dhabi": rentalImages.waterTankerSalt,
  "sweet-water-tanker-rental-abu-dhabi": rentalImages.waterTankerSweet,
  "drainage-water-tanker-rental-abu-dhabi": rentalImages.waterTankerDrainage,
  "generator-rental-abu-dhabi": rentalImages.generatorBanner,
  "compressor-rental-abu-dhabi": rentalImages.compressorBanner,
  "dewatering-pump-rental-abu-dhabi": rentalImages.dewateringPump,
};

const rentalHubImages: Record<string, string> = {
  "material-handling-equipment-rental": rentalImages.subBanner,
  "earthmoving-equipment-rental": rentalImages.bigExcavator,
  "lifting-access-equipment-rental": rentalImages.crane,
  "transport-equipment-rental": rentalImages.waterTanker,
  "power-equipment-rental": rentalImages.powerEquipmentBanner,
  "passenger-bus-rental-abu-dhabi": rentalImages.passengerMain,
};

export function getRentalImageForSlug(slug: string): string {
  return (
    rentalSlugImages[slug] ??
    rentalHubImages[slug] ??
    rentalImages.forklift
  );
}


export const rentalHubs: RentalHub[] = [
  {
    slug: "material-handling-equipment-rental",
    title: "Material Handling Equipment Rental",
    cardTitle: "Material Handling",
    image: rentalImages.subBanner,
    imageAlt: "Material handling equipment on a construction site in Abu Dhabi",
    intro:
      "Forklifts, wheel loaders, telehandlers and skid steers for warehouses, yards and active construction sites — mobilised quickly from our Abu Dhabi base.",
    seo: {
      title: "Material Handling Equipment Rental | Abu Dhabi | Peakfront",
      description:
        "Rent forklifts, wheel loaders, telehandlers and skid steers in Abu Dhabi and across the UAE. Competitive daily, weekly and monthly rates with fast delivery.",
      h1: "Material Handling Equipment Rental",
    },
    itemSlugs: [
      "forklift-rental-abu-dhabi",
      "wheel-loader-rental-abu-dhabi",
      "telehandler-rental-abu-dhabi",
      "skid-steer-rental-abu-dhabi",
      "backhoe-loader-rental-abu-dhabi",
    ],
  },
  {
    slug: "earthmoving-equipment-rental",
    title: "Earthmoving Equipment Rental",
    cardTitle: "Earthmoving",
    image: rentalImages.bigExcavator,
    imageAlt: "Earthmoving equipment on a UAE infrastructure project",
    intro:
      "Excavators, rollers and earthmoving plant for grading, excavation, compaction and site preparation on civil and infrastructure projects.",
    seo: {
      title: "Earthmoving Equipment Rental | Abu Dhabi | Peakfront",
      description:
        "Excavator and earthmoving equipment rental in Abu Dhabi and the UAE. Mini and crawler excavators, rollers and loaders with flexible hire terms.",
      h1: "Earthmoving Equipment Rental",
    },
    itemSlugs: [
      "mini-excavator-rental-abu-dhabi",
      "crawler-excavator-rental-abu-dhabi",
      "roller-rental-abu-dhabi",
    ],
  },
  {
    slug: "lifting-access-equipment-rental",
    title: "Lifting & Access Equipment Rental",
    cardTitle: "Lifting & Access",
    image: rentalImages.crane,
    imageAlt: "Lifting and access equipment on an industrial site in the UAE",
    intro:
      "Mobile cranes, boom lifts, scissor lifts and manlifts for construction, maintenance and industrial access work at height.",
    seo: {
      title: "Lifting & Access Equipment Rental | Abu Dhabi | Peakfront",
      description:
        "Mobile crane, boom lift and scissor lift rental in Abu Dhabi and Dubai. Safe, well-maintained lifting equipment with rapid mobilisation.",
      h1: "Lifting & Access Equipment Rental",
    },
    itemSlugs: [
      "mobile-crane-rental-abu-dhabi",
      "boom-lift-rental-abu-dhabi",
      "scissor-lift-rental-abu-dhabi",
      "manlift-rental-abu-dhabi",
    ],
  },
  {
    slug: "transport-equipment-rental",
    title: "Transport Equipment Rental",
    cardTitle: "Transport",
    image: rentalImages.waterTanker,
    imageAlt: "Water tanker and haulage equipment in the UAE",
    intro:
      "Water tankers, low bed trailers and haulage solutions for site logistics, plant movement and bulk material transport across all seven emirates.",
    seo: {
      title: "Transport Equipment Rental | Abu Dhabi | Peakfront",
      description:
        "Water tanker and low bed trailer rental in Abu Dhabi and the UAE. Licensed drivers, cross-emirate delivery and competitive hire rates.",
      h1: "Transport Equipment Rental",
    },
    itemSlugs: [
      "water-tanker-rental-abu-dhabi",
      "low-bed-trailer-rental-abu-dhabi",
    ],
  },
  {
    slug: "power-equipment-rental",
    title: "Power Equipment Rental",
    cardTitle: "Power & Utilities",
    image: rentalImages.powerEquipmentBanner,
    imageAlt: "Generators and power equipment on a UAE construction site",
    intro:
      "Generators, compressors and dewatering pumps for temporary power, site utilities and groundwater control on construction and industrial projects.",
    seo: {
      title: "Generator & Power Equipment Rental | Abu Dhabi | Peakfront",
      description:
        "Generator, compressor and dewatering pump rental in Abu Dhabi and across the UAE. Serviced equipment with 24/7 rental desk support.",
      h1: "Power Equipment Rental",
    },
    itemSlugs: [
      "generator-rental-abu-dhabi",
      "compressor-rental-abu-dhabi",
      "dewatering-pump-rental-abu-dhabi",
    ],
  },
  {
    slug: "passenger-bus-rental-abu-dhabi",
    title: "Passenger Bus Rental Abu Dhabi",
    cardTitle: "Passenger Buses",
    image: rentalImages.passengerMain,
    imageAlt: "Staff passenger buses for worker transport in Abu Dhabi",
    intro:
      "Coaster and coach buses for staff transport, camp transfers and site mobilisation with licensed drivers and air-conditioned cabins.",
    seo: {
      title: "Passenger Bus Rental Abu Dhabi | Peakfront",
      description:
        "Staff bus and coaster rental in Abu Dhabi and the UAE. Licensed drivers, AC cabins and flexible daily or monthly hire for camps and projects.",
      h1: "Passenger Bus Rental Abu Dhabi",
    },
    itemSlugs: [],
  },
];

function item(
  slug: string,
  hubSlug: string,
  title: string,
  cardTitle: string,
  imageAlt: string,
  intro: string,
  highlights: string[],
  body: string[],
  variants?: string[],
  relatedSlugs?: string[],
  extras?: Pick<
    RentalPage,
    | "heroBanner"
    | "heroTitle"
    | "marqueeText"
    | "layout"
    | "familyRoot"
    | "variantCards"
    | "featureSections"
    | "otherProducts"
  >,
): RentalPage {
  return {
    slug,
    hubSlug,
    title,
    cardTitle,
    image: getRentalImageForSlug(slug),
    imageAlt,
    intro,
    seo: {
      title: `${title} | Peakfront`,
      description: `${intro} Competitive rental rates in ${LOCATION}. Request a quote today.`,
      h1: title,
    },
    highlights,
    body,
    variants,
    relatedSlugs,
    heroBanner: extras?.heroBanner ?? rentalSlugHeroBanners[slug],
    heroTitle: extras?.heroTitle,
    marqueeText: extras?.marqueeText,
    layout: extras?.layout,
    familyRoot: extras?.familyRoot,
    variantCards: extras?.variantCards,
    featureSections: extras?.featureSections,
    otherProducts: extras?.otherProducts,
  };
}

export const rentalPages: RentalPage[] = [
  item(
    "forklift-rental-abu-dhabi",
    "material-handling-equipment-rental",
    "Forklift Rental Abu Dhabi",
    "Forklift",
    "Forklift operating in a warehouse and logistics yard in Abu Dhabi",
    "When it comes to material handling and logistics, contractors and warehouse operators across Abu Dhabi and Dubai rely on dependable forklifts to move loads safely and keep operations running.",
    [
      "Cost-effective alternative to purchasing and maintaining fleet",
      "Access to well-maintained units without long-term capital outlay",
      "Flexible daily, weekly and monthly hire for project peaks",
      "Fast mobilisation across Abu Dhabi, Dubai and the wider UAE",
      "Optional operator supply on request",
    ],
    [
      "Peakfront supplies forklifts for warehouses, fabrication yards, port logistics and construction sites. Whether you need a compact electric unit for indoor work or a diesel forklift for outdoor loading, we source the right capacity and mast configuration for your site.",
      "Our rental desk confirms availability quickly and provides transparent rates with mobilisation details upfront — so procurement teams and site managers can plan without surprises.",
    ],
    ["3 Ton Forklift", "5 Ton Forklift", "7 Ton Forklift", "10 Ton Forklift", "15 Ton Forklift"],
    ["telehandler-rental-abu-dhabi", "wheel-loader-rental-abu-dhabi", "skid-steer-rental-abu-dhabi"],
  ),
  item(
    "wheel-loader-rental-abu-dhabi",
    "material-handling-equipment-rental",
    "Wheel Loader Rental Abu Dhabi",
    "Wheel Loader",
    "Wheel loader moving aggregate on a UAE construction site",
    "Wheel loaders are essential for loading trucks, stockpiling aggregate and general material handling on earthworks and quarry operations.",
    [
      "Ideal for bulk loading and site logistics",
      "Multiple bucket sizes available through our supplier network",
      "Dry hire or operated options depending on project needs",
      "Suited to construction, mining support and industrial yards",
    ],
    [
      "Rent wheel loaders for short programmes or long-term earthworks contracts. Peakfront coordinates delivery, offloading and collection aligned to your site schedule.",
    ],
    undefined,
    ["forklift-rental-abu-dhabi", "backhoe-loader-rental-abu-dhabi", "crawler-excavator-rental-abu-dhabi"],
  ),
  item(
    "telehandler-rental-abu-dhabi",
    "material-handling-equipment-rental",
    "Telehandler Rental Abu Dhabi",
    "Telehandler",
    "Telehandler lifting materials on a construction site in the UAE",
    "Telehandlers combine lift height and forward reach for material placement on multi-storey construction and industrial projects.",
    [
      "Reach and lift capability for steel, blocks and palletised loads",
      "4x4 models for rough terrain sites",
      "Popular for MEP, façade and finishing trades",
      "Available for daily, weekly and monthly hire",
    ],
    [
      "Peakfront supplies telehandlers from trusted partners across the UAE. Share your lift height, capacity and site access requirements and we will confirm the best available unit.",
    ],
    ["14m Telehandler", "17m Telehandler", "20m Telehandler"],
    ["forklift-rental-abu-dhabi", "mobile-crane-rental-abu-dhabi", "boom-lift-rental-abu-dhabi"],
  ),
  item(
    "skid-steer-rental-abu-dhabi",
    "material-handling-equipment-rental",
    "Skid Steer Rental Abu Dhabi",
    "Skid Steer",
    "Skid steer loader working on a confined construction site",
    "Compact skid steer loaders are ideal for confined sites, landscaping, demolition support and utility trenching where manoeuvrability matters.",
    [
      "Compact footprint for restricted access areas",
      "Multiple attachments available through our network",
      "Quick mobilisation for short-duration tasks",
      "Cost-effective hire for supporting trades",
    ],
    [
      "Skid steers keep small sites productive without the mobilisation cost of larger plant. Peakfront arranges delivery and collection to fit your programme.",
    ],
    ["Bobcat Skid Steer", "Tracked Skid Steer"],
    ["mini-excavator-rental-abu-dhabi", "backhoe-loader-rental-abu-dhabi"],
  ),
  item(
    "backhoe-loader-rental-abu-dhabi",
    "material-handling-equipment-rental",
    "Backhoe Loader Rental Abu Dhabi",
    "Backhoe Loader",
    "Backhoe loader on a civil works site in Abu Dhabi",
    "Backhoe loaders remain one of the most versatile machines on civil and utility projects — excavation, loading and trenching in a single unit.",
    [
      "Versatile excavation and loading in one machine",
      "Widely used on utility, road and building projects",
      "Operator supply available on request",
      "Flexible rental periods from single shifts to months",
    ],
    [
      "Peakfront provides JCB-style backhoe loaders and equivalent models through vetted UAE suppliers. Contact our rental desk for availability and rates.",
    ],
    ["JCB 3CX Equivalent", "4WD Backhoe Loader"],
    ["wheel-loader-rental-abu-dhabi", "mini-excavator-rental-abu-dhabi"],
  ),
  item(
    "mini-excavator-rental-abu-dhabi",
    "earthmoving-equipment-rental",
    "Mini Excavator Rental Abu Dhabi",
    "Mini Excavator",
    "Mini excavator working on a utility trench in Abu Dhabi",
    "Mini excavators are the go-to choice for utility trenches, landscaping, indoor demolition and work in space-constrained urban sites.",
    [
      "Low ground pressure options for finished surfaces",
      "Ideal for utility contractors and finishing works",
      "Easy transport between zones on large campuses",
      "Multiple tonnage classes available",
    ],
    [
      "From 1.5-tonne micro diggers to 8-tonne compact excavators, Peakfront sources the right machine for your dig depth and access constraints.",
    ],
    ["1.7 Ton Mini Excavator", "3 Ton Mini Excavator", "5 Ton Mini Excavator"],
    ["crawler-excavator-rental-abu-dhabi", "skid-steer-rental-abu-dhabi"],
  ),
  item(
    "crawler-excavator-rental-abu-dhabi",
    "earthmoving-equipment-rental",
    "Crawler Excavator Rental Abu Dhabi",
    "Crawler Excavator",
    "Crawler excavator on an earthworks project in Abu Dhabi",
    "Crawler excavators handle bulk excavation, rock breaking support and heavy earthmoving on infrastructure, residential and industrial projects.",
    [
      "Stable performance on uneven terrain",
      "Wide range of tonnages for different dig programmes",
      "Long-reach and standard boom options",
      "Mobilisation across all seven emirates",
    ],
    [
      "Peakfront supplies crawler excavators with transparent daily, weekly and monthly rates. Breakdown replacement and urgent mobilisation supported through our 24/7 rental desk.",
    ],
    ["20 Ton Excavator", "30 Ton Excavator", "45 Ton Excavator"],
    ["wheel-loader-rental-abu-dhabi", "low-bed-trailer-rental-abu-dhabi"],
  ),
  item(
    "roller-rental-abu-dhabi",
    "earthmoving-equipment-rental",
    "Roller Rental Abu Dhabi",
    "Roller",
    "Compaction roller on a road works site in the UAE",
    "Rollers and compactors are essential for road bases, carparks and trench backfill compaction on civil projects.",
    [
      "Smooth drum and padfoot options",
      "Suitable for road, infrastructure and industrial slabs",
      "Short-notice availability for finishing gangs",
      "Operated and dry hire subject to model",
    ],
    [
      "Keep compaction work on programme with roller hire coordinated alongside your earthmoving fleet through a single Peakfront point of contact.",
    ],
    ["Single Drum Roller", "Double Drum Roller"],
    ["crawler-excavator-rental-abu-dhabi"],
  ),
  item(
    "mobile-crane-rental-abu-dhabi",
    "lifting-access-equipment-rental",
    "Mobile Crane Rental Abu Dhabi",
    "Mobile Crane",
    "Mobile crane lifting steel on a construction project in Abu Dhabi",
    "Mobile cranes support steel erection, precast installation and heavy lifts on building and infrastructure projects across the UAE.",
    [
      "All-terrain and truck-mounted options via supplier network",
      "Lift planning support through experienced partners",
      "Certified operators available on request",
      "Rapid quote turnaround for tender and site needs",
    ],
    [
      "Share lift weight, radius and site access details and Peakfront will confirm crane class, availability and mobilisation timing.",
    ],
    ["25 Ton Mobile Crane", "50 Ton Mobile Crane", "100 Ton Mobile Crane"],
    ["telehandler-rental-abu-dhabi", "low-bed-trailer-rental-abu-dhabi"],
  ),
  item(
    "boom-lift-rental-abu-dhabi",
    "lifting-access-equipment-rental",
    "Boom Lift Rental Abu Dhabi",
    "Boom Lift",
    "Boom lift used for façade access on a building project",
    "Articulating and telescopic boom lifts provide safe access for façade, steel, MEP and maintenance work at height.",
    [
      "Electric and diesel models for indoor/outdoor use",
      "Working heights to suit high-rise access packages",
      "Daily and weekly hire for finishing trades",
      "Delivery direct to active work fronts",
    ],
    [
      "Peakfront supplies boom lifts for contractors who need reliable access equipment without tying up capital in underutilised fleet.",
    ],
    ["14m Boom Lift", "18m Boom Lift", "24m Boom Lift"],
    ["scissor-lift-rental-abu-dhabi", "manlift-rental-abu-dhabi"],
  ),
  item(
    "scissor-lift-rental-abu-dhabi",
    "lifting-access-equipment-rental",
    "Scissor Lift Rental Abu Dhabi",
    "Scissor Lift",
    "Scissor lift on an indoor fit-out project in the UAE",
    "Scissor lifts offer stable elevated platforms for MEP installation, ceiling works, warehousing and facility maintenance.",
    [
      "Electric models for indoor and warehouse use",
      "Rough terrain scissor lifts for outdoor sites",
      "Compact units for tight access",
      "Competitive daily rates for trade packages",
    ],
    [
      "Book scissor lifts for single shifts or multi-week fit-out programmes. Our team confirms model, platform height and delivery slot.",
    ],
    ["8m Scissor Lift", "12m Scissor Lift", "14m Scissor Lift"],
    ["boom-lift-rental-abu-dhabi", "manlift-rental-abu-dhabi"],
  ),
  item(
    "manlift-rental-abu-dhabi",
    "lifting-access-equipment-rental",
    "Manlift Rental Abu Dhabi",
    "Manlift",
    "Manlift providing access for maintenance work at height",
    "Manlifts and vertical mast lifts are compact access solutions for facilities, retail fit-out and industrial maintenance.",
    [
      "Compact footprint for indoor maintenance",
      "Quick setup for short-duration tasks",
      "Operator training requirements clarified on hire",
      "Available across Abu Dhabi and Dubai",
    ],
    [
      "For facilities teams and contractors needing safe personnel elevation without large boom equipment, manlift rental is a practical and economical choice.",
    ],
    undefined,
    ["scissor-lift-rental-abu-dhabi", "boom-lift-rental-abu-dhabi"],
  ),
  item(
    "water-tanker-rental-abu-dhabi",
    "transport-equipment-rental",
    "Water Tanker Rental Abu Dhabi",
    "Water Tanker",
    "Water tanker rental in Abu Dhabi, Dubai and Sharjah for site supply, dust suppression and bulk water delivery",
    "Water tankers deliver salt water, sweet water and drainage water across construction sites, industrial facilities and infrastructure projects throughout the UAE.",
    [],
    [
      "Peakfront supplies water tankers for salt water, sweet water and drainage water across construction, industrial and camp sites in the UAE.",
      "Licensed drivers, flexible scheduling and 5,000–10,000 gallon capacity — share your site location, water type and daily volume for a fast quote.",
      "Reliable water tanker rental from Mussafah across Abu Dhabi, Dubai, Sharjah and the Northern Emirates.",
    ],
    ["Salt Water Tanker", "Sweet Water Tanker", "Drainage Water Tanker"],
    ["low-bed-trailer-rental-abu-dhabi"],
    {
      layout: "tanker-hub",
      familyRoot: WATER_TANKER_FAMILY,
      heroTitle: "Water Tanker for Rent",
      marqueeText: "Water Tanker Rental Abu Dhabi, Dubai, Sharjah",
      variantCards: [
        {
          slug: "salt-water-tanker-rental-abu-dhabi",
          title: "Salt Water Tanker for Rent",
          image: rentalImages.waterTankerSalt,
          imageAlt: "Salt water tanker for rent in Abu Dhabi",
        },
        {
          slug: "sweet-water-tanker-rental-abu-dhabi",
          title: "Sweet Water Tanker for Rent",
          image: rentalImages.waterTankerSweet,
          imageAlt: "Sweet water tanker for rent in Abu Dhabi",
        },
        {
          slug: "drainage-water-tanker-rental-abu-dhabi",
          title: "Drainage Water Tanker for Rent",
          image: rentalImages.waterTankerDrainage,
          imageAlt: "Drainage water tanker for rent in Abu Dhabi",
        },
      ],
      featureSections: [
        {
          heading: "Why rent a water tanker with Peakfront?",
          items: [
            {
              label: "Licensed drivers included",
              text: "All tanker hires include licensed, experienced drivers familiar with UAE site access and cross-emirate routes.",
            },
            {
              label: "Multiple water types",
              text: "Salt water, sweet water and drainage water tankers available to match compaction, potable supply and dewatering transfer needs.",
            },
            {
              label: "High-capacity fleet",
              text: "5,000 and 10,000 gallon tankers for large civil, industrial and infrastructure programmes.",
            },
            {
              label: "Flexible scheduling",
              text: "Ad-hoc deliveries or fixed daily runs — we align supply to your site programme.",
            },
            {
              label: "UAE-wide coverage",
              text: "Mobilisation from Mussafah across Abu Dhabi, Dubai, Sharjah and the Northern Emirates.",
            },
          ],
        },
      ],
    },
  ),
  item(
    "salt-water-tanker-rental-abu-dhabi",
    "transport-equipment-rental",
    "Salt Water Tanker Rental Abu Dhabi",
    "Salt Water Tanker",
    "Salt water tanker supplying compaction and dust suppression water on UAE construction sites",
    "Salt water tankers are widely used for road compaction, dust suppression, earthworks watering and industrial processes that do not require potable water.",
    [
      "Ideal for compaction and dust suppression on civil sites",
      "Cost-effective compared to sweet water for non-potable use",
      "Licensed drivers and scheduled or on-call delivery",
    ],
    [
      "Salt water tanker rental for compaction, dust suppression and earthworks watering on civil and infrastructure sites across Abu Dhabi and the UAE.",
      "Licensed drivers, scheduled or on-call delivery — share your daily volume and site details for a fast quotation.",
    ],
    undefined,
    ["sweet-water-tanker-rental-abu-dhabi", "drainage-water-tanker-rental-abu-dhabi", "water-tanker-rental-abu-dhabi"],
    {
      layout: "tanker-variant",
      familyRoot: WATER_TANKER_FAMILY,
      heroTitle: "Salt Water Tanker for Rent",
      marqueeText: "Salt Water Tanker Rental in Abu Dhabi, Dubai, Sharjah",
      otherProducts: [
        {
          slug: "sweet-water-tanker-rental-abu-dhabi",
          title: "Sweet Water Tanker for Rent",
          image: rentalImages.waterTankerSweet,
          imageAlt: "Sweet water tanker for rent in Abu Dhabi",
        },
        {
          slug: "drainage-water-tanker-rental-abu-dhabi",
          title: "Drainage Water Tanker for Rent",
          image: rentalImages.waterTankerDrainage,
          imageAlt: "Drainage water tanker for rent in Abu Dhabi",
        },
      ],
    },
  ),
  item(
    "sweet-water-tanker-rental-abu-dhabi",
    "transport-equipment-rental",
    "Sweet Water Tanker Rental Abu Dhabi",
    "Sweet Water Tanker",
    "Sweet water tanker for potable and general site water supply in the UAE",
    "Sweet water tankers deliver fresh, non-saline water for worker camps, concrete curing, irrigation, facility supply and general construction use.",
    [
      "Suitable for potable and general-purpose site supply",
      "Clean tankers maintained for sweet water delivery",
      "Daily, weekly and long-term camp supply contracts",
    ],
    [
      "Sweet water tanker rental for camps, concrete curing, irrigation and general site supply across Abu Dhabi, Dubai and Sharjah.",
      "Clean, well-maintained tankers with licensed drivers — coordinate daily or peak-demand delivery schedules with our rental desk.",
    ],
    undefined,
    ["salt-water-tanker-rental-abu-dhabi", "drainage-water-tanker-rental-abu-dhabi", "water-tanker-rental-abu-dhabi"],
    {
      layout: "tanker-variant",
      familyRoot: WATER_TANKER_FAMILY,
      heroTitle: "Sweet Water Tanker for Rent",
      marqueeText: "Sweet Water Tanker Rental in Abu Dhabi, Dubai, Sharjah",
      otherProducts: [
        {
          slug: "salt-water-tanker-rental-abu-dhabi",
          title: "Salt Water Tanker for Rent",
          image: rentalImages.waterTankerSalt,
          imageAlt: "Salt water tanker for rent in Abu Dhabi",
        },
        {
          slug: "drainage-water-tanker-rental-abu-dhabi",
          title: "Drainage Water Tanker for Rent",
          image: rentalImages.waterTankerDrainage,
          imageAlt: "Drainage water tanker for rent in Abu Dhabi",
        },
      ],
    },
  ),
  item(
    "drainage-water-tanker-rental-abu-dhabi",
    "transport-equipment-rental",
    "Drainage Water Tanker Rental Abu Dhabi",
    "Drainage Water Tanker",
    "Drainage water tanker for collection and transfer of site water in Abu Dhabi",
    "Drainage water tankers collect and transport excess groundwater, surface runoff and site drainage to approved disposal points.",
    [
      "Collection and transfer of site drainage and runoff",
      "Supports dewatering and excavation programmes",
      "Licensed drivers and compliant disposal routing",
    ],
    [
      "Drainage water tanker rental for collecting and transferring site runoff during excavation, basement and utility works.",
      "Works alongside dewatering pumps — licensed drivers and compliant disposal routing across Abu Dhabi and the UAE.",
    ],
    undefined,
    ["salt-water-tanker-rental-abu-dhabi", "sweet-water-tanker-rental-abu-dhabi", "water-tanker-rental-abu-dhabi"],
    {
      layout: "tanker-variant",
      familyRoot: WATER_TANKER_FAMILY,
      heroTitle: "Drainage Water Tanker for Rent",
      marqueeText: "Drainage Water Tanker Rental in Abu Dhabi, Dubai, Sharjah",
      otherProducts: [
        {
          slug: "salt-water-tanker-rental-abu-dhabi",
          title: "Salt Water Tanker for Rent",
          image: rentalImages.waterTankerSalt,
          imageAlt: "Salt water tanker for rent in Abu Dhabi",
        },
        {
          slug: "sweet-water-tanker-rental-abu-dhabi",
          title: "Sweet Water Tanker for Rent",
          image: rentalImages.waterTankerSweet,
          imageAlt: "Sweet water tanker for rent in Abu Dhabi",
        },
      ],
    },
  ),
  item(
    "low-bed-trailer-rental-abu-dhabi",
    "transport-equipment-rental",
    "Low Bed Trailer Rental Abu Dhabi",
    "Low Bed Trailer",
    "Low bed trailer transporting heavy equipment in the UAE",
    "Low bed trailers move excavators, cranes and heavy plant between sites and emirates — essential for multi-site contractors.",
    [
      "Multi-axle trailers for heavy plant moves",
      "Licensed drivers and route coordination",
      "Cross-emirate mobilisation and demobilisation",
      "Ideal companion to earthmoving and crane hire",
    ],
    [
      "Combine low bed transport with your equipment rental so mobilisation is handled through one accountable supplier.",
    ],
    ["60 Ton Low Bed", "80 Ton Low Bed"],
    ["crawler-excavator-rental-abu-dhabi", "mobile-crane-rental-abu-dhabi"],
  ),
  item(
    "generator-rental-abu-dhabi",
    "power-equipment-rental",
    "Generator Rental Abu Dhabi",
    "Generator",
    "Diesel generator providing temporary power on a UAE site",
    "Diesel generators deliver temporary power for construction sites, events, industrial shutdowns and backup supply during utility work.",
    [
      "Silent and standard canopy options",
      "Synchronising and distribution support on request",
      "Fuel management and refuel scheduling available",
      "24/7 support for active hire periods",
    ],
    [
      "From 100 kVA to 1,000 kVA and above, Peakfront sources generators sized to your load list with delivery, commissioning and collection arranged.",
    ],
    ["100 kVA Generator", "250 kVA Generator", "500 kVA Generator", "1,000 kVA Generator"],
    ["compressor-rental-abu-dhabi", "dewatering-pump-rental-abu-dhabi"],
  ),
  item(
    "compressor-rental-abu-dhabi",
    "power-equipment-rental",
    "Compressor Rental Abu Dhabi",
    "Compressor",
    "Air compressor on an industrial construction site",
    "Air compressors power pneumatic tools, sandblasting, pipeline testing and industrial processes on site.",
    [
      "Diesel and electric portable units",
      "Multiple CFM outputs for different tool packages",
      "Short and long-term hire available",
      "Serviced equipment from vetted suppliers",
    ],
    [
      "Tell us your tool list and running hours — we will recommend the right compressor class and hose package for your crew.",
    ],
    ["185 CFM Compressor", "375 CFM Compressor"],
    ["generator-rental-abu-dhabi"],
  ),
  item(
    "dewatering-pump-rental-abu-dhabi",
    "power-equipment-rental",
    "Dewatering Pump Rental Abu Dhabi",
    "Dewatering Pump",
    "Dewatering pump operating on a construction site in Abu Dhabi",
    "Dewatering pumps control groundwater and surface water during excavation, basement construction and utility trenching.",
    [
      "High-flow diesel pumps for deep dewatering",
      "Emergency replacement pumps available 24/7",
      "Hose and header line packages on request",
      "Experienced in UAE soil and water conditions",
    ],
    [
      "Peakfront supports contractors with dewatering pump hire and rapid swap-out if a unit fails mid-pour or mid-dig — call the rental desk any time.",
    ],
    ['4" Dewatering Pump', '6" Dewatering Pump', '8" Dewatering Pump'],
    ["generator-rental-abu-dhabi", "water-tanker-rental-abu-dhabi"],
  ),
  item(
    "passenger-bus-rental-abu-dhabi",
    "passenger-bus-rental-abu-dhabi",
    "Passenger Bus Rental Abu Dhabi",
    "Passenger Bus",
    "Passenger bus for staff and group transport in Abu Dhabi, Dubai and Sharjah",
    "Coaster and coach buses for staff transport, camp transfers and group travel across the UAE.",
    [],
    [
      "Peakfront supplies passenger buses from 14 to 66 seats for corporate shuttles, school trips, hotel transfers and site mobilisation. All units are air-conditioned, well maintained and available with licensed drivers.",
      "Choose the capacity that fits your group — our rental desk confirms availability and rates quickly across Abu Dhabi, Dubai and Sharjah.",
      "Reliable passenger bus rental from our Mussafah base, covering all seven emirates. Request a quote for daily, weekly or monthly hire.",
    ],
    ["14 Seater Passenger Bus", "34 Seater Passenger Bus", "66 Seater Passenger Bus"],
    ["water-tanker-rental-abu-dhabi"],
    {
      layout: "bus-hub",
      familyRoot: PASSENGER_BUS_FAMILY,
      heroTitle: "Passenger Bus for Rent",
      marqueeText:
        "Passenger Bus Rental Abu Dhabi, Dubai, Sharjah",
      variantCards: [
        {
          slug: "14-seater-passenger-bus-rental-abu-dhabi",
          title: "14 Seater Passenger Bus for Rent",
          image: rentalImages.passenger14,
          imageAlt: "14 seater passenger bus for rent in Abu Dhabi",
        },
        {
          slug: "34-seater-passenger-bus-rental-abu-dhabi",
          title: "34 Seater Passenger Bus for Rent",
          image: rentalImages.passenger34,
          imageAlt: "34 seater passenger bus for rent in Abu Dhabi",
        },
        {
          slug: "66-seater-passenger-bus-rental-abu-dhabi",
          title: "66 Seater Passenger Bus for Rent",
          image: rentalImages.passenger66,
          imageAlt: "66 seater passenger bus for rent in Abu Dhabi",
        },
      ],
      featureSections: [
        {
          heading: "Why rent a passenger bus with Peakfront?",
          items: [
            {
              label: "Licensed drivers",
              text: "Experienced drivers for safe, on-schedule group transport across the UAE.",
            },
            {
              label: "Flexible capacity",
              text: "14, 34 and 66 seater options to match your group size.",
            },
            {
              label: "Comfortable cabins",
              text: "Air-conditioned buses with comfortable seating for staff and guests.",
            },
            {
              label: "Well-maintained fleet",
              text: "Regularly serviced units ready for daily, weekly or monthly hire.",
            },
            {
              label: "UAE-wide coverage",
              text: "Mobilisation from Mussafah across Abu Dhabi, Dubai, Sharjah and beyond.",
            },
          ],
        },
      ],
    },
  ),
  item(
    "14-seater-passenger-bus-rental-abu-dhabi",
    "passenger-bus-rental-abu-dhabi",
    "14 Seater Passenger Bus Rental in Abu Dhabi",
    "14 Seater Passenger Bus",
    "14-seater passenger van rental in Abu Dhabi, Dubai and Sharjah for small group travel and staff transport",
    "We offer convenient and comfortable 14-seater passenger bus rentals in Abu Dhabi, Dubai and Sharjah, perfect for small group travel, staff transport, school trips, hotel transfers or family outings.",
    [
      "Ideal for small groups with ample legroom and comfortable seating",
      "Powerful air conditioning and smooth suspension",
      "Trained driver included with regular maintenance",
    ],
    [
      "14-seater passenger bus rental for small groups — staff transport, school trips, hotel transfers and site mobilisation in Abu Dhabi, Dubai and Sharjah.",
      "Air-conditioned cabin, trained driver and regular maintenance included. Contact Peakfront to book daily, weekly or monthly hire.",
    ],
    undefined,
    ["34-seater-passenger-bus-rental-abu-dhabi", "66-seater-passenger-bus-rental-abu-dhabi", "passenger-bus-rental-abu-dhabi"],
    {
      layout: "bus-variant",
      familyRoot: PASSENGER_BUS_FAMILY,
      heroTitle: "14 Seater Passenger Bus for Rent",
      marqueeText:
        "14 Seater Passenger Bus Rental in Abu Dhabi, Dubai, Sharjah",
      otherProducts: [
        {
          slug: "34-seater-passenger-bus-rental-abu-dhabi",
          title: "34 Seater Passenger Bus for Rent",
          image: rentalImages.passenger34,
          imageAlt: "34 seater passenger bus for rent in Abu Dhabi",
        },
        {
          slug: "66-seater-passenger-bus-rental-abu-dhabi",
          title: "66 Seater Passenger Bus for Rent",
          image: rentalImages.passenger66,
          imageAlt: "66 seater passenger bus for rent in Abu Dhabi",
        },
      ],
    },
  ),
  item(
    "34-seater-passenger-bus-rental-abu-dhabi",
    "passenger-bus-rental-abu-dhabi",
    "34 Seater Passenger Bus Rental in Abu Dhabi",
    "34 Seater Passenger Bus",
    "34-seater passenger bus rental in Abu Dhabi, Dubai and Sharjah for medium-sized groups and corporate outings",
    "We provide 34-seater passenger bus rental in Abu Dhabi, Dubai and Sharjah, perfect for medium-sized groups, corporate outings, school transportation and intercity travel.",
    [
      "Wide cushioned seats with ample legroom and air conditioning",
      "Licensed, experienced driver on every hire",
      "Regular maintenance checks for safety and reliability",
    ],
    [
      "34-seater passenger bus rental for medium-sized groups — corporate outings, school transport and intercity travel across the UAE.",
      "Wide seating, air conditioning and licensed drivers on every hire. Request a quote for your schedule.",
    ],
    undefined,
    ["14-seater-passenger-bus-rental-abu-dhabi", "66-seater-passenger-bus-rental-abu-dhabi", "passenger-bus-rental-abu-dhabi"],
    {
      layout: "bus-variant",
      familyRoot: PASSENGER_BUS_FAMILY,
      heroTitle: "34 Seater Passenger Bus for Rent",
      marqueeText:
        "34 Seater Passenger Bus Rental in Abu Dhabi, Dubai, Sharjah",
      otherProducts: [
        {
          slug: "14-seater-passenger-bus-rental-abu-dhabi",
          title: "14 Seater Passenger Bus for Rent",
          image: rentalImages.passenger14,
          imageAlt: "14 seater passenger bus for rent in Abu Dhabi",
        },
        {
          slug: "66-seater-passenger-bus-rental-abu-dhabi",
          title: "66 Seater Passenger Bus for Rent",
          image: rentalImages.passenger66,
          imageAlt: "66 seater passenger bus for rent in Abu Dhabi",
        },
      ],
    },
  ),
  item(
    "66-seater-passenger-bus-rental-abu-dhabi",
    "passenger-bus-rental-abu-dhabi",
    "66 Seater Passenger Bus Rental in Abu Dhabi",
    "66 Seater Passenger Bus",
    "66-seater passenger bus rental in Abu Dhabi, Dubai and Sharjah for large group transportation",
    "We offer reliable 66-seater passenger bus rental in Abu Dhabi, Dubai and Sharjah, ideal for large group transportation such as school trips, corporate events and staff shuttle services.",
    [
      "Spacious interiors with cushioned seating and strong air conditioning",
      "Ample luggage space for long or short-distance travel",
      "Skilled professional drivers and highest safety standards",
    ],
    [
      "66-seater passenger bus rental for large groups — school trips, corporate events and staff shuttles across Abu Dhabi, Dubai and Sharjah.",
      "Spacious AC cabin, professional drivers and regular maintenance. Reserve your coach with Peakfront today.",
    ],
    undefined,
    ["14-seater-passenger-bus-rental-abu-dhabi", "34-seater-passenger-bus-rental-abu-dhabi", "passenger-bus-rental-abu-dhabi"],
    {
      layout: "bus-variant",
      familyRoot: PASSENGER_BUS_FAMILY,
      heroTitle: "66 Seater Passenger Bus for Rent",
      marqueeText:
        "66 Seater Passenger Bus Rental in Abu Dhabi, Dubai, Sharjah",
      otherProducts: [
        {
          slug: "14-seater-passenger-bus-rental-abu-dhabi",
          title: "14 Seater Passenger Bus for Rent",
          image: rentalImages.passenger14,
          imageAlt: "14 seater passenger bus for rent in Abu Dhabi",
        },
        {
          slug: "34-seater-passenger-bus-rental-abu-dhabi",
          title: "34 Seater Passenger Bus for Rent",
          image: rentalImages.passenger34,
          imageAlt: "34 seater passenger bus for rent in Abu Dhabi",
        },
      ],
    },
  ),
];

export function getRentalHub(slug: string): RentalHub | undefined {
  return rentalHubs.find((hub) => hub.slug === slug);
}

export function getRentalPage(slug: string): RentalPage | undefined {
  return rentalPages.find((page) => page.slug === slug);
}

export function getRentalHubPath(slug: string): string {
  return `/equipment-rental/${slug}`;
}

export function getRentalPagePath(slug: string): string {
  return `/equipment-rental/${slug}`;
}

export function getPagesForHub(hubSlug: string): RentalPage[] {
  const hub = getRentalHub(hubSlug);
  if (!hub) return [];
  return hub.itemSlugs
    .map((slug) => getRentalPage(slug))
    .filter((page): page is RentalPage => page !== undefined)
    .filter((page) => !NAV_SUBPAGE_EXCLUDED.has(page.slug));
}

export function getAllRentalSlugs(): string[] {
  return [
    ...new Set([
      ...rentalHubs.map((hub) => hub.slug),
      ...rentalPages.map((page) => page.slug),
    ]),
  ];
}

export function getRentalHubSlugs(): string[] {
  return rentalHubs.map((hub) => hub.slug);
}

export function isRentalHub(slug: string): boolean {
  return rentalHubs.some((hub) => hub.slug === slug);
}

const equipmentIdToRentalSlug: Record<string, string> = {
  "crawler-excavator-20t": "crawler-excavator-rental-abu-dhabi",
  "telehandler-17m": "telehandler-rental-abu-dhabi",
  "wheel-loader": "wheel-loader-rental-abu-dhabi",
  "water-tanker-5000": "water-tanker-rental-abu-dhabi",
  "low-bed-trailer": "low-bed-trailer-rental-abu-dhabi",
  "coaster-bus-30": "passenger-bus-rental-abu-dhabi",
  "luxury-coach-50": "passenger-bus-rental-abu-dhabi",
  "dewatering-pump-6in": "dewatering-pump-rental-abu-dhabi",
  "generator-500kva": "generator-rental-abu-dhabi",
};

export function getRentalSlugForEquipmentId(
  equipmentId: string,
): string | undefined {
  return equipmentIdToRentalSlug[equipmentId];
}

const tagToRentalSlug: Record<string, string> = {
  Excavators: "crawler-excavator-rental-abu-dhabi",
  "Wheel Loaders": "wheel-loader-rental-abu-dhabi",
  "Backhoe Loaders": "backhoe-loader-rental-abu-dhabi",
  "Skid Steers": "skid-steer-rental-abu-dhabi",
  Rollers: "roller-rental-abu-dhabi",
  Telehandlers: "telehandler-rental-abu-dhabi",
  Forklifts: "forklift-rental-abu-dhabi",
  "Water Tankers": "water-tanker-rental-abu-dhabi",
  "Low Bed Trailers": "low-bed-trailer-rental-abu-dhabi",
  Generators: "generator-rental-abu-dhabi",
  "Dewatering Pumps": "dewatering-pump-rental-abu-dhabi",
  "Staff Buses": "passenger-bus-rental-abu-dhabi",
  "Luxury Coaches": "passenger-bus-rental-abu-dhabi",
  Compressors: "compressor-rental-abu-dhabi",
};

export function getRentalSlugForTag(tag: string): string | undefined {
  return tagToRentalSlug[tag];
}

export type EquipmentNavItem = {
  href: string;
  label: string;
};

/** Sub-pages linked from parent equipment pages only — not the header menu. */
const NAV_SUBPAGE_EXCLUDED = new Set([
  "14-seater-passenger-bus-rental-abu-dhabi",
  "34-seater-passenger-bus-rental-abu-dhabi",
  "66-seater-passenger-bus-rental-abu-dhabi",
  "salt-water-tanker-rental-abu-dhabi",
  "sweet-water-tanker-rental-abu-dhabi",
  "drainage-water-tanker-rental-abu-dhabi",
]);

export type EquipmentBrowseCard = {
  href: string;
  title: string;
  image: string;
  imageAlt: string;
};

const SCAFFOLDING_BROWSE_CARD: EquipmentBrowseCard = {
  href: "/scaffolding-suppliers-abu-dhabi",
  title: "Scaffolding",
  image: "/images/services/service-scaffolding.webp",
  imageAlt: "Scaffolding structures on a construction site in Abu Dhabi",
};

export function getEquipmentBrowseCards(): EquipmentBrowseCard[] {
  return [
    ...rentalHubs.map((hub) => ({
      href: getRentalHubPath(hub.slug),
      title: hub.cardTitle,
      image: hub.image,
      imageAlt: hub.imageAlt,
    })),
    SCAFFOLDING_BROWSE_CARD,
  ];
}

export const VIEW_ALL_EQUIPMENT_PATH = "/equipment-rental/all";

export type EquipmentCatalogSection = {
  id: string;
  title: string;
  shortTitle: string;
  hubHref?: string;
  cards: EquipmentBrowseCard[];
};

export function getAllEquipmentCatalogSections(): EquipmentCatalogSection[] {
  const sections: EquipmentCatalogSection[] = rentalHubs
    .map((hub) => {
      const cards = rentalPages
        .filter((page) => page.hubSlug === hub.slug || page.slug === hub.slug)
        .map((page) => ({
          href: getRentalPagePath(page.slug),
          title: page.title,
          image: page.image,
          imageAlt: page.imageAlt,
        }));

      return {
        id: hub.slug,
        title: hub.title,
        shortTitle: hub.cardTitle,
        hubHref: getRentalHubPath(hub.slug),
        cards,
      };
    })
    .filter((section) => section.cards.length > 0);

  sections.push({
    id: "scaffolding",
    title: "Scaffolding Services",
    shortTitle: "Scaffolding",
    cards: [SCAFFOLDING_BROWSE_CARD],
  });

  return sections;
}

export function getAllEquipmentMachineCards(): EquipmentBrowseCard[] {
  return getAllEquipmentCatalogSections().flatMap((section) => section.cards);
}

export function getViewAllEquipmentNavItem(): EquipmentNavItem {
  return {
    href: VIEW_ALL_EQUIPMENT_PATH,
    label: "View All Equipment",
  };
}

export function getEquipmentNavItems(): EquipmentNavItem[] {
  return [
    { href: "/#equipment", label: "Fleet Overview" },
    { href: "/#equipment-list", label: "Equipment List" },
    ...rentalHubs.map((hub) => ({
      href: getRentalHubPath(hub.slug),
      label: hub.cardTitle,
    })),
    { href: "/scaffolding-suppliers-abu-dhabi", label: "Scaffolding" },
  ];
}

/** Popular rental pages for the footer — keep this list short and well-known. */
const FOOTER_EQUIPMENT_SLUGS = [
  "crawler-excavator-rental-abu-dhabi",
  "mini-excavator-rental-abu-dhabi",
  "telehandler-rental-abu-dhabi",
  "wheel-loader-rental-abu-dhabi",
  "skid-steer-rental-abu-dhabi",
  "mobile-crane-rental-abu-dhabi",
  "forklift-rental-abu-dhabi",
  "backhoe-loader-rental-abu-dhabi",
  "generator-rental-abu-dhabi",
  "water-tanker-rental-abu-dhabi",
] as const;

export function getFooterEquipmentLinks(): EquipmentNavItem[] {
  const pages = FOOTER_EQUIPMENT_SLUGS.map((slug) => {
    const page = getRentalPage(slug);

    return {
      href: getRentalPagePath(slug),
      label: page?.title ?? slug,
    };
  });

  return [
    ...pages,
    { href: VIEW_ALL_EQUIPMENT_PATH, label: "View All Equipment" },
  ];
}
