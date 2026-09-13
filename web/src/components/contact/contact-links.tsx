import { t } from "@/lib/i18n";

type Props = {
  tone?: "light" | "dark";
  layout?: "pills" | "list";
  /** Use the homepage button labels ("Chamada · Mensagem normal · Mensagem WhatsApp · Email"). */
  labels?: "home" | "short";
};

/** The four contact choices: Chamada · SMS · WhatsApp · Email. */
export function ContactLinks({ tone = "light", layout = "pills", labels = "short" }: Props) {
  const items = [
    { href: t.brand.phoneTel, label: labels === "home" ? t.home.contactButtons.call : t.contact.call, icon: <PhoneIcon /> },
    { href: t.brand.sms, label: labels === "home" ? t.home.contactButtons.sms : t.contact.sms, icon: <SmsIcon /> },
    { href: t.brand.whatsapp, label: labels === "home" ? t.home.contactButtons.whatsapp : t.contact.whatsapp, icon: <WhatsappIcon />, external: true },
    { href: `mailto:${t.brand.email}`, label: labels === "home" ? t.home.contactButtons.email : t.contact.email, icon: <MailIcon /> },
  ];

  if (layout === "list") {
    return (
      <ul className="space-y-2 font-ui text-[0.95rem]">
        {items.map((i) => (
          <li key={i.href}>
            <a
              href={i.href}
              target={i.external ? "_blank" : undefined}
              rel={i.external ? "noreferrer" : undefined}
              className={`inline-flex min-h-11 items-center gap-3 hover:underline underline-offset-4 ${tone === "dark" ? "text-ivory/90 hover:text-white" : "text-forest"}`}
            >
              <span className="opacity-80">{i.icon}</span>
              <span>
                {i.label}
                {i.href.startsWith("tel:") ? <span className="opacity-70"> · {t.brand.phoneDisplay}</span> : null}
                {i.href.startsWith("mailto:") ? <span className="opacity-70"> · {t.brand.email}</span> : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  const pill =
    tone === "dark"
      ? "border-ivory/40 text-ivory hover:bg-ivory/10"
      : "border-forest/50 text-forest hover:bg-forest/5";
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((i) => (
        <a
          key={i.href}
          href={i.href}
          target={i.external ? "_blank" : undefined}
          rel={i.external ? "noreferrer" : undefined}
          className={`inline-flex h-12 items-center gap-2 rounded-full border px-5 font-ui text-[0.95rem] font-medium transition-colors ${pill}`}
        >
          {i.icon}
          {i.label}
        </a>
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
