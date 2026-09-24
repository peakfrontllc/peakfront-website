import { LEGAL_ENTITY_NAME } from "@/lib/license";
import {
  getBreadcrumbJsonLd,
  getFaqJsonLd,
  SITE_URL,
} from "@/lib/seo";

export const BOOMTRUCK_PATH = "/boomtruck";

export const boomtruckSeo = {
  title: "Boom Truck Crane Rental Abu Dhabi & UAE | Peakfront",
  description:
    "Rent a boom truck crane in Abu Dhabi and across the UAE. Truck-mounted knuckle boom cranes with a flatbed for generators, plant and site lifts. Daily, weekly and monthly hire from Mussafah.",
  h1: "Boom Truck Crane Rental in Abu Dhabi and the UAE",
  keywords: [
    "boom truck rental Abu Dhabi",
    "boom truck crane rental UAE",
    "boom truck rental Dubai",
    "truck mounted crane rental Abu Dhabi",
    "knuckle boom truck hire Mussafah",
    "cargo crane truck UAE",
    "boom truck with flatbed Abu Dhabi",
    "generator lift boom truck UAE",
  ],
} as const;

export const boomtruckImages = {
  hero: "/images/boomtruck/white-side.jpg",
  whiteBed: "/images/boomtruck/white-bed.jpg",
  blueCrane: "/images/boomtruck/blue-crane.jpg",
  blueFront: "/images/boomtruck/blue-front.jpg",
  generatorBed: "/images/boomtruck/generator-bed.jpg",
  generatorLift: "/images/boomtruck/generator-lift.jpg",
  crane: "/images/rental/equipment-equipment-6.webp",
  manlift: "/images/manlift/basket-platform.jpg",
} as const;

export const boomtruckWork = [
  {
    src: boomtruckImages.hero,
    alt: "White boom truck crane with a flatbed parked in Abu Dhabi",
    caption: "Flatbed boom truck",
    place: "Abu Dhabi",
  },
  {
    src: boomtruckImages.blueCrane,
    alt: "Blue boom truck with the knuckle boom crane unfolded over the bed",
    caption: "Crane unfolded",
    place: "Abu Dhabi",
  },
  {
    src: boomtruckImages.blueFront,
    alt: "Blue boom truck crane seen from the front in Abu Dhabi",
    caption: "Ready to drive",
    place: "Abu Dhabi",
  },
  {
    src: boomtruckImages.whiteBed,
    alt: "White boom truck crane with the crane folded behind the cab",
    caption: "Crane stowed for the road",
    place: "Abu Dhabi",
  },
  {
    src: boomtruckImages.generatorLift,
    alt: "Boom truck crane lifting a generator beside a lighting tower",
    caption: "Generator lift",
    place: "Abu Dhabi",
  },
  {
    src: boomtruckImages.generatorBed,
    alt: "Generator strapped on the bed of a boom truck crane",
    caption: "Load on the bed",
    place: "Abu Dhabi",
  },
] as const;

export const boomtruckAnswer =
  "A boom truck crane is a flatbed truck with a knuckle boom crane mounted behind the cab. The truck drives to the job, lifts the load, and can carry it on the bed to the next point. Peakfront Equipment Rental LLC SPC hires boom truck cranes from Mussafah, Abu Dhabi, for sites across the UAE.";

export const boomtruckServices = [
  {
    title: "Boom Truck Rental",
    text: "A telescopic boom on a truck chassis, for tower work and lifts that move between sites.",
    image: boomtruckImages.hero,
    imageAlt: "White boom truck crane with a flatbed in Abu Dhabi",
    fit: "cover",
    href: "#latest-projects",
    equipmentName: "Boom Truck",
  },
  {
    title: "Knuckle Boom Crane",
    text: "A crane behind the cab that unfolds over the bed to lift plant, generators and site materials.",
    image: boomtruckImages.blueCrane,
    imageAlt: "Knuckle boom crane unfolded on a blue boom truck",
    fit: "cover",
    href: "#generator-lifts",
    equipmentName: "Boom Truck",
  },
  {
    title: "Flatbed and Lift",
    text: "Lift the load, set it on the bed, and drive it to the next point on the same truck.",
    image: boomtruckImages.generatorBed,
    imageAlt: "Generator carried on a boom truck flatbed",
    fit: "cover",
    href: "#generator-lifts",
    equipmentName: "Boom Truck",
  },
  {
    title: "Manlift Rental",
    text: "Boom lifts, scissor lifts and compact manlifts when the job is personnel access rather than a truck boom.",
    image: boomtruckImages.manlift,
    imageAlt: "Manlift basket working at a telecom mast",
    fit: "cover",
    href: "/manlift",
    equipmentName: "Manlift",
  },
  {
    title: "Mobile Crane Rental",
    text: "Heavier steel and precast lifts, when a mobile crane is the right machine instead of a boom truck.",
    image: boomtruckImages.crane,
    imageAlt: "Mobile crane lifting a steel beam on a construction site",
    fit: "cover",
    href: "/equipment-rental/mobile-crane-rental-abu-dhabi",
    equipmentName: "Mobile Crane",
  },
] as const;

