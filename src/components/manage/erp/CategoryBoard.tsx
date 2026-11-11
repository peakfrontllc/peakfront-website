"use client";

import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, Check, ChevronRight, ImagePlus, Pencil, Plus, Search } from "lucide-react";
import { categoryUnits } from "@/lib/erp/category-units";
import { capacityLabel, lengthField } from "@/lib/erp/lengths";
import { matchesSearch } from "@/lib/erp/search";
import { PermanentDeleteButton } from "@/components/manage/erp/PermanentDeleteButton";
import { EquipmentMark } from "@/components/manage/erp/equipment-icons";
import { createCategory, deleteCategory, renameCategory, setCategoryArchived } from "@/lib/erp/equipment-actions";

export type CategoryItem = {
  id: string;
  name: string;
  parentId: string | null;
  kind?: "capacity" | "boom" | "length";
  imagePath: string;
  archivedAt: string | null;
};

const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-navy/30 focus:ring-2 focus:ring-navy/10";

const primaryButton =
  "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-navy px-3 text-sm font-semibold text-white transition hover:bg-blue active:translate-y-px";

const quietButton =
  "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50";

const ghostIcon =
  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-navy";

const chipButtonClass = "h-7 w-7 text-slate-400 hover:bg-transparent hover:text-navy";

const CATEGORY_PHOTOS: Record<string, string> = {
  "access equipment": "/images/categories/access-equipment.webp",
  compaction: "/images/categories/compaction.webp",
  earthmoving: "/images/categories/earthmoving.webp",
  "lifting and cranes": "/images/categories/lifting-cranes.webp",
  "material handling": "/images/categories/material-handling.webp",
  "power and site services": "/images/categories/power-site.webp",
  transport: "/images/categories/transport.webp",
};

function categoryPhoto(name: string) {
  return CATEGORY_PHOTOS[name.trim().toLowerCase()] ?? "";
}

function storedImage(path: string) {
  return `/api/erp/files?bucket=equipment-images&path=${encodeURIComponent(path)}`;
}

function picture(item: CategoryItem) {
  if (item.imagePath) return storedImage(item.imagePath);
  if (item.parentId) return `/images/equipment/${photoSlug(item.name)}.webp`;
  return categoryPhoto(item.name);
}

function byName(a: CategoryItem, b: CategoryItem) {
  return a.name.localeCompare(b.name, undefined, { numeric: true });
}

function isWeightCapacity(name: string) {
  return /kg|person|people|ton/.test(name.toLowerCase());
}

function reachKey(name: string) {
  const plain = name.trim().toLowerCase().replace(/\s*boom\s*$/i, "");
  const number = plain.match(/\d+(?:\.\d+)?/)?.[0] ?? "";
  return number ? `${number}m` : plain.replace(/[^a-z0-9.]+/g, "");
}

function sizeGroups(purposeName: string, typeName: string, sizes: CategoryItem[]) {
  const access = purposeName.toLowerCase().includes("access");
  const field = lengthField(purposeName, typeName);
  const reachTitle = field === "boom" ? "Boom length" : field === "bed" ? "Length" : "Height";
  const reachSizes = access
    ? sizes.filter((size) => size.kind !== "boom" && size.kind !== "length" && /\d/.test(size.name) && !isWeightCapacity(size.name))
    : [];
  const covered = new Set(reachSizes.map((size) => reachKey(size.name)));
  const side = (size: CategoryItem) => size.kind === "boom" || size.kind === "length";
  const capacities = sizes.filter((size) => !side(size) && !reachSizes.includes(size));
  const booms = [
    ...reachSizes,
    ...sizes.filter((size) => side(size) && !covered.has(reachKey(size.name))),
  ];
  return { capacities, booms, showReach: field === "boom" || field === "bed" || booms.length > 0, reachTitle };
}

const WATER_TANKERS = ["sweet water", "salt water", "sewage"];

function waterTankerRank(name: string) {
  const text = name.toLowerCase();
  const index = WATER_TANKERS.findIndex((part) => text.includes(part));
  return index === -1 ? -1 : index;
}

