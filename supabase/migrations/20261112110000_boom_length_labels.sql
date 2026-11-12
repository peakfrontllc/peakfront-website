-- Boom lengths are written as "30 m boom", matching the catalogue.
update public.equipment_categories
set name = regexp_replace(btrim(name), '^(\d+(?:\.\d+)?)\s*m(?:\s*boom)?$', '\1 m boom', 'i')
where kind = 'boom'
  and name ~* '^\d+(?:\.\d+)?\s*m(?:\s*boom)?$'
  and name !~ '^\d+(?:\.\d+)? m boom$';

update public.equipment
set boom_length = regexp_replace(btrim(boom_length), '^(\d+(?:\.\d+)?)\s*m(?:\s*boom)?$', '\1 m boom', 'i')
where boom_length ~* '^\d+(?:\.\d+)?\s*m(?:\s*boom)?$'
  and boom_length !~ '^\d+(?:\.\d+)? m boom$';
