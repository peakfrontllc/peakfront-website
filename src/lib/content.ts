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

// Images are stored locally in /public/images/

export const heroStats: {
  icon: LucideIcon;
  value: string;
  label: string;
}[] = [
  { icon: Boxes, value: "500+", label: "Equipment Available" },
  { icon: Truck, value: "24 hrs", label: "Fast UAE Delivery" },
  { icon: ShieldCheck, value: "Trusted", label: "Supplier Network" },
  { icon: Headphones, value: "24/7", label: "Professional Support" },
];

export const equipmentCategories: {
  title: string;
  image: string;
  description: string;
  tags: string[];
}[] = [
  {
    title: "Heavy Equipment",
    image: "/images/heavy-equipment.webp",
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
  },
  {
    title: "Transport",
    image: "/images/transport.webp",
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
  },
  {
    title: "Buses",
    image: "/images/buses.webp",
    description:
      "Staff mobility solutions with licensed drivers, scheduled routes and fully air-conditioned cabins.",
    tags: ["Mini Buses", "Coaster Buses", "Luxury Coaches", "Staff Transportation"],
  },
  {
    title: "Power Equipment",
    image: "/images/power-equipment.webp",
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
  },
];

export const featuredItems: {
  category: string;
  name: string;
  image: string;
  specs: [string, string][];
  rates: [string, string][];
}[] = [
  {
    category: "Heavy Equipment",
    name: "20T Crawler Excavator",
    image: "/images/crawler-excavator.webp",
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
  },
  {
    category: "Heavy Equipment",
    name: "17m Telehandler",
    image: "/images/telehandler.webp",
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
  },
  {
    category: "Transport",
    name: "5,000 Gal Water Tanker",
    image: "/images/water-tanker.webp",
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
  },
  {
    category: "Power Equipment",
    name: '6" Diesel Dewatering Pump',
    image: "/images/dewatering-pump.webp",
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
  },
];

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

export const testimonials: {
  quote: string;
  name: string;
  role: string;
}[] = [
  {
    quote:
      "Peakfront mobilised three excavators and a low bed to our Al Ain site inside a day. Their coordination kept our earthworks programme on schedule.",
    name: "Rashid Al Mansoori",
    role: "Project Manager, Infrastructure Contractor",
  },
  {
    quote:
      "We needed staff buses on short notice for a 400-worker camp move. Peakfront had coaster buses on site the next morning, drivers included.",
    name: "Fatima Al Suwaidi",
    role: "Operations Lead, Facilities Management",
  },
  {
    quote:
      "Transparent pricing and no surprises on the invoice. The monthly rate on our generators was cheaper than running our own ageing fleet.",
    name: "Michael Fernandes",
    role: "Site Manager, Industrial Contractor",
  },
  {
    quote:
      "Our dewatering pump failed at 11pm mid-pour. Peakfront had a replacement unit running by 2am. That's the kind of support that keeps us calling them first.",
    name: "Ahmed Al Hashimi",
    role: "Construction Manager, Government Projects",
  },
];

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

export const ABOUT_IMAGE = "/images/about.webp";
