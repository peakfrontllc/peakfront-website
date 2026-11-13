-- Split Transport into Water Tankers, Fuel Tankers, Buses, Trucks, and Recovery.
-- Types keep their sizes. 55 seater replaces 50 seater. 35 seater folds into 30 seater.

insert into public.equipment_categories (name, slug, description, tonnage)
select seed.name, seed.slug, '', ''
from (
  values
    ('Water Tankers', 'water-tankers'),
    ('Fuel Tankers', 'fuel-tankers'),
    ('Buses', 'buses'),
    ('Trucks', 'trucks'),
    ('Recovery', 'recovery')
) as seed(name, slug)
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id is null and lower(existing.name) = lower(seed.name)
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = seed.slug
);

update public.equipment_categories type
set parent_id = purpose.id
from (
  values
    ('Water Tankers', 'Sweet Water Tanker'),
    ('Water Tankers', 'Salt Water Tanker'),
    ('Water Tankers', 'Sewage Tanker'),
    ('Fuel Tankers', 'Diesel Tanker'),
    ('Fuel Tankers', 'Fuel Tanker'),
    ('Buses', 'Bus'),
    ('Trucks', 'Pickup Truck'),
    ('Trucks', 'Dyna Truck'),
    ('Trucks', 'Tipper Truck'),
    ('Trucks', 'Flatbed Truck'),
    ('Trucks', 'Dump Truck'),
    ('Trucks', 'Low Bed Trailer'),
    ('Recovery', 'Recovery Truck')
) as move(purpose_name, type_name)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = lower(move.purpose_name)
join public.equipment_categories transport
  on transport.parent_id is null and lower(transport.name) = 'transport'
where type.parent_id = transport.id
  and lower(type.name) = lower(move.type_name);

insert into public.equipment_categories (name, slug, description, tonnage, parent_id, kind)
select seed.name, seed.slug, '', seed.name, bus.id, 'capacity'
from (
  values
    ('55 seater', '55-seater'),
    ('66 seater', '66-seater')
) as seed(name, slug)
join public.equipment_categories bus
  on lower(bus.name) = 'bus'
join public.equipment_categories purpose
  on purpose.id = bus.parent_id and purpose.parent_id is null and lower(purpose.name) = 'buses'
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = bus.id and lower(existing.name) = lower(seed.name)
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = seed.slug
);

update public.equipment machine
set category_id = target.id,
    name = case when lower(machine.name) = '50 seater' then '55 seater' else machine.name end,
    capacity = case when lower(machine.capacity) = '50 seater' then '55 seater' else machine.capacity end
from public.equipment_categories source
join public.equipment_categories bus on bus.id = source.parent_id and lower(bus.name) = 'bus'
join public.equipment_categories target on target.parent_id = bus.id and lower(target.name) = '55 seater'
where machine.category_id = source.id
  and lower(source.name) = '50 seater';

delete from public.supplier_catalogue listed
using public.equipment_categories source
join public.equipment_categories bus on bus.id = source.parent_id and lower(bus.name) = 'bus'
join public.equipment_categories target on target.parent_id = bus.id and lower(target.name) = '55 seater'
where listed.category_id = source.id
  and lower(source.name) = '50 seater'
  and exists (
    select 1 from public.supplier_catalogue other
    where other.supplier_id = listed.supplier_id and other.category_id = target.id
  );

update public.supplier_catalogue listed
set category_id = target.id
from public.equipment_categories source
join public.equipment_categories bus on bus.id = source.parent_id and lower(bus.name) = 'bus'
join public.equipment_categories target on target.parent_id = bus.id and lower(target.name) = '55 seater'
where listed.category_id = source.id
  and lower(source.name) = '50 seater';

update public.equipment machine
set category_id = target.id,
    name = case when lower(machine.name) = '35 seater' then '30 seater' else machine.name end,
    capacity = case when lower(machine.capacity) = '35 seater' then '30 seater' else machine.capacity end
from public.equipment_categories source
join public.equipment_categories bus on bus.id = source.parent_id and lower(bus.name) = 'bus'
join public.equipment_categories target on target.parent_id = bus.id and lower(target.name) = '30 seater'
where machine.category_id = source.id
  and lower(source.name) = '35 seater';

delete from public.supplier_catalogue listed
using public.equipment_categories source
join public.equipment_categories bus on bus.id = source.parent_id and lower(bus.name) = 'bus'
join public.equipment_categories target on target.parent_id = bus.id and lower(target.name) = '30 seater'
where listed.category_id = source.id
  and lower(source.name) = '35 seater'
  and exists (
    select 1 from public.supplier_catalogue other
    where other.supplier_id = listed.supplier_id and other.category_id = target.id
  );

update public.supplier_catalogue listed
set category_id = target.id
from public.equipment_categories source
join public.equipment_categories bus on bus.id = source.parent_id and lower(bus.name) = 'bus'
join public.equipment_categories target on target.parent_id = bus.id and lower(target.name) = '30 seater'
where listed.category_id = source.id
  and lower(source.name) = '35 seater';

delete from public.equipment_categories size
where lower(size.name) in ('35 seater', '50 seater')
  and exists (
    select 1 from public.equipment_categories bus
    where bus.id = size.parent_id and lower(bus.name) = 'bus'
  )
  and not exists (select 1 from public.equipment machine where machine.category_id = size.id)
  and not exists (select 1 from public.supplier_catalogue listed where listed.category_id = size.id)
  and not exists (select 1 from public.equipment_categories child where child.parent_id = size.id);

insert into public.supplier_catalogue (supplier_id, category_id)
select listed.supplier_id, purpose.id
from public.supplier_catalogue listed
join public.equipment_categories transport
  on transport.id = listed.category_id
  and transport.parent_id is null
  and lower(transport.name) = 'transport'
join public.equipment_categories purpose
  on purpose.parent_id is null
  and purpose.name in ('Water Tankers', 'Fuel Tankers', 'Buses', 'Trucks', 'Recovery')
where not exists (
  select 1 from public.supplier_catalogue other
  where other.supplier_id = listed.supplier_id and other.category_id = purpose.id
);

delete from public.supplier_catalogue listed
using public.equipment_categories transport
where listed.category_id = transport.id
  and transport.parent_id is null
  and lower(transport.name) = 'transport';

delete from public.equipment_categories transport
where transport.parent_id is null
  and lower(transport.name) = 'transport'
  and not exists (select 1 from public.equipment_categories child where child.parent_id = transport.id)
  and not exists (select 1 from public.equipment machine where machine.category_id = transport.id)
  and not exists (select 1 from public.supplier_catalogue listed where listed.category_id = transport.id);
