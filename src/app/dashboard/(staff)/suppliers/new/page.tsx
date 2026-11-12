import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { ExtraFields } from "@/components/manage/erp/ExtraFields";
import { SocialLinksField } from "@/components/manage/erp/SocialLinksField";
import { ProvidedEquipmentField } from "@/components/manage/erp/ProvidedEquipmentField";
import { SupplierKindFields } from "@/components/manage/erp/SupplierKindFields";
import { EmiratesField, Flash, MasterHero, TextField } from "@/components/manage/erp/ui";
import { fieldClass, labelClass } from "@/components/manage/form-styles";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { catalogueTypeGroups, listCategories } from "@/lib/erp/equipment";
import { createSupplier } from "@/lib/erp/supplier-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add supplier", robots: { index: false, follow: false } };

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <h2 className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-navy">{title}</h2>
      <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default async function NewSupplierPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.suppliersWrite);
  const params = await searchParams;
  const groups = catalogueTypeGroups(await listCategories());

  return (
    <>
      <MasterHero kicker="Catalogue" title="Add supplier" icon={Building2} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Add an individual or a company, and choose the equipment they can provide.
      </p>
      <div className="mx-auto max-w-5xl">
        <Flash error={params.error} />
        <form action={createSupplier} className="space-y-4">
          <FormSection title="Supplier">
            <SupplierKindFields />
          </FormSection>
          <FormSection title="Contact">
            <TextField name="phone" label="Phone" />
            <TextField name="email" label="Email" type="email" />
            <TextField name="website" label="Website" />
            <TextField name="tradeLicence" label="Trade licence" />
          </FormSection>
          <FormSection title="Where they work">
            <EmiratesField />
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="address">Address</label>
              <textarea id="address" name="address" rows={3} className={fieldClass} />
            </div>
            <SocialLinksField />
          </FormSection>
          <FormSection title="Equipment they provide">
            <div className="sm:col-span-2">
              <ProvidedEquipmentField groups={groups} />
            </div>
          </FormSection>
          <FormSection title="Notes">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="notes">Summary</label>
              <textarea id="notes" name="notes" rows={3} placeholder="How you usually reach them, or what they are known for" className={fieldClass} />
            </div>
          </FormSection>
          <FormSection title="Extra fields">
            <ExtraFields heading={false} />
          </FormSection>
          <div className="flex justify-end">
            <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-blue" type="submit">
              Save supplier
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
