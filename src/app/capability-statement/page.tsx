import type { Metadata } from "next";
import CapabilityStatement from "@/components/capability-statement/CapabilityStatement";
import PrintToolbar from "@/components/capability-statement/PrintToolbar";
import { LEGAL_ENTITY_NAME } from "@/lib/license";

export const metadata: Metadata = {
  title: "Capability Statement",
  description: `${LEGAL_ENTITY_NAME} — construction equipment rental capability statement for procurement and project teams across the UAE.`,
  robots: { index: false, follow: false },
};

export default function CapabilityStatementPage() {
  return (
    <div className="capability-statement-root min-h-screen bg-slate-100 pb-10 print:bg-white print:pb-0">
      <PrintToolbar />
      <CapabilityStatement />
    </div>
  );
}
