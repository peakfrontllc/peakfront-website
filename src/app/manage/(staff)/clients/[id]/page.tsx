import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InlineEdit } from "@/components/manage/erp/InlineEdit";
import { PermanentDeleteButton } from "@/components/manage/erp/PermanentDeleteButton";
import { ArchiveButton, EmirateField, ExtraFieldPanel, Flash, MasterHero, Panel, SectionStack, TextField } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import {
  addClientContact,
  addClientInterest,
  addClientLocation,
  addClientNote,
  deleteClientContact,
  deleteClientInterest,
  deleteClient,
  setClientArchived,
  updateClient,
  updateClientContact,
  updateClientInterest,
  updateClientLocation,
} from "@/lib/erp/client-actions";
import { getClient } from "@/lib/erp/clients";
import { addCustomField, deleteCustomField } from "@/lib/erp/custom-field-actions";
import { listCustomFields } from "@/lib/erp/custom-fields";
import { equipmentGroups, listEquipmentOptions } from "@/lib/erp/equipment";

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
  const [client, equipment, customFields] = await Promise.all([
    getClient(id),
    listEquipmentOptions(),
    listCustomFields("client", id),
  ]);
  if (!client) notFound();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.clientsWrite);
  const linked = new Set(client.interests.map((item) => item.equipmentId));
  const available = equipment.filter((item) => !linked.has(item.id));

  return (
    <>
      <MasterHero kicker="Client" title={client.companyName} />
      <div>
        <div className="mx-auto max-w-5xl space-y-5">
          <Link href="/manage/clients" className="text-sm font-semibold text-blue hover:underline">Back to clients</Link>
          <Flash error={query.error} />
          {client.archivedAt && <p className="border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">This client is archived.</p>}

          <SectionStack>
          <Panel title="Company">
            {canWrite ? (
              <form action={updateClient} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={client.id} />
                <div className="sm:col-span-2"><TextField name="companyName" label="Company" required defaultValue={client.companyName} /></div>
                <TextField name="tradeLicence" label="Trade licence" defaultValue={client.tradeLicence} />
                <TextField name="industry" label="Industry" defaultValue={client.industry} />
                <TextField name="phone" label="Phone" defaultValue={client.phone} />
                <TextField name="email" label="Email" type="email" defaultValue={client.email} />
                <EmirateField name="emirate" defaultValue={client.emirate} />
                <div className="sm:col-span-2"><TextField name="billingAddress" label="Billing address" defaultValue={client.billingAddress} /></div>
                <div className="sm:col-span-2"><TextField name="notes" label="Summary" defaultValue={client.notes} /></div>
                <button className={buttonClass} type="submit">Save company</button>
              </form>
            ) : (
              <p className="text-sm text-slate-600">{client.industry} · {client.phone} · {client.emirate}</p>
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

          <Panel title="Contacts">
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

          <Panel title="Locations">
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

          <Panel title="Equipment they regularly need">
            {client.interests.map((interest) => (
              canWrite ? (
                <InlineEdit
                  key={interest.id}
                  summary={<p><strong>{equipment.find((option) => option.id === interest.equipmentId)?.label ?? interest.equipmentName}</strong> · Qty {interest.typicalQuantity} · {interest.durationNote}</p>}
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
                <p key={interest.id} className="mb-2 text-sm"><strong>{equipment.find((option) => option.id === interest.equipmentId)?.label ?? interest.equipmentName}</strong> · Qty {interest.typicalQuantity} · {interest.durationNote}</p>
              )
            ))}
            {canWrite && available.length > 0 && (
              <form action={addClientInterest} className="mt-4 grid gap-3 sm:grid-cols-3 sm:items-end">
                <input type="hidden" name="clientId" value={client.id} />
                <select name="equipmentId" required className={fieldClass} defaultValue="">
                  <option value="" disabled>Choose equipment</option>
                  {equipmentGroups(available).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                    </optgroup>
                  ))}
                </select>
                <input name="quantity" type="number" min={1} defaultValue={1} className={fieldClass} />
                <input name="durationNote" placeholder="Typical duration" className={fieldClass} />
                <button className={buttonClass} type="submit">Add equipment</button>
              </form>
            )}
          </Panel>

          <Panel title="Notes">
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
          </SectionStack>

          {canWrite && (
            <div className="flex flex-wrap gap-3">
              <ArchiveButton action={setClientArchived} id={client.id} archived={Boolean(client.archivedAt)} />
              <PermanentDeleteButton
                action={deleteClient}
                id={client.id}
                message={`Delete ${client.companyName} permanently? This cannot be restored.`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
