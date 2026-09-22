export type Feature = { label: string; icon: string };

export function ProductFeatures({ features }: { features: Feature[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-3">
      {features.map((feature) => (
        <li key={feature.label}>
          <div className="inline-flex flex-col items-center gap-2 rounded-2xl border border-moss/40 bg-paper px-4 py-3 text-center font-ui text-[0.9rem] font-medium text-forest">
            <span>{feature.icon}</span>
            <span>{feature.label}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
