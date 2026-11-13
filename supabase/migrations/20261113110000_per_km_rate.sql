-- One AED amount per kilometre, in place of a per-trip charge and a distance.

alter table public.supplier_rates
  add column if not exists per_km_rate numeric(12, 2);

alter table public.equipment_market_rates
  add column if not exists per_km_rate numeric(12, 2);

alter table public.supplier_rates drop column if exists trip_charge;
alter table public.supplier_rates drop column if exists trip_km;

alter table public.equipment_market_rates drop column if exists trip_charge;
alter table public.equipment_market_rates drop column if exists trip_km;

notify pgrst, 'reload schema';
