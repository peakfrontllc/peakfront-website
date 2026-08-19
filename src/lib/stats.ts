import { getProjects } from "@/lib/load-projects";
import { isProjectOngoing } from "@/lib/projects";

/** Single source of truth for company metrics shown across the site. */
export const companyStats = {
  unitsInNetwork: {
    value: "100+",
    label: "Units in network",
    shortLabel: "Equipment Available",
  },
  emiratesCovered: {
    value: "7",
    label: "Emirates covered",
  },
  rentalDesk: {
    value: "24/7",
    label: "Rental desk",
    shortLabel: "Professional Support",
  },
  fastDelivery: {
    value: "24 hrs",
    label: "Fast UAE Delivery",
  },
  supplierNetwork: {
    value: "Trusted",
    label: "Supplier Network",
  },
} as const;

export async function getProjectStats() {
  const catalog = await getProjects();
  const contractsDelivered = catalog.length;
  const projectsRunning = catalog.filter(isProjectOngoing).length;

  return {
    contractsDelivered,
    contractsDeliveredLabel: `${contractsDelivered}+`,
    projectsRunning,
    projectsRunningLabel: String(projectsRunning),
  };
}