export const boomtruckSpotlights = [
  {
    id: "boom-truck-rental",
    title: "Boom truck rental",
    image: boomtruckImages.hero,
    imageAlt: "White boom truck crane with the crane folded behind the cab",
    fit: "cover",
    paragraphs: [
      "A boom truck crane is the road truck, the flatbed and the knuckle boom in one machine. It drives to the site, lifts the load, and can carry that load on the bed. When the job moves, the crane folds behind the cab and the same truck goes on.",
      `${LEGAL_ENTITY_NAME} hires boom truck cranes from Mussafah for Abu Dhabi, Dubai and the other emirates. Lift weight, radius and the size of the load are confirmed on the quote.`,
    ],
    bullets: [
      "Knuckle boom crane behind the cab",
      "Flatbed to carry the load",
      "One truck for the lift and the road",
      "Daily, weekly or monthly hire",
      "Delivery from Mussafah",
    ],
    href: "#boomtruck-contact",
    linkLabel: "Ask about boom truck hire",
    equipmentName: "Boom Truck",
  },
  {
    id: "generator-lifts",
    title: "Generator and plant lifts",
    image: boomtruckImages.generatorLift,
    imageAlt: "Boom truck crane lifting a generator",
    fit: "cover",
    paragraphs: [
      "Boom truck cranes are used to lift generators and other plant onto the bed, off a trailer, or into a tight set-down. The crane works from the truck, so a separate mobile crane is not needed for these loads.",
      "Share the weight, the size of the unit and where it has to be set. Peakfront confirms the truck before it leaves Mussafah.",
    ],
    bullets: [
      "Generators and silent sets",
      "Plant and site equipment",
      "Load carried on the flatbed",
      "Jobs that move between sites",
    ],
    href: "#latest-projects",
    linkLabel: "See boom truck jobs",
    equipmentName: "Boom Truck",
  },
  {
    id: "flatbed-crane",
    title: "Crane and flatbed together",
    image: boomtruckImages.blueCrane,
    imageAlt: "Blue boom truck with the knuckle boom crane unfolded",
    fit: "cover",
    paragraphs: [
      "The crane folds behind the cab for the road and unfolds over the bed when it is time to lift. That is the usual boom truck crane: one driver, one truck, a hook for the load and a bed to carry it.",
      "Tell us the load, the site access and whether the truck needs to stay and carry the equipment on. Tight yards and overhead lines change which truck can be sent.",
    ],
    bullets: [
      "Crane folds for travel",
      "Unfolds over the flatbed",
      "Hook for generators and plant",
      "Site access checked before delivery",
    ],
    href: "/manlift",
    linkLabel: "Manlift rental for access work",
    equipmentName: "Boom Truck",
  },
  {
    id: "boom-truck-or-crane",
    title: "Boom truck or mobile crane",
    image: boomtruckImages.crane,
    imageAlt: "Mobile crane lifting a steel beam",
    fit: "cover",
    paragraphs: [
      "A boom truck suits tower, street and lighter lifting work where the truck needs to move itself between points. A mobile crane is the usual choice for heavier steel, precast and longer-radius construction lifts.",
      "Peakfront quotes both. Send the load weight, the radius and a photo of the set-up area if you are not sure which machine fits.",
    ],
    bullets: [
      "Boom truck for tower and street work",
      "Mobile crane for heavier site lifts",
      "Manlift or scissor when only people need to go up",
      "One rental desk for the recommendation",
    ],
    href: "/equipment-rental/mobile-crane-rental-abu-dhabi",
    linkLabel: "Mobile crane rental in Abu Dhabi",
    equipmentName: "Mobile Crane",
  },
] as const;

export const boomtruckSteps = [
  {
    title: "Requirement consultation",
    text: "Tell us the tower or the load, the working height, the radius, the ground at the set-up, the emirate and the hire dates. We confirm whether a boom truck, a manlift or a mobile crane is the right machine.",
  },
  {
    title: "Equipment delivery",
    text: "Once the hire is confirmed, the truck is sent to the site. Abu Dhabi and Dubai mobilisation is typically within 24 hours. Other emirates are scheduled by route.",
  },
  {
    title: "Project support",
    text: "The rental desk stays available through the hire. If the height, the duration or the next site changes, we confirm the booking before the truck moves.",
  },
] as const;

