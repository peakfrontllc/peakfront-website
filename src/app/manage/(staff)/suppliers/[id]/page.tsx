import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollapsibleSection } from "@/components/manage/erp/CollapsibleSection";
import { InlineEdit } from "@/components/manage/erp/InlineEdit";
import { SupplierKindFields } from "@/components/manage/erp/SupplierKindFields";
import { PermanentDeleteButton } from "@/components/manage/erp/PermanentDeleteButton";
import { ArchiveButton, EmiratesField, ExtraFieldPanel, Flash, MasterHero, Panel, SectionStack, TextField, fileHref } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { addCustomField, deleteCustomField } from "@/lib/erp/custom-field-actions";
import { listCustomFields } from "@/lib/erp/custom-fields";
import { equipmentGroups, listEquipmentOptions } from "@/lib/erp/equipment";
import { formatMoney, todayIso } from "@/lib/erp/shared";
import { DOCUMENT_BUCKET } from "@/lib/erp/files";
import {
  addSupplierContact,
  addSupplierDocument,
  addSupplierLocation,
  addSupplierNote,
  addSupplierRate,
  deleteSupplierContact,
  deleteSupplier,
  linkSupplierEquipment,
  setSupplierArchived,
  updateSupplier,
  updateSupplierContact,
  updateSupplierEquipment,
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
  const [supplier, equipment, customFields] = await Promise.all([
    getSupplier(id),
    listEquipmentOptions(),
    listCustomFields("supplier", id),
  ]);
  if (!supplier) notFound();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.suppliersWrite);
  const canRates = hasPermission(session.permissions, PERMISSIONS.ratesWrite);
  const canDocuments = hasPermission(session.permissions, PERMISSIONS.documentsWrite);
  const linked = new Set(supplier.equipment.map((item) => item.equipmentId));
  const available = equipment.filter((item) => !linked.has(item.id));

  return (
    <>
      <MasterHero kicker={supplier.partyType === "individual" ? "Individual" : "Company"} title={supplier.companyName} />
      <div>
        <div className="mx-auto max-w-5xl space-y-5">
          <Link href="/manage/suppliers" className="text-sm font-semibold text-blue hover:underline">Back to suppliers</Link>
          <Flash error={query.error} />
          {supplier.archivedAt && <p className="border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">This supplier is archived.</p>}

          <SectionStack>
          <Panel title={supplier.partyType === "individual" ? "Individual" : "Company"}>
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
                <div className="sm:col-span-2"><TextField name="notes" label="Summary" defaultValue={supplier.notes} /></div>
                <button className={buttonClass} type="submit">Save details</button>
              </form>
            ) : (
              <p className="text-sm text-slate-600">{supplier.partyType === "individual" ? "Individual" : "Company"} · {supplier.phone} · {supplier.email} · {supplier.emirate}</p>
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

          <Panel title="Contacts">
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

          <Panel title="Locations">
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

          <Panel title="Equipment and rates">
            {supplier.equipment.map((item) => {
              const option = equipment.find((entry) => entry.id === item.equipmentId);
              return (
              <CollapsibleSection
                key={item.id}
                nested
                title={option?.label ?? item.equipmentName}
                subtitle={option?.group}
              >
                {canWrite ? (
                  <InlineEdit
                    summary={<p className="text-slate-600">{item.leadTime ? `Lead time ${item.leadTime}. ` : "No lead time yet."}{item.notes}</p>}
                  >
                    <form action={updateSupplierEquipment} className="grid gap-3 sm:grid-cols-2">
                      <input type="hidden" name="supplierId" value={supplier.id} />
                      <input type="hidden" name="id" value={item.id} />
                      <input name="leadTime" defaultValue={item.leadTime} placeholder="Lead time" className={fieldClass} />
                      <input name="notes" defaultValue={item.notes} placeholder="Notes" className={fieldClass} />
                      <button className={buttonClass} type="submit">Save</button>
                    </form>
                  </InlineEdit>
                ) : (
                  <p className="mb-3 text-sm text-slate-600">{item.leadTime ? `Lead time ${item.leadTime}. ` : ""}{item.notes}</p>
                )}
                <table className="mt-3 w-full text-left text-sm">
                  <thead className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    <tr><th className="py-2">From</th><th>To</th><th>Daily</th><th>Weekly</th><th>Monthly</th><th>VAT</th></tr>
                  </thead>
                  <tbody>
                    {item.rates.map((rate) => (
                      <tr key={rate.id} className="border-t border-navy/5">
                        <td className="py-2">{rate.validFrom}</td>
                        <td>{rate.validTo ?? "Open"}</td>
                        <td>{formatMoney(rate.dailyRate)}</td>
                        <td>{formatMoney(rate.weeklyRate)}</td>
                        <td>{formatMoney(rate.monthlyRate)}</td>
                        <td>{rate.vatIncluded ? "Included" : "Extra"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-slate-500">Transport and operator charges stay on each historical rate and are not overwritten.</p>
                {canRates && (
                  <form action={addSupplierRate} className="mt-4 grid gap-3 sm:grid-cols-3">
                    <input type="hidden" name="supplierId" value={supplier.id} />
                    <input type="hidden" name="supplierEquipmentId" value={item.id} />
                    <input name="validFrom" type="date" required defaultValue={todayIso()} className={fieldClass} />
                    <input name="dailyRate" placeholder="Daily AED" className={fieldClass} />
                    <input name="weeklyRate" placeholder="Weekly AED" className={fieldClass} />
                    <input name="monthlyRate" placeholder="Monthly AED" className={fieldClass} />
                    <input name="transportCharge" placeholder="Transport AED" className={fieldClass} />
                    <input name="operatorDailyCharge" placeholder="Operator / day AED" className={fieldClass} />
                    <label className="flex items-center gap-2 text-sm text-navy"><input name="vatIncluded" type="checkbox" /> VAT included</label>
                    <button className={`${buttonClass} sm:col-span-3`} type="submit">Save new rate</button>
                  </form>
                )}
              </CollapsibleSection>
              );
            })}
            {canWrite && available.length > 0 && (
              <form action={linkSupplierEquipment} className={`${supplier.equipment.length > 0 ? "mt-4 " : ""}grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end`}>
                <input type="hidden" name="supplierId" value={supplier.id} />
                <select name="equipmentId" className={fieldClass} required defaultValue="">
                  <option value="" disabled>Choose equipment</option>
                  {equipmentGroups(available).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                    </optgroup>
                  ))}
                </select>
                <input name="leadTime" placeholder="Lead time" className={fieldClass} />
                <button className={buttonClass} type="submit">Link equipment</button>
              </form>
            )}
          </Panel>

          <Panel title="Notes">
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

          <Panel title="Documents">
            <ul className="space-y-2 text-sm">
              {supplier.documents.map((document) => (
                <li key={document.id}>
                  <a className="font-semibold text-blue hover:underline" href={fileHref(DOCUMENT_BUCKET, document.storagePath)}>{document.title}</a>
                  <span className="text-slate-500"> · {document.docType}{document.expiresOn ? ` · expires ${document.expiresOn}` : ""}</span>
                </li>
              ))}
            </ul>
            {canDocuments && (
              <form action={addSupplierDocument} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="supplierId" value={supplier.id} />
                <input name="title" placeholder="Title" required className={fieldClass} />
                <select name="docType" className={fieldClass} defaultValue="trade_licence">
                  <option value="trade_licence">trade licence</option>
                  <option value="insurance">insurance</option>
                  <option value="certificate">certificate</option>
                  <option value="other">other</option>
                </select>
                <input name="expiresOn" type="date" className={fieldClass} />
                <input name="document" type="file" required accept="application/pdf,image/*" className={fieldClass} />
                <button className={buttonClass} type="submit">Upload document</button>
              </form>
            )}
          </Panel>
          </SectionStack>

          {canWrite && (
            <div className="flex flex-wrap gap-3">
              <ArchiveButton action={setSupplierArchived} id={supplier.id} archived={Boolean(supplier.archivedAt)} />
              <PermanentDeleteButton
                action={deleteSupplier}
                id={supplier.id}
                message={`Delete ${supplier.companyName} permanently? Its rates are deleted too. This cannot be restored.`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
