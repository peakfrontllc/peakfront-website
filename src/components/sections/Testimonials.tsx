"use client";

import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useCallback, useState } from "react";
import { testimonials } from "@/lib/content";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((nextIndex: number) => {
    setFade(false);
    setTimeout(() => {
      setIndex(nextIndex);
      setFade(true);
    }, 250);
  }, []);

  const prev = () =>
    goTo((index - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((index + 1) % testimonials.length);

  const current = testimonials[index];

  return (
    <section
      aria-label="Customer testimonials"
      className="relative overflow-hidden bg-blue py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-5 lg:px-10">
        <Quote className="mx-auto h-10 w-10 text-white/40" />

        <div className="relative mt-8 min-h-[190px] sm:min-h-[170px]">
          <blockquote
            className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
          >
            <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
              &ldquo;{current.quote}&rdquo;
            </p>
            <footer className="mt-7">
              <div className="font-bold text-white">{current.name}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/65">
                {current.role}
              </div>
            </footer>
          </blockquote>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={prev}
            className="touch-target grid h-11 w-11 place-items-center border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 transition-all ${
                  i === index ? "w-8 bg-amber" : "w-3 bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={next}
            className="touch-target grid h-11 w-11 place-items-center border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
