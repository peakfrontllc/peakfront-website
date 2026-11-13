import "server-only";

import { getServiceClient } from "@/lib/supabase/service";
import { matchesSearch } from "@/lib/erp/search";
import { coversRegion, searchTerm } from "@/lib/erp/shared";

export type ClientListItem = {
  id: string;
  companyName: string;
  industry: string;
  phone: string;
  email: string;
  website: string;
  emirate: string;
  locationEmirates: string[];
  contactName: string;
  contactTitle: string;
  interestCount: number;
  archivedAt: string | null;
};

export type ClientDetail = {
  id: string;
  companyName: string;
  tradeLicence: string;
  industry: string;
  email: string;
  phone: string;
  website: string;
  billingAddress: string;
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
  interests: {
    id: string;
    equipmentId: string;
    equipmentName: string;
    typicalQuantity: number;
    durationNote: string;
  }[];
  noteLog: { id: string; body: string; createdAt: string }[];
  documents: {
    id: string;
    docType: string;
    title: string;
    storagePath: string;
    expiresOn: string | null;
  }[];
};

export async function listClients(filters: { q?: string; archived?: boolean; region?: string }): Promise<ClientListItem[]> {
  let query = getServiceClient()
    .from("clients")
    .select(`
      id, company_name, industry, phone, email, website, emirate, archived_at,
      client_contacts(name, job_title, is_primary),
      client_locations(emirate),
      client_equipment_interests(id)
    `)
    .order("company_name");
  query = filters.archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const region = filters.region ?? "";
  const term = searchTerm(filters.q);
  return (data ?? []).flatMap((row) => {
    const contacts = (Array.isArray(row.client_contacts) ? row.client_contacts : []) as { name: string; job_title: string; is_primary: boolean }[];
    const contact = contacts.find((item) => item.is_primary) ?? contacts[0];
    const locations = (Array.isArray(row.client_locations) ? row.client_locations : []) as { emirate?: string }[];
    const companyName = row.company_name as string;
    const contactName = (contact?.name ?? "").trim();
    const item: ClientListItem = {
      id: row.id as string,
      companyName,
      industry: (row.industry as string) ?? "",
      phone: (row.phone as string) ?? "",
      email: (row.email as string) ?? "",
      website: (row.website as string) ?? "",
      emirate: (row.emirate as string) ?? "",
      locationEmirates: locations.map((location) => (location.emirate ?? "").trim()).filter(Boolean),
      contactName: contactName.toLowerCase() === companyName.toLowerCase() ? "" : contactName,
      contactTitle: (contact?.job_title ?? "").trim(),
      interestCount: Array.isArray(row.client_equipment_interests) ? row.client_equipment_interests.length : 0,
      archivedAt: (row.archived_at as string | null) ?? null,
    };
    if (!coversRegion(item.emirate, item.locationEmirates, region)) return [];
    if (!matchesSearch(term, [item.companyName, item.industry, item.phone, item.email, item.website, item.emirate, item.contactName, item.contactTitle])) return [];
    return [item];
  });
}

export async function getClient(id: string): Promise<ClientDetail | null> {
  const { data, error } = await getServiceClient()
    .from("clients")
    .select(`
      id, company_name, trade_licence, industry, email, phone, website, billing_address, emirate, notes, archived_at,
      client_contacts(id, name, job_title, phone, email, whatsapp, is_primary),
      client_locations(id, label, address, city, emirate, notes),
      client_notes(id, body, created_at),
      client_documents(id, doc_type, title, storage_path, expires_on),
      client_equipment_interests(id, equipment_id, typical_quantity, duration_note, equipment(name))
    `)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    id: data.id as string,
    companyName: data.company_name as string,
    tradeLicence: data.trade_licence as string,
    industry: data.industry as string,
    email: data.email as string,
    phone: data.phone as string,
    website: (data.website as string) ?? "",
    billingAddress: data.billing_address as string,
    emirate: data.emirate as string,
    notes: data.notes as string,
    archivedAt: (data.archived_at as string | null) ?? null,
    contacts: ((data.client_contacts as {
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
    locations: ((data.client_locations as ClientDetail["locations"]) ?? []),
    interests: ((data.client_equipment_interests as {
      id: string;
      equipment_id: string;
      typical_quantity: number;
      duration_note: string;
      equipment: { name: string } | { name: string }[] | null;
    }[]) ?? []).map((item) => {
      const equipment = Array.isArray(item.equipment) ? item.equipment[0] : item.equipment;
      return {
        id: item.id,
        equipmentId: item.equipment_id,
        equipmentName: equipment?.name ?? "Equipment",
        typicalQuantity: item.typical_quantity,
        durationNote: item.duration_note,
      };
    }),
    noteLog: ((data.client_notes as { id: string; body: string; created_at: string }[]) ?? [])
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((item) => ({ id: item.id, body: item.body, createdAt: item.created_at })),
    documents: ((data.client_documents as {
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
  };
}
