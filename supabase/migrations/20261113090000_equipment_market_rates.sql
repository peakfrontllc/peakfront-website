-- One market note per machine, kept apart from supplier prices.

create table if not exists public.equipment_market_rates (
  equipment_id uuid primary key references public.equipment (id) on delete cascade,
  daily_rate numeric(12, 2),
  weekly_rate numeric(12, 2),
  monthly_rate numeric(12, 2),
  currency text not null default 'AED',
  vat_included boolean not null default false,
  notes text not null default '',
  updated_by uuid references public.staff_profiles (id),
  updated_at timestamptz not null default now()
);

alter table public.equipment_market_rates enable row level security;
revoke all on table public.equipment_market_rates from anon, authenticated;

notify pgrst, 'reload schema';
