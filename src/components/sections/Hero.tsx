"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import QuoteButton from "@/components/QuoteButton";
import { heroStats, HERO_IMAGE } from "@/lib/content";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [transform, setTransform] = useState("scale(1.01) translate(0%, 0%)");
  const reducedMotion = useRef(true);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion.current) return;

    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const maxShiftX = 0.4;
    const maxShiftY = 0.15;
    const shiftX = (px - 0.5) * -2 * maxShiftX;
    const shiftY = (py - 0.5) * -2 * maxShiftY;

    setTransform(`scale(1.01) translate(${shiftX}%, ${shiftY}%)`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion.current) return;
    setTransform("scale(1.01) translate(0%, 0%)");
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Heavy equipment rental hero"
      className="relative flex min-h-[88dvh] items-end overflow-hidden bg-navy sm:min-h-[92vh]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Excavator working on an Abu Dhabi construction site at dawn"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            transform,
            transition: "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/40 sm:via-navy/70 sm:to-navy/25" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-12 pt-24 sm:px-5 sm:pb-16 sm:pt-32 lg:px-10 lg:pb-20">
        <div className="max-w-3xl">
          <div className="hero-fade hero-fade-1 mb-5 inline-flex max-w-full items-center gap-2.5 border border-white/20 bg-white/5 px-3 py-2 backdrop-blur sm:mb-6 sm:gap-3 sm:px-4">
            <span className="hero-pulse h-2 w-2 shrink-0 rounded-full bg-amber" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 sm:text-[10px] sm:tracking-[0.22em]">
              Abu Dhabi · United Arab Emirates
            </span>
          </div>

          <h1 className="hero-fade hero-fade-2 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl sm:leading-[1.05] lg:text-7xl">
            Heavy Equipment
            <br />
            Rental Across <span className="text-amber">UAE</span>
          </h1>

          <p className="hero-fade hero-fade-3 mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:mt-7 sm:text-lg">
            Reliable equipment. Competitive pricing. Fast delivery. Trusted
            suppliers.
          </p>

          <div className="hero-fade hero-fade-4 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <QuoteButton className="group inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-all hover:bg-white sm:w-auto sm:px-8 sm:py-4 [clip-path:polygon(0_0,100%_0,100%_70%,96%_100%,0_100%)]">
              Get a Free Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </QuoteButton>
            <Link
              href="#equipment"
              className="inline-flex w-full items-center justify-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto sm:px-8 sm:py-4"
            >
              Browse Equipment
            </Link>
          </div>
        </div>

        <div className="hero-fade hero-fade-5 mt-10 grid grid-cols-2 gap-2.5 sm:mt-16 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-md transition-colors hover:border-amber/50 sm:p-5"
            >
              <stat.icon className="h-4 w-4 text-amber sm:h-5 sm:w-5" />
              <div className="mt-3 font-mono text-lg font-bold text-white sm:mt-4 sm:text-2xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] uppercase leading-snug tracking-wide text-white/60 sm:text-xs sm:tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
