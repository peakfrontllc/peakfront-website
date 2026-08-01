import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getRentalPagePath } from "@/lib/rental-pages";

type RentalEquipmentCardProps = {
  slug?: string;
  href?: string;
  title: string;
  image: string;
  imageAlt: string;
};

export default function RentalEquipmentCard({
  slug,
  href,
  title,
  image,
  imageAlt,
}: RentalEquipmentCardProps) {
  const linkHref = href ?? (slug ? getRentalPagePath(slug) : "/");

  return (
    <Link
      href={linkHref}
      className="group flex min-h-[11rem] flex-col overflow-hidden border border-navy/10 bg-white transition-all duration-500 active:scale-[0.99] sm:hover:-translate-y-1 sm:hover:border-blue/30 sm:hover:shadow-[0_24px_60px_-30px_rgba(11,37,69,0.35)]"
    >
      <div className="relative h-48 overflow-hidden bg-navy sm:h-44">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 p-4 sm:p-5">
        <h3 className="text-sm font-bold leading-snug text-navy sm:text-base">
          {title}
        </h3>
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-navy/10 text-navy transition-colors group-hover:border-amber group-hover:text-amber sm:h-9 sm:w-9">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
