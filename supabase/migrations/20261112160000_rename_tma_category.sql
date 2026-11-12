-- The catalogue category is named TMA. The extra equipment row with the same name is removed.

delete from public.equipment_categories child
using public.equipment_categories purpose
where child.parent_id = purpose.id
  and purpose.parent_id is null
  and lower(purpose.name) = 'tma truck mounted attenuator'
  and lower(child.name) = 'tma'
  and not exists (select 1 from public.equipment equipment where equipment.category_id = child.id)
  and not exists (select 1 from public.supplier_catalogue listed where listed.category_id = child.id);

update public.equipment_categories category
set name = 'TMA',
  slug = 'tma'
where category.parent_id is null
  and lower(category.name) = 'tma truck mounted attenuator'
  and not exists (
    select 1 from public.equipment_categories existing
    where existing.slug = 'tma' and existing.id <> category.id
  );
