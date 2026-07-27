"use client";

import { useEffect } from "react";

export default function HydrationMarker() {
  useEffect(() => {
    document.documentElement.classList.add("hydrated");
  }, []);

  return null;
}
