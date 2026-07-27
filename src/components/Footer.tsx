import {
  Camera,
  Music2,
  Network,
  Play,
} from "lucide-react";
import Link from "next/link";
import { navLinks } from "@/lib/content";
import { CONTACT } from "@/lib/constants";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const socialLinks = [
  { href: "https://www.linkedin.com", label: "LinkedIn", icon: Network },
  { href: "https://www.facebook.com", label: "Facebook", icon: FacebookIcon },
  { href: "https://www.instagram.com", label: "Instagram", icon: Camera },
  { href: "https://www.tiktok.com", label: "TikTok", icon: Music2 },
  { href: "https://www.youtube.com", label: "YouTube", icon: Play },
] as const;

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-navy pt-14 text-white sm:pt-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 sm:gap-12 sm:pb-16 lg:grid-cols-3">
          <div>
            <div className="text-2xl font-extrabold tracking-tight">
              PEAKFRONT
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              Heavy equipment, transport and site solutions for contractors
              across the United Arab Emirates.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="touch-target grid h-11 w-11 place-items-center border border-white/15 transition-colors hover:border-amber hover:text-amber"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">
              Quick Links
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-white/60">
              {navLinks.slice(0, 4).map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-amber">
                  {link.label}
                </Link>
              ))}
              <Link href="#contact" className="hover:text-amber">
                Contact
              </Link>
              {/* TODO: Create privacy and terms pages before launch */}
              <Link href="/privacy" className="hover:text-amber">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-amber">
                Terms
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">
              Head Office
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-white/60">
              <span>{CONTACT.address}</span>
              <a href={CONTACT.phoneHref} className="hover:text-amber">
                {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="hover:text-amber">
                {CONTACT.email}
              </a>
              <span>{CONTACT.hours}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-8 text-xs text-white/45 sm:flex sm:items-center sm:justify-between">
          <span>
            © 2026 Peakfront Equipment Rental LLC. All rights reserved.
          </span>
          <span className="mt-3 block font-mono uppercase tracking-[0.18em] sm:mt-0">
            Abu Dhabi · UAE
          </span>
        </div>
      </div>
      <div className="select-none whitespace-nowrap px-5 pb-4 text-center text-[9vw] font-extrabold leading-none tracking-tighter text-white/[0.06] lg:px-10">
        EQUIPMENT · TRANSPORT · SOLUTIONS
      </div>
    </footer>
  );
}
