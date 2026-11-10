"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SaveProgress } from "@/components/manage/SaveProgress";

export function SiteFrame({
  children,
  header,
  footer,
  extras,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  extras: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/manage")) {
    return (
      <>
        <SaveProgress />
        {children}
      </>
    );
  }

  return (
    <>
      <SaveProgress />
      {header}
      <main id="main-content" className="pb-20 sm:pb-0">
        {children}
      </main>
      {footer}
      {extras}
    </>
  );
}
