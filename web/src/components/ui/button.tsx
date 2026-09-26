import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-ui font-medium lowercase transition-[background-color,color,transform,border-color] duration-200 ease-[var(--ease-calm)] disabled:cursor-not-allowed disabled:opacity-60 select-none";

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-[0.95rem]",
  lg: "h-[52px] px-6 text-base",
};

const variants: Record<Variant, string> = {
  primary: "bg-forest text-white hover:bg-moss active:translate-y-px",
  secondary:
    "bg-transparent text-forest border border-forest/60 hover:border-forest hover:bg-forest/5 active:translate-y-px",
  ghost: "bg-transparent text-forest hover:bg-forest/5 px-3",
  onDark: "bg-ivory text-forest hover:bg-paper active:translate-y-px",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return [base, sizes[size], variants[variant], extra].join(" ");
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };
export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode };
export function LinkButton({ variant = "primary", size = "md", className = "", ...props }: LinkButtonProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

type AnchorButtonProps = ComponentProps<"a"> & { variant?: Variant; size?: Size };
export function AnchorButton({ variant = "primary", size = "md", className = "", ...props }: AnchorButtonProps) {
  return <a className={buttonClass(variant, size, className)} {...props} />;
}

/** Text link with the brand arrow, e.g. "vem espreitar →". */
export function TextLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center font-ui font-medium lowercase text-moss underline-offset-4 hover:underline ${className}`}
      {...props}
    />
  );
}
