"use server";

import { redirect } from "next/navigation";
import { logActivity } from "@/lib/auth/activity";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { insertCustomFields } from "@/lib/erp/custom-fields";
import { DOCUMENT_BUCKET, removeStoredFile, storeFile } from "@/lib/erp/files";
import { checked, clientEmirate, extraFieldPairs, fail, field, fileFromForm } from "@/lib/erp/shared";
import { getServiceClient } from "@/lib/supabase/service";

function clientInput(formData: FormData) {
  return {
    company_name: field(formData, "companyName"),
    trade_licence: field(formData, "tradeLicence"),
    industry: field(formData, "industry"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    website: field(formData, "website"),
    billing_address: field(formData, "billingAddress"),
    emirate: clientEmirate(field(formData, "emirate")),
    notes: field(formData, "notes"),
  };
}

export async function createClientRecord(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const input = clientInput(formData);
  const extras = extraFieldPairs(formData);
  if (input.company_name.length < 2) fail("/dashboard/clients/new", "Enter the company name.");
  if (!input.emirate) fail("/dashboard/clients/new", "Select a region.");
  if (extras.error) fail("/dashboard/clients/new", extras.error);
  const { data, error } = await getServiceClient()
    .from("clients")
    .insert({ ...input, created_by: session.userId })
    .select("id")
    .single();
  if (error || !data) fail("/dashboard/clients/new", "The client could not be saved.");
  const fieldError = await insertCustomFields("client", data.id as string, extras.pairs);
  if (fieldError) fail(`/dashboard/clients/${data.id}`, "The client was saved, but an extra field could not be saved.");
  await logActivity(session, "client.created", "client", data.id as string, { name: input.company_name });
  redirect(`/dashboard/clients/${data.id}`);
}

export async function updateClient(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const id = field(formData, "id");
  const input = clientInput(formData);
  const path = `/dashboard/clients/${id}`;
  if (input.company_name.length < 2) fail(path, "Enter the company name.");
  if (!input.emirate) fail(path, "Select a region.");
  const { error } = await getServiceClient().from("clients").update(input).eq("id", id);
  if (error) fail(path, "The client could not be saved.");
  await logActivity(session, "client.updated", "client", id);
  redirect(path);
}

export async function setClientArchived(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const id = field(formData, "id");
  const archived = field(formData, "archived") === "true";
  const { error } = await getServiceClient()
    .from("clients")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) fail(`/dashboard/clients/${id}`, "The client could not be updated.");
  await logActivity(session, archived ? "client.archived" : "client.restored", "client", id);
  redirect(archived ? "/dashboard/clients?archived=1" : `/dashboard/clients/${id}`);
}

export async function deleteClient(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const id = field(formData, "id");
  const path = `/dashboard/clients/${id}`;
  const service = getServiceClient();
  const { data: documents } = await service.from("client_documents").select("storage_path").eq("client_id", id);
  for (const document of documents ?? []) await removeStoredFile(DOCUMENT_BUCKET, document.storage_path as string);
  await service.from("custom_fields").delete().eq("owner_type", "client").eq("owner_id", id);
  const { error } = await service.from("clients").delete().eq("id", id);
  if (error) fail(path, "The client could not be deleted.");
  await logActivity(session, "client.deleted", "client", id);
  redirect("/dashboard/clients");
}

export async function addClientContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  const path = `/dashboard/clients/${clientId}`;
  const name = field(formData, "name");
  if (name.length < 2) fail(path, "Enter the contact name.");
  const service = getServiceClient();
  if (checked(formData, "isPrimary")) {
    await service.from("client_contacts").update({ is_primary: false }).eq("client_id", clientId);
  }
  const { error } = await service.from("client_contacts").insert({
    client_id: clientId,
    name,
    job_title: field(formData, "jobTitle"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    whatsapp: field(formData, "whatsapp"),
    is_primary: checked(formData, "isPrimary"),
  });
  if (error) fail(path, "The contact could not be saved.");
  await logActivity(session, "client_contact.created", "client", clientId);
  redirect(path);
}

export async function deleteClientContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  await getServiceClient().from("client_contacts").delete().eq("id", field(formData, "id"));
  await logActivity(session, "client_contact.deleted", "client", clientId);
  redirect(`/dashboard/clients/${clientId}`);
}

