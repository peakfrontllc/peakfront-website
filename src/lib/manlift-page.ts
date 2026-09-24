import { CONTACT } from "@/lib/constants";
import { LEGAL_ENTITY_NAME } from "@/lib/license";
import {
  getBreadcrumbJsonLd,
  getFaqJsonLd,
  SITE_URL,
} from "@/lib/seo";

export const MANLIFT_PATH = "/manlift";

export const manliftSeo = {
  title: "Manlift Rental Abu Dhabi & UAE | Peakfront",
  description:
    "Rent manlifts, truck-mounted manlifts, boom lifts and scissor lifts in Abu Dhabi and the UAE. Daily, weekly and monthly hire from Mussafah.",
  h1: "Reliable Manlift & Access Equipment Rental in the UAE",
  keywords: [
    "manlift rental Abu Dhabi",
    "truck mounted manlift rental Abu Dhabi",
    "truck mounted manlift UAE",
    "manlift rental UAE",
    "manlift rental Dubai",
    "boom lift rental Abu Dhabi",
    "scissor lift rental UAE",
    "cherry picker rental Abu Dhabi",
    "aerial work platform rental UAE",
    "access equipment rental Mussafah",
  ],
} as const;

export const manliftImages = {
  hero: "/images/manlift/telecom-boom.jpg",
  yard: "/images/manlift/telecom-yard.jpg",
  basketTrees: "/images/manlift/basket-trees.jpg",
  basketPlatform: "/images/manlift/basket-platform.jpg",
  truckDusk: "/images/manlift/truck-mounted-dusk.jpg",
  truckReach: "/images/manlift/truck-mounted-reach.jpg",
  truckTower: "/images/manlift/truck-mounted-tower.jpg",
  truckSite: "/images/manlift/truck-mounted-site.jpg",
  latticeWide: "/images/manlift/lattice-wide.jpg",
  latticeBasket: "/images/manlift/lattice-basket.jpg",
  latticeDishes: "/images/manlift/lattice-dishes.jpg",
  latticeSun: "/images/manlift/lattice-sun.jpg",
  latticeSite: "/images/manlift/lattice-site.jpg",
  latticeSetup: "/images/manlift/lattice-setup.jpg",
  manlift: "/images/rental/equipment-diesel-e450aj-articulated.webp",
  scissor: "/images/rental/equipment-scissor-lift.webp",
  crane: "/images/rental/equipment-equipment-6.webp",
} as const;

export const manliftWork = [
  {
    src: manliftImages.latticeWide,
    alt: "Truck-mounted manlift boom extended beside a lattice telecom tower in Abu Dhabi",
    caption: "Lattice tower access",
    place: "Abu Dhabi",
  },
  {
    src: manliftImages.latticeSun,
    alt: "Manlift boom reaching the head of a lattice telecom tower",
    caption: "Boom to the tower head",
    place: "Abu Dhabi",
  },
  {
    src: manliftImages.latticeBasket,
    alt: "Manlift basket positioned against the steel of a lattice tower",
    caption: "Basket at the steelwork",
    place: "Abu Dhabi",
  },
  {
    src: manliftImages.latticeDishes,
    alt: "Manlift basket beside satellite dishes on a telecom tower",
    caption: "Dish and antenna work",
    place: "Abu Dhabi",
  },
  {
    src: manliftImages.latticeSite,
    alt: "Truck-mounted manlift set up on a compound next to a lattice tower",
    caption: "Full site setup",
    place: "Abu Dhabi",
  },
  {
    src: manliftImages.latticeSetup,
    alt: "Truck-mounted manlift with the boom lowered under a lattice tower",
    caption: "Positioned under the tower",
    place: "Abu Dhabi",
  },
  {
    src: manliftImages.hero,
    alt: "Truck-mounted manlift boom raised to a telecom mast in Abu Dhabi",
    caption: "Monopole mast",
    place: "Abu Dhabi",
  },
  {
    src: manliftImages.truckTower,
    alt: "Iveco Magirus truck-mounted manlift at a solar lighting tower",
    caption: "Solar lighting tower",
    place: "Abu Dhabi",
  },
  {
    src: manliftImages.truckDusk,
    alt: "Iveco Magirus truck-mounted manlift beside a lighting tower at dusk",
    caption: "Lighting tower at dusk",
    place: "Abu Dhabi",
  },
] as const;

export const manliftAnswer =
  "A manlift is an aerial work platform that raises people and tools to work at height. Peakfront Equipment Rental LLC SPC rents truck-mounted manlifts, boom lifts, scissor lifts and compact manlifts from Mussafah, Abu Dhabi, for sites across the UAE.";

