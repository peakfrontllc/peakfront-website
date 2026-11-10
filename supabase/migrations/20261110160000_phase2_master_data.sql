-- Phase 2 master data.
-- Does not alter public.projects, project-images, or staff authentication tables.

create table if not exists public.equipment_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.equipment_categories (id),
  code text unique,
  name text not null,
  description text not null default '',
  capacity text not null default '',
  ownership text not null default 'supplier' check (ownership in ('owned', 'supplier', 'both')),
  status text not null default 'available' check (status in ('available', 'reserved', 'deployed', 'maintenance', 'inactive')),
  archived_at timestamptz,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists equipment_category_idx on public.equipment (category_id);
create index if not exists equipment_name_idx on public.equipment (name);
create index if not exists equipment_archived_idx on public.equipment (archived_at);

create table if not exists public.equipment_specifications (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.equipment_assets (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  asset_code text not null unique,
  serial_number text not null default '',
  registration_number text not null default '',
  year_made text not null default '',
  status text not null default 'available' check (status in ('available', 'deployed', 'maintenance', 'retired')),
  location text not null default '',
  notes text not null default '',
  archived_at timestamptz,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.equipment_images (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  storage_path text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.equipment_documents (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  equipment_asset_id uuid references public.equipment_assets (id) on delete set null,
  doc_type text not null default 'other' check (doc_type in ('registration', 'certificate', 'insurance', 'inspection', 'other')),
  title text not null,
  storage_path text not null,
  expires_on date,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.equipment_maintenance (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  equipment_asset_id uuid references public.equipment_assets (id) on delete set null,
  serviced_on date not null,
  description text not null,
  next_due_on date,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  trade_licence text not null default '',
  email text not null default '',
  phone text not null default '',
  website text not null default '',
  address text not null default '',
  emirate text not null default '',
  notes text not null default '',
  archived_at timestamptz,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists suppliers_name_idx on public.suppliers (company_name);

create table if not exists public.supplier_contacts (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  name text not null,
  job_title text not null default '',
  phone text not null default '',
  email text not null default '',
  whatsapp text not null default '',
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_locations (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  label text not null,
  address text not null default '',
  city text not null default '',
  emirate text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_notes (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  body text not null,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_documents (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  doc_type text not null default 'other' check (doc_type in ('trade_licence', 'insurance', 'certificate', 'other')),
  title text not null,
  storage_path text not null,
  expires_on date,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_equipment (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  equipment_id uuid not null references public.equipment (id),
  lead_time text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  unique (supplier_id, equipment_id)
);

create table if not exists public.supplier_rates (
  id uuid primary key default gen_random_uuid(),
  supplier_equipment_id uuid not null references public.supplier_equipment (id),
  daily_rate numeric(12, 2),
  weekly_rate numeric(12, 2),
  monthly_rate numeric(12, 2),
  transport_charge numeric(12, 2),
  operator_daily_charge numeric(12, 2),
  currency text not null default 'AED',
  vat_included boolean not null default false,
  valid_from date not null,
  valid_to date,
  notes text not null default '',
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now(),
  constraint supplier_rates_period check (valid_to is null or valid_to >= valid_from)
);

create index if not exists supplier_rates_lookup_idx
  on public.supplier_rates (supplier_equipment_id, valid_from desc);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  trade_licence text not null default '',
  industry text not null default '',
  email text not null default '',
  phone text not null default '',
  billing_address text not null default '',
  emirate text not null default '',
  notes text not null default '',
  archived_at timestamptz,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_name_idx on public.clients (company_name);

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  job_title text not null default '',
  phone text not null default '',
  email text not null default '',
  whatsapp text not null default '',
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.client_locations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  label text not null,
  address text not null default '',
  city text not null default '',
  emirate text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  body text not null,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.client_equipment_interests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  equipment_id uuid not null references public.equipment (id),
  typical_quantity integer not null default 1 check (typical_quantity > 0),
  duration_note text not null default '',
  created_at timestamptz not null default now(),
  unique (client_id, equipment_id)
);

drop trigger if exists equipment_categories_touch_updated_at on public.equipment_categories;
create trigger equipment_categories_touch_updated_at
before update on public.equipment_categories
for each row execute function public.touch_updated_at();

drop trigger if exists equipment_touch_updated_at on public.equipment;
create trigger equipment_touch_updated_at
before update on public.equipment
for each row execute function public.touch_updated_at();

drop trigger if exists equipment_assets_touch_updated_at on public.equipment_assets;
create trigger equipment_assets_touch_updated_at
before update on public.equipment_assets
for each row execute function public.touch_updated_at();

drop trigger if exists suppliers_touch_updated_at on public.suppliers;
create trigger suppliers_touch_updated_at
before update on public.suppliers
for each row execute function public.touch_updated_at();

drop trigger if exists clients_touch_updated_at on public.clients;
create trigger clients_touch_updated_at
before update on public.clients
for each row execute function public.touch_updated_at();

insert into storage.buckets (id, name, public)
values
  ('equipment-images', 'equipment-images', false),
  ('master-documents', 'master-documents', false)
on conflict (id) do update set public = false;

alter table public.equipment_categories enable row level security;
alter table public.equipment enable row level security;
alter table public.equipment_specifications enable row level security;
alter table public.equipment_assets enable row level security;
alter table public.equipment_images enable row level security;
alter table public.equipment_documents enable row level security;
alter table public.equipment_maintenance enable row level security;
alter table public.suppliers enable row level security;
alter table public.supplier_contacts enable row level security;
alter table public.supplier_locations enable row level security;
alter table public.supplier_notes enable row level security;
alter table public.supplier_documents enable row level security;
alter table public.supplier_equipment enable row level security;
alter table public.supplier_rates enable row level security;
alter table public.clients enable row level security;
alter table public.client_contacts enable row level security;
alter table public.client_locations enable row level security;
alter table public.client_notes enable row level security;
alter table public.client_equipment_interests enable row level security;

revoke all on table public.equipment_categories from anon, authenticated;
revoke all on table public.equipment from anon, authenticated;
revoke all on table public.equipment_specifications from anon, authenticated;
revoke all on table public.equipment_assets from anon, authenticated;
revoke all on table public.equipment_images from anon, authenticated;
revoke all on table public.equipment_documents from anon, authenticated;
revoke all on table public.equipment_maintenance from anon, authenticated;
revoke all on table public.suppliers from anon, authenticated;
revoke all on table public.supplier_contacts from anon, authenticated;
revoke all on table public.supplier_locations from anon, authenticated;
revoke all on table public.supplier_notes from anon, authenticated;
revoke all on table public.supplier_documents from anon, authenticated;
revoke all on table public.supplier_equipment from anon, authenticated;
revoke all on table public.supplier_rates from anon, authenticated;
revoke all on table public.clients from anon, authenticated;
revoke all on table public.client_contacts from anon, authenticated;
revoke all on table public.client_locations from anon, authenticated;
revoke all on table public.client_notes from anon, authenticated;
revoke all on table public.client_equipment_interests from anon, authenticated;

insert into public.staff_role_permissions (role_id, permission_id)
select roles.id, permissions.id
from public.staff_roles roles
join public.staff_permissions permissions on (
  (
    roles.key = 'admin'
    and permissions.key in (
      'equipment.read', 'equipment.write',
      'suppliers.read', 'suppliers.write',
      'rates.read', 'rates.write',
      'clients.read', 'clients.write',
      'documents.read', 'documents.write'
    )
  )
  or (
    roles.key = 'sales'
    and permissions.key in (
      'equipment.read', 'suppliers.read', 'rates.read',
      'clients.read', 'clients.write', 'documents.read'
    )
  )
  or (
    roles.key = 'operations'
    and permissions.key in (
      'equipment.read', 'equipment.write',
      'suppliers.read', 'rates.read', 'clients.read',
      'documents.read', 'documents.write'
    )
  )
  or (
    roles.key = 'procurement'
    and permissions.key in (
      'equipment.read',
      'suppliers.read', 'suppliers.write',
      'rates.read', 'rates.write',
      'documents.read', 'documents.write'
    )
  )
  or (
    roles.key = 'finance'
    and permissions.key in (
      'clients.read', 'suppliers.read', 'rates.read', 'documents.read'
    )
  )
  or (
    roles.key = 'viewer'
    and permissions.key in (
      'equipment.read', 'suppliers.read', 'rates.read', 'clients.read', 'documents.read'
    )
  )
)
on conflict do nothing;
