import "server-only";

import { getServiceClient } from "@/lib/supabase/service";
import { isCurrentRate, searchTerm } from "@/lib/erp/shared";

export type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  parentName: string;
  tonnage: string;
  archivedAt: string | null;
};

export type EquipmentListItem = {
  id: string;
  code: string;
  name: string;
  capacity: string;
  ownership: string;
  status: string;
  categoryName: string;
  purposeName: string;
  typeName: string;
  sizeName: string;
  suppliers: { id: string; name: string; phone: string }[];
  archivedAt: string | null;
};

export type EquipmentSupplier = {
  supplierId: string;
  supplierName: string;
  phone: string;
  leadTime: string;
  dailyRate: number | null;
  weeklyRate: number | null;
  monthlyRate: number | null;
};

function cataloguePlace(category: CategoryOption | undefined, categories: Map<string, CategoryOption>, capacity: string) {
  const parent = category?.parentId ? categories.get(category.parentId) : undefined;
  const grandparent = parent?.parentId ? categories.get(parent.parentId) : undefined;
  if (category && parent && grandparent) {
    return { purposeName: grandparent.name, typeName: parent.name, sizeName: category.name };
  }
  if (category && parent) {
    return { purposeName: parent.name, typeName: category.name, sizeName: capacity };
  }
  return { purposeName: category?.name ?? "", typeName: category?.name ?? "", sizeName: capacity };
}

function sizeRank(value: string) {
  const number = Number(value.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0]);
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER;
}

export function categoryLabel(category: Pick<CategoryOption, "name" | "parentName" | "tonnage">) {
  const title = category.parentName ? `${category.parentName} · ${category.name}` : category.name;
  if (!category.tonnage || category.tonnage.toLowerCase() === category.name.toLowerCase()) return title;
  return `${title} · ${category.tonnage}`;
}

export type EquipmentDetail = Omit<EquipmentListItem, "suppliers" | "purposeName" | "typeName" | "sizeName"> & {
  categoryId: string;
  description: string;
  specs: { id: string; label: string; value: string }[];
  assets: {
    id: string;
    assetCode: string;
    serialNumber: string;
    registrationNumber: string;
    yearMade: string;
    status: string;
    location: string;
    notes: string;
    archivedAt: string | null;
  }[];
  images: { id: string; storagePath: string; alt: string }[];
  documents: {
    id: string;
    docType: string;
    title: string;
    storagePath: string;
    expiresOn: string | null;
  }[];
  maintenance: {
    id: string;
    servicedOn: string;
    description: string;
    nextDueOn: string | null;
  }[];
};

function categoryName(value: { name: string } | { name: string }[] | null) {
  if (!value) return "";
  return Array.isArray(value) ? value[0]?.name ?? "" : value.name;
}

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  tonnage: string;
  archived_at: string | null;
};

async function loadCategoryRows(includeArchived: boolean) {
  let query = getServiceClient()
    .from("equipment_categories")
    .select("id, name, slug, description, parent_id, tonnage, archived_at")
    .order("name");
  if (!includeArchived) query = query.is("archived_at", null);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as CategoryRow[];
}

function toCategoryOptions(rows: CategoryRow[]): CategoryOption[] {
  const names = new Map(rows.map((row) => [row.id, row.name]));
  const options = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    parentId: row.parent_id,
    parentName: row.parent_id ? names.get(row.parent_id) ?? "" : "",
    tonnage: row.tonnage ?? "",
    archivedAt: row.archived_at,
  }));
  const sortKey = (item: CategoryOption) => {
    const family = item.parentName || item.name;
    const number = Number(item.name.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0]);
    const size = Number.isFinite(number) ? String(Math.round(number * 100)).padStart(8, "0") : `z-${item.name}`;
    return `${family}\u0000${item.parentId ? "1" : "0"}\u0000${size}`;
  };
  return options.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}

export async function listCategories(includeArchived = false): Promise<CategoryOption[]> {
  return toCategoryOptions(await loadCategoryRows(includeArchived));
}

