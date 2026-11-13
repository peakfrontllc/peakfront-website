"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/auth/activity";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission, requireStaff } from "@/lib/auth/session";
import { catalogueTypeGroups, catalogueTypeIdSet, listCategories, supplierEquipmentChargesPerKm } from "@/lib/erp/equipment";
import { DOCUMENT_BUCKET, removeStoredFile, storeFile } from "@/lib/erp/files";
import { insertCustomFields } from "@/lib/erp/custom-fields";
import { checked, chosenEmirates, dayBefore, EMIRATES, extraFieldPairs, fail, field, fileFromForm, parseMoney, searchTerm, socialLinkPairs, todayIso } from "@/lib/erp/shared";
import { getServiceClient } from "@/lib/supabase/service";

function redirectTo(path: string): never {
  refresh();
  return redirect(path);
}

function supplierInput(formData: FormData) {
  const emirates = chosenEmirates(formData);
  const partyType = field(formData, "partyType") === "individual" ? "individual" : "company";
  const links = socialLinkPairs(formData);
  return {
    error: links.error,
    input: {
      party_type: partyType,
      company_name: field(formData, "companyName"),
      trade_licence: field(formData, "tradeLicence"),
      email: field(formData, "email"),
      phone: field(formData, "phone"),
      website: field(formData, "website"),
      social_links: links.links,
      address: field(formData, "address"),
      emirates,
      emirate: emirates.join(", "),
      notes: field(formData, "notes"),
    },
  };
}

async function replaceSupplierCatalogue(supplierId: string, formData: FormData) {
  const categories = await listCategories();
  const allowed = catalogueTypeIdSet(categories);
  const selected = new Set(
    formData.getAll("catalogueCategoryId").filter((value): value is string => typeof value === "string" && allowed.has(value)),
  );
  for (const group of catalogueTypeGroups(categories)) {
    if (!selected.has(group.purposeId)) continue;
    for (const item of group.items) selected.delete(item.id);
  }
  const categoryIds = [...selected];
  const service = getServiceClient();
  const { error: clearError } = await service.from("supplier_catalogue").delete().eq("supplier_id", supplierId);
  if (clearError) return "The equipment list could not be saved.";
  if (categoryIds.length === 0) return null;
  const { error } = await service.from("supplier_catalogue").insert(
    categoryIds.map((categoryId) => ({ supplier_id: supplierId, category_id: categoryId })),
  );
  return error ? "The equipment list could not be saved." : null;
}

export async function createSupplier(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const parsed = supplierInput(formData);
  const input = parsed.input;
  const extras = extraFieldPairs(formData);
  if (parsed.error) fail("/dashboard/suppliers/new", parsed.error);
  if (input.company_name.length < 2) fail("/dashboard/suppliers/new", input.party_type === "individual" ? "Enter the person's name." : "Enter the company name.");
  if (extras.error) fail("/dashboard/suppliers/new", extras.error);
  const { data, error } = await getServiceClient()
    .from("suppliers")
    .insert({ ...input, created_by: session.userId })
    .select("id")
    .single();
  if (error || !data) fail("/dashboard/suppliers/new", "The supplier could not be saved.");
  const catalogueError = await replaceSupplierCatalogue(data.id as string, formData);
  if (catalogueError) fail(`/dashboard/suppliers/${data.id}`, "The supplier was saved, but the equipment list could not be saved.");
  const fieldError = await insertCustomFields("supplier", data.id as string, extras.pairs);
  if (fieldError) fail(`/dashboard/suppliers/${data.id}`, "The supplier was saved, but an extra field could not be saved.");
  await logActivity(session, "supplier.created", "supplier", data.id as string, { name: input.company_name });
  redirectTo(`/dashboard/suppliers/${data.id}`);
}

