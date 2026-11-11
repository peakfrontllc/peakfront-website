import type { Metadata } from "next";
import { ExtraFields } from "@/components/manage/erp/ExtraFields";
import { EmirateField, Flash, MasterHero, TextField } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { createClientRecord } from "@/lib/erp/client-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add client", robots: { index: false, follow: false } };

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.clientsWrite);
  const params = await searchParams;

  return (
    <>
      <MasterHero kicker="CRM" title="Add client" />
      <div>
        <div className="mx-auto max-w-3xl">
          <Flash error={params.error} />
          <form action={createClientRecord} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2"><TextField name="companyName" label="Company" required /></div>
            <TextField name="tradeLicence" label="Trade licence" />
            <TextField name="industry" label="Industry" />
            <TextField name="phone" label="Phone" />
            <TextField name="email" label="Email" type="email" />
            <TextField name="website" label="Website" />
            <EmirateField name="emirate" allowAll />
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="billingAddress">Billing address</label>
              <textarea id="billingAddress" name="billingAddress" rows={3} className={fieldClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" rows={3} className={fieldClass} />
            </div>
            <ExtraFields />
            <button className={buttonClass} type="submit">Save client</button>
          </form>
        </div>
      </div>
    </>
  );
}
