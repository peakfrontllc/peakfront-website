import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CataloguePhoto } from "@/components/manage/erp/CataloguePhoto";
import { SocialLinksField } from "@/components/manage/erp/SocialLinksField";
import { InlineEdit } from "@/components/manage/erp/InlineEdit";
import { ProvidedEquipmentField } from "@/components/manage/erp/ProvidedEquipmentField";
import { SupplierKindFields } from "@/components/manage/erp/SupplierKindFields";
import { PermanentDeleteButton } from "@/components/manage/erp/PermanentDeleteButton";
import { SectionNav } from "@/components/manage/erp/SectionNav";
import { ArchiveButton, EmiratesField, ExtraFieldPanel, Flash, Panel, SectionStack, TextField, documentTypeLabel, fileHref } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { socialHref } from "@/lib/erp/shared";
import { requirePermission } from "@/lib/auth/session";
import { addCustomField, deleteCustomField } from "@/lib/erp/custom-field-actions";
import { listCustomFields } from "@/lib/erp/custom-fields";
import { catalogueTypeGroups, equipmentGroups, listCategories, listEquipmentOptions } from "@/lib/erp/equipment";
import { DOCUMENT_BUCKET } from "@/lib/erp/files";
import {
  addSupplierContact,
  addSupplierDocument,
  addSupplierLocation,
  addSupplierNote,
  deleteSupplierContact,
  deleteSupplierDocument,
  deleteSupplier,
  linkSupplierEquipment,
  setSupplierArchived,
  updateSupplier,
  updateSupplierCatalogue,
  updateSupplierContact,
  updateSupplierLocation,
} from "@/lib/erp/supplier-actions";
import { getSupplier } from "@/lib/erp/suppliers";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Supplier", robots: { index: false, follow: false } };

