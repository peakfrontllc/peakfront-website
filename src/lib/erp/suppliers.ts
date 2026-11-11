import "server-only";

import { getServiceClient } from "@/lib/supabase/service";
import { emiratesFromRow, isCurrentRate, searchTerm } from "@/lib/erp/shared";

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
  archivedAt: string | null;
};

export type RateRow = {
  id: string;
  dailyRate: number | null;
  weeklyRate: number | null;
  monthlyRate: number | null;
  transportCharge: number | null;
  operatorDailyCharge: number | null;
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
    vatIncluded: row.vat_included,
    validFrom: row.valid_from,
    validTo: row.valid_to,
    notes: row.notes,
    current: isCurrentRate(row.valid_from, row.valid_to),
  };
}

export async function listSuppliers(filters: { q?: string; archived?: boolean; partyType?: string; region?: string; equipmentId?: string }): Promise<SupplierListItem[]> {
  let query = getServiceClient()
    .from("suppliers")
    .select(`
      id, company_name, party_type, phone, email, emirate, emirates, archived_at,
      supplier_contacts(name, job_title, phone, is_primary),
      supplier_equipment(id, equipment_id, equipment(name))
    `)
    .order("company_name");
  query = filters.archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  if (filters.partyType === "individual" || filters.partyType === "company") query = query.eq("party_type", filters.partyType);
  const term = searchTerm(filters.q);
  if (term) query = query.or(`company_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%,emirate.ilike.%${term}%`);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const region = filters.region ?? "";
  const equipmentId = filters.equipmentId ?? "";
  return (data ?? []).flatMap((row) => {
    const emirates = emiratesFromRow(row.emirates, row.emirate as string);
    const storedRegion = row.emirate as string;
    if (region && !(emirates as readonly string[]).includes(region) && !storedRegion.includes(region)) return [];
    const contacts = (Array.isArray(row.supplier_contacts) ? row.supplier_contacts : []) as { name: string; job_title: string; phone: string; is_primary: boolean }[];
    const primary = contacts.find((contact) => contact.is_primary) ?? contacts[0];
    const equipment = Array.isArray(row.supplier_equipment) ? row.supplier_equipment : [];
    if (equipmentId && !equipment.some((item) => (item as { equipment_id?: string }).equipment_id === equipmentId)) return [];
    const equipmentNames = equipment.flatMap((item) => {
      const linked = (item as { equipment?: { name?: string } | { name?: string }[] | null }).equipment;
      const record = Array.isArray(linked) ? linked[0] : linked;
      return record?.name ? [record.name] : [];
    });
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
      archivedAt: (row.archived_at as string | null) ?? null,
    }];
  });
}

export async function getSupplier(id: string): Promise<SupplierDetail | null> {
  const { data, error } = await getServiceClient()
    .from("suppliers")
    .select(`
      id, party_type, company_name, trade_licence, email, phone, website, address, emirates, emirate, notes, archived_at,
      supplier_contacts(id, name, job_title, phone, email, whatsapp, is_primary),
      supplier_locations(id, label, address, city, emirate, notes),
      supplier_notes(id, body, created_at),
      supplier_documents(id, doc_type, title, storage_path, expires_on),
      supplier_equipment(
        id, equipment_id, lead_time, notes,
        equipment(name),
        supplier_rates(id, daily_rate, weekly_rate, monthly_rate, transport_charge, operator_daily_charge, vat_included, valid_from, valid_to, notes)
      )
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
  };
}
