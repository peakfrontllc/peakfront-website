-- Dewatering pumps for excavation and groundwater control.
-- Sizes match the hire range used on site: 4, 6, 8, and 12 inch.

insert into public.equipment_categories (name, slug, description, tonnage, parent_id)
select 'Dewatering Pump', 'dewatering-pump', '', '', purpose.id
from public.equipment_categories purpose
where purpose.parent_id is null
  and purpose.name = 'Power and Site Services'
  and not exists (
    select 1 from public.equipment_categories existing
    where existing.parent_id = purpose.id and lower(existing.name) = 'dewatering pump'
  )
  and not exists (
    select 1 from public.equipment_categories existing where existing.slug = 'dewatering-pump'
  );

insert into public.equipment_categories (name, slug, parent_id, tonnage, description)
select sizes.size_name, left(parent.slug || '-' || sizes.size_slug, 80), parent.id, sizes.size_name, ''
from (
  values
    ('4 inch', '4-inch'),
    ('6 inch', '6-inch'),
    ('8 inch', '8-inch'),
    ('12 inch', '12-inch')
) as sizes(size_name, size_slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and purpose.name = 'Power and Site Services'
join public.equipment_categories parent
  on parent.parent_id = purpose.id and parent.name = 'Dewatering Pump'
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = parent.id and lower(existing.name) = lower(sizes.size_name)
)
and not exists (
  select 1 from public.equipment_categories existing
  where existing.slug = left(parent.slug || '-' || sizes.size_slug, 80)
);
