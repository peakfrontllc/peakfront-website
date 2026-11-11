-- Length in metres for trucks, trailers, and recovery trucks.
-- Capacity stays ton, cab, or gallons. Length is a separate list used on Add Equipment.

alter table public.equipment_categories
  drop constraint if exists equipment_categories_kind_check;

alter table public.equipment_categories
  add constraint equipment_categories_kind_check check (kind in ('capacity', 'boom', 'length'));

insert into public.equipment_categories (name, slug, parent_id, tonnage, description, kind)
select sizes.size_name, left(parent.slug || '-' || sizes.size_slug, 80), parent.id, '', '', 'length'
from (
  values
    ('Transport', 'Pickup Truck', '4.2 m', '4-2-m-length'),
    ('Transport', 'Pickup Truck', '5 m', '5-m-length'),
    ('Transport', 'Pickup Truck', '6 m', '6-m-length'),
    ('Transport', 'Dyna Truck', '4.2 m', '4-2-m-length'),
    ('Transport', 'Dyna Truck', '6 m', '6-m-length'),
    ('Transport', 'Dyna Truck', '7 m', '7-m-length'),
    ('Transport', 'Dyna Truck', '9 m', '9-m-length'),
    ('Transport', 'Tipper Truck', '6 m', '6-m-length'),
    ('Transport', 'Tipper Truck', '7 m', '7-m-length'),
    ('Transport', 'Tipper Truck', '9 m', '9-m-length'),
    ('Transport', 'Tipper Truck', '12 m', '12-m-length'),
    ('Transport', 'Flatbed Truck', '6 m', '6-m-length'),
    ('Transport', 'Flatbed Truck', '7 m', '7-m-length'),
    ('Transport', 'Flatbed Truck', '9 m', '9-m-length'),
    ('Transport', 'Flatbed Truck', '12 m', '12-m-length'),
    ('Transport', 'Dump Truck', '6 m', '6-m-length'),
    ('Transport', 'Dump Truck', '7 m', '7-m-length'),
    ('Transport', 'Dump Truck', '9 m', '9-m-length'),
    ('Transport', 'Dump Truck', '12 m', '12-m-length'),
    ('Transport', 'Recovery Truck', '6 m', '6-m-length'),
    ('Transport', 'Recovery Truck', '8 m', '8-m-length'),
    ('Transport', 'Recovery Truck', '10 m', '10-m-length'),
    ('Transport', 'Recovery Truck', '12 m', '12-m-length'),
    ('Transport', 'Low Bed Trailer', '12 m', '12-m-length'),
    ('Transport', 'Low Bed Trailer', '13.5 m', '13-5-m-length'),
    ('Transport', 'Low Bed Trailer', '15 m', '15-m-length'),
    ('Transport', 'Low Bed Trailer', '16 m', '16-m-length'),
    ('Transport', 'Low Bed Trailer', '18 m', '18-m-length'),
    ('Transport', 'Low Bed Trailer', '20 m', '20-m-length'),
    ('Transport', 'Low Bed Trailer', '24 m', '24-m-length')
) as sizes(purpose_name, parent_name, size_name, size_slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = lower(sizes.purpose_name)
join public.equipment_categories parent
  on parent.parent_id = purpose.id and lower(parent.name) = lower(sizes.parent_name)
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = parent.id and lower(existing.name) = lower(sizes.size_name) and existing.kind = 'length'
)
and not exists (
  select 1 from public.equipment_categories existing
  where existing.slug = left(parent.slug || '-' || sizes.size_slug, 80)
);
