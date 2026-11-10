-- Phase 1 staff authentication.
-- Does not alter public.projects or the project-images bucket.
-- Run in Supabase → SQL Editor, or apply with the project's migration step.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null default '',
  is_system boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  module text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.staff_role_permissions (
  role_id uuid not null references public.staff_roles (id) on delete cascade,
  permission_id uuid not null references public.staff_permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.staff_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null,
  role_id uuid not null references public.staff_roles (id),
  status text not null default 'invited' check (status in ('invited', 'active', 'disabled')),
  invited_by uuid references public.staff_profiles (id),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists staff_profiles_email_lower_idx
  on public.staff_profiles (lower(email));

create index if not exists staff_profiles_role_id_idx
  on public.staff_profiles (role_id);

create index if not exists staff_profiles_status_idx
  on public.staff_profiles (status);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.staff_profiles (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_created_at_idx
  on public.activity_logs (created_at desc);

create index if not exists activity_logs_actor_id_idx
  on public.activity_logs (actor_id);

drop trigger if exists staff_roles_touch_updated_at on public.staff_roles;
create trigger staff_roles_touch_updated_at
before update on public.staff_roles
for each row execute function public.touch_updated_at();

drop trigger if exists staff_profiles_touch_updated_at on public.staff_profiles;
create trigger staff_profiles_touch_updated_at
before update on public.staff_profiles
for each row execute function public.touch_updated_at();

insert into public.staff_roles (key, name, description)
values
  ('super_admin', 'Super Admin', 'Full access, including staff roles and permissions.'),
  ('admin', 'Admin', 'Invites staff and manages the website project portfolio.'),
  ('sales', 'Sales', 'Sales access. Can view the website project portfolio.'),
  ('operations', 'Operations', 'Operations access. Can view the website project portfolio.'),
  ('procurement', 'Procurement', 'Procurement access.'),
  ('finance', 'Finance', 'Finance access.'),
  ('viewer', 'Viewer', 'Read-only access to the website project portfolio.')
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description,
  updated_at = now();

insert into public.staff_permissions (key, module, description)
values
  ('website_projects.read', 'website_projects', 'View the website project portfolio editor.'),
  ('website_projects.write', 'website_projects', 'Add, edit, and delete website portfolio projects.'),
  ('staff.read', 'staff', 'View staff profiles.'),
  ('staff.invite', 'staff', 'Invite a staff member.'),
  ('staff.assign_roles', 'staff', 'Change a staff member''s role.'),
  ('staff.disable', 'staff', 'Disable or enable a staff member.'),
  ('activity.read', 'staff', 'View the staff activity log.'),
  ('clients.read', 'clients', 'View clients.'),
  ('clients.write', 'clients', 'Manage clients.'),
  ('equipment.read', 'equipment', 'View equipment.'),
  ('equipment.write', 'equipment', 'Manage equipment.'),
  ('suppliers.read', 'suppliers', 'View suppliers.'),
  ('suppliers.write', 'suppliers', 'Manage suppliers.'),
  ('rates.read', 'rates', 'View supplier rates.'),
  ('rates.write', 'rates', 'Manage supplier rates.'),
  ('enquiries.read', 'enquiries', 'View enquiries.'),
  ('enquiries.write', 'enquiries', 'Manage enquiries.'),
  ('quotations.read', 'quotations', 'View quotations.'),
  ('quotations.write', 'quotations', 'Manage quotations.'),
  ('rental_projects.read', 'rental_projects', 'View operational projects.'),
  ('rental_projects.write', 'rental_projects', 'Manage operational projects.'),
  ('bookings.read', 'bookings', 'View equipment bookings.'),
  ('bookings.write', 'bookings', 'Manage equipment bookings.'),
  ('procurement.read', 'procurement', 'View purchase orders.'),
  ('procurement.write', 'procurement', 'Manage purchase orders.'),
  ('finance.read', 'finance', 'View finance records.'),
  ('finance.write', 'finance', 'Manage finance records.'),
  ('documents.read', 'documents', 'View documents.'),
  ('documents.write', 'documents', 'Manage documents.'),
  ('reports.read', 'reports', 'View reports.'),
  ('settings.manage', 'settings', 'Manage system settings.')
on conflict (key) do update
set
  module = excluded.module,
  description = excluded.description;

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on (
  r.key = 'super_admin'
  or (
    r.key = 'admin'
    and p.key in (
      'website_projects.read',
      'website_projects.write',
      'staff.read',
      'staff.invite',
      'staff.disable',
      'activity.read'
    )
  )
  or (
    r.key in ('sales', 'operations', 'viewer')
    and p.key = 'website_projects.read'
  )
)
on conflict do nothing;

alter table public.staff_roles enable row level security;
alter table public.staff_permissions enable row level security;
alter table public.staff_role_permissions enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.activity_logs enable row level security;

revoke all on table public.staff_roles from anon, authenticated;
revoke all on table public.staff_permissions from anon, authenticated;
revoke all on table public.staff_role_permissions from anon, authenticated;
revoke all on table public.staff_profiles from anon, authenticated;
revoke all on table public.activity_logs from anon, authenticated;

grant select on table public.staff_roles to authenticated;
grant select on table public.staff_permissions to authenticated;
grant select on table public.staff_role_permissions to authenticated;
grant select on table public.staff_profiles to authenticated;

drop policy if exists "Active staff read roles" on public.staff_roles;
create policy "Active staff read roles"
on public.staff_roles
for select
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles profile
    where profile.id = auth.uid()
      and profile.status in ('active', 'invited')
  )
);

drop policy if exists "Active staff read permissions" on public.staff_permissions;
create policy "Active staff read permissions"
on public.staff_permissions
for select
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles profile
    where profile.id = auth.uid()
      and profile.status in ('active', 'invited')
  )
);

drop policy if exists "Active staff read role permissions" on public.staff_role_permissions;
create policy "Active staff read role permissions"
on public.staff_role_permissions
for select
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles profile
    where profile.id = auth.uid()
      and profile.status in ('active', 'invited')
  )
);

drop policy if exists "Staff read own profile" on public.staff_profiles;
create policy "Staff read own profile"
on public.staff_profiles
for select
to authenticated
using (id = auth.uid());

-- Links admin@peakfront.ae when that Auth user already exists.
-- Safe to re-run: it inserts nothing until the Auth user is created.
insert into public.staff_profiles (id, full_name, email, role_id, status)
select users.id, 'Peakfront Admin', users.email, roles.id, 'active'
from auth.users users
join public.staff_roles roles on roles.key = 'super_admin'
where lower(users.email) = 'admin@peakfront.ae'
on conflict (id) do update
set
  role_id = excluded.role_id,
  status = 'active',
  email = excluded.email,
  full_name = coalesce(nullif(public.staff_profiles.full_name, ''), excluded.full_name),
  updated_at = now();
