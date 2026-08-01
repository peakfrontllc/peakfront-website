type RentalMarqueeStripProps = {
  text: string;
};

export default function RentalMarqueeStrip({ text }: RentalMarqueeStripProps) {
  return (
    <section className="overflow-hidden border-t border-navy/10 bg-navy py-4 sm:py-5">
      <p className="px-4 text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/90 sm:hidden">
        {text}
      </p>
      <div className="relative hidden sm:flex">
        <div className="animate-marquee motion-reduce:transform-none whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-white/90 lg:text-sm lg:tracking-[0.22em]">
          <span className="mx-8">{text}</span>
          <span className="mx-8" aria-hidden="true">
            {text}
          </span>
          <span className="mx-8" aria-hidden="true">
            {text}
          </span>
        </div>
      </div>
    </section>
  );
}
