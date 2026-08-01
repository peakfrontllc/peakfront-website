import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type RentalBreadcrumbsProps = {
  items: Crumb[];
  align?: "left" | "center";
};

export default function RentalBreadcrumbs({
  items,
  align = "left",
}: RentalBreadcrumbsProps) {
  const alignClass =
    align === "center" ? "justify-center sm:justify-center" : "justify-start";

  return (
    <nav
      aria-label="Breadcrumb"
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60 sm:text-xs sm:tracking-[0.16em]"
    >
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1.5 ${alignClass}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex max-w-full items-center gap-2"
            >
              {index > 0 ? (
                <span aria-hidden="true" className="text-white/40">
                  /
                </span>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="touch-target inline-flex items-center py-1 transition-colors hover:text-amber"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`py-1 text-white/85 ${isLast ? "line-clamp-2 sm:line-clamp-none" : ""}`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
