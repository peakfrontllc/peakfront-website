import { BadgeCheck, ChevronDown } from "lucide-react";
import { LEGAL_ENTITY_NAME, licensedActivities } from "@/lib/license";

type LicensedSectionProps = {
  variant?: "dark" | "light";
  defaultOpen?: boolean;
};

export default function LicensedSection({
  variant = "dark",
  defaultOpen = false,
}: LicensedSectionProps) {
  const isLight = variant === "light";

  return (
    <details
      open={defaultOpen || undefined}
      suppressHydrationWarning
      className={`group ${isLight ? "border border-navy/10 bg-slate-50" : "border-t border-white/10 pt-8"}`}
    >
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-4 text-left marker:content-none [&::-webkit-details-marker]:hidden ${isLight ? "p-5 sm:p-6" : ""}`}
      >
        <div className="flex items-start gap-3">
          <BadgeCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-amber"
            aria-hidden="true"
          />
          <div>
            <h3 className={`font-mono text-[10px] uppercase tracking-[0.2em] ${isLight ? "text-blue" : "text-amber"}`}>
              Licensed &amp; Regulated
            </h3>
            <p
              className={`mt-1 text-sm ${isLight ? "text-slate-600" : "text-white/70"}`}
            >
              Verified trade license · {LEGAL_ENTITY_NAME}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform group-open:rotate-180 ${isLight ? "text-navy/50" : "text-white/50"}`}
          aria-hidden="true"
        />
      </summary>

      <div className={`${isLight ? "px-5 pb-5 sm:px-6 sm:pb-6" : "mt-5 pl-8"}`}>
        <p
          className={`text-xs leading-relaxed ${isLight ? "text-slate-500" : "text-white/50"}`}
        >
          Registered activities with TAMM / ADDED — for procurement verification.
        </p>
        <ul className="mt-4 space-y-2">
          {licensedActivities.map(({ code, description }) => (
            <li
              key={code}
              className={`flex gap-3 border px-3 py-2.5 text-xs leading-relaxed ${
                isLight
                  ? "border-navy/10 bg-white text-slate-600"
                  : "border-white/10 bg-white/[0.03] text-white/65"
              }`}
            >
              <span className="shrink-0 font-mono font-bold text-amber">
                {code}
              </span>
              <span>{description}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
