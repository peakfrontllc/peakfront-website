-- Equipment types a supplier can provide, chosen from the catalogue.
-- Kept apart from supplier_equipment, which is the available machines with lead times and rates.

create table if not exists public.supplier_catalogue (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  category_id uuid not null references public.equipment_categories (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (supplier_id, category_id)
);

create index if not exists supplier_catalogue_supplier_idx
  on public.supplier_catalogue (supplier_id);

create index if not exists supplier_catalogue_category_idx
  on public.supplier_catalogue (category_id);

alter table public.supplier_catalogue enable row level security;

revoke all on table public.supplier_catalogue from anon, authenticated;
