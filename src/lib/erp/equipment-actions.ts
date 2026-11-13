"use server";

import { redirect } from "next/navigation";
import { logActivity } from "@/lib/auth/activity";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { DOCUMENT_BUCKET, IMAGE_BUCKET, removeStoredFile, storeFile } from "@/lib/erp/files";
import { boomLabel, boomValue } from "@/lib/erp/lengths";
import {
  ASSET_STATUSES,
  EQUIPMENT_STATUSES,
  OWNERSHIP,
  extraFieldPairs,
  fail,
  field,
  fileFromForm,
  slugify,
} from "@/lib/erp/shared";
import { getServiceClient } from "@/lib/supabase/service";

function choice<T extends string>(value: string, allowed: readonly T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const CATEGORY_PATH = "/dashboard/categories";

function categoryPath(categoryId: string, typeId = "") {
  const params = new URLSearchParams();
  if (categoryId) params.set("category", categoryId);
  if (typeId) params.set("type", typeId);
  const query = params.toString();
  return query ? `${CATEGORY_PATH}?${query}` : CATEGORY_PATH;
}

async function categoryParent(parentId: string, categoryId?: string) {
  if (!parentId) return null;
  if (categoryId && parentId === categoryId) fail(CATEGORY_PATH, "A category cannot sit under itself.");
  const { data: parent } = await getServiceClient()
    .from("equipment_categories")
    .select("id, name, parent_id")
    .eq("id", parentId)
    .maybeSingle();
  if (!parent) fail(CATEGORY_PATH, "Choose a main category.");
  if (parent.parent_id) {
    const { data: grandparent } = await getServiceClient()
      .from("equipment_categories")
      .select("id, parent_id")
      .eq("id", parent.parent_id)
      .maybeSingle();
    if (!grandparent || grandparent.parent_id) {
      fail(CATEGORY_PATH, "Add a size under the equipment, not under another size.");
    }
  }
  if (categoryId) {
    const { count } = await getServiceClient()
      .from("equipment_categories")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", categoryId);
    if (count && parent.parent_id) {
      fail(CATEGORY_PATH, "This category has equipment under it, so it stays a main category.");
    }
  }
  return parent.name as string;
}

async function rootCategoryId(id: string) {
  const service = getServiceClient();
  const { data: row } = await service.from("equipment_categories").select("id, parent_id").eq("id", id).maybeSingle();
  if (!row?.parent_id) return id;
  const { data: parent } = await service
    .from("equipment_categories")
    .select("id, parent_id")
    .eq("id", row.parent_id)
    .maybeSingle();
  if (!parent?.parent_id) return (parent?.id as string) || (row.parent_id as string);
  return parent.parent_id as string;
}

async function attachCategoryImage(id: string, formData: FormData, returnPath: string) {
  const file = fileFromForm(formData, "image");
  if (!file) return;
  const service = getServiceClient();
  const { data: current } = await service.from("equipment_categories").select("image_path").eq("id", id).maybeSingle();
  let storagePath = "";
  try {
    storagePath = await storeFile(IMAGE_BUCKET, `categories/${id}`, file, "image");
  } catch (error) {
    fail(returnPath, error instanceof Error ? error.message : "The photo could not be saved.");
  }
  const { error } = await service.from("equipment_categories").update({ image_path: storagePath }).eq("id", id);
  if (error) {
    await removeStoredFile(IMAGE_BUCKET, storagePath);
    fail(returnPath, "The photo could not be saved.");
  }
  const previous = (current?.image_path as string | null) ?? "";
  if (previous && previous !== storagePath) await removeStoredFile(IMAGE_BUCKET, previous);
}

export async function createCategory(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const enteredName = field(formData, "name");
  const description = field(formData, "description");
  const tonnage = field(formData, "tonnage");
  const parentId = field(formData, "parentId");
  const requested = field(formData, "kind");
  const kind = parentId && (requested === "boom" || requested === "length") ? requested : "capacity";
  const name = kind === "boom" ? boomLabel(enteredName) || enteredName : enteredName;
  if (name.length < 2) fail(CATEGORY_PATH, "Enter a category name.");
  const parentName = await categoryParent(parentId);
  if (parentId) {
    const { data: duplicate } = await getServiceClient()
      .from("equipment_categories")
      .select("id")
      .eq("parent_id", parentId)
      .ilike("name", name)
      .is("archived_at", null)
      .maybeSingle();
    if (duplicate) fail(`${CATEGORY_PATH}?category=${parentId}`, `${name} is already under ${parentName}.`);
  }

  const service = getServiceClient();
  let slug = slugify(parentName ? `${parentName} ${name}` : name);
  const { data: existing } = await service.from("equipment_categories").select("slug").ilike("slug", `${slug}%`);
  const taken = new Set((existing ?? []).map((row) => row.slug as string));
  if (taken.has(slug)) {
    let n = 2;
    while (taken.has(`${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }

  const { data, error } = await service
    .from("equipment_categories")
    .insert({
      name,
      slug,
      description,
      tonnage,
      kind,
      parent_id: parentId || null,
      created_by: session.userId,
    })
    .select("id")
    .single();
  if (error || !data) fail(CATEGORY_PATH, "The category could not be saved.");
  const createdId = data.id as string;
  const returnPath = categoryPath(await rootCategoryId(parentId || createdId), field(formData, "type"));
  await attachCategoryImage(createdId, formData, returnPath);
  await logActivity(session, "equipment_category.created", "equipment_category", createdId, { name });
  redirect(returnPath);
}

export async function updateCategory(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const id = field(formData, "id");
  const name = field(formData, "name");
  const description = field(formData, "description");
  const tonnage = field(formData, "tonnage");
  const parentId = field(formData, "parentId");
  if (name.length < 2) fail(CATEGORY_PATH, "Enter a category name.");
  await categoryParent(parentId, id);
  const { error } = await getServiceClient()
    .from("equipment_categories")
    .update({
      name,
      description,
      tonnage,
      parent_id: parentId || null,
    })
    .eq("id", id);
  if (error) fail(CATEGORY_PATH, "The category could not be saved.");
  await logActivity(session, "equipment_category.updated", "equipment_category", id, { name });
  redirect(`${CATEGORY_PATH}?category=${await rootCategoryId(id)}`);
}

export async function renameCategory(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const id = field(formData, "id");
  const name = field(formData, "name");
  const focus = await rootCategoryId(field(formData, "focus") || id);
  const returnPath = categoryPath(focus, field(formData, "type"));
  if (name.length < 2) fail(returnPath, "Enter a category name.");
  const service = getServiceClient();
  const { data: current } = await service.from("equipment_categories").select("id, parent_id, kind").eq("id", id).maybeSingle();
  if (!current) fail(CATEGORY_PATH, "That category was already deleted.");
  const label = current.kind === "boom" ? boomLabel(name) || name : name;
  let duplicateQuery = service
    .from("equipment_categories")
    .select("id")
    .ilike("name", label)
    .is("archived_at", null)
    .neq("id", id);
  duplicateQuery = current.parent_id ? duplicateQuery.eq("parent_id", current.parent_id) : duplicateQuery.is("parent_id", null);
  const { data: duplicate } = await duplicateQuery.maybeSingle();
  if (duplicate) fail(returnPath, `${label} is already used here.`);
  const { error } = await service.from("equipment_categories").update({ name: label }).eq("id", id);
  if (error) fail(returnPath, "The name could not be saved.");
  await attachCategoryImage(id, formData, returnPath);
  await logActivity(session, "equipment_category.renamed", "equipment_category", id, { name: label });
  redirect(returnPath);
}

export async function setCategoryArchived(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const id = field(formData, "id");
  const archived = field(formData, "archived") === "true";
  const { error } = await getServiceClient()
    .from("equipment_categories")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) fail(CATEGORY_PATH, "The category could not be updated.");
  await logActivity(session, archived ? "equipment_category.archived" : "equipment_category.restored", "equipment_category", id);
  redirect(categoryPath(field(formData, "focus"), field(formData, "type")));
}

export async function deleteCategory(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const id = field(formData, "id");
  const focus = field(formData, "focus");
  const service = getServiceClient();
  const { data: category } = await service
    .from("equipment_categories")
    .select("id, name, parent_id")
    .eq("id", id)
    .maybeSingle();
  const stay = focus || (category?.parent_id as string | null) || id;
  const returnPath = categoryPath(stay, field(formData, "type"));
  if (!category) fail(CATEGORY_PATH, "That category was already deleted.");

  const { data: children } = await service.from("equipment_categories").select("id").eq("parent_id", id);
  const childIds = (children ?? []).map((child) => child.id as string);
  const { data: grandchildren } = childIds.length
    ? await service.from("equipment_categories").select("id").in("parent_id", childIds)
    : { data: [] };
  const grandchildIds = (grandchildren ?? []).map((child) => child.id as string);
  const ids = [id, ...childIds, ...grandchildIds];
  const { data: photos } = await service.from("equipment_categories").select("image_path").in("id", ids);
  const { count, error: countError } = await service
    .from("equipment")
    .select("id", { count: "exact", head: true })
    .in("category_id", ids);
  if (countError || count === null) fail(returnPath, "The category could not be deleted.");
  if (count > 0) {
    fail(returnPath, "Delete or move the equipment in this category first. Archive hides it without removing it.");
  }
  if (grandchildIds.length > 0) {
    const { error } = await service.from("equipment_categories").delete().in("id", grandchildIds);
    if (error) fail(returnPath, "The sizes could not be deleted.");
  }
  if (childIds.length > 0) {
    const { error } = await service.from("equipment_categories").delete().in("id", childIds);
    if (error) fail(returnPath, "The equipment could not be deleted.");
  }
  const { error } = await service.from("equipment_categories").delete().eq("id", id);
  if (error) fail(returnPath, "The category could not be deleted.");
  for (const photo of photos ?? []) {
    if (photo.image_path) await removeStoredFile(IMAGE_BUCKET, photo.image_path as string);
  }
  await logActivity(session, "equipment_category.deleted", "equipment_category", id, { name: category.name });
  redirect(category.parent_id ? returnPath : CATEGORY_PATH);
}

function equipmentInput(formData: FormData) {
  const name = field(formData, "name");
  const categoryId = field(formData, "categoryId");
  const code = field(formData, "code");
  return {
    name,
    categoryId,
    code: code || null,
    description: field(formData, "description"),
    capacity: field(formData, "capacity"),
    boomLength: boomValue(field(formData, "boomLength")),
    bedLength: boomValue(field(formData, "bedLength")),
    ownership: choice(field(formData, "ownership"), OWNERSHIP, "supplier"),
    status: choice(field(formData, "status"), EQUIPMENT_STATUSES, "available"),
  };
}

export async function createEquipment(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const input = equipmentInput(formData);
  const extras = extraFieldPairs(formData);
  if (input.name.length < 2 || !input.categoryId) {
    fail("/dashboard/equipment/new", "Enter a name and choose a category.");
  }
  if (extras.error) fail("/dashboard/equipment/new", extras.error);
  const { data, error } = await getServiceClient()
    .from("equipment")
    .insert({
      category_id: input.categoryId,
      code: input.code,
      name: input.name,
      description: input.description,
      capacity: input.capacity,
      boom_length: input.boomLength,
      bed_length: input.bedLength,
      ownership: input.ownership,
      status: input.status,
      created_by: session.userId,
    })
    .select("id")
    .single();
  if (error || !data) {
    fail("/dashboard/equipment/new", error?.message?.includes("duplicate") ? "That equipment code is already used." : "The equipment could not be saved.");
  }
  if (extras.pairs.length > 0) {
    const { error: fieldError } = await getServiceClient().from("equipment_specifications").insert(
      extras.pairs.map((pair) => ({ equipment_id: data.id, label: pair.label, value: pair.value })),
    );
    if (fieldError) fail(`/dashboard/equipment/${data.id}`, "The equipment was saved, but an extra field could not be saved.");
  }
  await logActivity(session, "equipment.created", "equipment", data.id as string, { name: input.name });
  redirect(`/dashboard/equipment/${data.id}`);
}

export async function updateEquipment(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const id = field(formData, "id");
  const input = equipmentInput(formData);
  const path = `/dashboard/equipment/${id}`;
  if (input.name.length < 2 || !input.categoryId) fail(path, "Enter a name and choose a category.");
  const { error } = await getServiceClient()
    .from("equipment")
    .update({
      category_id: input.categoryId,
      code: input.code,
      name: input.name,
      description: input.description,
      capacity: input.capacity,
      boom_length: input.boomLength,
      bed_length: input.bedLength,
      ownership: input.ownership,
      status: input.status,
    })
    .eq("id", id);
  if (error) fail(path, error.message.includes("duplicate") ? "That equipment code is already used." : "The equipment could not be saved.");
  await logActivity(session, "equipment.updated", "equipment", id);
  redirect(path);
}

export async function setEquipmentArchived(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const id = field(formData, "id");
  const archived = field(formData, "archived") === "true";
  const { error } = await getServiceClient()
    .from("equipment")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) fail(`/dashboard/equipment/${id}`, "The equipment could not be updated.");
  await logActivity(session, archived ? "equipment.archived" : "equipment.restored", "equipment", id);
  redirect(archived ? "/dashboard/equipment?archived=1" : `/dashboard/equipment/${id}`);
}

export async function deleteEquipment(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const id = field(formData, "id");
  const path = `/dashboard/equipment/${id}`;
  const service = getServiceClient();
  const { data: links } = await service.from("supplier_equipment").select("id").eq("equipment_id", id);
  const linkIds = (links ?? []).map((link) => link.id as string);
  if (linkIds.length > 0) {
    const { error: rateError } = await service.from("supplier_rates").delete().in("supplier_equipment_id", linkIds);
    if (rateError) fail(path, "The equipment could not be deleted.");
    const { error } = await service.from("supplier_equipment").delete().in("id", linkIds);
    if (error) fail(path, "The equipment could not be deleted.");
  }
  const [{ data: images }, { data: documents }] = await Promise.all([
    service.from("equipment_images").select("storage_path").eq("equipment_id", id),
    service.from("equipment_documents").select("storage_path").eq("equipment_id", id),
  ]);
  for (const image of images ?? []) await removeStoredFile(IMAGE_BUCKET, image.storage_path as string);
  for (const document of documents ?? []) await removeStoredFile(DOCUMENT_BUCKET, document.storage_path as string);
  const { error } = await service.from("equipment").delete().eq("id", id);
  if (error) fail(path, "The equipment could not be deleted.");
  await logActivity(session, "equipment.deleted", "equipment", id);
  redirect("/dashboard/equipment");
}

export async function addSpecification(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const equipmentId = field(formData, "equipmentId");
  const label = field(formData, "label");
  const value = field(formData, "value");
  const path = `/dashboard/equipment/${equipmentId}`;
  if (!label || !value) fail(path, "Enter a specification label and value.");
  const { error } = await getServiceClient().from("equipment_specifications").insert({
    equipment_id: equipmentId,
    label,
    value,
  });
  if (error) fail(path, "The specification could not be saved.");
  await logActivity(session, "equipment_specification.created", "equipment", equipmentId, { label });
  redirect(path);
}

export async function deleteSpecification(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const equipmentId = field(formData, "equipmentId");
  const id = field(formData, "id");
  await getServiceClient().from("equipment_specifications").delete().eq("id", id);
  await logActivity(session, "equipment_specification.deleted", "equipment", equipmentId);
  redirect(`/dashboard/equipment/${equipmentId}`);
}

export async function addAsset(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const equipmentId = field(formData, "equipmentId");
  const assetCode = field(formData, "assetCode");
  const path = `/dashboard/equipment/${equipmentId}`;
  if (assetCode.length < 2) fail(path, "Enter an asset code.");
  const { error } = await getServiceClient().from("equipment_assets").insert({
    equipment_id: equipmentId,
    asset_code: assetCode,
    serial_number: field(formData, "serialNumber"),
    registration_number: field(formData, "registrationNumber"),
    year_made: field(formData, "yearMade"),
    status: choice(field(formData, "status"), ASSET_STATUSES, "available"),
    location: field(formData, "location"),
    notes: field(formData, "notes"),
    created_by: session.userId,
  });
  if (error) fail(path, error.message.includes("duplicate") ? "That asset code is already used." : "The asset could not be saved.");
  await logActivity(session, "equipment_asset.created", "equipment", equipmentId, { assetCode });
  redirect(path);
}

export async function updateAsset(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const equipmentId = field(formData, "equipmentId");
  const path = `/dashboard/equipment/${equipmentId}`;
  const assetCode = field(formData, "assetCode");
  if (assetCode.length < 2) fail(path, "Enter an asset code.");
  const { error } = await getServiceClient().from("equipment_assets").update({
    asset_code: assetCode,
    serial_number: field(formData, "serialNumber"),
    registration_number: field(formData, "registrationNumber"),
    year_made: field(formData, "yearMade"),
    status: choice(field(formData, "status"), ASSET_STATUSES, "available"),
    location: field(formData, "location"),
    notes: field(formData, "notes"),
  }).eq("id", field(formData, "id")).eq("equipment_id", equipmentId);
  if (error) fail(path, error.message.includes("duplicate") ? "That asset code is already used." : "The asset could not be saved.");
  await logActivity(session, "equipment_asset.updated", "equipment", equipmentId, { assetCode });
  redirect(path);
}

export async function addEquipmentImage(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const equipmentId = field(formData, "equipmentId");
  const path = `/dashboard/equipment/${equipmentId}`;
  const file = fileFromForm(formData, "image");
  if (!file) fail(path, "Choose an image.");
  try {
    const storagePath = await storeFile(IMAGE_BUCKET, equipmentId, file, "image");
    const { error } = await getServiceClient().from("equipment_images").insert({
      equipment_id: equipmentId,
      storage_path: storagePath,
      alt: field(formData, "alt"),
      created_by: session.userId,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    fail(path, error instanceof Error ? error.message : "The image could not be saved.");
  }
  await logActivity(session, "equipment_image.created", "equipment", equipmentId);
  redirect(path);
}

export async function deleteEquipmentImage(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const equipmentId = field(formData, "equipmentId");
  const id = field(formData, "id");
  const storagePath = field(formData, "storagePath");
  await getServiceClient().from("equipment_images").delete().eq("id", id);
  if (storagePath) await removeStoredFile(IMAGE_BUCKET, storagePath);
  await logActivity(session, "equipment_image.deleted", "equipment", equipmentId);
  redirect(`/dashboard/equipment/${equipmentId}`);
}

export async function addEquipmentDocument(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.documentsWrite);
  const equipmentId = field(formData, "equipmentId");
  const path = `/dashboard/equipment/${equipmentId}`;
  const title = field(formData, "title");
  const file = fileFromForm(formData, "document");
  if (!title || !file) fail(path, "Enter a title and choose a file.");
  try {
    const storagePath = await storeFile(DOCUMENT_BUCKET, `equipment/${equipmentId}`, file, "document");
    const expires = field(formData, "expiresOn");
    const { error } = await getServiceClient().from("equipment_documents").insert({
      equipment_id: equipmentId,
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
  await logActivity(session, "equipment_document.created", "equipment", equipmentId, { title });
  redirect(path);
}

export async function addMaintenance(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.equipmentWrite);
  const equipmentId = field(formData, "equipmentId");
  const path = `/dashboard/equipment/${equipmentId}`;
  const servicedOn = field(formData, "servicedOn");
  const description = field(formData, "description");
  if (!servicedOn || description.length < 2) fail(path, "Enter the service date and description.");
  const nextDue = field(formData, "nextDueOn");
  const { error } = await getServiceClient().from("equipment_maintenance").insert({
    equipment_id: equipmentId,
    serviced_on: servicedOn,
    description,
    next_due_on: nextDue || null,
    created_by: session.userId,
  });
  if (error) fail(path, "The maintenance record could not be saved.");
  await logActivity(session, "equipment_maintenance.created", "equipment", equipmentId);
  redirect(path);
}
