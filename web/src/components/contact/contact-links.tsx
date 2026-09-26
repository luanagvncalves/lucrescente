import { getDictionary } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";

type Props = {
  tone?: "light" | "dark";
  layout?: "pills" | "list";
  /** Use the homepage button labels ("Chamada · Mensagem normal · Mensagem WhatsApp · Email"). */
  labels?: "home" | "short";
  locale?: ProductLocale;
};

type ContactItem = { person: string; display: string; href: string; external?: boolean };
type ContactGroup = { key: string; label: string; icon: React.ReactNode; items: ContactItem[] };

/**
 * How to reach the brand: WhatsApp on its own, and the rest — call, SMS, email
 * — folded behind "outros métodos".
 *
 * All four used to sit open side by side, which meant fourteen phone numbers
 * and addresses on the page at once, in the footer of every page. WhatsApp is
 * how people actually write, so it is the one left showing.
 *
 * A `<details>` rather than something scripted, so the other methods are in the
 * markup from the first paint: they stay findable with ctrl+F, they print, and
 * they open without JavaScript.
 */
export function ContactLinks({ tone = "light", layout = "pills", labels = "short", locale = "pt" }: Props) {
  const t = getDictionary(locale);
  const label = (key: "call" | "sms" | "whatsapp" | "email") => (labels === "home" ? t.home.contactButtons[key] : t.contact[key]);

  const lucieDigits = t.brand.luciePhonePTTel.replace("tel:", "");
  const lucieSms = `sms:${lucieDigits}`;
  const lucieWhatsapp = `https://wa.me/${lucieDigits.replace("+", "")}`;

  const groups: ContactGroup[] = [
    {
      key: "call",
      label: label("call"),
      icon: <PhoneIcon />,
      items: [
        { person: "lucie", display: t.brand.luciePhonePTDisplay, href: t.brand.luciePhonePTTel },
        { person: "lucie", display: t.brand.luciePhoneCHDisplay, href: t.brand.luciePhoneCHTel },
        { person: "luana", display: t.brand.phoneDisplay, href: t.brand.phoneTel },
      ],
    },
    {
      key: "sms",
      label: label("sms"),
      icon: <SmsIcon />,
      items: [
        { person: "lucie", display: t.brand.luciePhonePTDisplay, href: lucieSms },
        { person: "luana", display: t.brand.phoneDisplay, href: t.brand.sms },
      ],
    },
    {
      key: "whatsapp",
      label: label("whatsapp"),
      icon: <WhatsappIcon />,
      items: [
        { person: "lucie", display: t.brand.luciePhonePTDisplay, href: lucieWhatsapp, external: true },
        { person: "luana", display: t.brand.phoneDisplay, href: t.brand.whatsapp, external: true },
      ],
    },
    {
      key: "email",
      label: label("email"),
      icon: <MailIcon />,
      items: [
        { person: "lucie", display: t.brand.lucieEmail, href: `mailto:${t.brand.lucieEmail}` },
        { person: "luana", display: t.brand.email, href: `mailto:${t.brand.email}` },
      ],
    },
  ];

  const linkTone = tone === "dark" ? "text-ivory/90 hover:text-white" : "text-forest hover:text-forest/70";
  const labelTone = tone === "dark" ? "text-lavender" : "text-moss";
  const summaryTone = tone === "dark" ? "text-ivory/80 hover:text-white" : "text-moss hover:text-forest";

  const whatsapp = groups.find((g) => g.key === "whatsapp") as ContactGroup;
  const others = groups.filter((g) => g.key !== "whatsapp");

  const heading = (g: ContactGroup) => (
    <p className={`flex items-center gap-2 label-brand ${labelTone}`}>
      <span className="opacity-80">{g.icon}</span>
      {g.label}
    </p>
  );

  const numbers = (g: ContactGroup) => (
    <ul className="mt-2.5 space-y-1.5 font-ui text-[0.95rem]">
      {g.items.map((i) => (
        <li key={i.href}>
          <a
            href={i.href}
            target={i.external ? "_blank" : undefined}
            rel={i.external ? "noreferrer" : undefined}
            className={`inline-block min-h-11 py-1 hover:underline underline-offset-4 ${linkTone}`}
          >
            <span className="opacity-70">{i.person} · </span>
            {i.display}
          </a>
        </li>
      ))}
    </ul>
  );

  const summary = (
    <summary
      className={`flex min-h-11 cursor-pointer list-none items-center gap-2 label-brand ${summaryTone} [&::-webkit-details-marker]:hidden`}
    >
      <Chevron />
      {t.contact.otherMethods}
    </summary>
  );

  if (layout === "list") {
    return (
      <div className="space-y-5 font-ui text-[0.95rem]">
        <div>
          {heading(whatsapp)}
          {numbers(whatsapp)}
        </div>
        <details className="group">
          {summary}
          <div className="mt-4 space-y-5">
            {others.map((g) => (
              <div key={g.key}>
                {heading(g)}
                {numbers(g)}
              </div>
            ))}
          </div>
        </details>
      </div>
    );
  }

  const card = tone === "dark" ? "border-ivory/30 bg-ivory/5" : "border-forest/20 bg-paper";
  return (
    <div>
      <div className={`rounded-2xl border px-5 py-4 sm:max-w-sm ${card}`}>
        {heading(whatsapp)}
        {numbers(whatsapp)}
      </div>
      <details className="group mt-4">
        {summary}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {others.map((g) => (
            <div key={g.key} className={`rounded-2xl border px-5 py-4 ${card}`}>
              {heading(g)}
              {numbers(g)}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="transition-transform duration-200 ease-[var(--ease-calm)] group-open:rotate-90">
      <path {...stroke} d="m9 5 7 7-7 7" />
    </svg>
  );
}

const stroke = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M5.5 4h3l1.6 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.6v3a2 2 0 0 1-2 2A16 16 0 0 1 3.5 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
function SmsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17H6.5A2.5 2.5 0 0 1 4 14.5v-8Z" />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M4 20l1.2-3.6A8.5 8.5 0 1 1 8 19.1L4 20Z" />
      <path {...stroke} d="M9 8.5c0 3 2.5 5.5 5.5 6.5l1.2-1.3-1.8-.8-.9.7a5 5 0 0 1-2.6-2.6l.7-.9-.8-1.8L9 8.5Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect {...stroke} x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path {...stroke} d="m4.5 7 7.5 5.5L19.5 7" />
    </svg>
  );
}