export const manliftServices = [
  {
    title: "Truck Mounted Manlift",
    text: "A boom and basket on a truck, ready to drive between street, façade and maintenance sites.",
    image: manliftImages.hero,
    imageAlt: "Truck-mounted manlift working on a telecom tower in Abu Dhabi",
    fit: "cover",
    href: "#latest-projects",
    equipmentName: "Truck Mounted Manlift",
  },
  {
    title: "Manlift Rental",
    text: "Personnel lifts for construction, maintenance and industrial work at height.",
    image: manliftImages.basketPlatform,
    imageAlt: "Manlift basket at a telecom mast in Abu Dhabi",
    fit: "cover",
    href: "/equipment-rental/manlift-rental-abu-dhabi",
    equipmentName: "Manlift",
  },
  {
    title: "Boom Lift Rental",
    text: "Articulating and telescopic boom lifts for façades, steel and MEP access.",
    image: manliftImages.truckTower,
    imageAlt: "Boom raised beside a solar lighting tower",
    fit: "cover",
    href: "/equipment-rental/boom-lift-rental-abu-dhabi",
    equipmentName: "Boom Lift",
  },
  {
    title: "Scissor Lift Rental",
    text: "Stable vertical platforms for ceilings, warehouses and indoor fit-out.",
    image: manliftImages.scissor,
    imageAlt: "Scissor lift for warehouse and fit-out work in the UAE",
    fit: "contain",
    href: "#scissor-lift-rental",
    equipmentName: "Scissor Lift",
  },
  {
    title: "Cherry Picker Rental",
    text: "Basket-on-boom access for maintenance, glazing and short elevated tasks.",
    image: manliftImages.basketTrees,
    imageAlt: "Manlift basket positioned for work beside a tower compound",
    fit: "cover",
    href: "/equipment-rental/boom-lift-rental-abu-dhabi",
    equipmentName: "Cherry Picker",
  },
  {
    title: "Mobile Crane Rental",
    text: "Mobile cranes for steel, precast and other lifts alongside access equipment.",
    image: manliftImages.crane,
    imageAlt: "Mobile crane lifting a steel beam on a construction site",
    fit: "cover",
    href: "/equipment-rental/mobile-crane-rental-abu-dhabi",
    equipmentName: "Mobile Crane",
  },
] as const;

