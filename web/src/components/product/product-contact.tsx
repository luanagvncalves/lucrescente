"use client";

import { useId, useRef, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";
import { Button } from "@/components/ui/button";

export function ProductContact({ productName, locale = "pt", className = "" }: { productName: string; locale?: ProductLocale; className?: string }) {
  const t = getDictionary(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    // Honeypot: stays empty for a real visitor, bots fill every field they find.
    hp_website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFailed(false);

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
        setFormData({ name: "", email: "", message: "", hp_website: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        // Keep what they typed so the message is never lost.
        setFailed(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button type="button" variant="secondary" size="lg" className={className} aria-haspopup="dialog" aria-controls={id} onClick={() => dialog.current?.showModal()}>
        {t.productInfo.contactButton}
      </Button>
      <dialog ref={dialog} id={id} aria-labelledby={`${id}-title`} className="m-auto max-h-[85dvh] w-[90vw] max-w-lg overflow-y-auto rounded-3xl border border-moss/30 bg-paper p-0 text-ink shadow-2xl backdrop:bg-forest/55" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <section className="p-6 sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <svg aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 id={`${id}-title`} data-wrap-heading className="min-w-0 flex-1 text-h3 text-forest lowercase">{t.productInfo.contactTitle}</h2>
            <button type="button" aria-label={t.cart.close} className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/10" onClick={() => dialog.current?.close()}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>

          {submitted ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-green-800 text-sm">{t.productInfo.contactSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {failed ? (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-red-800 text-sm">
                    {t.productInfo.contactError}{" "}
                    <a href={`mailto:${t.brand.email}`} className="underline underline-offset-2">
                      {t.brand.email}
                    </a>
                  </p>
                </div>
              ) : null}

              {/*
                Honeypot. Off-screen rather than display:none (which some bots skip),
                out of the tab order and hidden from screen readers, so no real visitor
                can reach it. The field name is deliberately not one a password manager
                recognises, so autofill will not put anything in it either.
              */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="hp_website">não preencher</label>
                <input
                  type="text"
                  id="hp_website"
                  name="hp_website"
                  value={formData.hp_website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-forest mb-2">
                  {t.productInfo.contactName}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-moss/40 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
                  placeholder={t.productInfo.contactNamePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-forest mb-2">
                  {t.productInfo.contactEmail}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-moss/40 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
                  placeholder={t.productInfo.contactEmailPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-forest mb-2">
                  {t.productInfo.contactMessage}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-moss/40 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 resize-none"
                  placeholder={t.productInfo.contactMessagePlaceholder}
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
                {isSubmitting ? t.productInfo.contactSending : t.productInfo.contactSend}
              </button>
            </form>
          )}
        </section>
      </dialog>
    </>
  );
}
