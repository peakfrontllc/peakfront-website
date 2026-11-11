-- More standard rental equipment, including sweet, drain, and sewage water tankers.
-- A type or capacity is added only when that name is missing under its parent.

insert into public.equipment_categories (name, slug, description, tonnage, parent_id)
select seed.name, seed.slug, '', '', purpose.id
from (
  values
    ('Earthmoving', 'Dump Truck', 'dump-truck'),
    ('Lifting and Cranes', 'Boom Truck', 'boom-truck'),
    ('Access Equipment', 'Spider Lift', 'spider-lift'),
    ('Access Equipment', 'Vertical Mast Lift', 'vertical-mast-lift'),
    ('Material Handling', 'Reach Stacker', 'reach-stacker'),
    ('Material Handling', 'Pallet Truck', 'pallet-truck'),
    ('Compaction', 'Plate Compactor', 'plate-compactor'),
    ('Compaction', 'Tamping Rammer', 'tamping-rammer'),
    ('Transport and Haulage', 'Sweet Water Tanker', 'sweet-water-tanker'),
    ('Transport and Haulage', 'Drain Water Tanker', 'drain-water-tanker'),
    ('Transport and Haulage', 'Sewage Tanker', 'sewage-tanker'),
    ('Transport and Haulage', 'Pickup Truck', 'pickup-truck'),
    ('Transport and Haulage', 'Recovery Truck', 'recovery-truck'),
    ('Power and Site Services', 'Welding Machine', 'welding-machine'),
    ('Power and Site Services', 'Scaffolding', 'scaffolding')
) as seed(purpose_name, name, slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = lower(seed.purpose_name)
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = purpose.id and lower(existing.name) = lower(seed.name)
)
and not exists (
  select 1 from public.equipment_categories existing where existing.slug = seed.slug
);

