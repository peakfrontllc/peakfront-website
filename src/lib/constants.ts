// TODO: Replace placeholder contact details with real Peakfront info before launch.

export const CONTACT = {
  phone: "+971 527459432",
  phoneHref: "tel:+971527459432",
  email: "info@peakfront.ae",
  emailHref: "mailto:info@peakfront.ae",
  whatsappNumber: "971527459432",
  address: "Mussafah Industrial Area, M-17, Abu Dhabi, United Arab Emirates",
  hours: "Sat – Thu: 7:00 – 19:00 · Fri: On call",
} as const;

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Peakfront, I need equipment for my project.";
