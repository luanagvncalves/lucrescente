/** Brand motifs: crescent + orbit lines. Decorative only (aria-hidden). Max two per viewport. */

export function Crescent({ size = 24, className = "", tone = "currentColor" }: { size?: number; className?: string; tone?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M15.5 3.2A9.3 9.3 0 1 0 20.8 15 7.4 7.4 0 0 1 15.5 3.2Z"
        fill={tone}
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * A spiral: growth turning outward from a single point — the mark the pauses
 * between sections are set in. An Archimedean spiral (2¼ turns), drawn as one
 * cubic per quarter turn, so it stays smooth at any size.
 */
export function Spiral({
  size = 24,
  className = "",
  tone = "currentColor",
  strokeWidth = 1.5,
}: {
  size?: number;
  className?: string;
  tone?: string;
  strokeWidth?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M12 12C12.35 12 12.55 12.7 12 13.04C11.45 13.39 10.26 13.09 9.91 12C9.56 10.91 10.36 9.21 12 8.87C13.64 8.52 15.83 9.81 16.18 12C16.53 14.19 14.73 16.87 12 17.22C9.27 17.57 6.08 15.28 5.73 12C5.39 8.72 8.17 5.04 12 4.69C15.83 4.34 20.01 7.63 20.36 12C20.7 16.37 16.92 21.05 12 21.4"
        stroke={tone}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Orbit({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className} fill="none">
      <circle cx="200" cy="200" r="190" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="200" cy="200" r="140" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 10" />
      <circle cx="330" cy="120" r="4" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

/**
 * Small divider: a spiral, on its own, as a pause between sections. The rules
 * that used to flank it drew a line across the page — the opposite of a rest —
 * so the mark now stands alone and is set larger to carry the space by itself.
 */
export function Pause({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center text-clay/70 ${className}`} aria-hidden="true">
      <Spiral size={34} strokeWidth={1.3} />
    </div>
  );
}
