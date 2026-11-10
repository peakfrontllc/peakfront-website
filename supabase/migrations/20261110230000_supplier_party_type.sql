alter table public.suppliers
  add column if not exists party_type text not null default 'company';

alter table public.suppliers
  drop constraint if exists suppliers_party_type_check;

alter table public.suppliers
  add constraint suppliers_party_type_check check (party_type in ('individual', 'company'));
