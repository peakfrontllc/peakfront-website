import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Bus,
  CircleDot,
  Construction,
  Container,
  Drill,
  Droplets,
  Fuel,
  Forklift,
  GlassWater,
  HardHat,
  MoveVertical,
  Shovel,
  TowerControl,
  Tractor,
  Truck,
  Warehouse,
  Zap,
  Biohazard,
  Droplet,
} from "lucide-react";

const RULES: [RegExp, LucideIcon][] = [
  [/sweet water|potable/, GlassWater],
  [/salt water/, Droplets],
  [/sewage|sewer|sewerage/, Biohazard],
  [/drain|drainage/, Droplet],
  [/tower/, TowerControl],
  [/boom truck|crane/, Construction],
  [/spider|scissor|boom lift|manlift|mast lift|\blift\b|access/, MoveVertical],
  [/excavator|backhoe|trencher/, Shovel],
  [/attenuator|\btma\b|dump truck|tipper|flatbed|dyna|pickup|shifting|truck|trailer|lowbed|haul|recovery|transport/, Truck],
  [/bulldozer|dozer|loader|grader|dump|earth/, Tractor],
  [/reach stacker|forklift|telehandler|pallet|material/, Forklift],
  [/plate compactor|rammer|roller|compactor|compaction/, CircleDot],
  [/weld|generator|welder|compressor|light|power|lighting/, Zap],
  [/fuel/, Fuel],
  [/pump|water|tanker/, Droplets],
  [/bus/, Bus],
  [/scaffold/, Warehouse],
  [/container/, Container],
  [/drill|breaker|hammer/, Drill],
];

export function equipmentIcon(name: string): LucideIcon {
  const text = name.toLowerCase();
  return RULES.find(([pattern]) => pattern.test(text))?.[1] ?? (text.includes("equip") ? Boxes : HardHat);
}

export function EquipmentMark({
  name,
  active = false,
}: {
  name: string;
  active?: boolean;
}) {
  const Icon = equipmentIcon(name);
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? "bg-amber text-navy" : "bg-slate-100 text-navy"}`}>
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );
}
