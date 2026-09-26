"use client";

import { useLocale } from "@/lib/use-locale";

type PaymentMethod = "card" | "mbway" | "apple";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const { t } = useLocale();

  const methods: Array<{ id: PaymentMethod; title: string; description: string; icon: React.ReactNode }> = [
    {
      id: "card",
      title: t.checkout.creditCard,
      description: t.checkout.cardDesc,
      icon: (
        <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
          <rect x="2" y="4" width="44" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2" y="12" width="44" height="6" fill="currentColor" opacity="0.1" />
          <circle cx="10" cy="22" r="1.5" fill="currentColor" />
          <circle cx="16" cy="22" r="1.5" fill="currentColor" />
          <circle cx="22" cy="22" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    // MB WAY is offered whatever the page language. It used to be gated on a
    // check that was always true (the dictionary here was hardcoded to
    // Portuguese), and reading the real language would have hidden it — but the
    // language someone reads in says nothing about the phone they pay with, and
    // plenty of customers in Portugal browse in English.
    {
      id: "mbway",
      title: t.checkout.mbway,
      description: t.checkout.mbwayDesc,
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 14h12M10 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16" cy="8" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "apple",
      title: t.checkout.applePay,
      description: t.checkout.appleDesc,
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
          <path d="M20 4c2.761 0 5 2.239 5 5v14c0 2.761-2.239 5-5 5H12c-2.761 0-5-2.239-5-5V9c0-2.761 2.239-5 5-5h8z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 6h8M10 26h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 10l2 4h-4l2-4z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method.id}
          className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition-all ${
            value === method.id ? "border-forest bg-forest/5" : "border-moss/20 hover:border-moss/40"
          }`}
        >
          <input
            type="radio"
            name="payment-method"
            value={method.id}
            checked={value === method.id}
            onChange={() => onChange(method.id)}
            className="mt-1 h-5 w-5 cursor-pointer accent-forest"
          />
          <div className="flex flex-1 items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-display text-[1.1rem] text-forest lowercase">{method.title}</p>
              <p className="mt-1 text-[0.9rem] text-ink/70">{method.description}</p>
            </div>
            <div className="shrink-0 text-forest opacity-60">{method.icon}</div>
          </div>
        </label>
      ))}
    </div>
  );
}
