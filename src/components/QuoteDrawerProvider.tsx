"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type QuoteDrawerContextValue = {
  isOpen: boolean;
  openSession: number;
  openQuoteDrawer: (equipmentName?: string) => void;
  closeQuoteDrawer: () => void;
  prefilledEquipment: string;
  setTriggerElement: (el: HTMLElement | null) => void;
};

const QuoteDrawerContext = createContext<QuoteDrawerContextValue | null>(null);

export function QuoteDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSession, setOpenSession] = useState(0);
  const [prefilledEquipment, setPrefilledEquipment] = useState("");
  const triggerRef = useRef<HTMLElement | null>(null);

  const openQuoteDrawer = useCallback((equipmentName?: string) => {
    setPrefilledEquipment(equipmentName ?? "");
    setOpenSession((session) => session + 1);
    setIsOpen(true);
  }, []);

  const closeQuoteDrawer = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const setTriggerElement = useCallback((el: HTMLElement | null) => {
    triggerRef.current = el;
  }, []);

  return (
    <QuoteDrawerContext.Provider
      value={{
        isOpen,
        openSession,
        openQuoteDrawer,
        closeQuoteDrawer,
        prefilledEquipment,
        setTriggerElement,
      }}
    >
      {children}
    </QuoteDrawerContext.Provider>
  );
}

export function useQuoteDrawer() {
  const context = useContext(QuoteDrawerContext);
  if (!context) {
    throw new Error("useQuoteDrawer must be used within QuoteDrawerProvider");
  }
  return context;
}
