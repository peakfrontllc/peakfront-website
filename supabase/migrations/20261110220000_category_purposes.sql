-- Group machine types under a purpose, such as Access Equipment → Boom Lift → 12 m.

update public.equipment_categories
set name = 'Access Equipment'
where parent_id is null
  and lower(name) = 'access equipment'
  and name <> 'Access Equipment';

insert into public.equipment_categories (name, slug, description, tonnage)
select seed.name, seed.slug, '', ''
from (
  values
    ('Earthmoving', 'earthmoving'),
    ('Lifting and Cranes', 'lifting-and-cranes'),
    ('Access Equipment', 'access-equipment'),
    ('Material Handling', 'material-handling'),
    ('Compaction', 'compaction'),
    ('Transport and Haulage', 'transport-and-haulage'),
    ('Power and Site Services', 'power-and-site-services')
) as seed(name, slug)
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id is null and lower(existing.name) = lower(seed.name)
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = seed.slug
);

update public.equipment_categories equipment
set parent_id = purpose.id
from (
  values
    ('Earthmoving', 'Excavator'),
    ('Earthmoving', 'Wheel Loader'),
    ('Earthmoving', 'Backhoe Loader'),
    ('Earthmoving', 'Bulldozer'),
    ('Earthmoving', 'Motor Grader'),
    ('Earthmoving', 'Skid Steer'),
    ('Lifting and Cranes', 'Pickup Crane'),
    ('Lifting and Cranes', 'Mobile Crane'),
    ('Lifting and Cranes', 'Rough Terrain Crane'),
    ('Lifting and Cranes', 'Crawler Crane'),
    ('Lifting and Cranes', 'Tower Crane'),
    ('Access Equipment', 'Boom Lift'),
    ('Access Equipment', 'Scissor Lift'),
    ('Material Handling', 'Telehandler'),
    ('Material Handling', 'Forklift'),
    ('Compaction', 'Roller'),
    ('Transport and Haulage', 'Tipper Truck'),
    ('Transport and Haulage', 'Water Tanker'),
    ('Transport and Haulage', 'Fuel Tanker'),
    ('Transport and Haulage', 'Low Bed Trailer'),
    ('Transport and Haulage', 'Flatbed Truck'),
    ('Transport and Haulage', 'Bus'),
    ('Power and Site Services', 'Generator'),
    ('Power and Site Services', 'Diesel Pump'),
    ('Power and Site Services', 'Air Compressor'),
    ('Power and Site Services', 'Lighting Tower')
) as mapping(purpose_name, equipment_name)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = lower(mapping.purpose_name)
where equipment.parent_id is null
  and lower(equipment.name) = lower(mapping.equipment_name)
  and equipment.id <> purpose.id;

insert into public.equipment_categories (name, slug, description, tonnage, parent_id)
select seed.name, seed.slug, '', '', purpose.id
from (
  values
    ('Lifting and Cranes', 'Crawler Crane', 'crawler-crane'),
    ('Lifting and Cranes', 'Tower Crane', 'tower-crane')
) as seed(purpose_name, name, slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = lower(seed.purpose_name)
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = purpose.id and lower(existing.name) = lower(seed.name)
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = seed.slug
);

insert into public.equipment_categories (name, slug, parent_id, tonnage, description)
select sizes.size_name, left(parent.slug || '-' || sizes.size_slug, 48), parent.id, sizes.size_name, ''
from (
  values
    ('Crawler Crane', '50 ton', '50-ton'),
    ('Crawler Crane', '80 ton', '80-ton'),
    ('Crawler Crane', '100 ton', '100-ton'),
    ('Crawler Crane', '150 ton', '150-ton'),
    ('Crawler Crane', '250 ton', '250-ton'),
    ('Tower Crane', '5 ton', '5-ton'),
    ('Tower Crane', '8 ton', '8-ton'),
    ('Tower Crane', '10 ton', '10-ton'),
    ('Tower Crane', '16 ton', '16-ton')
) as sizes(parent_name, size_name, size_slug)
join public.equipment_categories parent on lower(parent.name) = lower(sizes.parent_name)
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = parent.id and lower(existing.name) = lower(sizes.size_name)
)
and not exists (
  select 1 from public.equipment_categories existing
  where existing.slug = left(parent.slug || '-' || sizes.size_slug, 48)
);
