"use client";

import { useMemo, useState } from "react";
import { CataloguePhoto } from "@/components/manage/erp/CataloguePhoto";
import { fieldClass, labelClass } from "@/components/manage/form-styles";
import { categoryUnits } from "@/lib/erp/category-units";
import { capacityLabel, lengthField } from "@/lib/erp/lengths";

function isWeightCapacity(name: string) {
  return /kg|person|people|ton/.test(name.toLowerCase());
}

export type CategoryChoice = {
  id: string;
  name: string;
  parentId: string | null;
  kind?: "capacity" | "boom" | "length";
};

export function EquipmentCategoryFields({
  categories,
  categoryId = "",
  capacity = "",
  boomLength = "",
  bedLength = "",
}: {
  categories: CategoryChoice[];
  categoryId?: string;
  capacity?: string;
  boomLength?: string;
  bedLength?: string;
}) {
  const byId = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);
  const current = byId.get(categoryId);
  const parent = current?.parentId ? byId.get(current.parentId) : undefined;
  const grandparent = parent?.parentId ? byId.get(parent.parentId) : undefined;
  const [purposeId, setPurposeId] = useState(grandparent?.id || parent?.id || (current && !current.parentId ? current.id : "") || "");
  const [typeId, setTypeId] = useState(grandparent ? parent?.id ?? "" : parent ? current?.id ?? "" : "");
  const [sizeId, setSizeId] = useState(grandparent ? current?.id ?? "" : "");
  const [capacityValue, setCapacityValue] = useState(capacity);
  const [boomValue, setBoomValue] = useState(boomLength);
  const [bedValue, setBedValue] = useState(bedLength);
  const purposes = categories.filter((category) => !category.parentId);
  const types = useMemo(
    () => categories.filter((category) => category.parentId === purposeId && category.kind !== "boom" && category.kind !== "length"),
    [categories, purposeId],
  );
  const sizes = useMemo(
    () => categories.filter((category) => category.parentId === typeId && category.kind !== "boom" && category.kind !== "length"),
    [categories, typeId],
  );
  const booms = useMemo(
    () => categories.filter((category) => category.parentId === typeId && category.kind === "boom").sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
    [categories, typeId],
  );
  const bedLengths = useMemo(
    () => categories.filter((category) => category.parentId === typeId && category.kind === "length").sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
    [categories, typeId],
  );
  const purpose = purposes.find((category) => category.id === purposeId);
  const type = types.find((category) => category.id === typeId);
  const size = sizes.find((category) => category.id === sizeId);
  const measure = type ? lengthField(purpose?.name ?? "", type?.name ?? "") : "";
  const access = (purpose?.name ?? "").toLowerCase().includes("access");
  const weightSizes = sizes.filter((item) => isWeightCapacity(item.name));
  const reachSizes = access ? sizes.filter((item) => /\d/.test(item.name) && !isWeightCapacity(item.name)) : [];
  const capacitySizes = access && measure === "boom" && weightSizes.length > 0 ? weightSizes : sizes;
  const sizeLabel = access && measure !== "boom" && weightSizes.length === 0 && reachSizes.length > 0 ? "Height" : "Capacity";
  const chosenCapacity = capacitySizes.find((item) => item.id === sizeId);
  const selectedId = chosenCapacity?.id || sizeId || typeId;
  const lengths = measure === "boom" ? booms.map((item) => item.name) : bedLengths.map((item) => item.name);
  const lengthValue = measure === "boom" ? boomValue : bedValue;
  const lengthChoices = lengthValue && !lengths.includes(lengthValue) ? [lengthValue, ...lengths] : lengths;
  const units = categoryUnits(purpose?.name ?? "", type?.name ?? "");
  const customCapacity = Boolean(size) && capacityValue.trim().toLowerCase() !== size.name.trim().toLowerCase() && capacityValue.trim() !== "";
  const showCapacity = Boolean(type) && (sizes.length === 0 || customCapacity);
  const submittedCapacity = sizes.length > 0 && !customCapacity ? (size?.name ?? "") : capacityValue;

  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      {type && (
        <div className="flex items-center gap-3 rounded-xl bg-navy px-3 py-3 sm:col-span-2">
          <CataloguePhoto name={type.name} />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-amber">{purpose?.name}</p>
            <p className="truncate text-sm font-semibold text-white">{type.name}</p>
            {size && <p className="truncate text-xs text-white/70">{size.name}</p>}
          </div>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="purposeCategory">Main category</label>
        <select
          id="purposeCategory"
          className={fieldClass}
          value={purposeId}
          required
          onChange={(event) => {
            setPurposeId(event.target.value);
            setTypeId("");
            setSizeId("");
            setBoomValue("");
            setBedValue("");
            setCapacityValue("");
          }}
        >
          <option value="">Choose a purpose</option>
          {purposes.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className={measure ? "sm:col-span-2" : undefined}>
        <label className={labelClass} htmlFor="equipmentType">Equipment</label>
        <select
          id="equipmentType"
          className={fieldClass}
          value={typeId}
          required={types.length > 0}
          disabled={!purposeId || types.length === 0}
          onChange={(event) => {
            setTypeId(event.target.value);
            setSizeId("");
            setBoomValue("");
            setBedValue("");
            setCapacityValue("");
          }}
        >
          <option value="">{types.length > 0 ? "Choose equipment" : "No equipment yet"}</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      {(!type || capacitySizes.length > 0) && (
      <div>
        <label className={labelClass} htmlFor="sizeCategory">{sizeLabel}</label>
        <select
          id="sizeCategory"
          className={fieldClass}
          value={chosenCapacity?.id ?? ""}
          required={capacitySizes.length > 0 && !sizeId}
          disabled={!typeId || capacitySizes.length === 0}
          onChange={(event) => {
            const nextId = event.target.value;
            setSizeId(nextId);
            const size = capacitySizes.find((item) => item.id === nextId);
            if (size) setCapacityValue(size.name);
          }}
        >
          <option value="">{capacitySizes.length > 0 ? (sizeLabel === "Capacity" && access ? "Choose capacity (person or kg)" : `Choose a ${sizeLabel.toLowerCase()}`) : "No capacities yet"}</option>
          {capacitySizes.map((size) => (
            <option key={size.id} value={size.id}>{capacityLabel(size.name)}</option>
          ))}
        </select>
      </div>
      )}
      {measure && (
        <div>
          <label className={labelClass} htmlFor="measureLength">{measure === "boom" ? "Boom length" : "Length"}</label>
          <select
            id="measureLength"
            className={fieldClass}
            value={lengthValue}
            disabled={lengths.length === 0}
            onChange={(event) => {
              if (measure === "boom") setBoomValue(event.target.value);
              else setBedValue(event.target.value);
            }}
          >
            <option value="">{lengths.length === 0 ? (measure === "boom" ? "No boom lengths yet" : "No lengths yet") : "Choose a length"}</option>
            {lengthChoices.map((length) => (
              <option key={length} value={length}>{length}</option>
            ))}
          </select>
        </div>
      )}
      {showCapacity && (
        <div>
          <label className={labelClass} htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            value={capacityValue}
            onChange={(event) => setCapacityValue(event.target.value)}
            className={fieldClass}
            placeholder={units.capacityPlaceholder}
          />
        </div>
      )}
      <input type="hidden" name="categoryId" value={selectedId} />
      <input type="hidden" name="capacity" value={submittedCapacity} />
      <input type="hidden" name="boomLength" value={measure === "boom" ? boomValue : ""} />
      <input type="hidden" name="bedLength" value={measure === "bed" ? bedValue : ""} />
    </div>
  );
}
