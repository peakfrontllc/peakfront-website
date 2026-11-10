-- Extra label/value fields on suppliers and clients.
-- Equipment keeps using equipment_specifications.

create table if not exists public.custom_fields (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('supplier', 'client')),
  owner_id uuid not null,
  label text not null,
  value text not null,
  created_at timestamptz not null default now()
);

create index if not exists custom_fields_owner_idx
  on public.custom_fields (owner_type, owner_id, created_at);

alter table public.custom_fields enable row level security;
revoke all on table public.custom_fields from anon, authenticated;
