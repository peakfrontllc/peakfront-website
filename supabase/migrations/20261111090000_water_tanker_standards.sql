-- Keep three water duties: sweet, drain, and sewage.
-- Each uses the five tanker sizes hired in the UAE: 2,000, 3,000, 5,000, 8,000 and 10,000 gal.
-- The old general Water Tanker duplicates those duties, so it is removed when nothing is linked to it.

insert into public.equipment_categories (name, slug, parent_id, tonnage, description)
select sizes.size_name, left(parent.slug || '-' || sizes.size_slug, 80), parent.id, sizes.size_name, ''
from (
  values
    ('Sweet Water Tanker', '2000 gal', '2000-gal'),
    ('Sweet Water Tanker', '3000 gal', '3000-gal'),
    ('Sweet Water Tanker', '5000 gal', '5000-gal'),
    ('Sweet Water Tanker', '8000 gal', '8000-gal'),
    ('Sweet Water Tanker', '10000 gal', '10000-gal'),
    ('Drain Water Tanker', '2000 gal', '2000-gal'),
    ('Drain Water Tanker', '3000 gal', '3000-gal'),
    ('Drain Water Tanker', '5000 gal', '5000-gal'),
    ('Drain Water Tanker', '8000 gal', '8000-gal'),
    ('Drain Water Tanker', '10000 gal', '10000-gal'),
    ('Sewage Tanker', '2000 gal', '2000-gal'),
    ('Sewage Tanker', '3000 gal', '3000-gal'),
    ('Sewage Tanker', '5000 gal', '5000-gal'),
    ('Sewage Tanker', '8000 gal', '8000-gal'),
    ('Sewage Tanker', '10000 gal', '10000-gal')
) as sizes(parent_name, size_name, size_slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and purpose.name = 'Transport and Haulage'
join public.equipment_categories parent
  on parent.parent_id = purpose.id and parent.name = sizes.parent_name
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = parent.id and lower(existing.name) = lower(sizes.size_name)
)
and not exists (
  select 1 from public.equipment_categories existing
  where existing.slug = left(parent.slug || '-' || sizes.size_slug, 80)
);

delete from public.equipment_categories size
using public.equipment_categories parent
where size.parent_id = parent.id
  and parent.name in ('Sweet Water Tanker', 'Drain Water Tanker', 'Sewage Tanker')
  and size.name in ('1000 gal', '4000 gal', '6000 gal')
  and not exists (select 1 from public.equipment equipment where equipment.category_id = size.id);

delete from public.equipment_categories size
using public.equipment_categories parent
where size.parent_id = parent.id
  and parent.name = 'Water Tanker'
  and parent.parent_id is not null
  and not exists (select 1 from public.equipment equipment where equipment.category_id = size.id);

delete from public.equipment_categories tanker
where tanker.name = 'Water Tanker'
  and tanker.parent_id is not null
  and not exists (
    select 1 from public.equipment_categories child where child.parent_id = tanker.id
  )
  and not exists (
    select 1 from public.equipment equipment where equipment.category_id = tanker.id
  );
