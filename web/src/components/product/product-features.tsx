export type Feature = { label: string };

export function ProductFeatures({ features }: { features: Feature[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-3">
      {features.map((feature) => (
        <li key={feature.label}>
          <div className="inline-flex items-center rounded-2xl border border-violet/30 bg-violet/50 px-4 py-3 font-ui text-[0.9rem] font-medium text-forest">
            {feature.label}
          </div>
        </li>
      ))}
    </ul>
  );
}
