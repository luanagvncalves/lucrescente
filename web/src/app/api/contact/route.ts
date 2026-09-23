import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, productName } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "campos obrigatórios em falta" },
        { status: 400 }
      );
    }

    const emailContent = `
Nova mensagem de contacto do site lucrescente

Nome: ${name}
Email: ${email}
Produto: ${productName}

Mensagem:
${message}
    `.trim();

    const adminEmail = process.env.CONTACT_EMAIL || "jonas@jonasalfonso.com";

    if (process.env.NODE_ENV === "development") {
      console.log("Contact form submission (dev mode):", { name, email, productName });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "erro a processar o contacto" },
      { status: 500 }
    );
  }
}
