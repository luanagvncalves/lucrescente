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

/** The four contact groups, each merging both Lucie's and Luana's details into one box: Chamada · SMS · WhatsApp · Email. */
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

  if (layout === "list") {
    return (
      <div className="space-y-5 font-ui text-[0.95rem]">
        {groups.map((g) => (
          <div key={g.key}>
            <p className={`flex items-center gap-2 label-brand ${tone === "dark" ? "text-lavender" : "text-moss"}`}>
              <span className="opacity-80">{g.icon}</span>
              {g.label}
            </p>
            <ul className="mt-2 space-y-1.5">
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
          </div>
        ))}
      </div>
    );
  }

  const card = tone === "dark" ? "border-ivory/30 bg-ivory/5" : "border-forest/20 bg-paper";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map((g) => (
        <div key={g.key} className={`rounded-2xl border px-5 py-4 ${card}`}>
          <p className={`flex items-center gap-2 label-brand ${tone === "dark" ? "text-lavender" : "text-moss"}`}>
            <span className="opacity-80">{g.icon}</span>
            {g.label}
          </p>
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
        </div>
      ))}
    </div>
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
