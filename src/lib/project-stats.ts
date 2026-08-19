import "server-only";

import { getProjects } from "@/lib/load-projects";
import { isProjectOngoing } from "@/lib/projects";

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
