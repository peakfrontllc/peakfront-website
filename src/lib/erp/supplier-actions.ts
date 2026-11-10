"use server";

import { redirect } from "next/navigation";
import { logActivity } from "@/lib/auth/activity";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { DOCUMENT_BUCKET, removeStoredFile, storeFile } from "@/lib/erp/files";
import { insertCustomFields } from "@/lib/erp/custom-fields";
import { checked, chosenEmirates, dayBefore, extraFieldPairs, fail, field, fileFromForm, parseMoney } from "@/lib/erp/shared";
import { getServiceClient } from "@/lib/supabase/service";

function supplierInput(formData: FormData) {
  const emirates = chosenEmirates(formData);
  const partyType = field(formData, "partyType") === "individual" ? "individual" : "company";
  return {
    party_type: partyType,
    company_name: field(formData, "companyName"),
    trade_licence: field(formData, "tradeLicence"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    website: field(formData, "website"),
    address: field(formData, "address"),
    emirates,
    emirate: emirates.join(", "),
    notes: field(formData, "notes"),
  };
}

export async function createSupplier(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const input = supplierInput(formData);
  const extras = extraFieldPairs(formData);
  if (input.company_name.length < 2) fail("/manage/suppliers/new", input.party_type === "individual" ? "Enter the person's name." : "Enter the company name.");
  if (extras.error) fail("/manage/suppliers/new", extras.error);
  const { data, error } = await getServiceClient()
    .from("suppliers")
    .insert({ ...input, created_by: session.userId })
    .select("id")
    .single();
  if (error || !data) fail("/manage/suppliers/new", "The supplier could not be saved.");
  const fieldError = await insertCustomFields("supplier", data.id as string, extras.pairs);
  if (fieldError) fail(`/manage/suppliers/${data.id}`, "The supplier was saved, but an extra field could not be saved.");
  await logActivity(session, "supplier.created", "supplier", data.id as string, { name: input.company_name });
  redirect(`/manage/suppliers/${data.id}`);
}

export async function updateSupplier(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const id = field(formData, "id");
  const input = supplierInput(formData);
  const path = `/manage/suppliers/${id}`;
  if (input.company_name.length < 2) fail(path, input.party_type === "individual" ? "Enter the person's name." : "Enter the company name.");
  const { error } = await getServiceClient().from("suppliers").update(input).eq("id", id);
  if (error) fail(path, "The supplier could not be saved.");
  await logActivity(session, "supplier.updated", "supplier", id);
  redirect(path);
}

export async function setSupplierArchived(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const id = field(formData, "id");
  const archived = field(formData, "archived") === "true";
  const { error } = await getServiceClient()
    .from("suppliers")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) fail(`/manage/suppliers/${id}`, "The supplier could not be updated.");
  await logActivity(session, archived ? "supplier.archived" : "supplier.restored", "supplier", id);
  redirect(archived ? "/manage/suppliers?archived=1" : `/manage/suppliers/${id}`);
}

export async function deleteSupplier(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const id = field(formData, "id");
  const path = `/manage/suppliers/${id}`;
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
  redirect("/manage/suppliers");
}

export async function addSupplierContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/manage/suppliers/${supplierId}`;
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
  redirect(path);
}

export async function deleteSupplierContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  await getServiceClient().from("supplier_contacts").delete().eq("id", field(formData, "id"));
  await logActivity(session, "supplier_contact.deleted", "supplier", supplierId);
  redirect(`/manage/suppliers/${supplierId}`);
}

export async function updateSupplierContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/manage/suppliers/${supplierId}`;
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
  redirect(path);
}

export async function updateSupplierLocation(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/manage/suppliers/${supplierId}`;
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
  redirect(path);
}

export async function addSupplierLocation(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/manage/suppliers/${supplierId}`;
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
  redirect(path);
}

export async function addSupplierNote(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const body = field(formData, "body");
  const path = `/manage/suppliers/${supplierId}`;
  if (body.length < 2) fail(path, "Enter a note.");
  const { error } = await getServiceClient().from("supplier_notes").insert({
    supplier_id: supplierId,
    body,
    created_by: session.userId,
  });
  if (error) fail(path, "The note could not be saved.");
  await logActivity(session, "supplier_note.created", "supplier", supplierId);
  redirect(path);
}

export async function addSupplierDocument(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.documentsWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/manage/suppliers/${supplierId}`;
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
  redirect(path);
}

export async function linkSupplierEquipment(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const equipmentId = field(formData, "equipmentId");
  const path = `/manage/suppliers/${supplierId}`;
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
  redirect(path);
}

export async function updateSupplierEquipment(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.suppliersWrite);
  const supplierId = field(formData, "supplierId");
  const path = `/manage/suppliers/${supplierId}`;
  const { error } = await getServiceClient().from("supplier_equipment").update({
    lead_time: field(formData, "leadTime"),
    notes: field(formData, "notes"),
  }).eq("id", field(formData, "id")).eq("supplier_id", supplierId);
  if (error) fail(path, "The linked equipment could not be saved.");
  await logActivity(session, "supplier_equipment.updated", "supplier", supplierId);
  redirect(path);
}

export async function addSupplierRate(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.ratesWrite);
  const supplierId = field(formData, "supplierId");
  const supplierEquipmentId = field(formData, "supplierEquipmentId");
  const path = `/manage/suppliers/${supplierId}`;
  const validFrom = field(formData, "validFrom");
  const daily = parseMoney(field(formData, "dailyRate"));
  const weekly = parseMoney(field(formData, "weeklyRate"));
  const monthly = parseMoney(field(formData, "monthlyRate"));
  const transport = parseMoney(field(formData, "transportCharge"));
  const operator = parseMoney(field(formData, "operatorDailyCharge"));
  if (!validFrom) fail(path, "Enter the date this rate starts.");
  if ([daily, weekly, monthly, transport, operator].some((value) => Number.isNaN(value))) {
    fail(path, "Enter amounts as numbers with up to two decimal places.");
  }
  if (daily === null && weekly === null && monthly === null) {
    fail(path, "Enter at least one of the daily, weekly, or monthly rates.");
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
  redirect(path);
}
