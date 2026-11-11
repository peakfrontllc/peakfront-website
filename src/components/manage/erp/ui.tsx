import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import { CollapsibleSection } from "@/components/manage/erp/CollapsibleSection";
import type { LucideIcon } from "lucide-react";
import { Archive, ArchiveRestore, Plus } from "lucide-react";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { EMIRATES } from "@/lib/erp/shared";

export function MasterHero({
  kicker,
  title,
  icon: Icon,
  action,
}: {
  kicker: string;
  title: string;
  icon?: LucideIcon;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white shadow-sm">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{kicker}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy">{title}</h1>
        </div>
      </div>
      {action && (
        <Link href={action.href} className={buttonClass}>
          {action.label.startsWith("Add") && <Plus className="h-4 w-4" aria-hidden />}
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Flash({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error.slice(0, 240)}
    </p>
  );
}

export function Panel({
  title,
  children,
  id,
  collapsible = false,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  collapsible?: boolean;
}) {
  if (collapsible) {
    return (
      <CollapsibleSection id={id} title={title} defaultOpen={defaultOpen}>
        {children}
      </CollapsibleSection>
    );
  }
  return (
    <section id={id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
      <h2 className="flex items-center gap-2.5 bg-navy px-5 py-3 text-sm font-semibold text-white">
        <span className="h-4 w-1 rounded-full bg-amber" aria-hidden />
        {title}
      </h2>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export function SectionStack({ children, collapsible = false }: { children: ReactNode; collapsible?: boolean }) {
  return (
    <div className="space-y-4">
      {collapsible
        ? Children.map(children, (child) => (
            isValidElement(child)
              ? cloneElement(child as ReactElement<{ collapsible?: boolean }>, { collapsible: true })
              : child
          ))
        : children}
    </div>
  );
}

export function DataCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function EmiratesField({ defaultValue = [] }: { defaultValue?: string[] }) {
  const selected = new Set(defaultValue);
  return (
    <fieldset className="sm:col-span-2">
      <legend className={labelClass}>Regions</legend>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {EMIRATES.map((emirate) => (
          <label key={emirate} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-navy">
            <input type="checkbox" name="emirates" value={emirate} defaultChecked={selected.has(emirate)} />
            {emirate}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function EmirateField({ name, defaultValue, allowAll = false }: { name: string; defaultValue?: string; allowAll?: boolean }) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>Region</label>
      <select id={name} name={name} defaultValue={defaultValue ?? ""} className={fieldClass}>
        <option value="">{allowAll ? "All regions" : "Select"}</option>
        {EMIRATES.map((emirate) => (
          <option key={emirate} value={emirate}>{emirate}</option>
        ))}
      </select>
    </div>
  );
}

export function TextField({
  name,
  label,
  defaultValue = "",
  required = false,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className={fieldClass}
      />
    </div>
  );
}

export function fileHref(bucket: string, path: string) {
  return `/api/erp/files?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`;
}

const DOCUMENT_TYPES: Record<string, string> = {
  trade_licence: "Trade licence",
  insurance: "Insurance",
  certificate: "Certificate",
  other: "Other",
};

export function documentTypeLabel(value: string) {
  return DOCUMENT_TYPES[value] ?? value;
}

export function ExtraFieldPanel({
  fields,
  canWrite,
  addAction,
  removeAction,
  hidden,
  id = "fields",
  collapsible = false,
}: {
  fields: { id: string; label: string; value: string }[];
  canWrite: boolean;
  addAction: (formData: FormData) => Promise<void>;
  removeAction: (formData: FormData) => Promise<void>;
  hidden: { name: string; value: string }[];
  id?: string;
  collapsible?: boolean;
}) {
  return (
    <Panel id={id} title={id === "specs" ? "Specs" : "Extra fields"} collapsible={collapsible}>
      {fields.length === 0 ? (
        <p className="text-sm text-slate-500">No extra fields yet.</p>
      ) : (
        <ul className="space-y-2">
          {fields.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span><strong>{item.label}:</strong> {item.value}</span>
              {canWrite && (
                <form action={removeAction}>
                  {hidden.map((entry) => (
                    <input key={entry.name} type="hidden" name={entry.name} value={entry.value} />
                  ))}
                  <input type="hidden" name="id" value={item.id} />
                  <button className="text-xs font-semibold text-red-700" type="submit">Remove</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
      {canWrite && (
        <form action={addAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          {hidden.map((entry) => (
            <input key={entry.name} type="hidden" name={entry.name} value={entry.value} />
          ))}
          <div>
            <label className={labelClass} htmlFor="extra-label">Field name</label>
            <input id="extra-label" name="label" required className={fieldClass} placeholder="Platform height" />
          </div>
          <div>
            <label className={labelClass} htmlFor="extra-value">Value</label>
            <input id="extra-value" name="value" required className={fieldClass} placeholder="45 m" />
          </div>
          <button className={buttonClass} type="submit">Add field</button>
        </form>
      )}
    </Panel>
  );
}

export function ArchiveButton({
  action,
  id,
  archived,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  archived: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="archived" value={archived ? "false" : "true"} />
      <button type="submit" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm hover:bg-slate-50">
        {archived ? <ArchiveRestore className="h-4 w-4" aria-hidden /> : <Archive className="h-4 w-4" aria-hidden />}
        {archived ? "Restore" : "Archive"}
      </button>
    </form>
  );
}
