alter table public.suppliers
  add column if not exists emirates text[] not null default '{}';

update public.suppliers
set emirates = array[emirate]
where emirates = '{}'
  and emirate in (
    'Abu Dhabi',
    'Dubai',
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah'
  );
