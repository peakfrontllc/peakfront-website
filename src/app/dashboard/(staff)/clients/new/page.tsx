import type { Metadata } from "next";
import { NewClientForm } from "@/components/manage/erp/NewClientForm";
import { MasterHero } from "@/components/manage/erp/ui";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add client", robots: { index: false, follow: false } };

export default async function NewClientPage() {
  await requirePermission(PERMISSIONS.clientsWrite);

  return (
    <>
      <MasterHero kicker="CRM" title="Add client" />
      <div>
        <div className="mx-auto max-w-3xl">
          <NewClientForm />
        </div>
      </div>
    </>
  );
}
