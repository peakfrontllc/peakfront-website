import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Boxes } from "lucide-react";
import { EquipmentCategoryFields } from "@/components/manage/erp/EquipmentCategoryFields";
import { ExtraFields } from "@/components/manage/erp/ExtraFields";
import { Flash, MasterHero } from "@/components/manage/erp/ui";
import { fieldClass, labelClass } from "@/components/manage/form-styles";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listCategories } from "@/lib/erp/equipment";
import { createEquipment } from "@/lib/erp/equipment-actions";
import { EQUIPMENT_STATUSES, OWNERSHIP, ownershipLabel } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add equipment", robots: { index: false, follow: false } };

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
      <h2 className="flex items-center gap-2.5 bg-navy px-5 py-3 text-sm font-semibold text-white">
        <span className="h-4 w-1 rounded-full bg-amber" aria-hidden />
        {title}
      </h2>
      <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default async function NewEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.equipmentWrite);
  const params = await searchParams;
  const categories = await listCategories();

  return (
    <>
      <MasterHero kicker="Catalogue" title="Add equipment" icon={Boxes} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Add a machine Peakfront owns, or one a supplier can provide.
      </p>
      <div className="mx-auto max-w-3xl">
        <Flash error={params.error} />
        {categories.length === 0 ? (
          <p className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
            Add a category first. <Link className="font-semibold text-blue" href="/dashboard/categories">Categories</Link>
          </p>
        ) : (
          <form action={createEquipment} className="space-y-4">
            <FormSection title="Machine">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="name">Name</label>
                <input id="name" name="name" required placeholder="Name staff will search for" className={fieldClass} />
              </div>
              <EquipmentCategoryFields
                categories={categories.map((category) => ({
                  id: category.id,
                  name: category.name,
                  parentId: category.parentId,
                  kind: category.kind,
                }))}
              />
            </FormSection>
            <FormSection title="Availability">
              <div>
                <label className={labelClass} htmlFor="code">Code</label>
                <input id="code" name="code" placeholder="Optional" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ownership">Source</label>
                <select id="ownership" name="ownership" className={fieldClass} defaultValue="owned">
                  {OWNERSHIP.map((item) => <option key={item} value={item}>{ownershipLabel(item)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="status">Status</label>
                <select id="status" name="status" className={fieldClass} defaultValue="available">
                  {EQUIPMENT_STATUSES.map((item) => (
                    <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                  ))}
                </select>
              </div>
            </FormSection>
            <FormSection title="Description">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="description">Notes</label>
                <textarea id="description" name="description" rows={4} placeholder="Anything the catalogue name does not cover" className={fieldClass} />
              </div>
            </FormSection>
            <FormSection title="Extra fields">
              <ExtraFields heading={false} />
            </FormSection>
            <div className="flex justify-end rounded-2xl bg-navy px-4 py-3">
              <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-amber px-4 text-sm font-semibold text-navy hover:bg-amber/90" type="submit">
                Save equipment
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
