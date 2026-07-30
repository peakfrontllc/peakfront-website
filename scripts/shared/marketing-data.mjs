import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

export const SITE_URL = "https://peakfront.ae";

export const LEGAL_ENTITY_NAME = "Peakfront Equipment Rental LLC SPC";

export const CONTACT = {
  phone: "+971 527459432",
  email: "info@peakfront.ae",
  website: SITE_URL,
  websiteDisplay: "peakfront.ae",
  whatsapp: "wa.me/971527459432",
  address: "Mussafah Industrial Area, M-17, Abu Dhabi, United Arab Emirates",
  hours: "Sat – Thu: 7:00 – 19:00 · Fri: On call",
};

export const COMPANY = {
  name: LEGAL_ENTITY_NAME,
  shortName: "Peakfront",
  tagline: "Heavy Equipment, Transport & Power Rental Across the UAE",
  description:
    "Reliable rental solutions for contractors, infrastructure projects, industrial facilities and commercial developments across all seven emirates.",
  extended:
    "We work with trusted suppliers to provide reliable rental solutions for contractors, infrastructure projects, industrial facilities and commercial developments — combining depth of fleet with the responsiveness of a single accountable partner.",
  owner: "Irfan Dayan",
  ownerTitle: "Managing Director",
};

export const licensedActivities = [
  {
    code: "7730009",
    description:
      "Construction and Building or Demolition Machines and Equipment Renting",
  },
  {
    code: "7730008",
    description: "Pumps, Generators and Engines Renting",
  },
  { code: "7710103", description: "Buses Rental" },
  {
    code: "7730004",
    description: "Heavy Machines and Equipment Renting",
  },
  { code: "7710102", description: "Trucks Rental" },
  {
    code: "7730010",
    description: "Lifting and Loading Machines and Equipment Renting",
  },
];

export const heroStats = [
  { value: "100+", label: "Equipment Available" },
  { value: "24 hrs", label: "Fast UAE Delivery" },
  { value: "Trusted", label: "Supplier Network" },
  { value: "24/7", label: "Professional Support" },
];

export const equipmentCategories = [
  {
    slug: "heavy-equipment",
    title: "Heavy Equipment",
    image: "heavy-equipment.webp",
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
    path: "/equipment/heavy-equipment",
  },
  {
    slug: "transport",
    title: "Transport",
    image: "transport.webp",
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
    path: "/equipment/transport",
  },
  {
    slug: "buses",
    title: "Buses",
    image: "buses.webp",
    imageAlt:
      "Air-conditioned staff coaster buses for worker transport in Abu Dhabi",
    description:
      "Staff mobility solutions with licensed drivers, scheduled routes and fully air-conditioned cabins.",
    tags: ["Mini Buses", "Coaster Buses", "Luxury Coaches", "Staff Transportation"],
    path: "/equipment/buses",
  },
  {
    slug: "power-equipment",
    title: "Power Equipment",
    image: "power-equipment.webp",
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
    path: "/equipment/power-equipment",
  },
];

export const whyItems = [
  {
    title: "Professional Supplier Network",
    text: "Pre-qualified partners across the Emirates giving you depth of fleet on short notice.",
  },
  {
    title: "Competitive Prices",
    text: "Direct-source pricing with transparent daily, weekly and monthly structures.",
  },
  {
    title: "Fast Delivery",
    text: "Mobilisation in as little as four hours within Abu Dhabi and Dubai.",
  },
  {
    title: "24/7 Support",
    text: "A live rental desk for breakdowns, extensions and emergency dispatch.",
  },
  {
    title: "Reliable Equipment",
    text: "Serviced, inspected and third-party certified machines only.",
  },
  {
    title: "Flexible Rental Terms",
    text: "Scale units up or down as your programme changes — no rigid lock-ins.",
  },
];

export const timelineSteps = [
  {
    step: "01",
    title: "Send your requirement",
    text: "Share equipment type, quantity, duration and site location — by form, phone or WhatsApp.",
  },
  {
    step: "02",
    title: "Receive quotation",
    text: "A detailed rate breakdown with availability, mobilisation cost and terms, typically within the hour.",
  },
  {
    step: "03",
    title: "Equipment delivered",
    text: "We schedule transport, permits and offloading so the machine is working on arrival.",
  },
  {
    step: "04",
    title: "Project completed",
    text: "Extend, swap or demobilise on your call, with servicing handled throughout.",
  },
];

export const industries = [
  "Construction",
  "Oil & Gas",
  "Infrastructure",
  "Events",
  "Manufacturing",
  "Government Projects",
  "Utilities",
  "Logistics",
];

function loadProjects() {
  const raw = JSON.parse(
    readFileSync(join(root, "data", "projects.json"), "utf8"),
  );
  return raw.projects.filter((project) => !project.id.includes("test"));
}

export function getAboutStats() {
  const projects = loadProjects();
  const projectsRunning = projects.filter(
    (project) =>
      project.status === "ongoing" ||
      String(project.completionDate).toLowerCase() === "running",
  ).length;

  return [
    { value: "100+", label: "Units in network" },
    { value: `${projects.length}+`, label: "Contracts delivered" },
    { value: String(projectsRunning), label: "Projects running" },
  ];
}

export function getPortfolioProjects(limit = 4) {
  return loadProjects().slice(0, limit);
}

export function categoryUrl(category) {
  return `${SITE_URL}${category.path}`;
}

export function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function licenseListHtml(compact = false) {
  return licensedActivities
    .map(
      (activity) => `
      <li class="${compact ? "license-item-compact" : "license-item"}">
        <span class="license-code">${esc(activity.code)}</span>
        <span>${esc(activity.description)}</span>
      </li>`,
    )
    .join("");
}
