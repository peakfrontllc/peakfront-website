-- Client equipment needs come from the catalogue (a whole category or a type), not from available machines.

alter table public.client_equipment_interests
  add column if not exists category_id uuid references public.equipment_categories (id) on delete cascade;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'client_equipment_interests'
      and column_name = 'equipment_id'
  ) then
    update public.client_equipment_interests interest
    set category_id = case
      when grandparent.id is not null then parent.id
      else category.id
    end
    from public.equipment machine
    join public.equipment_categories category on category.id = machine.category_id
    left join public.equipment_categories parent on parent.id = category.parent_id
    left join public.equipment_categories grandparent on grandparent.id = parent.parent_id
    where machine.id = interest.equipment_id
      and interest.category_id is null;

    delete from public.client_equipment_interests interest
    using public.client_equipment_interests keeper
    where interest.client_id = keeper.client_id
      and interest.category_id = keeper.category_id
      and interest.category_id is not null
      and interest.id <> keeper.id
      and (
        interest.typical_quantity < keeper.typical_quantity
        or (interest.typical_quantity = keeper.typical_quantity and interest.created_at > keeper.created_at)
        or (interest.typical_quantity = keeper.typical_quantity and interest.created_at = keeper.created_at and interest.id > keeper.id)
      );

    delete from public.client_equipment_interests where category_id is null;

    alter table public.client_equipment_interests drop constraint if exists client_equipment_interests_client_id_equipment_id_key;
    alter table public.client_equipment_interests drop column equipment_id;
  end if;
end $$;

alter table public.client_equipment_interests
  alter column category_id set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'client_equipment_interests_client_category_key'
  ) then
    alter table public.client_equipment_interests
      add constraint client_equipment_interests_client_category_key unique (client_id, category_id);
  end if;
end $$;

notify pgrst, 'reload schema';
