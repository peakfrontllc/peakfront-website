-- Boom length for cranes and access booms, and deck length for trailers and trucks.
-- Existing metre sizes on boom lifts are copied across so those records already show a boom length.

alter table public.equipment
  add column if not exists boom_length text not null default '',
  add column if not exists bed_length text not null default '';

update public.equipment equipment
set boom_length = size.name
from public.equipment_categories size
join public.equipment_categories type on type.id = size.parent_id
left join public.equipment_categories purpose on purpose.id = type.parent_id
where equipment.category_id = size.id
  and equipment.boom_length = ''
  and size.name ~ '^[0-9]+(\.[0-9]+)? m$'
  and (
    lower(coalesce(purpose.name, '')) like '%lifting%'
    or (
      lower(coalesce(purpose.name, '')) like '%access%'
      and lower(type.name) ~ '(boom|spider)'
      and lower(type.name) !~ '(scissor|mast)'
    )
    or lower(type.name) ~ '(crane|boom truck)'
  );
