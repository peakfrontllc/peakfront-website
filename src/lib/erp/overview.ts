import "server-only";

import { getProjects } from "@/lib/load-projects";
import { getServiceClient } from "@/lib/supabase/service";
import { emiratesFromRow } from "@/lib/erp/shared";

export type OverviewSlice = { name: string; count: number };

export type OperationsOverview = {
  categories: number;
  equipment: number;
  availableEquipment: number;
  suppliers: number;
  clients: number;
  openRates: number;
  projects: number;
  ongoingProjects: number;
  equipmentByPurpose: OverviewSlice[];
  supplierRegions: OverviewSlice[];
  clientRegions: OverviewSlice[];
  recentProjects: { name: string; client: string; status: string; location: string }[];
};

async function activeCount(table: "equipment_categories" | "equipment" | "suppliers" | "clients") {
  const { count, error } = await getServiceClient().from(table).select("id", { count: "exact", head: true }).is("archived_at", null);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

function tally(names: string[]) {
  const counts = new Map<string, number>();
  for (const name of names) {
    const label = name.trim() || "Not set";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function loadOperationsOverview(): Promise<OperationsOverview> {
  const service = getServiceClient();
  const [
    categories,
    equipment,
    availableCount,
    suppliers,
    clients,
    ratesCount,
    projects,
    equipmentRows,
    categoryRows,
    supplierRows,
    clientRows,
  ] = await Promise.all([
    activeCount("equipment_categories"),
    activeCount("equipment"),
    getServiceClient().from("equipment").select("id", { count: "exact", head: true }).is("archived_at", null).eq("status", "available"),
    activeCount("suppliers"),
    activeCount("clients"),
    service.from("supplier_rates").select("id", { count: "exact", head: true }).is("valid_to", null),
    getProjects(),
    service.from("equipment").select("category_id").is("archived_at", null),
    service.from("equipment_categories").select("id, name, parent_id").is("archived_at", null),
    service.from("suppliers").select("emirate, emirates").is("archived_at", null),
    service.from("clients").select("emirate").is("archived_at", null),
  ]);
  if (availableCount.error) throw new Error(availableCount.error.message);
  if (ratesCount.error) throw new Error(ratesCount.error.message);
  if (equipmentRows.error) throw new Error(equipmentRows.error.message);
  if (categoryRows.error) throw new Error(categoryRows.error.message);
  if (supplierRows.error) throw new Error(supplierRows.error.message);
  if (clientRows.error) throw new Error(clientRows.error.message);

  const categoriesById = new Map((categoryRows.data ?? []).map((row) => [row.id as string, row]));
  const purposeNames = (equipmentRows.data ?? []).map((row) => {
    const category = categoriesById.get(row.category_id as string);
    const parent = category?.parent_id ? categoriesById.get(category.parent_id as string) : undefined;
    const grandparent = parent?.parent_id ? categoriesById.get(parent.parent_id as string) : undefined;
    return (grandparent?.name as string) || (parent?.name as string) || (category?.name as string) || "Uncategorised";
  });
  const supplierRegions = (supplierRows.data ?? []).flatMap((row) => emiratesFromRow(row.emirates, (row.emirate as string) ?? ""));
  const clientRegions = (clientRows.data ?? []).map((row) => (row.emirate as string) || "Not set");

  return {
    categories,
    equipment,
    availableEquipment: availableCount.count ?? 0,
    suppliers,
    clients,
    openRates: ratesCount.count ?? 0,
    projects: projects.length,
    ongoingProjects: projects.filter((project) => project.status === "ongoing").length,
    equipmentByPurpose: tally(purposeNames).slice(0, 6),
    supplierRegions: tally(supplierRegions).slice(0, 6),
    clientRegions: tally(clientRegions).slice(0, 6),
    recentProjects: projects.slice(0, 5).map((project) => ({
      name: project.projectName,
      client: project.client,
      status: project.status,
      location: project.location ?? "",
    })),
  };
}
