export type QuoteFormPayload = {
  company: string;
  contact: string;
  phone: string;
  email: string;
  equipment: string;
  quantity: string;
  duration: string;
  location: string;
  message: string;
};

export function formatQuotePlainText(form: QuoteFormPayload): string {
  return [
    "New quote request — Peakfront Equipment Rental",
    "",
    form.company ? `Company: ${form.company}` : "",
    form.contact ? `Contact: ${form.contact}` : "",
    form.phone ? `Phone: ${form.phone}` : "",
    form.email ? `Email: ${form.email}` : "",
    form.equipment ? `Equipment: ${form.equipment}` : "",
    form.quantity ? `Quantity: ${form.quantity}` : "",
    form.duration ? `Duration: ${form.duration}` : "",
    form.location ? `Location: ${form.location}` : "",
    form.message ? `Message: ${form.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatQuoteHtml(form: QuoteFormPayload): string {
  const rows = [
    ["Company", form.company],
    ["Contact", form.contact],
    ["Phone", form.phone],
    ["Email", form.email],
    ["Equipment", form.equipment],
    ["Quantity", form.quantity],
    ["Duration", form.duration],
    ["Location", form.location],
    ["Message", form.message],
  ].filter(([, value]) => value);

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#0B2545;border-bottom:1px solid #eee;">${label}</td><td style="padding:8px 12px;color:#333;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#0B2545;">
      <h2 style="margin:0 0 16px;font-size:20px;">New Quote Request</h2>
      <p style="margin:0 0 20px;color:#666;">Submitted via peakfront.ae</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${tableRows}</table>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildWhatsAppMessage(form: QuoteFormPayload): string {
  return [
    "Hello Peakfront, I would like to request a quote.",
    form.company ? `Company: ${form.company}` : "",
    form.contact ? `Contact: ${form.contact}` : "",
    form.phone ? `Phone: ${form.phone}` : "",
    form.email ? `Email: ${form.email}` : "",
    form.equipment ? `Equipment: ${form.equipment}` : "",
    form.quantity ? `Quantity: ${form.quantity}` : "",
    form.duration ? `Duration: ${form.duration}` : "",
    form.location ? `Location: ${form.location}` : "",
    form.message ? `Message: ${form.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
