import "server-only";

import { getServiceClient } from "@/lib/supabase/service";
import { matchesClientSearch } from "@/lib/erp/search";
import { coversRegion } from "@/lib/erp/shared";

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
  contactEmail: string;
  searchParts: string[];
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
    categoryId: string;
    categoryName: string;
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
      id, company_name, trade_licence, industry, phone, email, website, billing_address, emirate, notes, archived_at,
      client_contacts(name, job_title, phone, email, whatsapp, is_primary),
      client_locations(label, address, city, emirate, notes),
      client_notes(body),
      client_documents(title),
      client_equipment_interests(id, equipment_categories(name))
    `)
    .order("company_name");
  query = filters.archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const region = filters.region ?? "";
  return (data ?? []).flatMap((row) => {
    const contacts = (Array.isArray(row.client_contacts) ? row.client_contacts : []) as {
      name?: string;
      job_title?: string;
      phone?: string;
      email?: string;
      whatsapp?: string;
      is_primary?: boolean;
    }[];
    const contact = contacts.find((item) => item.is_primary) ?? contacts[0];
    const locations = (Array.isArray(row.client_locations) ? row.client_locations : []) as {
      label?: string;
      address?: string;
      city?: string;
      emirate?: string;
      notes?: string;
    }[];
    const notes = (Array.isArray(row.client_notes) ? row.client_notes : []) as { body?: string }[];
    const documents = (Array.isArray(row.client_documents) ? row.client_documents : []) as { title?: string }[];
    const interests = (Array.isArray(row.client_equipment_interests) ? row.client_equipment_interests : []) as {
      equipment_categories?: { name?: string } | { name?: string }[] | null;
    }[];
    const companyName = row.company_name as string;
    const contactName = (contact?.name ?? "").trim();
    const interestNames = interests.flatMap((interest) => {
      const category = Array.isArray(interest.equipment_categories) ? interest.equipment_categories[0] : interest.equipment_categories;
      return category?.name ? [category.name] : [];
    });
    const searchParts = [
      companyName,
      (row.trade_licence as string) ?? "",
      (row.industry as string) ?? "",
      (row.phone as string) ?? "",
      (row.email as string) ?? "",
      (row.website as string) ?? "",
      (row.billing_address as string) ?? "",
      (row.emirate as string) ?? "",
      (row.notes as string) ?? "",
      ...contacts.flatMap((person) => [person.name ?? "", person.job_title ?? "", person.phone ?? "", person.email ?? "", person.whatsapp ?? ""]),
      ...locations.flatMap((location) => [location.label ?? "", location.address ?? "", location.city ?? "", location.emirate ?? "", location.notes ?? ""]),
      ...notes.map((note) => note.body ?? ""),
      ...documents.map((document) => document.title ?? ""),
      ...interestNames,
    ];
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
      contactEmail: (contact?.email ?? "").trim(),
      searchParts,
      interestCount: interests.length,
      archivedAt: (row.archived_at as string | null) ?? null,
    };
    if (!coversRegion(item.emirate, item.locationEmirates, region)) return [];
    if (!matchesClientSearch(filters.q ?? "", item.searchParts)) return [];
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
      client_equipment_interests(id, category_id, typical_quantity, duration_note, equipment_categories(name, parent_id))
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
      category_id: string;
      typical_quantity: number;
      duration_note: string;
      equipment_categories: { name: string; parent_id: string | null } | { name: string; parent_id: string | null }[] | null;
    }[]) ?? []).map((item) => {
      const category = Array.isArray(item.equipment_categories) ? item.equipment_categories[0] : item.equipment_categories;
      return {
        id: item.id,
        categoryId: item.category_id,
        categoryName: category?.name ?? "Equipment",
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