export async function listEquipment(filters: {
  q?: string;
  category?: string;
  archived?: boolean;
}): Promise<EquipmentListItem[]> {
  const categories = await listCategories(true);
  const byId = new Map(categories.map((category) => [category.id, category]));
  let query = getServiceClient()
    .from("equipment")
    .select("id, code, name, capacity, ownership, status, archived_at, category_id")
    .order("name");
  query = filters.archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  if (filters.category) {
    const ids = new Set([filters.category]);
    let grew = true;
    while (grew) {
      grew = false;
      for (const category of categories) {
        if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
          ids.add(category.id);
          grew = true;
        }
      }
    }
    query = query.in("category_id", ids.size > 0 ? [...ids] : ["00000000-0000-0000-0000-000000000000"]);
  }
  const term = searchTerm(filters.q);
  if (term) {
    query = query.or(`name.ilike.%${term}%,code.ilike.%${term}%,capacity.ilike.%${term}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const equipmentIds = (data ?? []).map((row) => row.id as string);
  const suppliersByEquipment = new Map<string, { id: string; name: string; phone: string }[]>();
  if (equipmentIds.length > 0) {
    const { data: links, error: linkError } = await getServiceClient()
      .from("supplier_equipment")
      .select("equipment_id, suppliers(id, company_name, phone, archived_at)")
      .in("equipment_id", equipmentIds);
    if (linkError) throw new Error(linkError.message);
    for (const link of links ?? []) {
      const equipmentId = link.equipment_id as string;
      const linked = Array.isArray(link.suppliers) ? link.suppliers[0] : link.suppliers;
      if (!linked || linked.archived_at) continue;
      const supplier = {
        id: linked.id as string,
        name: linked.company_name as string,
        phone: (linked.phone as string) ?? "",
      };
      const current = suppliersByEquipment.get(equipmentId) ?? [];
      if (!current.some((item) => item.id === supplier.id)) current.push(supplier);
      suppliersByEquipment.set(equipmentId, current);
    }
    for (const suppliers of suppliersByEquipment.values()) {
      suppliers.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  return (data ?? []).map((row) => {
    const category = byId.get(row.category_id as string);
    const place = cataloguePlace(category, byId, (row.capacity as string) ?? "");
    return {
      id: row.id as string,
      code: (row.code as string | null) ?? "",
      name: row.name as string,
      capacity: row.capacity as string,
      ownership: row.ownership as string,
      status: row.status as string,
      categoryName: category ? categoryLabel(category) : "",
      purposeName: place.purposeName,
      typeName: place.typeName,
      sizeName: place.sizeName,
      suppliers: suppliersByEquipment.get(row.id as string) ?? [],
      archivedAt: (row.archived_at as string | null) ?? null,
    };
  }).sort((a, b) => (
    a.purposeName.localeCompare(b.purposeName)
    || a.typeName.localeCompare(b.typeName)
    || sizeRank(a.sizeName) - sizeRank(b.sizeName)
    || a.name.localeCompare(b.name)
  ));
}

export async function listEquipmentSuppliers(equipmentId: string): Promise<EquipmentSupplier[]> {
  const { data, error } = await getServiceClient()
    .from("supplier_equipment")
    .select(`
      lead_time,
      suppliers(id, company_name, phone, archived_at),
      supplier_rates(daily_rate, weekly_rate, monthly_rate, valid_from, valid_to)
    `)
    .eq("equipment_id", equipmentId);
  if (error) throw new Error(error.message);

  return (data ?? []).flatMap((row) => {
    const linked = Array.isArray(row.suppliers) ? row.suppliers[0] : row.suppliers;
    if (!linked || linked.archived_at) return [];
    const rates = [...((row.supplier_rates as {
      daily_rate: number | string | null;
      weekly_rate: number | string | null;
      monthly_rate: number | string | null;
      valid_from: string;
      valid_to: string | null;
    }[]) ?? [])]
      .filter((rate) => isCurrentRate(rate.valid_from, rate.valid_to))
      .sort((a, b) => b.valid_from.localeCompare(a.valid_from));
    const current = rates[0];
    const money = (value: number | string | null | undefined) => {
      if (value === null || value === undefined) return null;
      const amount = Number(value);
      return Number.isFinite(amount) ? amount : null;
    };
    return [{
      supplierId: linked.id as string,
      supplierName: linked.company_name as string,
      phone: (linked.phone as string) ?? "",
      leadTime: (row.lead_time as string) ?? "",
      dailyRate: money(current?.daily_rate),
      weeklyRate: money(current?.weekly_rate),
      monthlyRate: money(current?.monthly_rate),
    }];
  }).sort((a, b) => a.supplierName.localeCompare(b.supplierName));
}

export type EquipmentOption = {
  id: string;
  name: string;
  code: string;
  group: string;
  label: string;
};

function equipmentOption(row: { id: string; name: string; code: string | null; capacity: string; category_id: string }, categories: CategoryOption[]): EquipmentOption {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const category = byId.get(row.category_id);
  const parent = category?.parentId ? byId.get(category.parentId) : undefined;
  const grandparent = parent?.parentId ? byId.get(parent.parentId) : undefined;
  const typeName = grandparent ? parent?.name ?? category?.name ?? "Equipment" : category?.name ?? "Equipment";
  const purposeName = grandparent?.name ?? parent?.name ?? "";
  const sizeName = grandparent ? category?.name ?? row.capacity : row.capacity;
  const group = purposeName && purposeName !== typeName ? `${purposeName} · ${typeName}` : typeName;
  const name = row.name;
  const parts = [sizeName, name].filter((part, index, all) => Boolean(part) && all.findIndex((item) => item.toLowerCase() === part.toLowerCase()) === index);
  return {
    id: row.id,
    name,
    code: row.code ?? "",
    group,
    label: parts.join(" · ") || name,
  };
}

export async function listEquipmentOptions(): Promise<EquipmentOption[]> {
  const [{ data, error }, categories] = await Promise.all([
    getServiceClient()
      .from("equipment")
      .select("id, name, code, capacity, category_id")
      .is("archived_at", null)
      .order("name"),
    listCategories(),
  ]);
  if (error) throw new Error(error.message);
  return (data ?? [])
    .map((row) => equipmentOption({
      id: row.id as string,
      name: row.name as string,
      code: (row.code as string | null) ?? "",
      capacity: (row.capacity as string) ?? "",
      category_id: row.category_id as string,
    }, categories))
    .sort((a, b) => a.group.localeCompare(b.group) || a.label.localeCompare(b.label, undefined, { numeric: true }));
}

export function equipmentGroups(items: EquipmentOption[]) {
  const groups = new Map<string, EquipmentOption[]>();
  for (const item of items) {
    const list = groups.get(item.group) ?? [];
    list.push(item);
    groups.set(item.group, list);
  }
  return [...groups.entries()];
}

export async function getEquipment(id: string): Promise<EquipmentDetail | null> {
  const { data, error } = await getServiceClient()
    .from("equipment")
    .select(`
      id, category_id, code, name, description, capacity, ownership, status, archived_at,
      equipment_categories(name),
      equipment_specifications(id, label, value, sort_order),
      equipment_assets(id, asset_code, serial_number, registration_number, year_made, status, location, notes, archived_at),
      equipment_images(id, storage_path, alt, sort_order),
      equipment_documents(id, doc_type, title, storage_path, expires_on),
      equipment_maintenance(id, serviced_on, description, next_due_on, created_at)
    `)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const specs = [...((data.equipment_specifications as { id: string; label: string; value: string; sort_order: number }[]) ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const images = [...((data.equipment_images as { id: string; storage_path: string; alt: string; sort_order: number }[]) ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const maintenance = [...((data.equipment_maintenance as { id: string; serviced_on: string; description: string; next_due_on: string | null; created_at: string }[]) ?? [])].sort((a, b) => b.serviced_on.localeCompare(a.serviced_on));

  return {
    id: data.id as string,
    categoryId: data.category_id as string,
    categoryName: categoryName(data.equipment_categories as { name: string } | { name: string }[] | null),
    code: (data.code as string | null) ?? "",
    name: data.name as string,
    description: data.description as string,
    capacity: data.capacity as string,
    ownership: data.ownership as string,
    status: data.status as string,
    archivedAt: (data.archived_at as string | null) ?? null,
    specs: specs.map((item) => ({ id: item.id, label: item.label, value: item.value })),
    assets: ((data.equipment_assets as {
        id: string;
        asset_code: string;
        serial_number: string;
        registration_number: string;
        year_made: string;
        status: string;
        location: string;
        notes: string;
        archived_at: string | null;
      }[]) ?? []).map((item) => ({
        id: item.id,
        assetCode: item.asset_code,
        serialNumber: item.serial_number,
        registrationNumber: item.registration_number,
        yearMade: item.year_made,
        status: item.status,
        location: item.location,
        notes: item.notes,
        archivedAt: item.archived_at,
      })),
    images: images.map((item) => ({ id: item.id, storagePath: item.storage_path, alt: item.alt })),
    documents: ((data.equipment_documents as {
      id: string;
      doc_type: string;
      title: string;
      storage_path: string;
      expires_on: string | null;
    }[]) ?? []).map((item) => ({
      id: item.id,
      docType: item.doc_type,
      title: item.title,
      storagePath: item.storage_path,
      expiresOn: item.expires_on,
    })),
    maintenance: maintenance.map((item) => ({
      id: item.id,
      servicedOn: item.serviced_on,
      description: item.description,
      nextDueOn: item.next_due_on,
    })),
  };
}
