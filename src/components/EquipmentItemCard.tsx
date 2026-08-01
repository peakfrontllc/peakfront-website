import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import QuoteButton from "@/components/QuoteButton";
import type { EquipmentItem } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/constants";
import {
  getRentalPagePath,
  getRentalSlugForEquipmentId,
} from "@/lib/rental-pages";

type EquipmentItemCardProps = {
  item: EquipmentItem;
};

export default function EquipmentItemCard({ item }: EquipmentItemCardProps) {
  const rentalSlug = getRentalSlugForEquipmentId(item.id);
  const rentalPath = rentalSlug ? getRentalPagePath(rentalSlug) : undefined;

  return (
    <article className="group flex flex-col border border-navy/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-32px_rgba(11,37,69,0.4)]">
      {rentalPath ? (
        <Link href={rentalPath} className="relative block h-44 overflow-hidden bg-navy">
          <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-110">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <span className="absolute left-4 top-4 bg-amber px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-navy">
            Available
          </span>
        </Link>
      ) : (
        <div className="relative h-44 overflow-hidden bg-navy">
          <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-110">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <span className="absolute left-4 top-4 bg-amber px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-navy">
            Available
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue">
          {item.category}
        </span>
        {rentalPath ? (
          <Link href={rentalPath}>
            <h3 className="mt-2 text-lg font-bold leading-snug text-navy transition-colors hover:text-blue">
              {item.name}
            </h3>
          </Link>
        ) : (
          <h3 className="mt-2 text-lg font-bold leading-snug text-navy">
            {item.name}
          </h3>
        )}
        <dl className="mt-4 space-y-1.5 border-y border-slate-100 py-4">
          {item.specs.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-3 text-xs">
              <dt className="text-slate-500">{key}</dt>
              <dd className="font-mono font-medium text-navy">{value}</dd>
            </div>
          ))}
        </dl>
        <dl className="mt-4 space-y-1.5">
          {item.rates.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-3 text-xs">
              <dt className="uppercase tracking-wider text-slate-500">{key}</dt>
              <dd className="font-mono font-bold text-navy">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 space-y-2">
          {rentalPath ? (
            <Link
              href={rentalPath}
              className="flex w-full min-h-11 items-center justify-center gap-2 border border-navy/15 py-3.5 text-xs font-bold uppercase tracking-wider text-navy transition-colors hover:border-blue hover:text-blue"
            >
              View rental details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
          <QuoteButton
            equipmentName={item.name}
            className="block w-full bg-navy py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue min-h-11"
          >
            Request Quote
          </QuoteButton>
          <a
            href={buildWhatsAppUrl(
              `Hello Peakfront, I need equipment for my project. Item: ${item.name}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full min-h-11 items-center justify-center gap-2 border border-navy/15 py-3.5 text-xs font-bold uppercase tracking-wider text-navy transition-colors hover:border-whatsapp hover:text-whatsapp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