export default async function SupplierDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.suppliersRead);
  const { id } = await params;
  const query = await searchParams;
  const [supplier, equipment, customFields, categories] = await Promise.all([
    getSupplier(id),
    listEquipmentOptions(),
    listCustomFields("supplier", id),
    listCategories(),
  ]);
  if (!supplier) notFound();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.suppliersWrite);
  const canEditEquipment = canWrite || hasPermission(session.permissions, PERMISSIONS.ratesWrite);
  const canDocuments = hasPermission(session.permissions, PERMISSIONS.documentsWrite);
  const linked = new Set(supplier.equipment.map((item) => item.equipmentId));
  const available = equipment.filter((item) => !linked.has(item.id));

  return (
    <>
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center">
        {supplier.equipment[0] ? (
          <CataloguePhoto name={supplier.equipment[0].equipmentName} large />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-semibold text-navy ring-1 ring-slate-200">
            {supplier.companyName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{supplier.partyType === "individual" ? "Individual" : "Company"}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy">{supplier.companyName}</h1>
          <p className="mt-1 text-sm text-slate-500">{[supplier.phone, supplier.email, supplier.emirates.join(", ")].filter(Boolean).join(" · ") || "No contact yet"}</p>
          {supplier.socialLinks.length > 0 && (
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {supplier.socialLinks.map((link, index) => {
                const href = socialHref(link.url);
                const text = link.label || link.url;
                return href ? (
                  <a key={`${link.url}-${index}`} href={href} target="_blank" rel="noreferrer" className="font-medium text-navy underline decoration-navy/30 underline-offset-2 hover:text-blue">{text}</a>
                ) : (
                  <span key={`${link.url}-${index}`} className="text-navy">{text}</span>
                );
              })}
            </p>
          )}
        </div>
        {canWrite && (
          <div className="flex shrink-0 gap-2">
            <ArchiveButton action={setSupplierArchived} id={supplier.id} archived={Boolean(supplier.archivedAt)} />
            <PermanentDeleteButton
              action={deleteSupplier}
              id={supplier.id}
              message={`Delete ${supplier.companyName} permanently? Its rates are deleted too. This cannot be restored.`}
            />
          </div>
        )}
      </div>
      <SectionNav items={[
        { id: "details", label: "Details" },
        { id: "fields", label: "Fields" },
        { id: "contacts", label: "Contacts" },
        { id: "locations", label: "Locations" },
        { id: "provides", label: "Equipment they provide" },
        { id: "equipment", label: "Available equipment" },
        { id: "notes", label: "Notes" },
        { id: "documents", label: "Documents" },
      ]} />
      <div>
        <div className="mx-auto max-w-5xl space-y-5">
          <Flash error={query.error} />
          {supplier.archivedAt && <p className="rounded-xl border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">This supplier is archived.</p>}

          <SectionStack collapsible>
          <Panel id="details" title={supplier.partyType === "individual" ? "Individual" : "Company"}>
            {canWrite ? (
              <form action={updateSupplier} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={supplier.id} />
                <SupplierKindFields defaultType={supplier.partyType} defaultName={supplier.companyName} />
                <TextField name="tradeLicence" label="Trade licence" defaultValue={supplier.tradeLicence} />
                <TextField name="phone" label="Phone" defaultValue={supplier.phone} />
                <TextField name="email" label="Email" type="email" defaultValue={supplier.email} />
                <TextField name="website" label="Website" defaultValue={supplier.website} />
                <EmiratesField defaultValue={supplier.emirates} />
                <div className="sm:col-span-2"><TextField name="address" label="Address" defaultValue={supplier.address} /></div>
                <SocialLinksField links={supplier.socialLinks} />
                <div className="sm:col-span-2"><TextField name="notes" label="Summary" defaultValue={supplier.notes} /></div>
                <button className={buttonClass} type="submit">Save details</button>
              </form>
            ) : (
              <p className="text-sm text-slate-600">{[supplier.partyType === "individual" ? "Individual" : "Company", supplier.phone, supplier.email, supplier.website, supplier.emirate, ...supplier.socialLinks.map((link) => link.label || link.url)].filter(Boolean).join(" · ")}</p>
            )}
          </Panel>

          <ExtraFieldPanel
            fields={customFields}
            canWrite={canWrite}
            addAction={addCustomField}
            removeAction={deleteCustomField}
            hidden={[
              { name: "ownerType", value: "supplier" },
              { name: "ownerId", value: supplier.id },
            ]}
          />

          <Panel id="contacts" title="Contacts">
            {supplier.contacts.map((contact) => (
              canWrite ? (
                <InlineEdit
                  key={contact.id}
                  summary={
                    <p>
                      <strong>{contact.name}</strong>{contact.isPrimary ? " · Primary" : ""}
                      <span className="block text-slate-600">{[contact.jobTitle, contact.phone, contact.email, contact.whatsapp].filter(Boolean).join(" · ")}</span>
                    </p>
                  }
                  actions={
                    <form action={deleteSupplierContact}>
                      <input type="hidden" name="supplierId" value={supplier.id} />
                      <input type="hidden" name="id" value={contact.id} />
                      <button className="text-xs font-bold text-red-700" type="submit">Remove</button>
                    </form>
                  }
                >
                  <form action={updateSupplierContact} className="grid gap-3 sm:grid-cols-2">
                    <input type="hidden" name="supplierId" value={supplier.id} />
                    <input type="hidden" name="id" value={contact.id} />
                    <input name="name" defaultValue={contact.name} placeholder="Name" required className={fieldClass} />
                    <input name="jobTitle" defaultValue={contact.jobTitle} placeholder="Job title" className={fieldClass} />
                    <input name="phone" defaultValue={contact.phone} placeholder="Phone" className={fieldClass} />
                    <input name="email" defaultValue={contact.email} placeholder="Email" className={fieldClass} />
                    <input name="whatsapp" defaultValue={contact.whatsapp} placeholder="WhatsApp" className={fieldClass} />
                    <label className="flex items-center gap-2 text-sm text-navy"><input name="isPrimary" type="checkbox" defaultChecked={contact.isPrimary} /> Primary contact</label>
                    <button className={`${buttonClass} sm:col-span-2`} type="submit">Save contact</button>
                  </form>
                </InlineEdit>
              ) : (
                <p key={contact.id} className="mb-3 text-sm">
                  <strong>{contact.name}</strong>{contact.isPrimary ? " · Primary" : ""}
                  <span className="block text-slate-600">{[contact.jobTitle, contact.phone, contact.email, contact.whatsapp].filter(Boolean).join(" · ")}</span>
                </p>
              )
            ))}
            {canWrite && (
              <form action={addSupplierContact} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="supplierId" value={supplier.id} />
                <input name="name" placeholder="Name" required className={fieldClass} />
                <input name="jobTitle" placeholder="Job title" className={fieldClass} />
                <input name="phone" placeholder="Phone" className={fieldClass} />
                <input name="email" placeholder="Email" className={fieldClass} />
                <input name="whatsapp" placeholder="WhatsApp" className={fieldClass} />
                <label className="flex items-center gap-2 text-sm text-navy"><input name="isPrimary" type="checkbox" /> Primary contact</label>
                <button className={`${buttonClass} sm:col-span-2`} type="submit">Add contact</button>
              </form>
            )}
          </Panel>

          <Panel id="locations" title="Locations">
            {supplier.locations.map((location) => (
              canWrite ? (
                <InlineEdit
                  key={location.id}
                  summary={<p><strong>{location.label}</strong> · {[location.address, location.city, location.emirate].filter(Boolean).join(" · ")}</p>}
                >
                  <form action={updateSupplierLocation} className="grid gap-3 sm:grid-cols-2">
                    <input type="hidden" name="supplierId" value={supplier.id} />
                    <input type="hidden" name="id" value={location.id} />
                    <input name="label" defaultValue={location.label} placeholder="Location name" required className={fieldClass} />
                    <input name="city" defaultValue={location.city} placeholder="City" className={fieldClass} />
                    <input name="address" defaultValue={location.address} placeholder="Address" className={fieldClass} />
                    <input name="emirate" defaultValue={location.emirate} placeholder="Emirate" className={fieldClass} />
                    <button className={buttonClass} type="submit">Save location</button>
                  </form>
                </InlineEdit>
              ) : (
                <p key={location.id} className="mb-2 text-sm"><strong>{location.label}</strong> · {location.address} · {location.city} · {location.emirate}</p>
              )
            ))}
            {canWrite && (
              <form action={addSupplierLocation} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="supplierId" value={supplier.id} />
                <input name="label" placeholder="Location name" required className={fieldClass} />
                <input name="city" placeholder="City" className={fieldClass} />
                <input name="address" placeholder="Address" className={fieldClass} />
                <input name="emirate" placeholder="Emirate" className={fieldClass} />
                <button className={buttonClass} type="submit">Add location</button>
              </form>
            )}
          </Panel>

          <Panel id="provides" title={supplier.provided.length > 0 ? `Equipment they provide · ${supplier.provided.map((item) => item.name).join(", ")}` : "Equipment they provide"}>
            {canWrite ? (
              <form action={updateSupplierCatalogue}>
                <input type="hidden" name="supplierId" value={supplier.id} />
                <ProvidedEquipmentField groups={catalogueTypeGroups(categories)} selectedIds={supplier.provided.map((item) => item.categoryId)} />
                <button className={`${buttonClass} mt-4`} type="submit">Save equipment list</button>
              </form>
            ) : supplier.provided.length === 0 ? (
              <p className="text-sm text-slate-500">No equipment is listed yet.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {supplier.provided.map((item) => (
                  <li key={item.id} className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-medium text-navy">{item.name}</li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel id="equipment" title={supplier.equipment.length > 0 ? `Available equipment · ${supplier.equipment.length}` : "Available equipment"}>
            {supplier.equipment.length === 0 ? (
              <p className="text-sm text-slate-500">No equipment is linked yet.</p>
            ) : (
              <>
                <ul className="divide-y divide-navy/10 overflow-hidden rounded-xl border border-navy/10 bg-white">
                  {supplier.equipment.slice(0, 2).map((item) => {
                    const option = equipment.find((entry) => entry.id === item.equipmentId);
                    return (
                      <li key={item.id} className="flex items-center gap-2 px-2.5 py-1.5 transition hover:bg-amber/15">
                        <CataloguePhoto name={option?.typeName ?? item.equipmentName} small />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-navy">{option?.label ?? item.equipmentName}</p>
                          {(option?.group || option?.detail) && (
                            <p className="text-xs text-slate-500">
                              {option?.group}
                              {option?.group && option?.detail ? " · " : ""}
                              {option?.detail && <span className="font-medium text-navy">{option.detail}</span>}
                            </p>
                          )}
                        </div>
                        <Link href={`/dashboard/equipment/${item.equipmentId}`} className="inline-flex h-7 shrink-0 items-center rounded-md bg-navy px-2.5 text-[11px] font-semibold text-white hover:bg-blue">
                          View more details
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {supplier.equipment.length > 0 && (
                  <Link href={`/dashboard/suppliers/${supplier.id}/equipment`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex h-8 items-center gap-1 rounded-md border border-navy/15 px-2.5 text-xs font-semibold text-navy hover:border-amber hover:bg-amber/10">
                    {canEditEquipment ? "View and edit available equipment" : "View all available equipment"}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                )}
              </>
            )}
            {canWrite && available.length > 0 && (
              <form action={linkSupplierEquipment} className={`${supplier.equipment.length > 0 ? "mt-4 " : ""}grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end`}>
                <input type="hidden" name="supplierId" value={supplier.id} />
                <select name="equipmentId" className={fieldClass} required defaultValue="">
                  <option value="" disabled>Choose equipment</option>
                  {equipmentGroups(available).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map((item) => <option key={item.id} value={item.id}>{[item.label, item.detail].filter(Boolean).join(" · ")}</option>)}
                    </optgroup>
                  ))}
                </select>
                <input name="leadTime" placeholder="Lead time" className={fieldClass} />
                <button className={buttonClass} type="submit">Link equipment</button>
              </form>
            )}
          </Panel>

          <Panel id="notes" title="Notes">
            {supplier.noteLog.map((note) => (
              <p key={note.id} className="mb-3 text-sm"><span className="text-slate-400">{note.createdAt.slice(0, 10)}</span> {note.body}</p>
            ))}
            {canWrite && (
              <form action={addSupplierNote} className="mt-4 grid gap-3">
                <input type="hidden" name="supplierId" value={supplier.id} />
                <textarea name="body" required rows={3} placeholder="Add a note" className={fieldClass} />
                <button className={buttonClass} type="submit">Add note</button>
              </form>
            )}
          </Panel>

          <Panel id="documents" title="Documents">
            {supplier.documents.length === 0 ? (
              <p className="text-sm text-slate-500">No documents yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {supplier.documents.map((document) => (
                  <li key={document.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 px-3 py-2">
                    <p>
                      <a className="font-semibold text-blue hover:underline" href={fileHref(DOCUMENT_BUCKET, document.storagePath)}>{document.title}</a>
                      <span className="text-slate-500"> · {documentTypeLabel(document.docType)}{document.expiresOn ? ` · expires ${document.expiresOn}` : ""}</span>
                    </p>
                    {canDocuments && (
                      <form action={deleteSupplierDocument}>
                        <input type="hidden" name="supplierId" value={supplier.id} />
                        <input type="hidden" name="id" value={document.id} />
                        <button className="text-xs font-bold text-red-700" type="submit">Remove</button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {canDocuments && (
              <form action={addSupplierDocument} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="supplierId" value={supplier.id} />
                <input name="title" placeholder="Title" required className={fieldClass} />
                <select name="docType" className={fieldClass} defaultValue="trade_licence">
                  <option value="trade_licence">Trade licence</option>
                  <option value="insurance">Insurance</option>
                  <option value="certificate">Certificate</option>
                  <option value="other">Other</option>
                </select>
                <input name="expiresOn" type="date" aria-label="Expires on" className={fieldClass} />
                <input name="document" type="file" required accept="application/pdf,image/*" className={fieldClass} />
                <button className={buttonClass} type="submit">Upload document</button>
              </form>
            )}
          </Panel>
          </SectionStack>
        </div>
      </div>
    </>
  );
}
