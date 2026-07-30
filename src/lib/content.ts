import {
  Award,
  BadgeDollarSign,
  Boxes,
  CalendarDays,
  CircleCheckBig,
  Factory,
  FileText,
  Flame,
  HardHat,
  Headphones,
  Landmark,
  Network,
  PartyPopper,
  Receipt,
  Route,
  ShieldCheck,
  Ship,
  Timer,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { companyStats } from "@/lib/stats";

// Images are stored locally in /public/images/

export type EquipmentCategory = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  tags: string[];
  seo: {
    title: string;
    description: string;
    h1: string;
  };
};

export type EquipmentItem = {
  id: string;
  categorySlug: string;
  category: string;
  name: string;
  image: string;
  imageAlt: string;
  specs: [string, string][];
  rates: [string, string][];
  featured?: boolean;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Set to true only after you have confirmed this is a real client quote. */
  published: boolean;
  needsReview?: boolean;
};

export const heroStats: {
  icon: LucideIcon;
  value: string;
  label: string;
}[] = [
  {
    icon: Boxes,
    value: companyStats.unitsInNetwork.value,
    label: companyStats.unitsInNetwork.shortLabel,
  },
  {
    icon: Truck,
    value: companyStats.fastDelivery.value,
    label: companyStats.fastDelivery.label,
  },
  {
    icon: ShieldCheck,
    value: companyStats.supplierNetwork.value,
    label: companyStats.supplierNetwork.label,
  },
  {
    icon: Headphones,
    value: companyStats.rentalDesk.value,
    label: companyStats.rentalDesk.shortLabel,
  },
];

export const equipmentCategories: EquipmentCategory[] = [
  {
    slug: "heavy-equipment",
    title: "Heavy Equipment",
    image: "/images/heavy-equipment.webp",
    imageAlt:
      "Crawler excavator and earthmoving fleet on a construction site in Abu Dhabi",
    description:
      "Earthmoving and lifting fleet for excavation, grading, compaction and material handling on large-scale sites.",
    tags: [
      "Excavators",
      "Wheel Loaders",
      "Bulldozers",
      "Backhoe Loaders",
      "Skid Steers",
      "Graders",
      "Rollers",
      "Telehandlers",
      "Forklifts",
    ],
    seo: {
      title: "Heavy Equipment Rental Abu Dhabi",
      description:
        "Rent excavators, wheel loaders, bulldozers, telehandlers and earthmoving equipment in Abu Dhabi and across the UAE. Daily, weekly and monthly rates with fast mobilisation from Mussafah.",
      h1: "Heavy Equipment Rental in Abu Dhabi",
    },
  },
  {
    slug: "transport",
    title: "Transport",
    image: "/images/transport.webp",
    imageAlt:
      "Low bed trailer and heavy haulage trucks for equipment transport across the UAE",
    description:
      "Haulage and site logistics — from pickups to low bed trailers moving plant across all seven emirates.",
    tags: [
      "Pickup Trucks",
      "Flatbed Trucks",
      "Boom Trucks",
      "Low Bed Trailers",
      "Water Tankers",
      "Fuel Tankers",
      "Tipper Trucks",
    ],
    seo: {
      title: "Transport & Haulage Rental Abu Dhabi",
      description:
        "Truck, low bed trailer, water tanker and haulage rental in Abu Dhabi and the UAE. Licensed drivers, cross-emirate delivery and competitive daily rates.",
      h1: "Transport & Haulage Rental in Abu Dhabi",
    },
  },
  {
    slug: "buses",
    title: "Buses",
    image: "/images/buses.webp",
    imageAlt:
      "Air-conditioned staff coaster buses for worker transport in Abu Dhabi",
    description:
      "Staff mobility solutions with licensed drivers, scheduled routes and fully air-conditioned cabins.",
    tags: ["Mini Buses", "Coaster Buses", "Luxury Coaches", "Staff Transportation"],
    seo: {
      title: "Bus Rental Abu Dhabi",
      description:
        "Staff bus, coaster and coach rental in Abu Dhabi and across the UAE. Licensed drivers, AC cabins and flexible daily or monthly hire for camps and sites.",
      h1: "Bus Rental in Abu Dhabi",
    },
  },
  {
    slug: "power-equipment",
    title: "Power Equipment",
    image: "/images/power-equipment.webp",
    imageAlt:
      "Industrial diesel generators and dewatering pumps for temporary site power in the UAE",
    description:
      "Temporary power, dewatering and site utilities — serviced, fuelled and delivered ready to run.",
    tags: [
      "Generators",
      "Diesel Pumps",
      "Air Compressors",
      "Lighting Towers",
      "Water Pumps",
      "Diesel Engines",
    ],
    seo: {
      title: "Generator & Power Equipment Rental Abu Dhabi",
      description:
        "Generator, dewatering pump, air compressor and lighting tower rental in Abu Dhabi. Serviced equipment, fast delivery and 24/7 support from Peakfront.",
      h1: "Generator & Power Equipment Rental in Abu Dhabi",
    },
  },
];

