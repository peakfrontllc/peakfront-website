import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EquipmentCategoryFields } from "@/components/manage/erp/EquipmentCategoryFields";
import { InlineEdit } from "@/components/manage/erp/InlineEdit";
import { PermanentDeleteButton } from "@/components/manage/erp/PermanentDeleteButton";
import { ArchiveButton, ExtraFieldPanel, Flash, MasterHero, Panel, SectionStack, fileHref } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { getEquipment, listCategories, listEquipmentSuppliers } from "@/lib/erp/equipment";
import {
  addAsset,
  addEquipmentDocument,
  addEquipmentImage,
  addMaintenance,
  addSpecification,
  deleteEquipmentImage,
  deleteSpecification,
  deleteEquipment,
  setEquipmentArchived,
  updateAsset,
  updateEquipment,
} from "@/lib/erp/equipment-actions";
import { DOCUMENT_BUCKET, IMAGE_BUCKET } from "@/lib/erp/files";
import { ASSET_STATUSES, EQUIPMENT_STATUSES, OWNERSHIP, formatMoney, ownershipLabel } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Equipment", robots: { index: false, follow: false } };

export default async function EquipmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; section?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.equipmentRead);
  const { id } = await params;
  const query = await searchParams;
  const [equipment, categories, suppliers] = await Promise.all([
    getEquipment(id),
    listCategories(true),
    listEquipmentSuppliers(id),
  ]);
  if (!equipment) notFound();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.equipmentWrite);
  const canDocuments = hasPermission(session.permissions, PERMISSIONS.documentsWrite);
  const canRates = hasPermission(session.permissions, PERMISSIONS.ratesRead);

  return (
    <>
      <MasterHero kicker={equipment.categoryName || "Equipment"} title={equipment.name} />
      <div>
        <div className="mx-auto max-w-5xl space-y-5">
          <Link href="/manage/equipment" className="text-sm font-semibold text-blue hover:underline">Back to equipment</Link>
          <Flash error={query.error} />
          {equipment.archivedAt && <p className="border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">This equipment is archived.</p>}

          <SectionStack>
          <Panel title="Details">
            {canWrite ? (
              <form action={updateEquipment} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={equipment.id} />
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="name">Name</label>
                  <input id="name" name="name" required defaultValue={equipment.name} className={fieldClass} />
                </div>
                <EquipmentCategoryFields
                  categories={categories
                    .filter((category) => !category.archivedAt || category.id === equipment.categoryId)
                    .map((category) => ({ id: category.id, name: category.name, parentId: category.parentId }))}
                  categoryId={equipment.categoryId}
                  capacity={equipment.capacity}
                />
                <div>
                  <label className={labelClass} htmlFor="code">Code</label>
                  <input id="code" name="code" defaultValue={equipment.code} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="ownership">Source</label>
                  <select id="ownership" name="ownership" defaultValue={equipment.ownership} className={fieldClass}>
                    {OWNERSHIP.map((item) => <option key={item} value={item}>{ownershipLabel(item)}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="status">Status</label>
                  <select id="status" name="status" defaultValue={equipment.status} className={fieldClass}>
                    {EQUIPMENT_STATUSES.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="description">Description</label>
                  <textarea id="description" name="description" rows={4} defaultValue={equipment.description} className={fieldClass} />
                </div>
                <button className={buttonClass} type="submit">Save details</button>
              </form>
            ) : (
              <p className="text-sm text-slate-600">{equipment.description || "No description."}</p>
            )}
          </Panel>

          <Panel
            id="suppliers"
            defaultOpen={query.section === "suppliers"}
            title={suppliers.length > 1 ? `Available from ${suppliers.length} suppliers` : "Suppliers"}
          >
            {suppliers.length === 0 ? (
              <p className="text-sm text-slate-600">
                No supplier is linked yet. Open a supplier, then link this equipment under Equipment and rates.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="py-2 pr-4">Supplier</th>
                      <th className="py-2 pr-4">Lead time</th>
                      {canRates && <th className="py-2 pr-4">Daily</th>}
                      {canRates && <th className="py-2 pr-4">Weekly</th>}
                      {canRates && <th className="py-2 pr-4">Monthly</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr key={supplier.supplierId} className="border-t border-slate-100">
                        <td className="py-2 pr-4">
                          <Link href={`/manage/suppliers/${supplier.supplierId}`} className="font-semibold text-blue hover:underline">{supplier.supplierName}</Link>
                          {supplier.phone && <span className="mt-0.5 block text-xs text-slate-500">{supplier.phone}</span>}
                        </td>
                        <td className="py-2 pr-4 text-slate-600">{supplier.leadTime || "—"}</td>
                        {canRates && <td className="py-2 pr-4 text-slate-600">{formatMoney(supplier.dailyRate)}</td>}
                        {canRates && <td className="py-2 pr-4 text-slate-600">{formatMoney(supplier.weeklyRate)}</td>}
                        {canRates && <td className="py-2 pr-4 text-slate-600">{formatMoney(supplier.monthlyRate)}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {suppliers.length > 1 && canRates && (
              <p className="mt-4">
                <Link href={`/manage/rates/compare?equipment=${equipment.id}`} className="text-sm font-semibold text-blue hover:underline">
                  Compare these rates
                </Link>
              </p>
            )}
          </Panel>

          <ExtraFieldPanel
            fields={equipment.specs}
            canWrite={canWrite}
            addAction={addSpecification}
            removeAction={deleteSpecification}
            hidden={[{ name: "equipmentId", value: equipment.id }]}
          />

          <Panel title="Owned assets">
            <div className="space-y-3">
              {equipment.assets.map((asset) => (
                canWrite ? (
                  <InlineEdit
                    key={asset.id}
                    summary={
                      <p className="text-slate-700">
                        <strong className="text-navy">{asset.assetCode}</strong>
                        {" · "}{asset.status}
                        {asset.registrationNumber ? ` · ${asset.registrationNumber}` : ""}
                        {asset.serialNumber ? ` · SN ${asset.serialNumber}` : ""}
                        {asset.location ? ` · ${asset.location}` : ""}
                      </p>
                    }
                  >
                    <form action={updateAsset} className="grid gap-3 sm:grid-cols-2">
                      <input type="hidden" name="equipmentId" value={equipment.id} />
                      <input type="hidden" name="id" value={asset.id} />
                      <input name="assetCode" defaultValue={asset.assetCode} placeholder="Asset code" required className={fieldClass} />
                      <input name="registrationNumber" defaultValue={asset.registrationNumber} placeholder="Registration / Mulkiya" className={fieldClass} />
                      <input name="serialNumber" defaultValue={asset.serialNumber} placeholder="Serial number" className={fieldClass} />
                      <input name="yearMade" defaultValue={asset.yearMade} placeholder="Year" className={fieldClass} />
                      <input name="location" defaultValue={asset.location} placeholder="Current location" className={fieldClass} />
                      <input name="notes" defaultValue={asset.notes} placeholder="Notes" className={fieldClass} />
                      <select name="status" className={fieldClass} defaultValue={asset.status}>
                        {ASSET_STATUSES.map((item) => <option key={item}>{item}</option>)}
                      </select>
                      <button className={buttonClass} type="submit">Save asset</button>
                    </form>
                  </InlineEdit>
                ) : (
                  <p key={asset.id} className="text-sm text-slate-700">
                    <strong className="text-navy">{asset.assetCode}</strong>
                    {" · "}{asset.status}
                    {asset.registrationNumber ? ` · ${asset.registrationNumber}` : ""}
                    {asset.serialNumber ? ` · SN ${asset.serialNumber}` : ""}
                    {asset.location ? ` · ${asset.location}` : ""}
                  </p>
                )
              ))}
            </div>
            {canWrite && (
              <form action={addAsset} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="equipmentId" value={equipment.id} />
                <input name="assetCode" placeholder="Asset code" required className={fieldClass} />
                <input name="registrationNumber" placeholder="Registration / Mulkiya" className={fieldClass} />
                <input name="serialNumber" placeholder="Serial number" className={fieldClass} />
                <input name="yearMade" placeholder="Year" className={fieldClass} />
                <input name="location" placeholder="Current location" className={fieldClass} />
                <select name="status" className={fieldClass} defaultValue="available">
                  {ASSET_STATUSES.map((item) => <option key={item}>{item}</option>)}
                </select>
                <button className={`${buttonClass} sm:col-span-2`} type="submit">Add asset</button>
              </form>
            )}
          </Panel>

          <Panel title="Images">
            <div className="grid gap-4 sm:grid-cols-3">
              {equipment.images.map((image) => (
                <figure key={image.id}>
                  {/* Staff files are served through an authorized route. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fileHref(IMAGE_BUCKET, image.storagePath)} alt={image.alt || equipment.name} className="h-32 w-full object-cover" />
                  {canWrite && (
                    <form action={deleteEquipmentImage} className="mt-2">
                      <input type="hidden" name="equipmentId" value={equipment.id} />
                      <input type="hidden" name="id" value={image.id} />
                      <input type="hidden" name="storagePath" value={image.storagePath} />
                      <button className="text-xs font-bold text-red-700" type="submit">Remove</button>
                    </form>
                  )}
                </figure>
              ))}
            </div>
            {canWrite && (
              <form action={addEquipmentImage} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <input type="hidden" name="equipmentId" value={equipment.id} />
                <input name="image" type="file" accept="image/*" required className={fieldClass} />
                <input name="alt" placeholder="Alt text" className={fieldClass} />
                <button className={buttonClass} type="submit">Upload</button>
              </form>
            )}
          </Panel>

          <Panel title="Registration and certificates">
            <ul className="space-y-2 text-sm">
              {equipment.documents.map((document) => (
                <li key={document.id}>
                  <a className="font-semibold text-blue hover:underline" href={fileHref(DOCUMENT_BUCKET, document.storagePath)}>{document.title}</a>
                  <span className="text-slate-500"> · {document.docType}{document.expiresOn ? ` · expires ${document.expiresOn}` : ""}</span>
                </li>
              ))}
            </ul>
            {canDocuments && (
              <form action={addEquipmentDocument} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="equipmentId" value={equipment.id} />
                <input name="title" placeholder="Title" required className={fieldClass} />
                <select name="docType" className={fieldClass} defaultValue="certificate">
                  <option value="registration">registration</option>
                  <option value="certificate">certificate</option>
                  <option value="insurance">insurance</option>
                  <option value="inspection">inspection</option>
                  <option value="other">other</option>
                </select>
                <input name="expiresOn" type="date" className={fieldClass} />
                <input name="document" type="file" accept="application/pdf,image/*" required className={fieldClass} />
                <button className={buttonClass} type="submit">Upload document</button>
              </form>
            )}
          </Panel>

          <Panel title="Maintenance">
            <ul className="space-y-2 text-sm">
              {equipment.maintenance.map((entry) => (
                <li key={entry.id}>
                  <strong>{entry.servicedOn}:</strong> {entry.description}
                  {entry.nextDueOn ? ` Next due ${entry.nextDueOn}.` : ""}
                </li>
              ))}
            </ul>
            {canWrite && (
              <form action={addMaintenance} className="mt-4 grid gap-3">
                <input type="hidden" name="equipmentId" value={equipment.id} />
                <input name="servicedOn" type="date" required className={fieldClass} />
                <textarea name="description" placeholder="Work carried out" required rows={3} className={fieldClass} />
                <input name="nextDueOn" type="date" className={fieldClass} />
                <button className={buttonClass} type="submit">Add maintenance record</button>
              </form>
            )}
          </Panel>
          </SectionStack>

          {canWrite && (
            <div className="flex flex-wrap gap-3">
              <ArchiveButton action={setEquipmentArchived} id={equipment.id} archived={Boolean(equipment.archivedAt)} />
              <PermanentDeleteButton
                action={deleteEquipment}
                id={equipment.id}
                message={`Delete ${equipment.name} permanently? Its supplier rates are deleted too. This cannot be restored.`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
