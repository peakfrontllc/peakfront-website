type CapSectionHeadProps = {
  eyebrow: string;
  title: string;
  aside?: string;
};

export default function CapSectionHead({
  eyebrow,
  title,
  aside,
}: CapSectionHeadProps) {
  return (
    <div className="mb-[2mm] flex items-baseline justify-between gap-[3mm] border-b border-amber pb-[1.5mm]">
      <div>
        <p className="font-mono text-[6pt] uppercase tracking-[0.18em] text-blue">
          {eyebrow}
        </p>
        <h2 className="font-display text-[9.5pt] font-extrabold leading-tight text-navy">
          {title}
        </h2>
      </div>
      {aside ? (
        <p className="max-w-[52mm] text-right text-[6.5pt] leading-snug text-slate-500">
          {aside}
        </p>
      ) : null}
    </div>
  );
}
