-- Boom lengths sit beside capacities under a crane or boom lift, for example Mobile Crane → 75 m boom.
-- Add Equipment reads this list. Existing metre boom values are renamed to match, such as 45 m → 45 m boom.

alter table public.equipment_categories
  add column if not exists kind text not null default 'capacity';

alter table public.equipment_categories
  drop constraint if exists equipment_categories_kind_check;

alter table public.equipment_categories
  add constraint equipment_categories_kind_check check (kind in ('capacity', 'boom'));

insert into public.equipment_categories (name, slug, parent_id, tonnage, description, kind)
select sizes.size_name, left(parent.slug || '-' || sizes.size_slug, 80), parent.id, '', '', 'boom'
from (
  values
    ('Lifting and Cranes', 'Pickup Crane', '10 m boom', '10-m-boom'),
    ('Lifting and Cranes', 'Pickup Crane', '12 m boom', '12-m-boom'),
    ('Lifting and Cranes', 'Pickup Crane', '16 m boom', '16-m-boom'),
    ('Lifting and Cranes', 'Pickup Crane', '18 m boom', '18-m-boom'),
    ('Lifting and Cranes', 'Pickup Crane', '20 m boom', '20-m-boom'),
    ('Lifting and Cranes', 'Pickup Crane', '24 m boom', '24-m-boom'),
    ('Lifting and Cranes', 'Pickup Crane', '28 m boom', '28-m-boom'),
    ('Lifting and Cranes', 'Pickup Crane', '32 m boom', '32-m-boom'),
    ('Lifting and Cranes', 'Boom Truck', '10 m boom', '10-m-boom'),
    ('Lifting and Cranes', 'Boom Truck', '12 m boom', '12-m-boom'),
    ('Lifting and Cranes', 'Boom Truck', '16 m boom', '16-m-boom'),
    ('Lifting and Cranes', 'Boom Truck', '18 m boom', '18-m-boom'),
    ('Lifting and Cranes', 'Boom Truck', '20 m boom', '20-m-boom'),
    ('Lifting and Cranes', 'Boom Truck', '24 m boom', '24-m-boom'),
    ('Lifting and Cranes', 'Boom Truck', '28 m boom', '28-m-boom'),
    ('Lifting and Cranes', 'Boom Truck', '32 m boom', '32-m-boom'),
    ('Lifting and Cranes', 'Mobile Crane', '32 m boom', '32-m-boom'),
    ('Lifting and Cranes', 'Mobile Crane', '40 m boom', '40-m-boom'),
    ('Lifting and Cranes', 'Mobile Crane', '50 m boom', '50-m-boom'),
    ('Lifting and Cranes', 'Mobile Crane', '60 m boom', '60-m-boom'),
    ('Lifting and Cranes', 'Mobile Crane', '70 m boom', '70-m-boom'),
    ('Lifting and Cranes', 'Mobile Crane', '75 m boom', '75-m-boom'),
    ('Lifting and Cranes', 'Mobile Crane', '80 m boom', '80-m-boom'),
    ('Lifting and Cranes', 'Rough Terrain Crane', '24 m boom', '24-m-boom'),
    ('Lifting and Cranes', 'Rough Terrain Crane', '30 m boom', '30-m-boom'),
    ('Lifting and Cranes', 'Rough Terrain Crane', '40 m boom', '40-m-boom'),
    ('Lifting and Cranes', 'Rough Terrain Crane', '45 m boom', '45-m-boom'),
    ('Lifting and Cranes', 'Rough Terrain Crane', '50 m boom', '50-m-boom'),
    ('Lifting and Cranes', 'Crawler Crane', '40 m boom', '40-m-boom'),
    ('Lifting and Cranes', 'Crawler Crane', '52 m boom', '52-m-boom'),
    ('Lifting and Cranes', 'Crawler Crane', '60 m boom', '60-m-boom'),
    ('Lifting and Cranes', 'Crawler Crane', '70 m boom', '70-m-boom'),
    ('Lifting and Cranes', 'Crawler Crane', '80 m boom', '80-m-boom'),
    ('Lifting and Cranes', 'Crawler Crane', '90 m boom', '90-m-boom'),
    ('Access Equipment', 'Boom Lift', '12 m boom', '12-m-boom'),
    ('Access Equipment', 'Boom Lift', '16 m boom', '16-m-boom'),
    ('Access Equipment', 'Boom Lift', '20 m boom', '20-m-boom'),
    ('Access Equipment', 'Boom Lift', '26 m boom', '26-m-boom'),
    ('Access Equipment', 'Boom Lift', '32 m boom', '32-m-boom'),
    ('Access Equipment', 'Boom Lift', '38 m boom', '38-m-boom'),
    ('Access Equipment', 'Boom Lift', '45 m boom', '45-m-boom'),
    ('Access Equipment', 'Boom Lift', '55 m boom', '55-m-boom'),
    ('Access Equipment', 'Boom Lift', '65 m boom', '65-m-boom'),
    ('Access Equipment', 'Boom Lift', '75 m boom', '75-m-boom'),
    ('Access Equipment', 'Spider Lift', '13 m boom', '13-m-boom'),
    ('Access Equipment', 'Spider Lift', '15 m boom', '15-m-boom'),
    ('Access Equipment', 'Spider Lift', '17 m boom', '17-m-boom'),
    ('Access Equipment', 'Spider Lift', '20 m boom', '20-m-boom'),
    ('Access Equipment', 'Spider Lift', '23 m boom', '23-m-boom'),
    ('Access Equipment', 'Spider Lift', '25 m boom', '25-m-boom')
) as sizes(purpose_name, parent_name, size_name, size_slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = lower(sizes.purpose_name)
join public.equipment_categories parent
  on parent.parent_id = purpose.id and lower(parent.name) = lower(sizes.parent_name)
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = parent.id and lower(existing.name) = lower(sizes.size_name)
)
and not exists (
  select 1 from public.equipment_categories existing
  where existing.slug = left(parent.slug || '-' || sizes.size_slug, 80)
);

update public.equipment equipment
set boom_length = boom.name
from public.equipment_categories size
join public.equipment_categories type on type.id = size.parent_id
join public.equipment_categories boom on boom.parent_id = type.id and boom.kind = 'boom'
where equipment.category_id = size.id
  and equipment.boom_length ~ '^[0-9]+(\.[0-9]+)? m$'
  and boom.name = regexp_replace(equipment.boom_length, ' m$', ' m boom');
