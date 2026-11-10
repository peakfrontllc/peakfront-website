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
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-navy">You do not have access</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Your role does not include this part of the staff area. Ask a Super Admin if you need it.
        </p>
        <p className="mt-6">
          <Link href="/manage/account" className="font-semibold text-blue hover:underline">
            Go to your account
          </Link>
        </p>
    </div>
  );
}
