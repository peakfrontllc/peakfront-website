import { Resend } from "resend";
import { NextResponse } from "next/server";
import {
  formatQuoteHtml,
  formatQuotePlainText,
  type QuoteFormPayload,
} from "@/lib/quote-email";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function isValidPayload(body: unknown): body is QuoteFormPayload {
  if (!body || typeof body !== "object") return false;
  const form = body as Record<string, unknown>;
  return [
    "company",
    "contact",
    "phone",
    "email",
    "equipment",
    "quantity",
    "duration",
    "location",
    "message",
  ].every((key) => typeof form[key] === "string");
}

export async function POST(request: Request) {
  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (!body.phone.trim() && !body.email.trim()) {
    return NextResponse.json(
      { error: "Please provide a phone number or email." },
      { status: 400 },
    );
  }

  const to =
    process.env.RESEND_TO_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "";
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Peakfront <onboarding@resend.dev>";

  if (!to) {
    return NextResponse.json(
      { error: "Recipient email is not configured." },
      { status: 503 },
    );
  }

  const subject = body.equipment.trim()
    ? `Quote Request: ${body.equipment.trim()}`
    : "New Quote Request — Peakfront Website";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: body.email.trim() || undefined,
    subject,
    text: formatQuotePlainText(body),
    html: formatQuoteHtml(body),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try WhatsApp or call us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
