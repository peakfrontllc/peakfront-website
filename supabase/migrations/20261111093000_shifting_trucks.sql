-- Trucks that shift material, separate from tankers, cranes, and low beds.
-- Dyna is the light truck. Tipper, flatbed, dump, and pickup move here from the other groups.

insert into public.equipment_categories (name, slug, description, tonnage)
select 'Shifting Trucks', 'shifting-trucks', '', ''
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id is null and lower(existing.name) = 'shifting trucks'
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = 'shifting-trucks'
);

update public.equipment_categories truck
set parent_id = shifting.id
from public.equipment_categories shifting
where shifting.parent_id is null
  and shifting.name = 'Shifting Trucks'
  and truck.name in ('Tipper Truck', 'Flatbed Truck', 'Dump Truck', 'Pickup Truck')
  and exists (
    select 1 from public.equipment_categories purpose
    where purpose.id = truck.parent_id and purpose.parent_id is null
  );

insert into public.equipment_categories (name, slug, description, tonnage, parent_id)
select 'Dyna Truck', 'dyna-truck', '', '', shifting.id
from public.equipment_categories shifting
where shifting.parent_id is null and shifting.name = 'Shifting Trucks'
  and not exists (
    select 1 from public.equipment_categories existing
    where existing.parent_id = shifting.id and lower(existing.name) = 'dyna truck'
  )
  and not exists (
    select 1 from public.equipment_categories existing where existing.slug = 'dyna-truck'
  );

insert into public.equipment_categories (name, slug, parent_id, tonnage, description)
select sizes.size_name, left(parent.slug || '-' || sizes.size_slug, 80), parent.id, sizes.size_name, ''
from (
  values
    ('2 ton', '2-ton'),
    ('3 ton', '3-ton'),
    ('4 ton', '4-ton'),
    ('5 ton', '5-ton')
) as sizes(size_name, size_slug)
join public.equipment_categories shifting
  on shifting.parent_id is null and shifting.name = 'Shifting Trucks'
join public.equipment_categories parent
  on parent.parent_id = shifting.id and parent.name = 'Dyna Truck'
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = parent.id and lower(existing.name) = lower(sizes.size_name)
)
and not exists (
  select 1 from public.equipment_categories existing
  where existing.slug = left(parent.slug || '-' || sizes.size_slug, 80)
);
