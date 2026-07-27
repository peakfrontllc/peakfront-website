"use client";

import { useQuoteDrawer } from "./QuoteDrawerProvider";

type QuoteButtonProps = {
  equipmentName?: string;
  children: React.ReactNode;
  className?: string;
};

export default function QuoteButton({
  equipmentName,
  children,
  className,
}: QuoteButtonProps) {
  const { openQuoteDrawer, setTriggerElement } = useQuoteDrawer();

  return (
    <button
      type="button"
      onClick={(e) => {
        setTriggerElement(e.currentTarget);
        openQuoteDrawer(equipmentName);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
