"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/lib/content";

function SectionKicker({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-[2px] w-8 bg-amber" />
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
        {label}
      </span>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
        <div className="max-w-2xl">
          <SectionKicker label="FAQ" />
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Answers for procurement teams
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Still need detail? Our rental desk answers technical and commercial
            questions directly.
          </p>
        </div>

        <div className="w-full">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="border-b border-navy/10"
              >
                <h3 className="flex">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="flex flex-1 items-center justify-between py-5 text-left text-base font-bold text-navy transition-all hover:text-blue sm:py-6"
                  >
                    {faq.question}
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  className="grid transition-[grid-template-rows] duration-350 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