export const boomtruckReasons = [
  {
    title: "Licensed lifting rental",
    text: "Peakfront is licensed in Abu Dhabi for lifting and loading machines and equipment renting, from a head office in Mussafah Industrial Area, M-17.",
  },
  {
    title: "All seven emirates",
    text: "Boom trucks are delivered across the UAE. Abu Dhabi and Dubai mobilisation is typically within 24 hours; other emirates are scheduled by route.",
  },
  {
    title: "Day, week or month",
    text: "Book a single tower visit or a longer programme. Monthly hire suits a run of sites that use the same truck.",
  },
  {
    title: "One rental desk",
    text: "Boom trucks sit alongside manlifts, mobile cranes and transport, so related machines can be hired through the same contact.",
  },
] as const;

export const boomtruckAreas = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export const boomtruckFaqs = [
  {
    question: "What is a boom truck crane?",
    answer:
      "A boom truck crane is a flatbed truck with a knuckle boom crane behind the cab. It drives to the job, lifts the load with the crane, and can carry that load on the bed. Peakfront confirms the lift weight and radius before the truck is sent.",
  },
  {
    question: "Do you rent boom truck cranes in Abu Dhabi?",
    answer:
      "Yes. Boom truck cranes are hired from Mussafah, Abu Dhabi, for sites in Abu Dhabi, Dubai and the other emirates. Share the load, the site and the hire dates, and the rental desk confirms the truck.",
  },
  {
    question: "What is the difference between a boom truck and a manlift?",
    answer:
      "A boom truck crane lifts and carries materials. A manlift lifts people in a basket. Peakfront rents both. Use a boom truck crane for generators, plant and other loads. Use a manlift when people need to work at height.",
  },
  {
    question: "What is the difference between a boom truck and a mobile crane?",
    answer:
      "A boom truck crane lifts a load and can carry it on its own flatbed. A mobile crane is the usual choice for heavier steel, precast and longer-radius construction lifts. Send the load weight and the radius if you need help choosing.",
  },
  {
    question: "How high can the boom truck reach?",
    answer:
      "Reach and lift capacity depend on the truck and how far the load sits from the crane. Peakfront confirms the weight, the radius and the truck when you request a quote. One published figure does not cover every boom truck.",
  },
  {
    question: "Do you provide an operator?",
    answer:
      "Operated hire and dry hire depend on the machine. Tell the rental desk if you need an operator, and that is included in the quote.",
  },
  {
    question: "How fast can a boom truck be delivered?",
    answer:
      "Abu Dhabi and Dubai mobilisation is typically within 24 hours of a confirmed booking. Other emirates are scheduled by route. The 24/7 rental desk takes the request outside ordinary site hours.",
  },
  {
    question: "Can I hire a boom truck for one day?",
    answer:
      "Yes. Boom truck cranes are available for daily, weekly and monthly hire. A single day suits one lift or one delivery. A longer booking suits a run of sites.",
  },
  {
    question: "How much does boom truck rental cost?",
    answer:
      "The rate depends on the truck, the hire duration and the delivery location. Peakfront quotes a firm price after those details are known. One rate does not cover every job.",
  },
  {
    question: "What do you need to quote a boom truck?",
    answer:
      "Peakfront needs the emirate and site location, what is being lifted, the approximate weight, how far the load sits from the truck, the hire dates, and whether you need an operator. Photos of the set-up area help when access is tight.",
  },
];

export function getBoomtruckPageJsonLd() {
  const pageUrl = `${SITE_URL}${BOOMTRUCK_PATH}`;

  return [
    getBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Boom Truck Rental", path: BOOMTRUCK_PATH },
    ]),
    getFaqJsonLd(boomtruckFaqs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: boomtruckSeo.title,
      description: boomtruckSeo.description,
      inLanguage: "en-AE",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${pageUrl}#service` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}${boomtruckImages.hero}`,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#boomtruck-answer", "#boomtruck-faq"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Boom Truck Rental",
      serviceType: "Boom truck and truck-mounted telescopic boom rental",
      url: pageUrl,
      description: boomtruckSeo.description,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: [
        { "@type": "City", name: "Abu Dhabi" },
        { "@type": "City", name: "Dubai" },
        { "@type": "City", name: "Sharjah" },
        { "@type": "Country", name: "United Arab Emirates" },
      ],
      offers: {
        "@type": "Offer",
        url: pageUrl,
        availability: "https://schema.org/InStock",
        areaServed: "AE",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to rent a boom truck in Abu Dhabi",
      description:
        "Request a boom truck crane from Peakfront for generator, plant and site lifts in Abu Dhabi or elsewhere in the UAE.",
      step: boomtruckSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.text,
      })),
    },
  ];
}