export async function updateSupplier(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const id = field(formData, "id");
  const parsed = supplierInput(formData);
  const input = parsed.input;
  const path = `/dashboard/suppliers/${id}`;
  if (parsed.error) fail(path, parsed.error);
  if (input.company_name.length < 2) fail(path, input.party_type === "individual" ? "Enter the person's name." : "Enter the company name.");
  const { error } = await getServiceClient().from("suppliers").update(input).eq("id", id);
  if (error) fail(path, "The supplier could not be saved.");
  await logActivity(session, "supplier.updated", "supplier", id);
  redirectTo(path);
}

export async function updateSupplierCatalogue(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/dashboard/suppliers/${supplierId}`;
  const catalogueError = await replaceSupplierCatalogue(supplierId, formData);
  if (catalogueError) fail(path, catalogueError);
  await logActivity(session, "supplier_catalogue.updated", "supplier", supplierId);
  redirectTo(`${path}#provides`);
}

export async function setSupplierArchived(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const id = field(formData, "id");
  const archived = field(formData, "archived") === "true";
  const { error } = await getServiceClient()
    .from("suppliers")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) fail(`/dashboard/suppliers/${id}`, "The supplier could not be updated.");
  await logActivity(session, archived ? "supplier.archived" : "supplier.restored", "supplier", id);
  redirectTo(archived ? "/dashboard/suppliers?archived=1" : `/dashboard/suppliers/${id}`);
}

export async function deleteSupplier(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const id = field(formData, "id");
  const path = `/dashboard/suppliers/${id}`;
  const service = getServiceClient();
  const { data: links } = await service.from("supplier_equipment").select("id").eq("supplier_id", id);
  const linkIds = (links ?? []).map((link) => link.id as string);
  if (linkIds.length > 0) {
    const { error: rateError } = await service.from("supplier_rates").delete().in("supplier_equipment_id", linkIds);
    if (rateError) fail(path, "The supplier could not be deleted.");
  }
  const { data: documents } = await service.from("supplier_documents").select("storage_path").eq("supplier_id", id);
  for (const document of documents ?? []) await removeStoredFile(DOCUMENT_BUCKET, document.storage_path as string);
  await service.from("custom_fields").delete().eq("owner_type", "supplier").eq("owner_id", id);
  const { error } = await service.from("suppliers").delete().eq("id", id);
  if (error) fail(path, "The supplier could not be deleted.");
  await logActivity(session, "supplier.deleted", "supplier", id);
  redirectTo("/dashboard/suppliers");
}

export async function addSupplierContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/dashboard/suppliers/${supplierId}`;
  const name = field(formData, "name");
  if (name.length < 2) fail(path, "Enter the contact name.");
  const service = getServiceClient();
  if (checked(formData, "isPrimary")) {
    await service.from("supplier_contacts").update({ is_primary: false }).eq("supplier_id", supplierId);
  }
  const { error } = await service.from("supplier_contacts").insert({
    supplier_id: supplierId,
    name,
    job_title: field(formData, "jobTitle"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    whatsapp: field(formData, "whatsapp"),
    is_primary: checked(formData, "isPrimary"),
  });
  if (error) fail(path, "The contact could not be saved.");
  await logActivity(session, "supplier_contact.created", "supplier", supplierId);
  redirectTo(path);
}

export async function deleteSupplierContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  await getServiceClient().from("supplier_contacts").delete().eq("id", field(formData, "id"));
  await logActivity(session, "supplier_contact.deleted", "supplier", supplierId);
  redirectTo(`/dashboard/suppliers/${supplierId}`);
}

export async function updateSupplierContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/dashboard/suppliers/${supplierId}`;
  const name = field(formData, "name");
  if (name.length < 2) fail(path, "Enter the contact name.");
  const service = getServiceClient();
  if (checked(formData, "isPrimary")) {
    await service.from("supplier_contacts").update({ is_primary: false }).eq("supplier_id", supplierId);
  }
  const { error } = await service.from("supplier_contacts").update({
    name,
    job_title: field(formData, "jobTitle"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    whatsapp: field(formData, "whatsapp"),
    is_primary: checked(formData, "isPrimary"),
  }).eq("id", field(formData, "id")).eq("supplier_id", supplierId);
  if (error) fail(path, "The contact could not be saved.");
  await logActivity(session, "supplier_contact.updated", "supplier", supplierId);
  redirectTo(path);
}

