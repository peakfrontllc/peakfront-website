import {
  ArrowUp,
  ArrowUpFromLine,
  Award,
  BadgeDollarSign,
  Boxes,
  CalendarRange,
  Construction,
  Headphones,
  Network,
  Package,
  Route,
  ShieldCheck,
  Timer,
  Truck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import capabilityData from "../../../data/capability-statement.json";

const CAPABILITY_ICONS: LucideIcon[] = [
  Boxes,
  Construction,
  ArrowUpFromLine,
  Package,
  Zap,
  ArrowUp,
  Truck,
  Users,
  Route,
  CalendarRange,
];

const WHY_ICONS: LucideIcon[] = [
  Timer,
  BadgeDollarSign,
  CalendarRange,
  Network,
  Award,
  ShieldCheck,
  Headphones,
  Truck,
];

export const TAGLINE = capabilityData.tagline;
export const OVERVIEW = capabilityData.overview;

export type CapabilityItem = {
  label: string;
  icon: LucideIcon;
};

export const coreCapabilities: CapabilityItem[] =
  capabilityData.coreCapabilities.map((label, index) => ({
    label,
    icon: CAPABILITY_ICONS[index] ?? Boxes,
  }));

export const equipmentCategories = capabilityData.equipmentCategories;
export const industriesServed = capabilityData.industriesServed;

export type WhyItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const whyPeakfront: WhyItem[] = capabilityData.whyPeakfront.map(
  (item, index) => ({
    ...item,
    icon: WHY_ICONS[index] ?? Award,
  }),
);

export const companyStrengths = capabilityData.companyStrengths;
