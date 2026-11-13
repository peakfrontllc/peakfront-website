import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InlineEdit } from "@/components/manage/erp/InlineEdit";
import { ProvidedEquipmentField } from "@/components/manage/erp/ProvidedEquipmentField";
import { PermanentDeleteButton } from "@/components/manage/erp/PermanentDeleteButton";
import { SectionNav } from "@/components/manage/erp/SectionNav";
import { ArchiveButton, EmiratesField, ExtraFieldPanel, Flash, Panel, SectionStack, TextField, documentTypeLabel, fileHref } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { emiratesFromRow, regionLabel } from "@/lib/erp/shared";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import {
  addClientContact,
  addClientDocument,
  addClientLocation,
  addClientNote,
  deleteClientContact,
  deleteClientDocument,
  deleteClientInterest,
  deleteClient,
  saveClientEquipment,
  setClientArchived,
  updateClient,
  updateClientContact,
  updateClientInterest,
  updateClientLocation,
} from "@/lib/erp/client-actions";
import { getClient } from "@/lib/erp/clients";
import { addCustomField, deleteCustomField } from "@/lib/erp/custom-field-actions";
import { listCustomFields } from "@/lib/erp/custom-fields";
import { catalogueTypeGroups, listCategories, type CategoryOption } from "@/lib/erp/equipment";
import { DOCUMENT_BUCKET } from "@/lib/erp/files";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Client", robots: { index: false, follow: false } };

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.clientsRead);
  const { id } = await params;
  const query = await searchParams;
  const [client, categories, customFields] = await Promise.all([
    getClient(id),
    listCategories(),
    listCustomFields("client", id),
  ]);
  if (!client) notFound();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.clientsWrite);
  const canDocuments = hasPermission(session.permissions, PERMISSIONS.documentsWrite);
  const catalogue = catalogueTypeGroups(categories);

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Client</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy">{client.companyName}</h1>
          <p className="mt-1 text-sm text-slate-500">{[client.industry, client.phone, client.email, client.website, regionLabel(client.emirate) || "No region"].filter(Boolean).join(" · ")}</p>
        </div>
        {canWrite && (
          <div className="flex shrink-0 gap-2">
            <ArchiveButton action={setClientArchived} id={client.id} archived={Boolean(client.archivedAt)} />
            <PermanentDeleteButton
              action={deleteClient}
              id={client.id}
              message={`Delete ${client.companyName} permanently? This cannot be restored.`}
            />
          </div>
        )}
      </div>
      <SectionNav items={[
        { id: "company", label: "Company" },
        { id: "fields", label: "Fields" },
        { id: "contacts", label: "Contacts" },
        { id: "locations", label: "Locations" },
        { id: "equipment", label: "Equipment" },
        { id: "notes", label: "Notes" },
        { id: "documents", label: "Documents" },
      ]} />
      <div>
        <div className="mx-auto max-w-5xl space-y-5">
          <Flash error={query.error} />
          {client.archivedAt && <p className="rounded-xl border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">This client is archived.</p>}

          <SectionStack collapsible>
          <Panel id="company" title="Company">
            {canWrite ? (
              <form action={updateClient} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={client.id} />
                <div className="sm:col-span-2"><TextField name="companyName" label="Company" required defaultValue={client.companyName} /></div>
                <TextField name="tradeLicence" label="Trade licence" defaultValue={client.tradeLicence} />
                <TextField name="industry" label="Industry" defaultValue={client.industry} />
                <TextField name="phone" label="Phone" defaultValue={client.phone} />
                <TextField name="email" label="Email" type="email" defaultValue={client.email} />
                <TextField name="website" label="Website" defaultValue={client.website} />
                <EmiratesField defaultValue={emiratesFromRow(null, client.emirate)} />
                <div className="sm:col-span-2"><TextField name="billingAddress" label="Billing address" defaultValue={client.billingAddress} /></div>
                <div className="sm:col-span-2"><TextField name="notes" label="Summary" defaultValue={client.notes} /></div>
                <button className={buttonClass} type="submit">Save company</button>
              </form>
            ) : (
              <p className="text-sm text-slate-600">{[client.industry, client.phone, client.email, client.website, regionLabel(client.emirate) || "No region"].filter(Boolean).join(" · ")}</p>
            )}
          </Panel>

          <ExtraFieldPanel
            fields={customFields}
            canWrite={canWrite}
            addAction={addCustomField}
            removeAction={deleteCustomField}
            hidden={[
              { name: "ownerType", value: "client" },
              { name: "ownerId", value: client.id },
            ]}
          />

          <Panel id="contacts" title="Contacts">
            {client.contacts.map((contact) => (
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
                    <form action={deleteClientContact}>
                      <input type="hidden" name="clientId" value={client.id} />
                      <input type="hidden" name="id" value={contact.id} />
                      <button className="text-xs font-bold text-red-700" type="submit">Remove</button>
                    </form>
                  }
                >
                  <form action={updateClientContact} className="grid gap-3 sm:grid-cols-2">
                    <input type="hidden" name="clientId" value={client.id} />
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
              <form action={addClientContact} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="clientId" value={client.id} />
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
            {client.locations.map((location) => (
              canWrite ? (
                <InlineEdit
                  key={location.id}
                  summary={<p><strong>{location.label}</strong> · {[location.address, location.city, location.emirate].filter(Boolean).join(" · ")}</p>}
                >
                  <form action={updateClientLocation} className="grid gap-3 sm:grid-cols-2">
                    <input type="hidden" name="clientId" value={client.id} />
                    <input type="hidden" name="id" value={location.id} />
                    <input name="label" defaultValue={location.label} placeholder="Site or office" required className={fieldClass} />
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
              <form action={addClientLocation} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="clientId" value={client.id} />
                <input name="label" placeholder="Site or office" required className={fieldClass} />
                <input name="city" placeholder="City" className={fieldClass} />
                <input name="address" placeholder="Address" className={fieldClass} />
                <input name="emirate" placeholder="Emirate" className={fieldClass} />
                <button className={buttonClass} type="submit">Add location</button>
              </form>
            )}
          </Panel>

          <Panel id="equipment" title="Equipment they regularly need">
            {canWrite ? (
              <form action={saveClientEquipment}>
                <input type="hidden" name="clientId" value={client.id} />
                <ProvidedEquipmentField groups={catalogue} selectedIds={client.interests.map((item) => item.categoryId)} />
                <button className={`${buttonClass} mt-4`} type="submit">Save equipment list</button>
              </form>
            ) : client.interests.length === 0 ? (
              <p className="text-sm text-slate-500">No equipment is listed yet.</p>
            ) : null}
            {client.interests.length > 0 && (
              <div className={canWrite ? "mt-4" : ""}>
                {client.interests.map((interest) => (
                  canWrite ? (
                    <InlineEdit
                      key={interest.id}
                      summary={<p><strong>{interestTitle(categories, interest.categoryId, interest.categoryName)}</strong> · Qty {interest.typicalQuantity}{interest.durationNote ? ` · ${interest.durationNote}` : ""}</p>}
                      actions={
                        <form action={deleteClientInterest}>
                          <input type="hidden" name="clientId" value={client.id} />
                          <input type="hidden" name="id" value={interest.id} />
                          <button className="text-xs font-bold text-red-700" type="submit">Remove</button>
                        </form>
                      }
                    >
                      <form action={updateClientInterest} className="grid gap-3 sm:grid-cols-2">
                        <input type="hidden" name="clientId" value={client.id} />
                        <input type="hidden" name="id" value={interest.id} />
                        <input name="quantity" type="number" min={1} defaultValue={interest.typicalQuantity} className={fieldClass} />
                        <input name="durationNote" defaultValue={interest.durationNote} placeholder="Typical duration" className={fieldClass} />
                        <button className={buttonClass} type="submit">Save equipment</button>
                      </form>
                    </InlineEdit>
                  ) : (
                    <p key={interest.id} className="mb-2 text-sm"><strong>{interestTitle(categories, interest.categoryId, interest.categoryName)}</strong> · Qty {interest.typicalQuantity}{interest.durationNote ? ` · ${interest.durationNote}` : ""}</p>
                  )
                ))}
              </div>
            )}
          </Panel>

          <Panel id="notes" title="Notes">
            {client.noteLog.map((note) => (
              <p key={note.id} className="mb-3 text-sm"><span className="text-slate-400">{note.createdAt.slice(0, 10)}</span> {note.body}</p>
            ))}
            {canWrite && (
              <form action={addClientNote} className="mt-4 grid gap-3">
                <input type="hidden" name="clientId" value={client.id} />
                <textarea name="body" required rows={3} placeholder="Add a note" className={fieldClass} />
                <button className={buttonClass} type="submit">Add note</button>
              </form>
            )}
          </Panel>

          <Panel id="documents" title="Documents">
            {client.documents.length === 0 ? (
              <p className="text-sm text-slate-500">No documents yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {client.documents.map((document) => (
                  <li key={document.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 px-3 py-2">
                    <p>
                      <a className="font-semibold text-blue hover:underline" href={fileHref(DOCUMENT_BUCKET, document.storagePath)}>{document.title}</a>
                      <span className="text-slate-500"> · {documentTypeLabel(document.docType)}{document.expiresOn ? ` · expires ${document.expiresOn}` : ""}</span>
                    </p>
                    {canDocuments && (
                      <form action={deleteClientDocument}>
                        <input type="hidden" name="clientId" value={client.id} />
                        <input type="hidden" name="id" value={document.id} />
                        <button className="text-xs font-bold text-red-700" type="submit">Remove</button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {canDocuments && (
              <form action={addClientDocument} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="clientId" value={client.id} />
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

function interestTitle(categories: CategoryOption[], categoryId: string, fallback: string) {
  const category = categories.find((item) => item.id === categoryId);
  if (!category) return fallback;
  return category.parentName ? `${category.parentName} · ${category.name}` : category.name;
}
