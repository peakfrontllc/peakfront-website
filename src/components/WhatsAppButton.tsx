import { MessageCircle } from "lucide-react";
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
} from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <a
      href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Peakfront on WhatsApp"
      className="fixed z-40 flex touch-target items-center gap-2 rounded-full bg-whatsapp px-4 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-black/25 transition-transform duration-300 hover:scale-105 hover:bg-[#0f7a6d] sm:px-5 sm:py-4"
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        right: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}