export async function updateSupplierLocation(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/dashboard/suppliers/${supplierId}`;
  const label = field(formData, "label");
  if (label.length < 2) fail(path, "Enter a location name.");
  const { error } = await getServiceClient().from("supplier_locations").update({
    label,
    address: field(formData, "address"),
    city: field(formData, "city"),
    emirate: field(formData, "emirate"),
  }).eq("id", field(formData, "id")).eq("supplier_id", supplierId);
  if (error) fail(path, "The location could not be saved.");
  await logActivity(session, "supplier_location.updated", "supplier", supplierId);
  redirectTo(path);
}

export async function addSupplierLocation(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/dashboard/suppliers/${supplierId}`;
  const label = field(formData, "label");
  if (label.length < 2) fail(path, "Enter a location name.");
  const { error } = await getServiceClient().from("supplier_locations").insert({
    supplier_id: supplierId,
    label,
    address: field(formData, "address"),
    city: field(formData, "city"),
    emirate: field(formData, "emirate"),
    notes: field(formData, "notes"),
  });
  if (error) fail(path, "The location could not be saved.");
  await logActivity(session, "supplier_location.created", "supplier", supplierId);
  redirectTo(path);
}

export async function addSupplierNote(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const body = field(formData, "body");
  const path = `/dashboard/suppliers/${supplierId}`;
  if (body.length < 2) fail(path, "Enter a note.");
  const { error } = await getServiceClient().from("supplier_notes").insert({
    supplier_id: supplierId,
    body,
    created_by: session.userId,
  });
  if (error) fail(path, "The note could not be saved.");
  await logActivity(session, "supplier_note.created", "supplier", supplierId);
  redirectTo(path);
}

export async function addSupplierDocument(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.documentsWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/dashboard/suppliers/${supplierId}`;
  const title = field(formData, "title");
  const file = fileFromForm(formData, "document");
  if (!title || !file) fail(path, "Enter a title and choose a file.");
  try {
    const storagePath = await storeFile(DOCUMENT_BUCKET, `suppliers/${supplierId}`, file, "document");
    const expires = field(formData, "expiresOn");
    const { error } = await getServiceClient().from("supplier_documents").insert({
      supplier_id: supplierId,
      doc_type: field(formData, "docType") || "other",
      title,
      storage_path: storagePath,
      expires_on: expires || null,
      created_by: session.userId,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    fail(path, error instanceof Error ? error.message : "The document could not be saved.");
  }
  await logActivity(session, "supplier_document.created", "supplier", supplierId, { title });
  redirectTo(`${path}#documents`);
}

export async function deleteSupplierDocument(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.documentsWrite);
  const supplierId = field(formData, "supplierId");
  const id = field(formData, "id");
  const path = `/dashboard/suppliers/${supplierId}`;
  const service = getServiceClient();
  const { data } = await service
    .from("supplier_documents")
    .select("storage_path")
    .eq("id", id)
    .eq("supplier_id", supplierId)
    .maybeSingle();
  if (!data) fail(path, "That document was not found.");
  await removeStoredFile(DOCUMENT_BUCKET, data.storage_path as string);
  const { error } = await service.from("supplier_documents").delete().eq("id", id).eq("supplier_id", supplierId);
  if (error) fail(path, "The document could not be removed.");
  await logActivity(session, "supplier_document.deleted", "supplier", supplierId);
  redirectTo(`${path}#documents`);
}

function equipmentReturn(formData: FormData) {
  const value = field(formData, "returnTo");
  return /^\/dashboard\/equipment\/[0-9a-f-]{36}$/i.test(value) ? `${value}#suppliers` : "";
}