export const equipmentItems: EquipmentItem[] = [
  {
    id: "crawler-excavator-20t",
    categorySlug: "heavy-equipment",
    category: "Heavy Equipment",
    name: "20T Crawler Excavator",
    image: "/images/crawler-excavator.webp",
    imageAlt:
      "20-tonne crawler excavator working on a construction site in Abu Dhabi",
    specs: [
      ["Operating Weight", "20,500 kg"],
      ["Bucket", "1.0 m³"],
      ["Power", "110 kW"],
    ],
    rates: [
      ["Daily", "AED 950"],
      ["Weekly", "AED 5,400"],
      ["Monthly", "AED 17,500"],
    ],
    featured: true,
  },
  {
    id: "telehandler-17m",
    categorySlug: "heavy-equipment",
    category: "Heavy Equipment",
    name: "17m Telehandler",
    image: "/images/telehandler.webp",
    imageAlt:
      "17-metre telehandler lifting materials on an industrial construction site in the UAE",
    specs: [
      ["Max Lift", "4,000 kg"],
      ["Max Height", "17 m"],
      ["Drive", "4x4"],
    ],
    rates: [
      ["Daily", "AED 700"],
      ["Weekly", "AED 3,900"],
      ["Monthly", "AED 12,800"],
    ],
    featured: true,
  },
  {
    id: "wheel-loader",
    categorySlug: "heavy-equipment",
    category: "Heavy Equipment",
    name: "Wheel Loader",
    image: "/images/heavy-equipment.webp",
    imageAlt: "Wheel loader moving aggregate on a UAE construction earthworks site",
    specs: [
      ["Operating Weight", "18,000 kg"],
      ["Bucket", "3.0 m³"],
      ["Drive", "4x4"],
    ],
    rates: [
      ["Daily", "AED 850"],
      ["Weekly", "AED 4,800"],
      ["Monthly", "AED 15,500"],
    ],
  },
  {
    id: "water-tanker-5000",
    categorySlug: "transport",
    category: "Transport",
    name: "5,000 Gal Water Tanker",
    image: "/images/water-tanker.webp",
    imageAlt:
      "5,000-gallon water tanker truck supplying dust suppression water on an Abu Dhabi site",
    specs: [
      ["Capacity", "22,700 L"],
      ["Pump", "Self-priming"],
      ["Driver", "Included"],
    ],
    rates: [
      ["Daily", "AED 600"],
      ["Weekly", "AED 3,300"],
      ["Monthly", "AED 10,500"],
    ],
    featured: true,
  },
  {
    id: "low-bed-trailer",
    categorySlug: "transport",
    category: "Transport",
    name: "Low Bed Trailer",
    image: "/images/transport.webp",
    imageAlt:
      "Low bed trailer transporting heavy plant equipment between emirates in the UAE",
    specs: [
      ["Capacity", "60 T"],
      ["Axles", "3–4 axle"],
      ["Driver", "Included"],
    ],
    rates: [
      ["Daily", "AED 1,200"],
      ["Weekly", "AED 6,500"],
      ["Monthly", "AED 21,000"],
    ],
  },
  {
    id: "coaster-bus-30",
    categorySlug: "buses",
    category: "Buses",
    name: "30-Seater Coaster Bus",
    image: "/images/buses.webp",
    imageAlt:
      "30-seater air-conditioned coaster bus for staff transport in Abu Dhabi",
    specs: [
      ["Seats", "30"],
      ["Driver", "Included"],
      ["AC", "Full cabin"],
    ],
    rates: [
      ["Daily", "AED 450"],
      ["Weekly", "AED 2,400"],
      ["Monthly", "AED 7,800"],
    ],
    featured: true,
  },
  {
    id: "luxury-coach-50",
    categorySlug: "buses",
    category: "Buses",
    name: "50-Seater Luxury Coach",
    image: "/images/buses.webp",
    imageAlt:
      "50-seater luxury coach for executive and staff group transport across the UAE",
    specs: [
      ["Seats", "50"],
      ["Driver", "Included"],
      ["Features", "Reclining seats, AC"],
    ],
    rates: [
      ["Daily", "AED 900"],
      ["Weekly", "AED 4,900"],
      ["Monthly", "AED 16,000"],
    ],
  },
  {
    id: "dewatering-pump-6in",
    categorySlug: "power-equipment",
    category: "Power Equipment",
    name: '6" Diesel Dewatering Pump',
    image: "/images/dewatering-pump.webp",
    imageAlt:
      "6-inch diesel dewatering pump operating on a construction dewatering project in Abu Dhabi",
    specs: [
      ["Flow", "220 m³/h"],
      ["Head", "28 m"],
      ["Tank", "12 h runtime"],
    ],
    rates: [
      ["Daily", "AED 320"],
      ["Weekly", "AED 1,750"],
      ["Monthly", "AED 5,600"],
    ],
    featured: true,
  },
  {
    id: "generator-500kva",
    categorySlug: "power-equipment",
    category: "Power Equipment",
    name: "500 kVA Generator",
    image: "/images/power-equipment.webp",
    imageAlt:
      "500 kVA diesel generator providing temporary power on an industrial site in the UAE",
    specs: [
      ["Output", "500 kVA"],
      ["Fuel", "Diesel"],
      ["Runtime", "24 h tank"],
    ],
    rates: [
      ["Daily", "AED 850"],
      ["Weekly", "AED 4,700"],
      ["Monthly", "AED 15,200"],
    ],
  },
];

