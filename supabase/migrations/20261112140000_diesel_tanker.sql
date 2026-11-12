-- Diesel Tanker sits with the other tankers under Transport and uses the same gallon sizes.

insert into public.equipment_categories (name, slug, description, tonnage, parent_id)
select 'Diesel Tanker', 'diesel-tanker', '', '', purpose.id
from public.equipment_categories purpose
join public.equipment_categories fuel
  on fuel.parent_id = purpose.id and lower(fuel.name) = 'fuel tanker'
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = purpose.id and lower(existing.name) = 'diesel tanker'
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = 'diesel-tanker'
);

insert into public.equipment_categories (name, slug, parent_id, tonnage, description, kind)
select size.name,
  left('diesel-tanker-' || regexp_replace(lower(size.name), '[^a-z0-9]+', '-', 'g'), 80),
  diesel.id,
  size.tonnage,
  '',
  size.kind
from public.equipment_categories fuel
join public.equipment_categories size on size.parent_id = fuel.id
join public.equipment_categories diesel on lower(diesel.name) = 'diesel tanker'
where lower(fuel.name) = 'fuel tanker'
  and not exists (
    select 1 from public.equipment_categories existing
    where existing.parent_id = diesel.id and lower(existing.name) = lower(size.name)
  )
  and not exists (
    select 1 from public.equipment_categories existing
    where existing.slug = left('diesel-tanker-' || regexp_replace(lower(size.name), '[^a-z0-9]+', '-', 'g'), 80)
  );
