create table if not exists public.client_documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  doc_type text not null default 'other' check (doc_type in ('trade_licence', 'insurance', 'certificate', 'other')),
  title text not null,
  storage_path text not null,
  expires_on date,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now()
);

alter table public.client_documents enable row level security;
revoke all on table public.client_documents from anon, authenticated;
