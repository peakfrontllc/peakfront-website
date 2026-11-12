-- Van is its own catalogue category, with the van types staff can assign to a supplier.

insert into public.equipment_categories (name, slug, description, tonnage)
select 'Van', 'van', '', ''
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id is null and lower(existing.name) = 'van'
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = 'van'
);

insert into public.equipment_categories (name, slug, description, tonnage, parent_id)
select seed.name, seed.slug, '', '', purpose.id
from (
  values
    ('Chiller Van', 'chiller-van'),
    ('Freezer Van', 'freezer-van'),
    ('Dry Van', 'dry-van'),
    ('Insulated Van', 'insulated-van'),
    ('Passenger Van', 'passenger-van')
) as seed(name, slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = 'van'
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = purpose.id and lower(existing.name) = lower(seed.name)
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = seed.slug
);
