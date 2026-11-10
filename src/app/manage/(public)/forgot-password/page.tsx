import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/manage/PasswordForms";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-xl font-semibold text-navy">Reset your password</h1>
      <p className="mt-1 text-sm text-slate-500">We will email you a link to choose a new one.</p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
