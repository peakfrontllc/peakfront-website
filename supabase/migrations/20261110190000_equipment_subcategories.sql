-- Size classes under an equipment category, for example Excavator → Small, 1–8 ton.

alter table public.equipment_categories
  add column if not exists parent_id uuid references public.equipment_categories (id) on delete restrict,
  add column if not exists tonnage text not null default '';

create index if not exists equipment_categories_parent_idx
  on public.equipment_categories (parent_id);
