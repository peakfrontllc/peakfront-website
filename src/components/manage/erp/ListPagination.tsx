import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE, pageCount, pageItems } from "@/lib/erp/pagination";

export function ListPagination({
  page,
  total,
  hrefFor,
  pageSize = PAGE_SIZE,
}: {
  page: number;
  total: number;
  hrefFor: (page: number) => string;
  pageSize?: number;
}) {
  const count = pageCount(total, pageSize);
  if (count <= 1) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  const linkClass = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold";
  return (
    <nav className="flex flex-col gap-3 border-t border-navy/10 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4" aria-label="Pagination">
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-navy">{start}–{end}</span> of {total}
      </p>
      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} aria-label="Previous page" className={`${linkClass} border-navy/15 text-navy hover:border-amber`}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span aria-hidden className={`${linkClass} border-slate-200 text-slate-300`}>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
        <div className="hidden items-center gap-1.5 sm:flex">
          {pageItems(page, count).map((item, index) => item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-400">…</span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              aria-current={item === page ? "page" : undefined}
              className={`${linkClass} ${item === page ? "border-navy bg-navy text-white" : "border-navy/15 text-navy hover:border-amber"}`}
            >
              {item}
            </Link>
          ))}
        </div>
        <span className="min-w-24 text-center text-sm font-semibold text-navy sm:hidden">
          Page {page} of {count}
        </span>
        {page < count ? (
          <Link href={hrefFor(page + 1)} aria-label="Next page" className={`${linkClass} border-navy/15 text-navy hover:border-amber`}>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span aria-hidden className={`${linkClass} border-slate-200 text-slate-300`}>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
