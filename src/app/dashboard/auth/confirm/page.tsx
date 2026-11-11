import { Suspense } from "react";
import { ConfirmStaffLink } from "@/components/manage/ConfirmStaffLink";

export const dynamic = "force-dynamic";

export default function ConfirmStaffLinkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <ConfirmStaffLink />
    </Suspense>
  );
}