export const manliftSpotlights = [
  {
    id: "truck-mounted-manlift",
    title: "Truck-mounted manlift rental",
    image: manliftImages.latticeWide,
    imageAlt: "Truck-mounted manlift beside a lattice telecom tower in Abu Dhabi",
    fit: "cover",
    paragraphs: [
      "A truck-mounted manlift is a boom and work basket fixed to a truck chassis. The truck drives to the job, sets up on its outriggers, and moves to the next point without a separate low-bed. Peakfront’s Iveco Magirus unit is used on tall lighting towers, street assets and other work spread across a site.",
      "Hire is from Mussafah for Abu Dhabi, Dubai and the other emirates. Working height and basket capacity are confirmed when you request a quote, so the truck matches the tower, façade or street you are working on.",
    ],
    bullets: [
      "Street light and utility maintenance",
      "Building façade cleaning and repairs",
      "Electrical installation and signage",
      "Jobs that move between several sites",
      "Daily, weekly or monthly hire",
    ],
    href: "#manlift-contact",
    linkLabel: "Ask about truck-mounted hire",
    equipmentName: "Truck Mounted Manlift",
  },
  {
    id: "manlift-rental",
    title: "Manlift rental",
    image: manliftImages.basketPlatform,
    imageAlt: "Manlift basket working at a telecom mast in Abu Dhabi",
    fit: "cover",
    paragraphs: [
      "Manlift rental from Peakfront gives crews a mobile platform for construction, facility maintenance, electrical work, painting and building cleaning. The machine arrives at the work front, lifts the team and their tools, and moves on when that face is finished.",
      "Published boom lifts run to 14 m, 18 m and 24 m. Published scissor lifts run to 8 m, 12 m and 14 m. Compact vertical manlifts cover lower indoor work. Tell us the height and whether the site is indoors or outdoors, and we confirm the model before delivery.",
    ],
    bullets: [
      "Building and façade maintenance",
      "Glass and signage installation",
      "Electrical and MEP works",
      "Warehouse and plant-room access",
      "Industrial construction and shutdowns",
    ],
    href: "/equipment-rental/manlift-rental-abu-dhabi",
    linkLabel: "Compact manlift rental in Abu Dhabi",
    equipmentName: "Manlift",
  },
  {
    id: "boom-lift-rental",
    title: "Boom lift rental",
    image: manliftImages.truckTower,
    imageAlt: "Boom raised beside a solar lighting tower",
    fit: "cover",
    paragraphs: [
      "A boom lift reaches up and over obstacles. Articulating models bend around steel, canopies and façade lines. Telescopic models extend in a straighter line when the basket needs distance from the base.",
      "Peakfront lists 14 m, 18 m and 24 m boom lifts. Electric units suit indoor slabs. Diesel units suit outdoor ground. Hire can be a day, a week or a month, with delivery to the active work front.",
    ],
    bullets: [
      "Façade, cladding and painting",
      "Steel erection support and MEP risers",
      "Outdoor maintenance on uneven ground",
      "Electric models for internal floors",
    ],
    href: "/equipment-rental/boom-lift-rental-abu-dhabi",
    linkLabel: "Boom lift rental in Abu Dhabi",
    equipmentName: "Boom Lift",
  },
  {
    id: "scissor-lift-rental",
    title: "Scissor lift rental",
    image: manliftImages.scissor,
    imageAlt: "Scissor lift raised for indoor access work",
    fit: "contain",
    paragraphs: [
      "A scissor lift rises straight up on a broad deck. It is the usual choice when several people, or people plus materials, need a level platform for ceiling works, racking, warehousing or fit-out.",
      "Listed heights are 8 m, 12 m and 14 m. Electric scissors stay on indoor slabs. Rough-terrain scissors handle outdoor ground. Peakfront confirms platform height and the delivery slot when you book.",
    ],
    bullets: [
      "Ceiling services and lighting",
      "Warehouse racking and stock access",
      "Retail and commercial fit-out",
      "Rough-terrain models for site ground",
    ],
    href: "/equipment-rental/scissor-lift-rental-abu-dhabi",
    linkLabel: "Scissor lift rental in Abu Dhabi",
    equipmentName: "Scissor Lift",
  },
  {
    id: "cherry-picker-rental",
    title: "Cherry picker rental",
    image: manliftImages.basketTrees,
    imageAlt: "Manlift basket positioned for work beside a tower compound",
    fit: "cover",
    paragraphs: [
      "A cherry picker is a boom-type manlift: a hydraulic arm with a basket for one or two people and their tools. On this fleet, cherry picker hire is the articulating and telescopic boom lifts listed at 14 m, 18 m and 24 m.",
      "Crews use them for electrical maintenance, façade cleaning, glazing and short installation jobs where scaffold would take longer to erect than the work itself. Setup is at the machine, and the basket can be positioned around obstacles.",
    ],
    bullets: [
      "Safe access to elevated work points",
      "Faster setup than a full scaffold",
      "Reach up and over obstructions",
      "Daily, weekly or monthly hire",
    ],
    href: "/equipment-rental/boom-lift-rental-abu-dhabi",
    linkLabel: "View boom lift rental",
    equipmentName: "Cherry Picker",
  },
] as const;

export const manliftSteps = [
  {
    title: "Requirement consultation",
    text: "Tell us the working height, whether the site is indoors or outdoors, the emirate and the hire dates. We recommend a truck-mounted manlift, boom lift, scissor lift or cherry picker to match the job.",
  },
  {
    title: "Equipment delivery",
    text: "Once the hire is confirmed, the machine is delivered to the work front. Abu Dhabi and Dubai mobilisation is typically within 24 hours. Other emirates are scheduled by route.",
  },
  {
    title: "Project support",
    text: "The rental desk stays available through the hire. If the height, duration or site changes, we confirm the next machine or an extended booking.",
  },
] as const;

export const manliftReasons = [
  {
    title: "Licensed lifting rental",
    text: "Peakfront is licensed in Abu Dhabi for lifting and loading machines and equipment renting, from a head office in Mussafah Industrial Area, M-17.",
  },
  {
    title: "All seven emirates",
    text: "Manlifts are delivered across the UAE. Abu Dhabi and Dubai mobilisation is typically within 24 hours; other emirates are scheduled by route.",
  },
  {
    title: "Day, week or month",
    text: "Book a single shift or a multi-week fit-out. Monthly hire is the practical option when the same platform stays on a longer programme.",
  },
  {
    title: "One rental desk",
    text: "Access equipment sits alongside cranes, telehandlers, generators and transport, so a site can hire related machines through the same contact.",
  },
] as const;

