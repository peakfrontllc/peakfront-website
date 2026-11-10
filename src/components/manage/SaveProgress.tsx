"use client";

import { useEffect, useState } from "react";

function requestUrl(input: RequestInfo | URL) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function isSameOriginPost(input: RequestInfo | URL, init?: RequestInit) {
  const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  if (method !== "POST") return false;
  try {
    const url = new URL(requestUrl(input), window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

export function SaveProgress() {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let waiting = 0;
    const buttons = new Set<HTMLButtonElement>();

    const show = (visible: boolean) => {
      setSaving(visible);
      document.body.toggleAttribute("data-saving", visible);
    };

    const restoreButtons = () => {
      buttons.forEach((button) => {
        button.classList.remove("is-saving");
        if (button.dataset.saveLabel !== undefined) {
          button.textContent = button.dataset.saveLabel;
          delete button.dataset.saveLabel;
        }
      });
      buttons.clear();
    };

    const onSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || event.defaultPrevented) return;
      const action = form.getAttribute("action") ?? "";
      const saves = action.startsWith("javascript:") || form.method.toLowerCase() === "post";
      if (!saves) return;
      waiting += 1;
      show(true);
      const submitter = (event as SubmitEvent).submitter;
      if (submitter instanceof HTMLButtonElement && !buttons.has(submitter)) {
        buttons.add(submitter);
        queueMicrotask(() => {
          if (!submitter.isConnected) return;
          submitter.dataset.saveLabel = submitter.textContent ?? "";
          submitter.textContent = "Saving…";
          submitter.classList.add("is-saving");
        });
      }
    };

    const original = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const tracked = waiting > 0 && isSameOriginPost(input, init);
      try {
        return await original(input, init);
      } finally {
        if (tracked) {
          waiting = Math.max(0, waiting - 1);
          if (waiting === 0) {
            restoreButtons();
            show(false);
          }
        }
      }
    };

    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("submit", onSubmit, true);
      window.fetch = original;
      document.body.removeAttribute("data-saving");
    };
  }, []);

  if (!saving) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100]"
      role="status"
      aria-live="polite"
      data-save-progress
    >
      <span className="sr-only">Saving</span>
      <div className="h-1 overflow-hidden bg-navy/15">
        <div className="save-progress-bar h-full w-1/3 bg-amber" />
      </div>
    </div>
  );
}
