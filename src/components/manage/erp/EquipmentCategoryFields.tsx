"use client";

import { useMemo, useState } from "react";
import { fieldClass, labelClass } from "@/components/manage/form-styles";

export type CategoryChoice = {
  id: string;
  name: string;
  parentId: string | null;
};

export function EquipmentCategoryFields({
  categories,
  categoryId = "",
  capacity = "",
}: {
  categories: CategoryChoice[];
  categoryId?: string;
  capacity?: string;
}) {
  const byId = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);
  const current = byId.get(categoryId);
  const parent = current?.parentId ? byId.get(current.parentId) : undefined;
  const grandparent = parent?.parentId ? byId.get(parent.parentId) : undefined;
  const [purposeId, setPurposeId] = useState(grandparent?.id || parent?.id || (current && !current.parentId ? current.id : "") || "");
  const [typeId, setTypeId] = useState(grandparent ? parent?.id ?? "" : parent ? current?.id ?? "" : "");
  const [sizeId, setSizeId] = useState(grandparent ? current?.id ?? "" : "");
  const [capacityValue, setCapacityValue] = useState(capacity);
  const purposes = categories.filter((category) => !category.parentId);
  const types = useMemo(
    () => categories.filter((category) => category.parentId === purposeId),
    [categories, purposeId],
  );
  const sizes = useMemo(
    () => categories.filter((category) => category.parentId === typeId),
    [categories, typeId],
  );
  const selectedId = sizes.length > 0 ? sizeId : typeId;

  return (
    <>
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
          }}
        >
          <option value="">Choose a purpose</option>
          {purposes.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div>
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
          }}
        >
          <option value="">{types.length > 0 ? "Choose equipment" : "No equipment yet"}</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="sizeCategory">Size</label>
        <select
          id="sizeCategory"
          className={fieldClass}
          value={sizeId}
          required={sizes.length > 0}
          disabled={!typeId || sizes.length === 0}
          onChange={(event) => {
            const nextId = event.target.value;
            setSizeId(nextId);
            const size = sizes.find((item) => item.id === nextId);
            if (size) setCapacityValue(size.name);
          }}
        >
          <option value="">{sizes.length > 0 ? "Choose a size" : "No sizes yet"}</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.id}>{size.name}</option>
          ))}
        </select>
        <input type="hidden" name="categoryId" value={selectedId} />
      </div>
      <div>
        <label className={labelClass} htmlFor="capacity">Tonnage / capacity</label>
        <input
          id="capacity"
          name="capacity"
          value={capacityValue}
          onChange={(event) => setCapacityValue(event.target.value)}
          className={fieldClass}
          placeholder="3 ton"
        />
      </div>
    </>
  );
}
