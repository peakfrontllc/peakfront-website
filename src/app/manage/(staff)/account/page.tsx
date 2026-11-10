import type { Metadata } from "next";
import { AccountForm } from "@/components/manage/AccountForm";
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
      <section className="bg-navy py-14 text-white sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
              Account
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your staff profile
          </h1>
        </div>
      </section>
      <section className="section-padding bg-slate-50">
        <div className="mx-auto max-w-lg px-4 sm:px-5 lg:px-10">
          <AccountForm fullName={session.fullName} email={session.email} />
        </div>
      </section>
    </>
  );
}
