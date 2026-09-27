import type { ReactNode } from "react";

/** Section label: DM Sans Medium 12px, 0.10em tracking, moss or violet. */
export function Label({ children, tone = "moss", className = "" }: { children: ReactNode; tone?: "moss" | "violet" | "ivory"; className?: string }) {
  const color = tone === "moss" ? "text-moss" : tone === "violet" ? "text-violet" : "text-ivory/80";
  return <p className={`label-brand ${color} ${className}`}>{children}</p>;
}

export function H1({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h1 id={id} className={`text-h1 text-forest lowercase ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={`text-h2 text-forest lowercase ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-h3 text-forest lowercase ${className}`}>{children}</h3>;
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-body-lg text-ink measure ${className}`}>{children}</p>;
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`text-body text-ink measure space-y-5 ${className}`}>{children}</div>;
}

/** Section header: label + title + optional subtitle. */
export function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
  tone = "moss",
  as: As = H2,
  /** Overrides the default 20ch measure — a short title can be held on one line. */
  titleClassName = "max-w-[20ch]",
  /**
   * Lands on the heading itself. A `<section aria-labelledby="…">` needs the id
   * to exist or the section has no name at all, which is worse than having no
   * `aria-labelledby` to begin with.
   */
  titleId,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "moss" | "violet";
  as?: typeof H1 | typeof H2;
  titleClassName?: string;
  titleId?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : ""}`}>
      {label ? <Label tone={tone}>{label}</Label> : null}
      <As id={titleId} className={titleClassName}>
        {title}
      </As>
      {subtitle ? <p className="text-body-lg text-ink/90 measure">{subtitle}</p> : null}
    </div>
  );
}
