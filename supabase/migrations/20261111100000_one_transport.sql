-- One Transport category: shifting trucks go back with the tankers, low beds, and recovery trucks.

update public.equipment_categories transport
set name = 'Transport'
where transport.parent_id is null
  and transport.name = 'Transport and Haulage';

update public.equipment_categories truck
set parent_id = transport.id
from public.equipment_categories transport
where transport.parent_id is null
  and transport.name = 'Transport'
  and truck.parent_id in (
    select shifting.id
    from public.equipment_categories shifting
    where shifting.parent_id is null
      and shifting.name = 'Shifting Trucks'
  );

delete from public.equipment_categories shifting
where shifting.parent_id is null
  and shifting.name = 'Shifting Trucks'
  and not exists (
    select 1 from public.equipment_categories child where child.parent_id = shifting.id
  )
  and not exists (
    select 1 from public.equipment equipment where equipment.category_id = shifting.id
  );
