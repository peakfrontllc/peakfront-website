import type { Metadata } from "next";
import Link from "next/link";
import { requireStaff } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Access denied",
  robots: { index: false, follow: false },
};

export default async function ForbiddenPage() {
  await requireStaff();

  return (
    <section className="section-padding bg-slate-50">
      <div className="mx-auto max-w-xl px-4 sm:px-5 lg:px-10">
        <h1 className="text-3xl font-extrabold text-navy">You do not have access</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Your role does not include this part of the staff area. Ask a Super Admin if you need it.
        </p>
        <p className="mt-6">
          <Link href="/manage/account" className="font-semibold text-blue hover:underline">
            Go to your account
          </Link>
        </p>
      </div>
    </section>
  );
}