export const manliftAreas = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export const manliftFaqs: { question: string; answer: string }[] = [
  {
    question: "What is a manlift?",
    answer:
      "A manlift is an aerial work platform that lifts workers and their tools to an elevated work area. In the UAE the same machines are also called cherry pickers or access platforms. Peakfront rents truck-mounted manlifts, boom lifts, scissor lifts and compact manlifts.",
  },
  {
    question: "Do you rent truck-mounted manlifts in Abu Dhabi?",
    answer:
      "Yes. A truck-mounted manlift is a boom and basket mounted on a truck, so it can drive between sites. Peakfront hires them from Mussafah for street lighting, façade work, electrical installation, signage and other jobs that move. Share the working height, basket load and location, and the rental desk confirms the truck.",
  },
  {
    question:
      "What is the difference between a manlift, a boom lift and a scissor lift?",
    answer:
      "A boom lift has an articulating or telescopic arm that reaches up and over obstacles. A scissor lift rises straight up on a larger, stable platform. A compact manlift is a smaller vertical personnel lift for tight indoor spaces. All three are types of aerial work platform. The right machine depends on height, reach, ground conditions and how many people need to stand on the platform.",
  },
  {
    question: "Where can I rent a manlift in Abu Dhabi?",
    answer: `${LEGAL_ENTITY_NAME} rents manlifts from Mussafah Industrial Area, M-17, Abu Dhabi, and delivers them to sites across Abu Dhabi and the wider UAE. Call ${CONTACT.phone}, email ${CONTACT.email}, or request a quote on this page.`,
  },
  {
    question: "Do you deliver manlifts to Dubai, Sharjah and the other emirates?",
    answer:
      "Yes. Peakfront delivers manlifts to all seven emirates. Abu Dhabi and Dubai deliveries are typically arranged within 24 hours. Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah are scheduled according to the route and the machine.",
  },
  {
    question: "What manlift heights can I rent?",
    answer:
      "Published boom lift heights are 14 m, 18 m and 24 m. Published scissor lift heights are 8 m, 12 m and 14 m. Compact manlifts cover lower indoor work. Share the working height you need and Peakfront will confirm the available model.",
  },
  {
    question: "How much does manlift rental cost in Abu Dhabi?",
    answer:
      "Manlift rental rates depend on the machine, working height, whether the hire is daily, weekly or monthly, and the delivery location. Peakfront quotes a firm price after those details are known. One rate does not cover every boom, scissor and compact manlift.",
  },
  {
    question: "Do you provide a manlift operator?",
    answer:
      "Operated hire and dry hire are both available, depending on the model. Peakfront confirms whether an operator is included, and what the site needs to provide, when the booking is made.",
  },
  {
    question: "Can I rent a manlift for one day?",
    answer:
      "Yes. Manlifts are available for daily, weekly and monthly hire. A single day or shift suits short tasks. Monthly hire is the usual choice when the same platform stays on site for a longer programme.",
  },
  {
    question: "How fast can a manlift arrive on site?",
    answer:
      "Standard mobilisation is within 24 hours in Abu Dhabi and Dubai. For an urgent requirement, call or WhatsApp the rental desk and Peakfront will confirm the nearest available unit.",
  },
  {
    question: "Can a manlift be used indoors?",
    answer:
      "Yes, when the model matches the building. Electric boom lifts and electric scissor lifts are used on indoor slabs and in warehouses. Diesel and rough-terrain models are for outdoor sites. Floor loading, door width and ceiling height decide which indoor machine will fit.",
  },
  {
    question: "What do you need to quote a manlift?",
    answer:
      "Peakfront needs the emirate and site location, whether the work is indoors or outdoors, the working height, the hire dates, and whether you need an operator. Photos of the access route help when the site is tight.",
  },
];

export function getManliftPageJsonLd() {
  const pageUrl = `${SITE_URL}${MANLIFT_PATH}`;

  return [
    getBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Manlift Rental", path: MANLIFT_PATH },
    ]),
    getFaqJsonLd(manliftFaqs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: manliftSeo.title,
      description: manliftSeo.description,
      inLanguage: "en-AE",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${pageUrl}#service` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}${manliftImages.truckReach}`,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#manlift-answer", "#manlift-faq"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Manlift Rental",
      serviceType: "Aerial work platform and manlift rental",
      url: pageUrl,
      description: manliftSeo.description,
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
      name: "How to rent a manlift in Abu Dhabi",
      description:
        "Request a boom lift, scissor lift or compact manlift from Peakfront for a site in Abu Dhabi or elsewhere in the UAE.",
      step: manliftSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.text,
      })),
    },
  ];
}
