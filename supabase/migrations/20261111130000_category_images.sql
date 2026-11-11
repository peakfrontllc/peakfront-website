-- Optional photo for a main category or an equipment type.

alter table public.equipment_categories
  add column if not exists image_path text;
