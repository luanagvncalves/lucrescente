/**
 * Per-product contact form -> email.
 *
 * Sends through Resend's HTTP API (no extra dependency: plain fetch).
 * Required env: RESEND_API_KEY, CONTACT_EMAIL. Optional: CONTACT_FROM_EMAIL.
 *
 * This route NEVER answers `success` unless the provider accepted the message —
 * a silent "sent" loses real customers.
 */
import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 200, message: 5000, productName: 200 };

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido inválido" }, { status: 400 });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const message = clean(body.message, MAX.message);
  const productName = clean(body.productName, MAX.productName);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "campos obrigatórios em falta" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "email inválido" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  // Resend's shared sender works out of the box but only delivers to the address
  // that owns the Resend account. Set CONTACT_FROM_EMAIL once the domain is verified.
  const from = process.env.CONTACT_FROM_EMAIL || "lucrescente <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error(
      "[contact] not configured: missing RESEND_API_KEY and/or CONTACT_EMAIL — message NOT sent",
      { productName },
    );
    return NextResponse.json({ error: "o envio de email ainda não está configurado" }, { status: 503 });
  }

  const subject = productName
    ? `site lucrescente — ${productName} — ${name}`
    : `site lucrescente — mensagem de ${name}`;

  const text = [
    "nova mensagem de contacto do site lucrescente",
    "",
    `nome: ${name}`,
    `email: ${email}`,
    productName ? `produto: ${productName}` : null,
    "",
    "mensagem:",
    message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text }),
    });

    if (!res.ok) {
      console.error("[contact] provider rejected the message", res.status, await res.text());
      return NextResponse.json({ error: "erro a enviar a mensagem" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact] provider unreachable", error);
    return NextResponse.json({ error: "erro a enviar a mensagem" }, { status: 502 });
  }
}
