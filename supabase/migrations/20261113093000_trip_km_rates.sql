-- Per-trip charge and the kilometres that charge covers, on supplier rates and general rates.

alter table public.supplier_rates
  add column if not exists trip_charge numeric(12, 2),
  add column if not exists trip_km numeric(8, 2);

alter table public.equipment_market_rates
  add column if not exists trip_charge numeric(12, 2),
  add column if not exists trip_km numeric(8, 2);

notify pgrst, 'reload schema';