insert into public.equipment_categories (name, slug, parent_id, tonnage, description)
select sizes.size_name, left(parent.slug || '-' || sizes.size_slug, 80), parent.id, sizes.size_name, ''
from (
  values
    ('Earthmoving', 'Dump Truck', '15 ton', '15-ton'),
    ('Earthmoving', 'Dump Truck', '20 ton', '20-ton'),
    ('Earthmoving', 'Dump Truck', '25 ton', '25-ton'),
    ('Earthmoving', 'Dump Truck', '30 ton', '30-ton'),
    ('Earthmoving', 'Dump Truck', '40 ton', '40-ton'),
    ('Lifting and Cranes', 'Boom Truck', '8 ton', '8-ton'),
    ('Lifting and Cranes', 'Boom Truck', '10 ton', '10-ton'),
    ('Lifting and Cranes', 'Boom Truck', '16 ton', '16-ton'),
    ('Lifting and Cranes', 'Boom Truck', '20 ton', '20-ton'),
    ('Lifting and Cranes', 'Boom Truck', '25 ton', '25-ton'),
    ('Access Equipment', 'Spider Lift', '13 m', '13-m'),
    ('Access Equipment', 'Spider Lift', '15 m', '15-m'),
    ('Access Equipment', 'Spider Lift', '17 m', '17-m'),
    ('Access Equipment', 'Spider Lift', '20 m', '20-m'),
    ('Access Equipment', 'Spider Lift', '23 m', '23-m'),
    ('Access Equipment', 'Vertical Mast Lift', '6 m', '6-m'),
    ('Access Equipment', 'Vertical Mast Lift', '8 m', '8-m'),
    ('Access Equipment', 'Vertical Mast Lift', '10 m', '10-m'),
    ('Access Equipment', 'Vertical Mast Lift', '12 m', '12-m'),
    ('Material Handling', 'Reach Stacker', '10 ton', '10-ton'),
    ('Material Handling', 'Reach Stacker', '45 ton', '45-ton'),
    ('Material Handling', 'Pallet Truck', '2 ton', '2-ton'),
    ('Material Handling', 'Pallet Truck', '2.5 ton', '2-5-ton'),
    ('Material Handling', 'Pallet Truck', '3 ton', '3-ton'),
    ('Compaction', 'Plate Compactor', '60 kg', '60-kg'),
    ('Compaction', 'Plate Compactor', '90 kg', '90-kg'),
    ('Compaction', 'Plate Compactor', '120 kg', '120-kg'),
    ('Compaction', 'Plate Compactor', '300 kg', '300-kg'),
    ('Compaction', 'Plate Compactor', '500 kg', '500-kg'),
    ('Compaction', 'Tamping Rammer', '60 kg', '60-kg'),
    ('Compaction', 'Tamping Rammer', '70 kg', '70-kg'),
    ('Compaction', 'Tamping Rammer', '80 kg', '80-kg'),
    ('Transport and Haulage', 'Sweet Water Tanker', '1000 gal', '1000-gal'),
    ('Transport and Haulage', 'Sweet Water Tanker', '2000 gal', '2000-gal'),
    ('Transport and Haulage', 'Sweet Water Tanker', '3000 gal', '3000-gal'),
    ('Transport and Haulage', 'Sweet Water Tanker', '5000 gal', '5000-gal'),
    ('Transport and Haulage', 'Sweet Water Tanker', '10000 gal', '10000-gal'),
    ('Transport and Haulage', 'Drain Water Tanker', '2000 gal', '2000-gal'),
    ('Transport and Haulage', 'Drain Water Tanker', '5000 gal', '5000-gal'),
    ('Transport and Haulage', 'Drain Water Tanker', '8000 gal', '8000-gal'),
    ('Transport and Haulage', 'Drain Water Tanker', '10000 gal', '10000-gal'),
    ('Transport and Haulage', 'Sewage Tanker', '2000 gal', '2000-gal'),
    ('Transport and Haulage', 'Sewage Tanker', '4000 gal', '4000-gal'),
    ('Transport and Haulage', 'Sewage Tanker', '6000 gal', '6000-gal'),
    ('Transport and Haulage', 'Sewage Tanker', '10000 gal', '10000-gal'),
    ('Transport and Haulage', 'Pickup Truck', 'Single Cab', 'single-cab'),
    ('Transport and Haulage', 'Pickup Truck', 'Double Cab', 'double-cab'),
    ('Transport and Haulage', 'Recovery Truck', '3 ton', '3-ton'),
    ('Transport and Haulage', 'Recovery Truck', '5 ton', '5-ton'),
    ('Transport and Haulage', 'Recovery Truck', '8 ton', '8-ton'),
    ('Transport and Haulage', 'Recovery Truck', '10 ton', '10-ton'),
    ('Power and Site Services', 'Welding Machine', '300 A', '300-a'),
    ('Power and Site Services', 'Welding Machine', '400 A', '400-a'),
    ('Power and Site Services', 'Welding Machine', '500 A', '500-a'),
    ('Power and Site Services', 'Scaffolding', 'Cuplock', 'cuplock'),
    ('Power and Site Services', 'Scaffolding', 'Ringlock', 'ringlock'),
    ('Power and Site Services', 'Scaffolding', 'Frame', 'frame'),
    ('Power and Site Services', 'Scaffolding', 'Mobile Tower', 'mobile-tower')
) as sizes(purpose_name, parent_name, size_name, size_slug)
join public.equipment_categories purpose
  on purpose.parent_id is null and lower(purpose.name) = lower(sizes.purpose_name)
join public.equipment_categories parent
  on parent.parent_id = purpose.id and lower(parent.name) = lower(sizes.parent_name)
where not exists (
  select 1 from public.equipment_categories existing
  where existing.parent_id = parent.id and lower(existing.name) = lower(sizes.size_name)
)
and not exists (
  select 1 from public.equipment_categories existing
  where existing.slug = left(parent.slug || '-' || sizes.size_slug, 80)
);