export async function linkSupplierEquipment(formData: FormData) {
  const session = await requireStaff();
  const allowed = hasPermission(session.permissions, PERMISSIONS.suppliersWrite)
    || hasPermission(session.permissions, PERMISSIONS.equipmentWrite);
  if (!allowed) redirect(`/dashboard/forbidden?need=${encodeURIComponent(PERMISSIONS.suppliersWrite)}`);
  const supplierId = field(formData, "supplierId");
  const equipmentId = field(formData, "equipmentId");
  const path = equipmentReturn(formData) || `/dashboard/suppliers/${supplierId}`;
  if (!supplierId) fail(path, "Choose a supplier.");
  if (!equipmentId) fail(path, "Choose equipment.");
  const { error } = await getServiceClient().from("supplier_equipment").insert({
    supplier_id: supplierId,
    equipment_id: equipmentId,
    lead_time: field(formData, "leadTime"),
    notes: field(formData, "notes"),
  });
  if (error) {
    fail(path, error.message.includes("duplicate") ? "That equipment is already linked." : "The equipment could not be linked.");
  }
  await logActivity(session, "supplier_equipment.linked", "supplier", supplierId, { equipmentId });
  redirectTo(path);
}

function supplierPath(formData: FormData, supplierId: string) {
  const profile = `/dashboard/suppliers/${supplierId}`;
  return field(formData, "returnTo") === `${profile}/equipment` ? `${profile}/equipment` : profile;
}

export async function updateSupplierEquipment(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = supplierPath(formData, supplierId);
  const { error } = await getServiceClient().from("supplier_equipment").update({
    lead_time: field(formData, "leadTime"),
    notes: field(formData, "notes"),
  }).eq("id", field(formData, "id")).eq("supplier_id", supplierId);
  if (error) fail(path, "The linked equipment could not be saved.");
  await logActivity(session, "supplier_equipment.updated", "supplier", supplierId);
  redirectTo(path);
}

export async function addSupplierRate(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.ratesWrite);
  const supplierId = field(formData, "supplierId");
  const supplierEquipmentId = field(formData, "supplierEquipmentId");
  const path = supplierPath(formData, supplierId);
  const validFrom = field(formData, "validFrom");
  const daily = parseMoney(field(formData, "dailyRate"));
  const weekly = parseMoney(field(formData, "weeklyRate"));
  const monthly = parseMoney(field(formData, "monthlyRate"));
  const transport = parseMoney(field(formData, "transportCharge"));
  const operator = parseMoney(field(formData, "operatorDailyCharge"));
  const perKm = parseMoney(field(formData, "perKmRate"));
  if (!validFrom) fail(path, "Enter the date this rate starts.");
  if ([daily, weekly, monthly, transport, operator, perKm].some((value) => Number.isNaN(value))) {
    fail(path, "Enter amounts as numbers with up to two decimal places.");
  }
  const kilometre = await supplierEquipmentChargesPerKm(supplierEquipmentId) ? perKm : null;
  if (daily === null && weekly === null && monthly === null && kilometre === null) {
    fail(path, "Enter a hire rate or an AED amount per kilometre.");
  }

  const service = getServiceClient();
  const { data: current } = await service
    .from("supplier_rates")
    .select("id, valid_from")
    .eq("supplier_equipment_id", supplierEquipmentId)
    .is("valid_to", null)
    .maybeSingle();

  if (current && validFrom <= (current.valid_from as string)) {
    fail(path, "The new rate must start after the current rate.");
  }
  if (current) {
    const { error } = await service
      .from("supplier_rates")
      .update({ valid_to: dayBefore(validFrom) })
      .eq("id", current.id);
    if (error) fail(path, "The previous rate could not be closed.");
  }

  const { data, error } = await service
    .from("supplier_rates")
    .insert({
      supplier_equipment_id: supplierEquipmentId,
      daily_rate: daily,
      weekly_rate: weekly,
      monthly_rate: monthly,
      transport_charge: transport,
      operator_daily_charge: operator,
      per_km_rate: kilometre,
      vat_included: checked(formData, "vatIncluded"),
      valid_from: validFrom,
      notes: field(formData, "notes"),
      created_by: session.userId,
    })
    .select("id")
    .single();
  if (error || !data) fail(path, "The rate could not be saved.");
  await logActivity(session, "supplier_rate.created", "supplier_rate", data.id as string, {
    supplierId,
    validFrom,
  });
  redirectTo(path);
}