export async function updateClientContact(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  const path = `/dashboard/clients/${clientId}`;
  const name = field(formData, "name");
  if (name.length < 2) fail(path, "Enter the contact name.");
  const service = getServiceClient();
  if (checked(formData, "isPrimary")) {
    await service.from("client_contacts").update({ is_primary: false }).eq("client_id", clientId);
  }
  const { error } = await service.from("client_contacts").update({
    name,
    job_title: field(formData, "jobTitle"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    whatsapp: field(formData, "whatsapp"),
    is_primary: checked(formData, "isPrimary"),
  }).eq("id", field(formData, "id")).eq("client_id", clientId);
  if (error) fail(path, "The contact could not be saved.");
  await logActivity(session, "client_contact.updated", "client", clientId);
  redirect(path);
}

export async function updateClientLocation(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  const path = `/dashboard/clients/${clientId}`;
  const label = field(formData, "label");
  if (label.length < 2) fail(path, "Enter a location name.");
  const { error } = await getServiceClient().from("client_locations").update({
    label,
    address: field(formData, "address"),
    city: field(formData, "city"),
    emirate: field(formData, "emirate"),
  }).eq("id", field(formData, "id")).eq("client_id", clientId);
  if (error) fail(path, "The location could not be saved.");
  await logActivity(session, "client_location.updated", "client", clientId);
  redirect(path);
}

export async function addClientLocation(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  const path = `/dashboard/clients/${clientId}`;
  const label = field(formData, "label");
  if (label.length < 2) fail(path, "Enter a location name.");
  const { error } = await getServiceClient().from("client_locations").insert({
    client_id: clientId,
    label,
    address: field(formData, "address"),
    city: field(formData, "city"),
    emirate: field(formData, "emirate"),
    notes: field(formData, "notes"),
  });
  if (error) fail(path, "The location could not be saved.");
  await logActivity(session, "client_location.created", "client", clientId);
  redirect(path);
}

export async function addClientNote(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  const body = field(formData, "body");
  const path = `/dashboard/clients/${clientId}`;
  if (body.length < 2) fail(path, "Enter a note.");
  const { error } = await getServiceClient().from("client_notes").insert({
    client_id: clientId,
    body,
    created_by: session.userId,
  });
  if (error) fail(path, "The note could not be saved.");
  await logActivity(session, "client_note.created", "client", clientId);
  redirect(path);
}

export async function addClientDocument(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.documentsWrite);
  const clientId = field(formData, "clientId");
  const path = `/dashboard/clients/${clientId}`;
  const title = field(formData, "title");
  const file = fileFromForm(formData, "document");
  if (!title || !file) fail(path, "Enter a title and choose a file.");
  try {
    const storagePath = await storeFile(DOCUMENT_BUCKET, `clients/${clientId}`, file, "document");
    const expires = field(formData, "expiresOn");
    const { error } = await getServiceClient().from("client_documents").insert({
      client_id: clientId,
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
  await logActivity(session, "client_document.created", "client", clientId, { title });
  redirect(`${path}#documents`);
}

export async function deleteClientDocument(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.documentsWrite);
  const clientId = field(formData, "clientId");
  const id = field(formData, "id");
  const path = `/dashboard/clients/${clientId}`;
  const service = getServiceClient();
  const { data } = await service
    .from("client_documents")
    .select("storage_path")
    .eq("id", id)
    .eq("client_id", clientId)
    .maybeSingle();
  if (!data) fail(path, "That document was not found.");
  await removeStoredFile(DOCUMENT_BUCKET, data.storage_path as string);
  const { error } = await service.from("client_documents").delete().eq("id", id).eq("client_id", clientId);
  if (error) fail(path, "The document could not be removed.");
  await logActivity(session, "client_document.deleted", "client", clientId);
  redirect(`${path}#documents`);
}

export async function addClientInterest(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  const equipmentId = field(formData, "equipmentId");
  const path = `/dashboard/clients/${clientId}`;
  const quantity = Number(field(formData, "quantity") || "1");
  if (!equipmentId) fail(path, "Choose equipment.");
  if (!Number.isInteger(quantity) || quantity < 1) fail(path, "Enter a quantity of at least 1.");
  const { error } = await getServiceClient().from("client_equipment_interests").insert({
    client_id: clientId,
    equipment_id: equipmentId,
    typical_quantity: quantity,
    duration_note: field(formData, "durationNote"),
  });
  if (error) {
    fail(path, error.message.includes("duplicate") ? "That equipment is already listed." : "The equipment interest could not be saved.");
  }
  await logActivity(session, "client_interest.created", "client", clientId, { equipmentId });
  redirect(path);
}

export async function updateClientInterest(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  const path = `/dashboard/clients/${clientId}`;
  const quantity = Number(field(formData, "quantity") || "1");
  if (!Number.isInteger(quantity) || quantity < 1) fail(path, "Enter a quantity of at least 1.");
  const { error } = await getServiceClient().from("client_equipment_interests").update({
    typical_quantity: quantity,
    duration_note: field(formData, "durationNote"),
  }).eq("id", field(formData, "id")).eq("client_id", clientId);
  if (error) fail(path, "The equipment interest could not be saved.");
  await logActivity(session, "client_interest.updated", "client", clientId);
  redirect(path);
}

export async function deleteClientInterest(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.clientsWrite);
  const clientId = field(formData, "clientId");
  await getServiceClient().from("client_equipment_interests").delete().eq("id", field(formData, "id"));
  await logActivity(session, "client_interest.deleted", "client", clientId);
  redirect(`/dashboard/clients/${clientId}`);
}
