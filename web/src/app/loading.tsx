import { Crescent } from "@/components/ui/motifs";

export default function Loading() {
  return (
    <div className="container-brand section-gap" aria-busy="true" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-clay">
        <Crescent size={28} className="animate-pulse" />
        <span className="label-brand">a carregar</span>
      </div>
    </div>
  );
}
