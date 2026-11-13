import "server-only";

import { getServiceClient } from "@/lib/supabase/service";
import { catalogueAncestorIds, catalogueSearchParts, catalogueTypeGroups, catalogueTypeIdSet, catalogueTypes, listCategories, listedBoomFits } from "@/lib/erp/equipment";
import { boomMetres } from "@/lib/erp/lengths";
import { matchesSearch } from "@/lib/erp/search";
import { emiratesFromRow, isCurrentRate, socialLinksFromValue, type SocialLink } from "@/lib/erp/shared";

export type SupplierListItem = {
  id: string;
  companyName: string;
  partyType: "individual" | "company";
  phone: string;
  email: string;
  emirate: string;
  emirates: string[];
  contactName: string;
  contactTitle: string;
  equipmentCount: number;
  equipmentNames: string[];
  providedNames: string[];
  socialLinks: string[];
  archivedAt: string | null;
};

export type RateRow = {
  id: string;
  dailyRate: number | null;
  weeklyRate: number | null;
  monthlyRate: number | null;
  transportCharge: number | null;
  operatorDailyCharge: number | null;
  perKmRate: number | null;
  vatIncluded: boolean;
  validFrom: string;
  validTo: string | null;
  notes: string;
  current: boolean;
};

export type SuppliedEquipment = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  leadTime: string;
  notes: string;
  rates: RateRow[];
};

export type SupplierDetail = {
  id: string;
  companyName: string;
  partyType: "individual" | "company";
  tradeLicence: string;
  email: string;
  phone: string;
  website: string;
  socialLinks: SocialLink[];
  address: string;
  emirates: string[];
  emirate: string;
  notes: string;
  archivedAt: string | null;
  contacts: {
    id: string;
    name: string;
    jobTitle: string;
    phone: string;
    email: string;
    whatsapp: string;
    isPrimary: boolean;
  }[];
  locations: {
    id: string;
    label: string;
    address: string;
    city: string;
    emirate: string;
    notes: string;
  }[];
  noteLog: { id: string; body: string; createdAt: string }[];
  documents: {
    id: string;
    docType: string;
    title: string;
    storagePath: string;
    expiresOn: string | null;
  }[];
  equipment: SuppliedEquipment[];
  provided: { id: string; categoryId: string; name: string }[];
};

