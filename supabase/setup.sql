-- Run this once in Supabase → SQL Editor, then create the storage bucket.

create table if not exists public.projects (
  id text primary key,
  project_name text not null,
  client text not null default '',
  main_contractor text not null default '',
  scope_of_work text not null default '',
  equipment jsonb not null default '[]'::jsonb,
  location text,
  start_date text not null default '',
  completion_date text not null default '',
  status text not null default 'completed',
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- The website reads and writes with the service role (bypasses RLS).
-- Leave anon with no table policies so the database is not public.

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read project images" on storage.objects;
create policy "Public read project images"
on storage.objects
for select
to public
using (bucket_id = 'project-images');
