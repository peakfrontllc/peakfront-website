-- TMA equipment is the crash-test rating: TL-1 (50 km/h), TL-2 (70 km/h), TL-3 (100 km/h).
-- Higher test levels are for fixed barriers, not truck-mounted attenuators.

insert into public.equipment_categories (name, slug, description, tonnage, parent_id)
select seed.name, seed.slug, '', '', purpose.id
from (
  values
    ('Attenuator TL-1', 'attenuator-tl-1'),
    ('Attenuator TL-2', 'attenuator-tl-2'),
    ('Attenuator TL-3', 'attenuator-tl-3')
) as seed(name, slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = 'tma'
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = purpose.id and lower(existing.name) = lower(seed.name)
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = seed.slug
);
