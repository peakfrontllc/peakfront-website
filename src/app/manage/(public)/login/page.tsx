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

  return (
    <>
      <section className="bg-navy pt-28 pb-14 text-white sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
              Peakfront staff
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sign in
          </h1>
        </div>
      </section>
      <section className="section-padding bg-slate-50">
        <div className="mx-auto max-w-lg px-4 sm:px-5 lg:px-10">
          {usesPublicSupabaseAuth() ? (
            <LoginForm next={next} />
          ) : (
            <p className="border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">
              Staff sign-in is not configured. Add NEXT_PUBLIC_SUPABASE_URL and
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then restart the server.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