/** Homepage featured subset — derived from the full catalog. */
export const featuredItems = equipmentItems.filter((item) => item.featured);

export function getCategoryBySlug(slug: string): EquipmentCategory | undefined {
  return equipmentCategories.find((category) => category.slug === slug);
}

export function getEquipmentByCategory(slug: string): EquipmentItem[] {
  return equipmentItems.filter((item) => item.categorySlug === slug);
}

export function getCategoryPath(slug: string): string {
  return `/equipment/${slug}`;
}

export const whyItems: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Network,
    title: "Professional Supplier Network",
    description:
      "Pre-qualified partners across the Emirates giving you depth of fleet on short notice.",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Prices",
    description:
      "Direct-source pricing with transparent daily, weekly and monthly structures.",
  },
  {
    icon: Timer,
    title: "Fast Delivery",
    description:
      "Mobilisation in as little as four hours within Abu Dhabi and Dubai.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "A live rental desk for breakdowns, extensions and emergency dispatch.",
  },
  {
    icon: Wrench,
    title: "Reliable Equipment",
    description: "Serviced, inspected and third-party certified machines only.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description:
      "Rental specialists who understand site sequencing and plant logistics.",
  },
  {
    icon: CalendarDays,
    title: "Flexible Rental Terms",
    description:
      "Scale units up or down as your programme changes — no rigid lock-ins.",
  },
  {
    icon: Award,
    title: "Quality Service",
    description:
      "One accountable point of contact from enquiry to demobilisation.",
  },
];

