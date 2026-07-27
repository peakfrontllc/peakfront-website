import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import QuoteButton from "@/components/QuoteButton";
import { CONTACT, buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/constants";

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

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="max-w-2xl">
          <SectionKicker label="Contact" />
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Talk to the Peakfront rental desk
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Based in Mussafah, Abu Dhabi — mobilising equipment across the
            Emirates every day.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-px border border-navy/10 bg-navy/10">
            <div className="flex items-start gap-4 bg-white p-6">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue">
                  Phone
                </div>
                <a
                  href={CONTACT.phoneHref}
                  className="mt-1 block font-semibold text-navy hover:text-blue"
                >
                  {CONTACT.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue">
                  Email
                </div>
                <a
                  href={CONTACT.emailHref}
                  className="mt-1 block font-semibold text-navy hover:text-blue"
                >
                  {CONTACT.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue">
                  WhatsApp
                </div>
                <a
                  href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block font-semibold text-navy hover:text-blue"
                >
                  Chat with our team
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue">
                  Office Address
                </div>
                <div className="mt-1 font-semibold leading-relaxed text-navy">
                  {CONTACT.address}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue">
                  Business Hours
                </div>
                <div className="mt-1 font-semibold leading-relaxed text-navy">
                  {CONTACT.hours}
                </div>
              </div>
            </div>

            <QuoteButton className="block w-full bg-amber py-4 text-center text-sm font-bold uppercase tracking-wider text-navy transition-colors hover:bg-[#e0900d]">
              Request a Quote
            </QuoteButton>
          </div>

          <div className="min-h-[280px] overflow-hidden border border-navy/10 bg-white sm:min-h-[420px]">
            <iframe
              title="Peakfront Equipment Rental location, Mussafah Abu Dhabi"
              src="https://www.google.com/maps?q=Mussafah%20Industrial%20Area%20Abu%20Dhabi&output=embed"
              loading="lazy"
              className="h-full min-h-[280px] w-full border-0 sm:min-h-[420px]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
