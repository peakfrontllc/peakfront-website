"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectImage } from "@/lib/projects";

type ProjectPhotosProps = {
  images: ProjectImage[];
  projectName: string;
  variant: "table" | "card";
};

export default function ProjectPhotos({
  images,
  projectName,
  variant,
}: ProjectPhotosProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || images.length === 0) return current;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || images.length === 0) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showNext, showPrevious]);

  if (images.length === 0) {
    return variant === "table" ? (
      <span className="text-slate-400" aria-hidden="true">
        —
      </span>
    ) : null;
  }

  const cover = images[0];
  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setActiveIndex(0)}
        aria-label={`View photos of ${projectName}`}
        className={
          variant === "card"
            ? "relative block aspect-[16/10] w-full cursor-pointer overflow-hidden bg-slate-100 sm:aspect-auto sm:h-56"
            : "relative block h-24 w-32 cursor-pointer overflow-hidden border border-navy/10 bg-slate-100"
        }
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={variant === "card" ? "(max-width: 1024px) 100vw, 480px" : "128px"}
          className="object-cover"
        />
        {images.length > 1 && (
          <span className="absolute bottom-1.5 right-1.5 bg-navy/80 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
            {images.length} photos
          </span>
        )}
      </button>

      {activeImage &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-navy/92 px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,env(safe-area-inset-top))] sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-photo-title"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] text-white/80 transition-colors hover:text-white sm:right-6 sm:top-6"
            >
              <X className="h-7 w-7" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showPrevious();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 touch-target text-white/80 transition-colors hover:text-white sm:flex sm:left-6"
                >
                  <ChevronLeft className="h-9 w-9" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next photo"
                  className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 touch-target text-white/80 transition-colors hover:text-white sm:flex sm:right-6"
                >
                  <ChevronRight className="h-9 w-9" />
                </button>
              </>
            )}

            <div
              className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
              onClick={(event) => event.stopPropagation()}
            >
              <figure className="flex w-full flex-col items-center gap-3">
                <div className="relative h-[min(48vh,680px)] w-full sm:h-[min(64vh,680px)]">
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-contain"
                    priority
                  />
                </div>
                <figcaption className="px-2 text-center">
                  <p
                    id="project-photo-title"
                    className="text-sm font-semibold break-words text-white"
                  >
                    {projectName}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                    {activeIndex !== null ? activeIndex + 1 : 1} / {images.length}
                  </p>
                </figcaption>
              </figure>

              {images.length > 1 && (
                <div className="flex w-full items-center justify-between gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Previous photo"
                    className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-white/20 text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next photo"
                    className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-white/20 text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {images.length > 1 && (
                <div className="flex max-w-full gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                  {images.map((image, index) => (
                    <button
                      key={`${image.src}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Photo ${index + 1}`}
                      aria-current={index === activeIndex}
                      className={`relative h-14 w-[4.5rem] shrink-0 cursor-pointer overflow-hidden border-2 ${
                        index === activeIndex
                          ? "border-amber"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt=""
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
