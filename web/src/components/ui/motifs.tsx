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

export function Orbit({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className} fill="none">
      <circle cx="200" cy="200" r="190" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="200" cy="200" r="140" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 10" />
      <circle cx="330" cy="120" r="4" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

/** Small divider: a crescent as a pause between sections. */
export function Pause({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-clay/70 ${className}`} aria-hidden="true">
      <span className="h-px w-12 bg-current opacity-50" />
      <Crescent size={14} />
      <span className="h-px w-12 bg-current opacity-50" />
    </div>
  );
}
