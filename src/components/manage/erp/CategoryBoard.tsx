"use client";

import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, Check, ChevronRight, Plus } from "lucide-react";
import { PermanentDeleteButton } from "@/components/manage/erp/PermanentDeleteButton";
import { EquipmentMark } from "@/components/manage/erp/equipment-icons";
import { createCategory, deleteCategory, renameCategory, setCategoryArchived } from "@/lib/erp/equipment-actions";
import { buttonClass, iconButtonClass } from "@/components/manage/form-styles";

export type CategoryItem = {
  id: string;
  name: string;
  parentId: string | null;
  archivedAt: string | null;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15";

export function CategoryBoard({
  categories,
  canWrite,
  initialCategory,
}: {
  categories: CategoryItem[];
  canWrite: boolean;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(initialCategory ?? "");
  const [openType, setOpenType] = useState("");

  useEffect(() => {
    if (initialCategory) setPicked(initialCategory);
  }, [initialCategory]);

  const needle = query.trim().toLowerCase();
  const mains = categories.filter((category) => !category.parentId);
  const under = (id: string): CategoryItem[] =>
    categories.filter((item) => item.parentId === id).flatMap((item) => [item, ...under(item.id)]);
  const matches = (category: CategoryItem) => {
    if (!needle) return true;
    if (category.name.toLowerCase().includes(needle)) return true;
    return under(category.id).some((item) => item.name.toLowerCase().includes(needle));
  };
  const active = mains.filter((category) => !category.archivedAt && matches(category));
  const archived = mains.filter((category) => category.archivedAt && matches(category));
  const visible = [...active, ...archived];
  const selected = visible.find((category) => category.id === picked) ?? visible[0] ?? null;
  const types = selected ? categories.filter((item) => item.parentId === selected.id) : [];
  const activeTypes = types.filter((item) => !item.archivedAt);
  const archivedTypes = types.filter((item) => item.archivedAt);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:h-[calc(100dvh-13.5rem)]">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-navy">{active.length}</span>{" "}
          {active.length === 1 ? "main category" : "main categories"}
        </p>
        {canWrite && (
          <form action={createCategory} className="flex flex-1 gap-2 sm:ml-auto sm:max-w-md">
            <input
              name="name"
              required
              minLength={2}
              placeholder="New main category"
              aria-label="New main category"
              className={inputClass}
            />
            <button className={`${buttonClass} shrink-0`} type="submit"><Plus className="h-4 w-4" aria-hidden />Add</button>
          </form>
        )}
      </div>
      <div className="grid min-h-0 md:flex-1 md:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="flex max-h-72 min-h-0 flex-col border-b border-slate-200 md:max-h-none md:border-b-0 md:border-r">
          <div className="border-b border-slate-100 p-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search categories or equipment"
              aria-label="Search categories or equipment"
              className={inputClass}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500">No categories match that search.</p>
            ) : (
              <ul>
                {active.map((category) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    count={categories.filter((item) => item.parentId === category.id && !item.archivedAt).length}
                    selected={selected?.id === category.id}
                    onSelect={setPicked}
                  />
                ))}
                {archived.length > 0 && (
                  <li className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Archived
                  </li>
                )}
                {archived.map((category) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    count={categories.filter((item) => item.parentId === category.id && !item.archivedAt).length}
                    selected={selected?.id === category.id}
                    onSelect={setPicked}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex min-h-0 flex-col">
          {selected ? (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  {canWrite ? (
                    <form key={selected.id} action={renameCategory} className="flex gap-2">
                      <input type="hidden" name="id" value={selected.id} />
                      <input type="hidden" name="focus" value={selected.id} />
                      <input
                        name="name"
                        required
                        minLength={2}
                        defaultValue={selected.name}
                        aria-label="Main category name"
                        className={inputClass}
                      />
                      <button className={`${buttonClass} shrink-0`} type="submit"><Check className="h-4 w-4" aria-hidden />Save</button>
                    </form>
                  ) : (
                    <h2 className="text-base font-semibold text-navy">{selected.name}</h2>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {selected.archivedAt
                      ? "Archived"
                      : `${activeTypes.length} equipment type${activeTypes.length === 1 ? "" : "s"}`}
                  </p>
                </div>
                {canWrite && (
                  <div className="flex shrink-0 items-center gap-2">
                    <ArchiveButton
                      id={selected.id}
                      focus={selected.id}
                      archived={Boolean(selected.archivedAt)}
                      label={selected.archivedAt ? "Restore" : "Archive"}
                    />
                    <PermanentDeleteButton
                      action={deleteCategory}
                      id={selected.id}
                      message={
                        types.length > 0
                          ? `Delete ${selected.name} and the equipment under it permanently? This cannot be restored.`
                          : `Delete ${selected.name} permanently? This cannot be restored.`
                      }
                    />
                  </div>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {activeTypes.length === 0 ? (
                  <p className="text-sm text-slate-500">No equipment under this category yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {activeTypes.map((type) => (
                      <EquipmentType
                        key={type.id}
                        type={type}
                        purpose={selected}
                        sizes={categories.filter((size) => size.parentId === type.id)}
                        open={openType === type.id}
                        canWrite={canWrite}
                        onToggle={() => setOpenType(openType === type.id ? "" : type.id)}
                      />
                    ))}
                  </ul>
                )}
                {archivedTypes.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Archived equipment</p>
                    <ul className="space-y-2">
                      {archivedTypes.map((type) => (
                        <li key={type.id} className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-slate-200 px-3 py-2">
                          <span className="text-sm text-slate-400">{type.name}</span>
                          {canWrite && (
                            <span className="flex items-center gap-2">
                              <ArchiveButton id={type.id} focus={selected.id} archived label="Restore" />
                              <PermanentDeleteButton
                                action={deleteCategory}
                                id={type.id}
                                compact
                                message={`Delete ${type.name} permanently? This cannot be restored.`}
                                hidden={[{ name: "focus", value: selected.id }]}
                              />
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {canWrite && !selected.archivedAt && (
                <form action={createCategory} className="flex gap-2 border-t border-slate-100 p-3">
                  <input type="hidden" name="parentId" value={selected.id} />
                  <input
                    name="name"
                    required
                    minLength={2}
                    placeholder={`Add equipment under ${selected.name}`}
                    aria-label={`Add equipment under ${selected.name}`}
                    className={inputClass}
                  />
                  <button className={`${buttonClass} shrink-0 whitespace-nowrap`} type="submit"><Plus className="h-4 w-4" aria-hidden />Add equipment</button>
                </form>
              )}
            </>
          ) : (
            <p className="p-6 text-sm text-slate-500">Add a main category to start.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function EquipmentType({
  type,
  purpose,
  sizes,
  open,
  canWrite,
  onToggle,
}: {
  type: CategoryItem;
  purpose: CategoryItem;
  sizes: CategoryItem[];
  open: boolean;
  canWrite: boolean;
  onToggle: () => void;
}) {
  const activeSizes = sizes.filter((size) => !size.archivedAt);
  const archivedSizes = sizes.filter((size) => size.archivedAt);

  return (
    <li className="rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 px-3 py-2">
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <EquipmentMark name={type.name} />
          <span className="min-w-0">
            <span className="flex items-center gap-1">
              <ChevronRight className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-90" : ""}`} aria-hidden />
              <span className="truncate text-sm font-semibold text-navy">{type.name}</span>
            </span>
            <span className="pl-5 text-xs text-slate-500">{`${activeSizes.length} ${activeSizes.length === 1 ? "size" : "sizes"}`}</span>
          </span>
        </button>
        {canWrite && (
          <span className="flex shrink-0 items-center gap-2">
            <ArchiveButton id={type.id} focus={purpose.id} archived={false} label={`Archive ${type.name}`} compact />
            <PermanentDeleteButton
              action={deleteCategory}
              id={type.id}
              compact
              message={`Delete ${type.name} and its sizes permanently? This cannot be restored.`}
              hidden={[{ name: "focus", value: purpose.id }]}
            />
          </span>
        )}
      </div>
      {open && (
        <div className="border-t border-slate-100 px-3 py-3">
          {canWrite && (
            <form key={type.id} action={renameCategory} className="mb-3 flex gap-2">
              <input type="hidden" name="id" value={type.id} />
              <input type="hidden" name="focus" value={purpose.id} />
              <input name="name" required minLength={2} defaultValue={type.name} aria-label={`${type.name} name`} className={inputClass} />
              <button className={`${buttonClass} shrink-0`} type="submit"><Check className="h-4 w-4" aria-hidden />Save</button>
            </form>
          )}
          {activeSizes.length === 0 ? (
            <p className="text-sm text-slate-500">No sizes yet.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {activeSizes.map((size) => (
                <li key={size.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <span className="truncate text-sm text-navy">{size.name}</span>
                  {canWrite && (
                    <span className="flex shrink-0 items-center gap-2">
                      <ArchiveButton id={size.id} focus={purpose.id} archived={false} label={`Archive ${size.name}`} compact />
                      <PermanentDeleteButton
                        action={deleteCategory}
                        id={size.id}
                        compact
                        message={`Delete ${size.name} under ${type.name} permanently? This cannot be restored.`}
                        hidden={[{ name: "focus", value: purpose.id }]}
                      />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {archivedSizes.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {archivedSizes.map((size) => (
                <li key={size.id} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-200 px-3 py-1.5 text-sm text-slate-400">
                  {size.name}
                  {canWrite && <ArchiveButton id={size.id} focus={purpose.id} archived label="Restore" compact />}
                </li>
              ))}
            </ul>
          )}
          {canWrite && (
            <form action={createCategory} className="mt-3 flex gap-2">
              <input type="hidden" name="parentId" value={type.id} />
              <input name="name" required minLength={2} placeholder="Add a size, such as 5 ton" aria-label={`Add a size under ${type.name}`} className={inputClass} />
              <button className={`${buttonClass} shrink-0 whitespace-nowrap`} type="submit"><Plus className="h-4 w-4" aria-hidden />Add size</button>
            </form>
          )}
        </div>
      )}
    </li>
  );
}

function CategoryRow({
  category,
  count,
  selected,
  onSelect,
}: {
  category: CategoryItem;
  count: number;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(category.id)}
        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${
          selected ? "bg-navy text-white" : "text-navy hover:bg-slate-50"
        } ${category.archivedAt && !selected ? "text-slate-400" : ""}`}
      >
        <EquipmentMark name={category.name} active={selected} />
        <span className="min-w-0 flex-1 truncate font-medium">{category.name}</span>
        <span className={`shrink-0 text-xs tabular-nums ${selected ? "text-white/70" : "text-slate-400"}`}>
          {count}
        </span>
      </button>
    </li>
  );
}

function ArchiveButton({
  id,
  focus,
  archived,
  label,
  compact = false,
}: {
  id: string;
  focus: string;
  archived: boolean;
  label: string;
  compact?: boolean;
}) {
  return (
    <form action={setCategoryArchived}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="focus" value={focus} />
      <input type="hidden" name="archived" value={archived ? "false" : "true"} />
      <button
        type="submit"
        aria-label={label}
        className={compact ? iconButtonClass : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-slate-50"}
      >
        {archived ? <ArchiveRestore className="h-4 w-4" aria-hidden /> : <Archive className="h-4 w-4" aria-hidden />}
        {compact ? <span className="sr-only">{label}</span> : archived ? "Restore" : "Archive"}
      </button>
    </form>
  );
}
