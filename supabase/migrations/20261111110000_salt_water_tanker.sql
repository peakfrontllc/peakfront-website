-- Drain water tanker is the salt-water dust-control tanker.

update public.equipment_categories tanker
set name = 'Salt Water Tanker'
where lower(tanker.name) = 'drain water tanker'
  and not exists (
    select 1
    from public.equipment_categories existing
    where lower(existing.name) = 'salt water tanker'
      and existing.id <> tanker.id
  );
