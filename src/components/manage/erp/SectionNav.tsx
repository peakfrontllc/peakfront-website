"use client";

export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="sticky top-14 z-20 -mx-4 mb-5 border-b border-slate-200/80 bg-[#f4f6f8]/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex gap-1 overflow-x-auto py-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => {
              if (window.location.hash === `#${item.id}`) {
                window.dispatchEvent(new HashChangeEvent("hashchange"));
              }
            }}
            className="shrink-0 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-navy shadow-sm ring-1 ring-navy/10 hover:bg-navy hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
