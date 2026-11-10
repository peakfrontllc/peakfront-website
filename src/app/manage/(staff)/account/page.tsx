import type { Metadata } from "next";
import { AccountForm } from "@/components/manage/AccountForm";
import { MasterHero } from "@/components/manage/erp/ui";
import { requireStaff } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await requireStaff();

  return (
    <>
      <MasterHero kicker="Account" title="Your profile" />
      <div>
        <div className="mx-auto max-w-lg">
          <AccountForm fullName={session.fullName} email={session.email} />
        </div>
      </div>
    </>
  );
}
