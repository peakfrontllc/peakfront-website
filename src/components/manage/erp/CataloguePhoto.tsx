"use client";

import { useState } from "react";
import { equipmentIcon } from "@/components/manage/erp/equipment-icons";

function photoSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function stockPath(name: string) {
  const slug = photoSlug(name);
  if (!slug) return "";
  if (slug === "manlift" || slug === "cherry-picker") return "/images/equipment/boom-lift.webp";
  return `/images/equipment/${slug}.webp`;
}

export function CataloguePhoto({
  name,
  src = "",
  large = false,
  small = false,
}: {
  name: string;
  src?: string;
  large?: boolean;
  small?: boolean;
}) {
  const stock = stockPath(name);
  const [shown, setShown] = useState(src || stock);
  const size = large ? "h-16 w-16 rounded-2xl" : small ? "h-8 w-8 rounded-lg" : "h-14 w-14 rounded-xl";
  if (!shown) {
    const Icon = equipmentIcon(name);
    return (
      <span className={`flex shrink-0 items-center justify-center bg-slate-100 text-navy ring-1 ring-slate-200 ${size}`}>
        <Icon className={large ? "h-6 w-6" : small ? "h-3.5 w-3.5" : "h-5 w-5"} aria-hidden />
      </span>
    );
  }
  return (
    <img
      src={shown}
      alt=""
      width={112}
      height={112}
      decoding="async"
      loading="lazy"
      onError={() => setShown((current) => (current === src && stock && src !== stock ? stock : ""))}
      className={`shrink-0 object-cover ring-1 ring-black/5 ${size}`}
    />
  );
}