function ratesReturnPath(formData: FormData) {
  const params = new URLSearchParams();
  const q = searchTerm(field(formData, "q"));
  if (q) params.set("q", q);
  const view = field(formData, "view");
  if (view === "list" || view === "table") params.set("view", view);
  const supplier = field(formData, "supplier");
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(supplier)) params.set("supplier", supplier);
  const purpose = field(formData, "purpose").replace(/[\r\n]/g, " ").trim().slice(0, 80);
  if (purpose) params.set("purpose", purpose);
  const region = field(formData, "region");
  if ((EMIRATES as readonly string[]).includes(region)) params.set("region", region);
  const status = field(formData, "status");
  if (status === "rated" || status === "missing") params.set("status", status);
  const text = params.toString();
  return text ? `/dashboard/rates?${text}` : "/dashboard/rates";
}

export async function updateEquipmentRate(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.ratesWrite);
  const supplierEquipmentId = field(formData, "supplierEquipmentId");
  const rateId = field(formData, "rateId");
  const supplierId = field(formData, "supplierId");
  const path = field(formData, "returnTo") && supplierId ? supplierPath(formData, supplierId) : ratesReturnPath(formData);
  const daily = parseMoney(field(formData, "dailyRate"));
  const weekly = parseMoney(field(formData, "weeklyRate"));
  const monthly = parseMoney(field(formData, "monthlyRate"));
  const transport = parseMoney(field(formData, "transportCharge"));
  const operator = parseMoney(field(formData, "operatorDailyCharge"));
  const perKm = parseMoney(field(formData, "perKmRate"));
  if (!supplierEquipmentId) fail(path, "Link a supplier before saving a rate.");
  if ([daily, weekly, monthly, transport, operator, perKm].some((value) => Number.isNaN(value))) {
    fail(path, "Enter amounts as numbers with up to two decimal places.");
  }
  const kilometre = await supplierEquipmentChargesPerKm(supplierEquipmentId) ? perKm : null;
  if (daily === null && weekly === null && monthly === null && kilometre === null) {
    fail(path, "Enter a hire rate or an AED amount per kilometre.");
  }

  const service = getServiceClient();
  const amounts = {
    daily_rate: daily,
    weekly_rate: weekly,
    monthly_rate: monthly,
    transport_charge: transport,
    operator_daily_charge: operator,
    per_km_rate: kilometre,
    vat_included: checked(formData, "vatIncluded"),
  };
  if (rateId) {
    const { data, error } = await service
      .from("supplier_rates")
      .update(amounts)
      .eq("id", rateId)
      .eq("supplier_equipment_id", supplierEquipmentId)
      .is("valid_to", null)
      .select("id")
      .maybeSingle();
    if (error || !data) fail(path, "The current rate could not be updated.");
    await logActivity(session, "supplier_rate.updated", "supplier_rate", data.id as string, { supplierEquipmentId });
    redirectTo(path);
  }

  const { data: open } = await service
    .from("supplier_rates")
    .select("id")
    .eq("supplier_equipment_id", supplierEquipmentId)
    .is("valid_to", null)
    .maybeSingle();
  if (open) fail(path, "This equipment already has a current rate. Refresh the page and edit that rate.");
  const { data, error } = await service
    .from("supplier_rates")
    .insert({
      ...amounts,
      supplier_equipment_id: supplierEquipmentId,
      valid_from: todayIso(),
      notes: "",
      created_by: session.userId,
    })
    .select("id")
    .single();
  if (error || !data) fail(path, "The rate could not be saved.");
  await logActivity(session, "supplier_rate.created", "supplier_rate", data.id as string, { supplierEquipmentId });
  redirectTo(path);
}
