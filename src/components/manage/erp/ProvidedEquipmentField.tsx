"use client";

import { useState } from "react";
import { fieldClass, labelClass } from "@/components/manage/form-styles";
import { matchesSearch } from "@/lib/erp/search";

export type ProvidedEquipmentGroup = {
  purpose: string;
  purposeId: string;
  items: { id: string; name: string; children?: { id: string; name: string }[] }[];
};

export function ProvidedEquipmentField({
  groups,
  selectedIds = [],
}: {
  groups: ProvidedEquipmentGroup[];
  selectedIds?: string[];
}) {
  const incoming = [...selectedIds].sort().join("\n");
  const [applied, setApplied] = useState(incoming);
  const [picked, setPicked] = useState(() => new Set(selectedIds));
  const [query, setQuery] = useState("");
  if (incoming !== applied) {
    setApplied(incoming);
    setPicked(new Set(selectedIds));
  }
  const needle = query.trim();

  function purposeMatches(purpose: string) {
    return Boolean(needle) && matchesSearch(needle, [purpose]);
  }

  function itemShown(purpose: string, item: ProvidedEquipmentGroup["items"][number]) {
    if (!needle || purposeMatches(purpose)) return true;
    if (matchesSearch(needle, [purpose, item.name])) return true;
    return (item.children ?? []).some((child) => matchesSearch(needle, [purpose, item.name, child.name]));
  }

  function childShown(purpose: string, typeName: string, childName: string) {
    if (!needle || purposeMatches(purpose) || matchesSearch(needle, [purpose, typeName])) return true;
    return matchesSearch(needle, [purpose, typeName, childName]);
  }

  function groupShown(group: ProvidedEquipmentGroup) {
    if (!needle) return true;
    return purposeMatches(group.purpose) || group.items.some((item) => itemShown(group.purpose, item));
  }

  function togglePurpose(group: ProvidedEquipmentGroup) {
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(group.purposeId)) {
        next.delete(group.purposeId);
      } else {
        next.add(group.purposeId);
        for (const item of group.items) {
          next.delete(item.id);
          for (const child of item.children ?? []) next.delete(child.id);
        }
      }
      return next;
    });
  }

  function toggleItem(group: ProvidedEquipmentGroup, item: ProvidedEquipmentGroup["items"][number]) {
    setPicked((current) => {
      const next = new Set(current);
      next.delete(group.purposeId);
      for (const child of item.children ?? []) next.delete(child.id);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  }

  function toggleChild(group: ProvidedEquipmentGroup, item: ProvidedEquipmentGroup["items"][number], childId: string) {
    setPicked((current) => {
      const next = new Set(current);
      next.delete(group.purposeId);
      next.delete(item.id);
      if (next.has(childId)) next.delete(childId);
      else next.add(childId);
      return next;
    });
  }

  const selectedNames = groups.flatMap((group) => {
    if (picked.has(group.purposeId)) return [group.purpose];
    return group.items.flatMap((item) => {
      if (picked.has(item.id)) return [item.name];
      return (item.children ?? []).filter((child) => picked.has(child.id)).map((child) => child.name);
    });
  });
  const anyShown = groups.some((group) => groupShown(group));

  return (
    <div>
      <p className="text-sm text-slate-500">
        Choose a whole category, such as Buses, a type such as Bus, or a size such as 14 seater. The choices come from the equipment catalogue.
      </p>
      <p className="mt-2 text-sm font-medium text-navy">
        {selectedNames.length > 0 ? selectedNames.join(", ") : "Nothing selected yet."}
      </p>
      <label className={`${labelClass} mt-3 block`} htmlFor="catalogue-search">Search the catalogue</label>
      <input
        id="catalogue-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.preventDefault();
        }}
        placeholder="Access Equipment, forklift, boom lift"
        className={fieldClass}
      />
      <div className="mt-3 space-y-4">
        {groups.map((group) => {
          const visible = groupShown(group);
          const wholeCategory = picked.has(group.purposeId);
          return (
            <section key={group.purposeId} className={visible ? "overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70" : "hidden"}>
              <label className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-navy">
                <input
                  type="checkbox"
                  name="catalogueCategoryId"
                  value={group.purposeId}
                  checked={wholeCategory}
                  onChange={() => togglePurpose(group)}
                />
                <span className="min-w-0 flex-1">{group.purpose}</span>
                <span className="shrink-0 text-xs font-medium text-slate-400">Whole category</span>
              </label>
              {group.items.length > 0 && <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => {
                  const covered = wholeCategory;
                  const checked = !covered && picked.has(item.id);
                  const children = item.children ?? [];
                  return (
                    <div key={item.id} className={itemShown(group.purpose, item) ? children.length > 0 ? "space-y-2 sm:col-span-2 lg:col-span-3" : "" : "hidden"}>
                      <label className={`flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy ${children.length > 0 ? "w-fit" : ""} ${covered ? "opacity-60" : ""}`}>
                        <input
                          type="checkbox"
                          name="catalogueCategoryId"
                          value={item.id}
                          checked={checked}
                          disabled={covered}
                          onChange={() => toggleItem(group, item)}
                        />
                        {item.name}
                      </label>
                      {children.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {children.map((child) => {
                            const childCovered = covered || checked;
                            const childChecked = !childCovered && picked.has(child.id);
                            return (
                              <label
                                key={child.id}
                                className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy whitespace-nowrap ${childShown(group.purpose, item.name, child.name) ? "" : "hidden"} ${childCovered ? "opacity-60" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  name="catalogueCategoryId"
                                  value={child.id}
                                  checked={childChecked}
                                  disabled={childCovered}
                                  onChange={() => toggleChild(group, item, child.id)}
                                />
                                {child.name}
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>}
              {wholeCategory && group.items.length > 0 && (
                <p className="px-4 pb-3 text-xs text-slate-500">Every machine in {group.purpose} is included.</p>
              )}
            </section>
          );
        })}
        {needle && !anyShown && <p className="text-sm text-slate-500">No catalogue equipment matches that search.</p>}
      </div>
    </div>
  );
}
