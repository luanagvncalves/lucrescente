"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";

export function ProductContact({ productName }: { productName: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productName,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 rounded-3xl bg-lavender/20 p-8 md:p-10">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h2 className="text-h3 text-forest lowercase">fala connosco sobre este produto</h2>
      </div>

      {submitted ? (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-green-800 text-sm">✓ mensagem enviada com sucesso! agradecemos o contacto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-forest mb-2">
              nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-moss/40 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
              placeholder="como te chamas?"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-forest mb-2">
              email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-moss/40 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
              placeholder="o teu email"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-forest mb-2">
              mensagem
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-moss/40 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 resize-none"
              placeholder="deixa-nos saber o que achas, dúvidas, pedidos especiais..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 rounded-lg bg-forest text-ivory font-medium transition-all hover:bg-forest/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {isSubmitting ? "a enviar..." : "enviar"}
          </button>
        </form>
      )}
    </section>
  );
}
