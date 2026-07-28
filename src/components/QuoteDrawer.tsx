"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/constants";
import { buildWhatsAppMessage, type QuoteFormPayload } from "@/lib/quote-email";
import { useQuoteDrawer } from "./QuoteDrawerProvider";

type FormData = QuoteFormPayload;

const emptyForm: FormData = {
  company: "",
  contact: "",
  phone: "",
  email: "",
  equipment: "",
  quantity: "",
  duration: "",
  location: "",
  message: "",
};

function createInitialForm(prefilledEquipment: string): FormData {
  return { ...emptyForm, equipment: prefilledEquipment };
}

function QuoteDrawerForm({
  prefilledEquipment,
}: {
  prefilledEquipment: string;
}) {
  const [form, setForm] = useState(() => createInitialForm(prefilledEquipment));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const submittingRef = useRef(false);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setError("");
    setSubmitting(true);

    const submissionId = crypto.randomUUID();
    const whatsappMessage = buildWhatsAppMessage(form);
    setWhatsappUrl(buildWhatsAppUrl(whatsappMessage));

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Quote-Submission-Id": submissionId,
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not send your request.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not send your request. Try WhatsApp instead.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col overflow-y-auto px-7 py-7"
    >
      {!submitted ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="qf-company"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Company Name
              </label>
              <input
                id="qf-company"
                type="text"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                className="mt-2 w-full border border-navy/15 px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-blue"
              />
            </div>
            <div>
              <label
                htmlFor="qf-contact"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Contact Person
              </label>
              <input
                id="qf-contact"
                type="text"
                value={form.contact}
                onChange={(e) => updateField("contact", e.target.value)}
                className="mt-2 w-full border border-navy/15 px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-blue"
              />
            </div>
            <div>
              <label
                htmlFor="qf-phone"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Phone
              </label>
              <input
                id="qf-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="mt-2 w-full border border-navy/15 px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-blue"
              />
            </div>
            <div>
              <label
                htmlFor="qf-email"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Email
              </label>
              <input
                id="qf-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-2 w-full border border-navy/15 px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-blue"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="qf-equipment"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Equipment Required
              </label>
              <input
                id="qf-equipment"
                type="text"
                value={form.equipment}
                onChange={(e) => updateField("equipment", e.target.value)}
                className="mt-2 w-full border border-navy/15 px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-blue"
              />
            </div>
            <div>
              <label
                htmlFor="qf-quantity"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Quantity
              </label>
              <input
                id="qf-quantity"
                type="text"
                value={form.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                className="mt-2 w-full border border-navy/15 px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-blue"
              />
            </div>
            <div>
              <label
                htmlFor="qf-duration"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Rental Duration
              </label>
              <input
                id="qf-duration"
                type="text"
                placeholder="e.g. 3 months"
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                className="mt-2 w-full border border-navy/15 px-3.5 py-2.5 text-sm text-navy placeholder:text-slate-400 outline-none transition-colors focus:border-blue"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="qf-location"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Project Location
              </label>
              <input
                id="qf-location"
                type="text"
                placeholder="e.g. Mussafah, Abu Dhabi"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="mt-2 w-full border border-navy/15 px-3.5 py-2.5 text-sm text-navy placeholder:text-slate-400 outline-none transition-colors focus:border-blue"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="qf-message"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
              >
                Message
              </label>
              <textarea
                id="qf-message"
                rows={4}
                placeholder="Scope, mobilisation dates, operator requirement..."
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="mt-2 w-full resize-y border border-navy/15 px-3.5 py-2.5 text-sm text-navy placeholder:text-slate-400 outline-none transition-colors focus:border-blue"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full bg-amber py-3.5 text-center text-sm font-bold uppercase tracking-wider text-navy transition-colors hover:bg-[#e0900d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Submit Request"}
          </button>
        </>
      ) : (
        <div className="mt-6 border border-blue/20 bg-blue/5 px-5 py-4 text-sm leading-relaxed text-navy">
          Thanks — your quote request has been sent to our rental desk. We
          typically respond within one business hour.
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 border border-whatsapp py-3 text-center text-xs font-bold uppercase tracking-wider text-whatsapp transition-colors hover:bg-whatsapp hover:text-white"
          >
            Or follow up on WhatsApp
          </a>
        </div>
      )}
    </form>
  );
}

export default function QuoteDrawer() {
  const { isOpen, closeQuoteDrawer, prefilledEquipment, openSession } =
    useQuoteDrawer();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeQuoteDrawer();
        return;
      }

      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeQuoteDrawer]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-navy/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeQuoteDrawer}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-drawer-title"
        className={`fixed right-0 top-0 z-[101] flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-navy/10 px-7 pb-6 pt-7">
          <div>
            <h2
              id="quote-drawer-title"
              className="font-display text-2xl font-extrabold tracking-tight text-navy"
            >
              Request a Quote
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              Send your requirement and our team responds with pricing and
              availability, usually within one business hour.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeQuoteDrawer}
            aria-label="Close quote drawer"
            className="mt-1 shrink-0 text-slate-400 transition-colors hover:text-navy"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isOpen && (
          <QuoteDrawerForm
            key={openSession}
            prefilledEquipment={prefilledEquipment}
          />
        )}
      </aside>
    </>
  );
}
