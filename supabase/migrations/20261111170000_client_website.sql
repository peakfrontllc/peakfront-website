alter table public.clients
  add column if not exists website text not null default '';