export const timelineSteps: {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}[] = [
  {
    icon: FileText,
    step: "Step 01",
    title: "Send your requirement",
    description:
      "Share equipment type, quantity, duration and site location — by form, phone or WhatsApp.",
  },
  {
    icon: Receipt,
    step: "Step 02",
    title: "Receive quotation",
    description:
      "A detailed rate breakdown with availability, mobilisation cost and terms, typically within the hour.",
  },
  {
    icon: Truck,
    step: "Step 03",
    title: "Equipment delivered",
    description:
      "We schedule transport, permits and offloading so the machine is working on arrival.",
  },
  {
    icon: CircleCheckBig,
    step: "Step 04",
    title: "Project completed",
    description:
      "Extend, swap or demobilise on your call, with servicing handled throughout.",
  },
];

export const industries: { icon: LucideIcon; name: string }[] = [
  { icon: HardHat, name: "Construction" },
  { icon: Flame, name: "Oil & Gas" },
  { icon: Route, name: "Infrastructure" },
  { icon: PartyPopper, name: "Events" },
  { icon: Factory, name: "Manufacturing" },
  { icon: Landmark, name: "Government Projects" },
  { icon: Zap, name: "Utilities" },
  { icon: Ship, name: "Logistics" },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Do you deliver across the UAE?",
    answer:
      "Yes. We mobilise equipment to all seven emirates. Abu Dhabi and Dubai deliveries can typically be arranged within 4–24 hours; other emirates are scheduled based on route and load.",
  },
  {
    question: "Can I rent monthly?",
    answer:
      "Yes. Every listing includes daily, weekly and monthly rates, and monthly hire carries the deepest discount. Long-term project rates are available on request for multi-unit or multi-month bookings.",
  },
  {
    question: "Do you provide operators?",
    answer:
      "Operated and self-drive options are both available depending on the equipment category. Transport, buses and water tankers come with licensed drivers included; heavy equipment can be booked dry (self-operated) or wet (with operator).",
  },
  {
    question: "How fast can equipment arrive?",
    answer:
      "Standard mobilisation is within 24 hours across Abu Dhabi and Dubai. Emergency and same-day dispatch is available for active breakdowns — call the rental desk directly for priority handling.",
  },
  {
    question: "Do you support emergency rentals?",
    answer:
      "Yes, our 24/7 rental desk handles breakdown replacements and urgent site requirements. WhatsApp or call us any time and we will confirm the nearest available unit.",
  },
];

/**
 * Client testimonials — set `published: true` only after confirming each quote
 * is from a real client. All entries below are flagged for review and hidden
 * on the live site until published.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Peakfront mobilised three excavators and a low bed to our Al Ain site inside a day. Their coordination kept our earthworks programme on schedule.",
    name: "Rashid Al Mansoori",
    role: "Project Manager, Infrastructure Contractor",
    published: false,
    needsReview: true,
  },
  {
    quote:
      "We needed staff buses on short notice for a 400-worker camp move. Peakfront had coaster buses on site the next morning, drivers included.",
    name: "Fatima Al Suwaidi",
    role: "Operations Lead, Facilities Management",
    published: false,
    needsReview: true,
  },
  {
    quote:
      "Transparent pricing and no surprises on the invoice. The monthly rate on our generators was cheaper than running our own ageing fleet.",
    name: "Michael Fernandes",
    role: "Site Manager, Industrial Contractor",
    published: false,
    needsReview: true,
  },
  {
    quote:
      "Our dewatering pump failed at 11pm mid-pour. Peakfront had a replacement unit running by 2am. That's the kind of support that keeps us calling them first.",
    name: "Ahmed Al Hashimi",
    role: "Construction Manager, Government Projects",
    published: false,
    needsReview: true,
  },
];

export const publishedTestimonials = testimonials.filter(
  (testimonial) => testimonial.published,
);

export const navLinks = [
  { href: "/#equipment", label: "Equipment" },
  { href: "/#featured", label: "Featured" },
  { href: "/#why", label: "Why Peakfront" },
  { href: "/#industries", label: "Industries" },
  { href: "/our-project", label: "Our Projects" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
] as const;

export const HERO_IMAGE = "/images/hero.webp";
export const HERO_IMAGE_ALT =
  "Crawler excavator working on a construction site in Abu Dhabi at dawn";

export const ABOUT_IMAGE = "/images/about.webp";
export const ABOUT_IMAGE_ALT =
  "Peakfront heavy equipment rental fleet staged in Mussafah, Abu Dhabi";