function money(value: unknown) {
  if (value === null || value === undefined) return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function mapRate(row: {
  id: string;
  daily_rate: unknown;
  weekly_rate: unknown;
  monthly_rate: unknown;
  transport_charge: unknown;
  operator_daily_charge: unknown;
  per_km_rate: unknown;
  vat_included: boolean;
  valid_from: string;
  valid_to: string | null;
  notes: string;
}): RateRow {
  return {
    id: row.id,
    dailyRate: money(row.daily_rate),
    weeklyRate: money(row.weekly_rate),
    monthlyRate: money(row.monthly_rate),
    transportCharge: money(row.transport_charge),
    operatorDailyCharge: money(row.operator_daily_charge),
    perKmRate: money(row.per_km_rate),
    vatIncluded: row.vat_included,
    validFrom: row.valid_from,
    validTo: row.valid_to,
    notes: row.notes,
    current: isCurrentRate(row.valid_from, row.valid_to),
  };
}

export async function listSuppliers(filters: { q?: string; archived?: boolean; partyType?: string; region?: string; equipmentId?: string; catalogueId?: string }): Promise<SupplierListItem[]> {
  const categories = await listCategories(true);
  const typeOrder = new Map<string, number>();
  catalogueTypeGroups(categories).forEach((group, groupIndex) => {
    typeOrder.set(group.purposeId, groupIndex * 1000);
    group.items.forEach((item, itemIndex) => {
      typeOrder.set(item.id, groupIndex * 1000 + itemIndex + 1);
      item.children.forEach((child, childIndex) => typeOrder.set(child.id, groupIndex * 1000 + itemIndex + 1 + (childIndex + 1) / 100));
    });
  });
  let coveredCategoryIds = new Set<string>();
  let selectedCategoryId = "";
  let selectedBoomLength = "";
  let selectedTypeId = "";
  let categoryFilterId = "";
  const catalogueIdsAllowed = catalogueTypeIdSet(categories);
  const requestedCatalogue = filters.catalogueId ?? "";
  const requestedEquipment = filters.equipmentId ?? "";
  if (requestedCatalogue && catalogueIdsAllowed.has(requestedCatalogue)) categoryFilterId = requestedCatalogue;
  else if (requestedEquipment && catalogueIdsAllowed.has(requestedEquipment)) categoryFilterId = requestedEquipment;
  const equipmentId = categoryFilterId && categoryFilterId === requestedEquipment ? "" : requestedEquipment;
  if (equipmentId) {
    const { data: equipmentRow, error: equipmentError } = await getServiceClient()
      .from("equipment")
      .select("category_id, boom_length")
      .eq("id", equipmentId)
      .maybeSingle();
    if (equipmentError) throw new Error(equipmentError.message);
    selectedCategoryId = (equipmentRow?.category_id as string) ?? "";
    selectedBoomLength = (equipmentRow?.boom_length as string) ?? "";
    const ancestors = catalogueAncestorIds(selectedCategoryId, categories);
    coveredCategoryIds = new Set(ancestors);
    const typeIds = new Set(catalogueTypes(categories).map((item) => item.id));
    selectedTypeId = ancestors.find((id) => typeIds.has(id)) ?? "";
  }
  let query = getServiceClient()
    .from("suppliers")
    .select(`
      id, company_name, party_type, phone, email, emirate, emirates, social_links, archived_at,
      supplier_contacts(name, job_title, phone, is_primary),
      supplier_equipment(id, equipment_id, equipment(name, boom_length, category_id)),
      supplier_catalogue(category_id)
    `)
    .order("company_name");
  query = filters.archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  if (filters.partyType === "individual" || filters.partyType === "company") query = query.eq("party_type", filters.partyType);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const region = filters.region ?? "";
  const selection = categoryFilterId || equipmentId;
  const term = selection ? "" : (filters.q ?? "").trim();
  const categoryMatches = (categoryId: string) => {
    if (!categoryFilterId || !categoryId) return false;
    if (categoryId === categoryFilterId) return true;
    return catalogueAncestorIds(categoryId, categories).includes(categoryFilterId)
      || catalogueAncestorIds(categoryFilterId, categories).includes(categoryId);
  };
  return (data ?? []).flatMap((row) => {
    const emirates = emiratesFromRow(row.emirates, row.emirate as string);
    const storedRegion = row.emirate as string;
    if (region && !(emirates as readonly string[]).includes(region) && !storedRegion.includes(region)) return [];
    const contacts = (Array.isArray(row.supplier_contacts) ? row.supplier_contacts : []) as { name: string; job_title: string; phone: string; is_primary: boolean }[];
    const primary = contacts.find((contact) => contact.is_primary) ?? contacts[0];
    const equipment = Array.isArray(row.supplier_equipment) ? row.supplier_equipment : [];
    const catalogueIds = (Array.isArray(row.supplier_catalogue) ? row.supplier_catalogue : [])
      .map((item) => (item as { category_id?: string }).category_id ?? "")
      .filter(Boolean);
    const linked = equipment.flatMap((item) => {
      const rowItem = item as { equipment_id?: string; equipment?: { name?: string; boom_length?: string; category_id?: string } | { name?: string; boom_length?: string; category_id?: string }[] | null };
      const record = Array.isArray(rowItem.equipment) ? rowItem.equipment[0] : rowItem.equipment;
      if (!rowItem.equipment_id) return [];
      return [{ id: rowItem.equipment_id, name: record?.name ?? "", boom: record?.boom_length ?? "", categoryId: record?.category_id ?? "" }];
    });
    const selectedBoom = boomMetres(selectedBoomLength);
    const sameFamily = (categoryId: string) => Boolean(selectedTypeId) && catalogueAncestorIds(categoryId, categories).includes(selectedTypeId);
    const matchesMachine = equipmentId === "" || linked.some((item) => item.id === equipmentId || (selectedBoom !== "" && boomMetres(item.boom) === selectedBoom && sameFamily(item.categoryId))) || (catalogueIds.some((id) => coveredCategoryIds.has(id)) && listedBoomFits(categories, selectedCategoryId, selectedBoomLength, linked));
    const matchesCatalogue = categoryFilterId === "" || linked.some((item) => categoryMatches(item.categoryId)) || catalogueIds.some((id) => categoryMatches(id));
    if (selection && (!matchesMachine || !matchesCatalogue)) return [];
    const equipmentNames = linked.flatMap((item) => item.name ? [item.name] : []);
    const provided = catalogueIds.flatMap((id) => {
      const category = categories.find((item) => item.id === id);
      return category ? [{ id, name: category.name }] : [];
    }).sort((a, b) => (typeOrder.get(a.id) ?? 9999) - (typeOrder.get(b.id) ?? 9999) || a.name.localeCompare(b.name));
    const providedNames = provided.map((item) => item.name);
    const socialLinks = socialLinksFromValue(row.social_links).map((link) => [link.label, link.url].filter(Boolean).join(" "));
    if (term && !matchesSearch(term, [
      row.company_name as string,
      (row.phone as string) ?? "",
      primary?.phone ?? "",
      (row.email as string) ?? "",
      storedRegion,
      ...emirates,
      primary?.name ?? "",
      primary?.job_title ?? "",
      ...equipmentNames,
      ...catalogueIds.flatMap((id) => catalogueSearchParts(id, categories)),
      ...socialLinks,
    ])) return [];
    return [{
      id: row.id as string,
      companyName: row.company_name as string,
      partyType: row.party_type === "individual" ? "individual" as const : "company" as const,
      phone: (row.phone as string) || primary?.phone || "",
      email: (row.email as string) ?? "",
      emirate: row.emirate as string,
      emirates,
      contactName: primary?.name ?? "",
      contactTitle: (primary?.job_title ?? "").trim(),
      equipmentCount: equipment.length,
      equipmentNames: [...new Set(equipmentNames)],
      providedNames,
      socialLinks,
      archivedAt: (row.archived_at as string | null) ?? null,
    }];
  });
}

export async function getSupplier(id: string): Promise<SupplierDetail | null> {
  const { data, error } = await getServiceClient()
    .from("suppliers")
    .select(`
      id, party_type, company_name, trade_licence, email, phone, website, social_links, address, emirates, emirate, notes, archived_at,
      supplier_contacts(id, name, job_title, phone, email, whatsapp, is_primary),
      supplier_locations(id, label, address, city, emirate, notes),
      supplier_notes(id, body, created_at),
      supplier_documents(id, doc_type, title, storage_path, expires_on),
      supplier_equipment(
        id, equipment_id, lead_time, notes,
        equipment(name),
        supplier_rates(id, daily_rate, weekly_rate, monthly_rate, transport_charge, operator_daily_charge, per_km_rate, vat_included, valid_from, valid_to, notes)
      ),
      supplier_catalogue(id, category_id, equipment_categories(name))
    `)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    id: data.id as string,
    companyName: data.company_name as string,
    partyType: data.party_type === "individual" ? "individual" : "company",
    tradeLicence: data.trade_licence as string,
    email: data.email as string,
    phone: data.phone as string,
    website: data.website as string,
    socialLinks: socialLinksFromValue(data.social_links),
    address: data.address as string,
    emirates: emiratesFromRow(data.emirates, data.emirate as string),
    emirate: data.emirate as string,
    notes: data.notes as string,
    archivedAt: (data.archived_at as string | null) ?? null,
    contacts: ((data.supplier_contacts as SupplierDetail["contacts"] extends never ? never : {
      id: string;
      name: string;
      job_title: string;
      phone: string;
      email: string;
      whatsapp: string;
      is_primary: boolean;
    }[]) ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      jobTitle: item.job_title,
      phone: item.phone,
      email: item.email,
      whatsapp: item.whatsapp,
      isPrimary: item.is_primary,
    })),
    locations: ((data.supplier_locations as {
      id: string;
      label: string;
      address: string;
      city: string;
      emirate: string;
      notes: string;
    }[]) ?? []).map((item) => ({
      id: item.id,
      label: item.label,
      address: item.address,
      city: item.city,
      emirate: item.emirate,
      notes: item.notes,
    })),
    noteLog: ((data.supplier_notes as { id: string; body: string; created_at: string }[]) ?? [])
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((item) => ({ id: item.id, body: item.body, createdAt: item.created_at })),
    documents: ((data.supplier_documents as {
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
    equipment: ((data.supplier_equipment as {
      id: string;
      equipment_id: string;
      lead_time: string;
      notes: string;
      equipment: { name: string } | { name: string }[] | null;
      supplier_rates: Parameters<typeof mapRate>[0][];
    }[]) ?? []).map((item) => {
      const equipment = Array.isArray(item.equipment) ? item.equipment[0] : item.equipment;
      return {
        id: item.id,
        equipmentId: item.equipment_id,
        equipmentName: equipment?.name ?? "Equipment",
        leadTime: item.lead_time,
        notes: item.notes,
        rates: (item.supplier_rates ?? []).map(mapRate).sort((a, b) => b.validFrom.localeCompare(a.validFrom)),
      };
    }),
    provided: ((data.supplier_catalogue as {
      id: string;
      category_id: string;
      equipment_categories: { name: string } | { name: string }[] | null;
    }[]) ?? []).flatMap((item) => {
      const category = Array.isArray(item.equipment_categories) ? item.equipment_categories[0] : item.equipment_categories;
      if (!category?.name) return [];
      return [{ id: item.id, categoryId: item.category_id, name: category.name }];
    }).sort((a, b) => a.name.localeCompare(b.name)),
  };
}
