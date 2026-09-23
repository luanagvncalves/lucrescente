import type { Metadata } from "next";
import { t } from "@/lib/i18n";
import { SectionHeader, H1 } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "feiras e mercados",
  description: "encontra-nos em feiras e mercados locais",
  alternates: { canonical: "/feiras-e-mercados" },
};

export default function FairsAndMarketsPage() {
  return (
    <div className="container-brand pt-10 pb-16 md:pt-16">
      <header className="max-w-3xl">
        <SectionHeader as={H1} label="lucrescente" title="feiras e mercados" />
        <p className="mt-6 text-body-lg measure">
          para além da loja online, também nos podes encontrar em feiras e mercados locais — a mostrar os produtos ao vivo, a conhecer quem os vai usar e, às vezes, a fazer peças personalizadas na hora. segue o nosso instagram para saberes onde vamos estar a seguir.
        </p>
      </header>

      <div className="mt-12 rounded-3xl bg-moss/10 p-8 md:p-12">
        <p className="text-body-lg measure text-ink/80">
          em breve, mais informações sobre os próximos eventos e feiras onde nos podes encontrar!
        </p>
      </div>
    </div>
  );
}
