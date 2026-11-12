-- TMA Truck Mounted Attenuator is its own catalogue category.
-- The equipment type under it is TMA, so staff can select the whole category or the machine.

insert into public.equipment_categories (name, slug, description, tonnage)
select 'TMA Truck Mounted Attenuator', 'tma-truck-mounted-attenuator', '', ''
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id is null and lower(existing.name) = 'tma truck mounted attenuator'
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = 'tma-truck-mounted-attenuator'
);

insert into public.equipment_categories (name, slug, description, tonnage, parent_id)
select 'TMA', 'tma', '', '', purpose.id
from public.equipment_categories purpose
where purpose.parent_id is null and lower(purpose.name) = 'tma truck mounted attenuator'
  and not exists (
    select 1 from public.equipment_categories existing
    where existing.parent_id = purpose.id and lower(existing.name) = 'tma'
  )
  and not exists (
    select 1 from public.equipment_categories existing where existing.slug = 'tma'
  );
