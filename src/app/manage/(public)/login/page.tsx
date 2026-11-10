import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/manage/LoginForm";
import { getStaffSession } from "@/lib/auth/session";
import { usesPublicSupabaseAuth } from "@/lib/supabase/public-env";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

function safeNext(value: string | undefined) {
  if (!value || !value.startsWith("/manage") || value.startsWith("//")) return "/manage";
  if (value.startsWith("/manage/login") || value.includes("://")) return "/manage";
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const session = await getStaffSession();
  if (session) redirect(next);

  return usesPublicSupabaseAuth() ? (
    <>
      <h1 className="text-xl font-semibold text-navy">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">Use your Peakfront staff account.</p>
      <div className="mt-6">
        <LoginForm next={next} />
      </div>
    </>
  ) : (
    <p className="rounded-lg border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">
      Staff sign-in is not configured. Add NEXT_PUBLIC_SUPABASE_URL and
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then restart the server.
    </p>
  );
}