function byType(a: CategoryItem, b: CategoryItem) {
  const aRank = waterTankerRank(a.name);
  const bRank = waterTankerRank(b.name);
  if (aRank >= 0 && bRank >= 0) return aRank - bRank;
  const aKey = aRank >= 0 ? "sweet water tanker" : a.name;
  const bKey = bRank >= 0 ? "sweet water tanker" : b.name;
  const nameOrder = aKey.localeCompare(bKey, undefined, { numeric: true });
  if (nameOrder !== 0) return nameOrder;
  if (aRank >= 0) return -1;
  if (bRank >= 0) return 1;
  return 0;
}

export function CategoryBoard({
  categories,
  canWrite,
  initialCategory,
  initialType = "",
}: {
  categories: CategoryItem[];
  canWrite: boolean;
  initialCategory?: string;
  initialType?: string;
}) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(initialCategory ?? "");
  const [openType, setOpenType] = useState(initialType);

  useEffect(() => {
    if (initialCategory) setPicked(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialType) setOpenType(initialType);
  }, [initialType]);

  const needle = query.trim();
  const byId = new Map(categories.map((item) => [item.id, item]));
  const lineage = (item: CategoryItem) => {
    const names = [item.name];
    let parentId = item.parentId;
    while (parentId) {
      const parent = byId.get(parentId);
      if (!parent) break;
      names.push(parent.name);
      parentId = parent.parentId;
    }
    return names;
  };
  const selfMatch = (item: CategoryItem) => matchesSearch(needle, lineage(item));
  const branchMatch = (item: CategoryItem): boolean =>
    selfMatch(item) || categories.some((child) => child.parentId === item.id && branchMatch(child));
  const mains = categories.filter((category) => !category.parentId);
  const matches = branchMatch;
  const active = mains.filter((category) => !category.archivedAt && matches(category));
  const archived = mains.filter((category) => category.archivedAt && matches(category));
  const visible = [...active, ...archived];
  const selected = visible.find((category) => category.id === picked) ?? visible[0] ?? null;
  const types = selected
    ? categories.filter((item) => item.parentId === selected.id && matches(item)).sort(byType)
    : [];
  const activeTypes = types.filter((item) => !item.archivedAt);
  const archivedTypes = types.filter((item) => item.archivedAt);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm md:h-[calc(100dvh-13.5rem)]">
      <div className="flex flex-col gap-3 border-b border-slate-200/80 px-4 py-3 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-navy">{active.length}</span>{" "}
          {active.length === 1 ? "main category" : "main categories"}
        </p>
        {canWrite && (
          <form action={createCategory} className="flex flex-1 items-center gap-2 sm:ml-auto sm:max-w-md">
            <PhotoPicker src="" />
            <input
              name="name"
              required
              minLength={2}
              placeholder="New main category"
              aria-label="New main category"
              className={inputClass}
            />
            <button className={primaryButton} type="submit"><Plus className="h-4 w-4" aria-hidden />Add</button>
          </form>
        )}
      </div>
      <div className="grid min-h-0 md:flex-1 md:grid-cols-[21rem_minmax(0,1fr)]">
        <div className="flex max-h-72 min-h-0 flex-col border-b border-slate-200/80 bg-slate-50/80 md:max-h-none md:border-b-0 md:border-r">
          <div className="p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search categories or equipment"
                aria-label="Search categories or equipment"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500">No categories match that search.</p>
            ) : (
              <ul className="space-y-0.5 pb-2">
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
              <div className="border-b border-slate-200/80 px-4 py-4">
                <div className="flex items-center gap-4">
                  {canWrite ? (
                    <form action={renameCategory} className="contents">
                      <input type="hidden" name="id" value={selected.id} />
                      <input type="hidden" name="focus" value={selected.id} />
                      <PhotoPicker src={picture(selected)} large />
                      <input
                        name="name"
                        required
                        minLength={2}
                        defaultValue={selected.name}
                        aria-label="Main category name"
                        className={`${inputClass} min-w-0 flex-1`}
                      />
                      <button className={primaryButton} type="submit"><Check className="h-4 w-4" aria-hidden />Save</button>
                    </form>
                  ) : (
                    <>
                      {picture(selected) ? (
                        <img src={picture(selected)} alt="" width={112} height={112} decoding="async" className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200" />
                      ) : null}
                      <h2 className="min-w-0 flex-1 text-base font-semibold text-navy">{selected.name}</h2>
                    </>
                  )}
                  {canWrite && (
                    <>
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
                    </>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {selected.archivedAt
                    ? canWrite
                      ? "Archived. Click the photo to replace it, then save."
                      : "Archived"
                    : canWrite
                      ? `${activeTypes.length} equipment type${activeTypes.length === 1 ? "" : "s"}. Click the photo to replace it, then save.`
                      : `${activeTypes.length} equipment type${activeTypes.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/40 p-4">
                {activeTypes.length === 0 ? (
                  <p className="text-sm text-slate-500">No equipment under this category yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {activeTypes.map((type) => {
                      const sizes = categories.filter((size) => size.parentId === type.id);
                      const typeMatches = selfMatch(type);
                      const shownSizes = needle && !typeMatches ? sizes.filter(selfMatch) : sizes;
                      return (
                        <EquipmentType
                          key={type.id}
                          type={type}
                          purpose={selected}
                          sizes={shownSizes}
                          open={openType === type.id || (Boolean(needle) && !typeMatches && shownSizes.length > 0)}
                          canWrite={canWrite}
                          onToggle={() => setOpenType(openType === type.id ? "" : type.id)}
                        />
                      );
                    })}
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
                <form action={createCategory} className="flex items-center gap-2 border-t border-slate-200/80 bg-white p-3">
                  <input type="hidden" name="parentId" value={selected.id} />
                  <PhotoPicker src="" />
                  <input
                    name="name"
                    required
                    minLength={2}
                    placeholder={`Add equipment under ${selected.name}`}
                    aria-label={`Add equipment under ${selected.name}`}
                    className={inputClass}
                  />
                  <button className={`${primaryButton} whitespace-nowrap`} type="submit"><Plus className="h-4 w-4" aria-hidden />Add equipment</button>
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

function photoSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function TypePhoto({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <EquipmentMark name={name} />;
  return (
    <img
      key={src}
      src={src}
      alt=""
      width={80}
      height={80}
      decoding="async"
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
    />
  );
}

function PhotoPicker({ src, large = false }: { src: string; large?: boolean }) {
  const [preview, setPreview] = useState("");
  const shown = preview || src;
  return (
    <label className={`group relative shrink-0 cursor-pointer overflow-hidden bg-slate-100 ring-1 ring-slate-200 ${large ? "h-16 w-16 rounded-2xl" : "h-11 w-11 rounded-xl"}`}>
      {shown ? (
        <img src={shown} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full items-center justify-center text-slate-400">
          <ImagePlus className="h-4 w-4" aria-hidden />
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-navy/55 text-white opacity-0 transition group-hover:opacity-100">
        <Pencil className="h-4 w-4" aria-hidden />
      </span>
      <input
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp,image/gif"
        aria-label={shown ? "Replace photo" : "Add photo"}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          setPreview((current) => {
            if (current) URL.revokeObjectURL(current);
            return url;
          });
        }}
      />
    </label>
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
  const groups = sizeGroups(purpose.name, type.name, sizes);
  const activeCapacities = groups.capacities.filter((size) => !size.archivedAt);
  const activeBooms = groups.booms.filter((size) => !size.archivedAt);
  const capacityLabel = activeCapacities.length > 0 ? `${activeCapacities.length} ${activeCapacities.length === 1 ? "capacity" : "capacities"}` : "";
  const boomLabel = activeBooms.length > 0
    ? `${activeBooms.length} ${groups.reachTitle === "Height" ? (activeBooms.length === 1 ? "height" : "heights") : groups.reachTitle === "Length" ? (activeBooms.length === 1 ? "length" : "lengths") : activeBooms.length === 1 ? "boom length" : "boom lengths"}`
    : "";

  return (
    <li className={`rounded-xl border bg-white transition ${open ? "border-navy/15 shadow-sm" : "border-slate-200/80 hover:border-slate-300"}`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <TypePhoto name={type.name} src={picture(type)} />
          <span className="flex min-w-0 flex-col items-start">
            <span className="flex w-full min-w-0 items-center gap-1.5">
              <ChevronRight className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-90 text-navy" : ""}`} aria-hidden />
              <span className="truncate text-sm font-semibold text-navy">{type.name}</span>
            </span>
            <span className="ml-5 mt-1 flex flex-wrap gap-1">
              {capacityLabel && <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{capacityLabel}</span>}
              {boomLabel && <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{boomLabel}</span>}
            </span>
          </span>
        </button>
        {canWrite && (
          <span className="flex shrink-0 items-center">
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
          <EquipmentDetails type={type} purpose={purpose} sizes={sizes} canWrite={canWrite} />
        </div>
      )}
    </li>
  );
}

function EquipmentDetails({
  type,
  purpose,
  sizes,
  canWrite,
}: {
  type: CategoryItem;
  purpose: CategoryItem;
  sizes: CategoryItem[];
  canWrite: boolean;
}) {
  const groups = sizeGroups(purpose.name, type.name, sizes);
  const units = categoryUnits(purpose.name, type.name);
  const activeSizes = groups.capacities.filter((size) => !size.archivedAt);
  const archivedSizes = groups.capacities.filter((size) => size.archivedAt);
  const activeBooms = groups.booms.filter((size) => !size.archivedAt);
  const archivedBooms = groups.booms.filter((size) => size.archivedAt);
  const showSecond = units.showSecond || activeBooms.length > 0 || archivedBooms.length > 0;
  const secondTitle = units.secondTitle || groups.reachTitle;

  return (
    <>
      {canWrite && (
        <form key={type.id} action={renameCategory} className="mb-3 flex items-center gap-2">
          <input type="hidden" name="id" value={type.id} />
          <input type="hidden" name="focus" value={purpose.id} />
          <input type="hidden" name="type" value={type.id} />
          <PhotoPicker src={picture(type)} />
          <input name="name" required minLength={2} defaultValue={type.name} aria-label={`${type.name} name`} className={inputClass} />
          <button className={primaryButton} type="submit"><Check className="h-4 w-4" aria-hidden />Save</button>
        </form>
      )}
      <div className={`grid gap-3 ${showSecond ? "md:grid-cols-2" : ""}`}>
        <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Capacity</p>
          <p className="mb-2 text-xs text-slate-500">{units.capacityHint}</p>
          {activeSizes.length === 0 && archivedSizes.length === 0 ? (
            <p className="text-sm text-slate-500">No capacities yet.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {[...activeSizes].sort(byName).map((size) => (
                <SizeChip key={size.id} size={size} type={type} purpose={purpose} canWrite={canWrite} />
              ))}
              {[...archivedSizes].sort(byName).map((size) => (
                <SizeChip key={size.id} size={size} type={type} purpose={purpose} canWrite={canWrite} archived />
              ))}
            </ul>
          )}
          {canWrite && (
            <form action={createCategory} className="mt-3 flex gap-2">
              <input type="hidden" name="parentId" value={type.id} />
              <input type="hidden" name="focus" value={purpose.id} />
              <input type="hidden" name="type" value={type.id} />
              <input type="hidden" name="kind" value="capacity" />
              <input name="name" required minLength={2} placeholder={units.capacityPlaceholder} aria-label={`Add a capacity under ${type.name}`} className={inputClass} />
              <button className={`${primaryButton} whitespace-nowrap`} type="submit"><Plus className="h-4 w-4" aria-hidden />Add</button>
            </form>
          )}
        </section>
        {showSecond && (
          <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{secondTitle}</p>
            <p className="mb-2 text-xs text-slate-500">{units.secondHint || "Metres"}</p>
            {activeBooms.length === 0 && archivedBooms.length === 0 ? (
              <p className="text-sm text-slate-500">None yet.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {[...activeBooms].sort(byName).map((size) => (
                  <SizeChip key={size.id} size={size} type={type} purpose={purpose} canWrite={canWrite} />
                ))}
                {[...archivedBooms].sort(byName).map((size) => (
                  <SizeChip key={size.id} size={size} type={type} purpose={purpose} canWrite={canWrite} archived />
                ))}
              </ul>
            )}
            {canWrite && (
              <form action={createCategory} className="mt-3 flex gap-2">
                <input type="hidden" name="parentId" value={type.id} />
                <input type="hidden" name="focus" value={purpose.id} />
                <input type="hidden" name="type" value={type.id} />
                <input type="hidden" name="kind" value={units.secondKind} />
                <input name="name" required minLength={2} placeholder={units.secondPlaceholder || "8 m"} aria-label={`Add a ${secondTitle.toLowerCase()} under ${type.name}`} className={inputClass} />
                <button className={`${primaryButton} whitespace-nowrap`} type="submit"><Plus className="h-4 w-4" aria-hidden />Add</button>
              </form>
            )}
          </section>
        )}
      </div>
    </>
  );
}

function SizeChip({
  size,
  type,
  purpose,
  canWrite,
  archived = false,
}: {
  size: CategoryItem;
  type: CategoryItem;
  purpose: CategoryItem;
  canWrite: boolean;
  archived?: boolean;
}) {
  return (
    <li className={`inline-flex max-w-full items-center rounded-full border py-0.5 pl-3 pr-0.5 ${archived ? "border-dashed border-slate-300 bg-slate-50 text-slate-400" : "border-slate-200 bg-white text-navy"}`}>
      <span className="truncate text-sm font-medium">{capacityLabel(size.name)}</span>
      {canWrite && (
        <span className="ml-0.5 flex items-center">
          <ArchiveButton
            id={size.id}
            focus={purpose.id}
            typeId={type.id}
            archived={archived}
            label={archived ? `Restore ${size.name}` : `Archive ${size.name}`}
            compact
            buttonClassName={chipButtonClass}
          />
          <PermanentDeleteButton
            action={deleteCategory}
            id={size.id}
            compact
            className="h-7 w-7"
            label={`Delete ${size.name}`}
            message={`Delete ${size.name} under ${type.name} permanently? This cannot be restored.`}
            hidden={[{ name: "focus", value: purpose.id }, { name: "type", value: type.id }]}
          />
        </span>
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
        className={`mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition ${
          selected ? "bg-white text-navy shadow-sm ring-1 ring-slate-200" : "text-navy hover:bg-white/80"
        } ${category.archivedAt && !selected ? "text-slate-400" : ""}`}
      >
        {picture(category) ? (
          <img
            src={picture(category)}
            alt=""
            width={80}
            height={80}
            decoding="async"
            loading="lazy"
            className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-black/5"
          />
        ) : (
          <EquipmentMark name={category.name} active={selected} />
        )}
        <span className="min-w-0 flex-1 truncate font-medium">{category.name}</span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${selected ? "bg-navy text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>
          {count}
        </span>
      </button>
    </li>
  );
}

function ArchiveButton({
  id,
  focus,
  typeId = "",
  archived,
  label,
  compact = false,
  buttonClassName = "",
}: {
  id: string;
  focus: string;
  typeId?: string;
  archived: boolean;
  label: string;
  compact?: boolean;
  buttonClassName?: string;
}) {
  return (
    <form action={setCategoryArchived} className="inline-flex">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="focus" value={focus} />
      {typeId && <input type="hidden" name="type" value={typeId} />}
      <input type="hidden" name="archived" value={archived ? "false" : "true"} />
      <button
        type="submit"
        aria-label={label}
        title={label}
        className={compact ? `${ghostIcon} ${buttonClassName}` : `${quietButton} ${buttonClassName}`}
      >
        {archived ? <ArchiveRestore className="h-4 w-4" aria-hidden /> : <Archive className="h-4 w-4" aria-hidden />}
        {compact ? <span className="sr-only">{label}</span> : archived ? "Restore" : "Archive"}
      </button>
    </form>
  );
}
