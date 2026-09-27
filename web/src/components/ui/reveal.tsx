"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Editorial reveal: the block fades and lifts into place the first time it
 * enters the viewport, so the page unfolds as the visitor scrolls instead of
 * arriving all at once.
 *
 * `as="li"` exists because a reveal often has to *be* the list item or the
 * grid cell: an extra `div` between a `ul` and its `li`, or between a grid and
 * its children, is invalid markup and collapses the layout.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return as === "li" ? <li className={className}>{children}</li> : <div className={className}>{children}</div>;
  }

  const Motion = as === "li" ? motion.li : motion.div;
  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Motion>
  );
}
