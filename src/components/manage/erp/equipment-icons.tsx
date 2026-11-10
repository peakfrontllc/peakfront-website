import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  CircleDot,
  Construction,
  Container,
  Drill,
  Droplets,
  Forklift,
  HardHat,
  MoveVertical,
  Shovel,
  TowerControl,
  Tractor,
  Truck,
  Warehouse,
  Zap,
} from "lucide-react";

const RULES: [RegExp, LucideIcon][] = [
  [/tower/, TowerControl],
  [/crane|boom truck/, Construction],
  [/scissor|boom lift|manlift|spider|mast lift|\blift\b|access/, MoveVertical],
  [/excavator|backhoe|trencher/, Shovel],
  [/bulldozer|dozer|loader|grader|earth|dump/, Tractor],
  [/forklift|telehandler|pallet|reach stacker|material/, Forklift],
  [/roller|compactor|compaction/, CircleDot],
  [/generator|welder|compressor|light|power|lighting/, Zap],
  [/pump|water/, Droplets],
  [/truck|trailer|pickup|tanker|lowbed|haul|tipper|transport|bus/, Truck],
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
