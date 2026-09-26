import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { t } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart-store";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/toaster";
import { LocaleRuntime } from "@/components/layout/locale-runtime";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "lucrescente", template: "%s · lucrescente" },
  description: t.brand.description,
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "lucrescente",
    title: "lucrescente",
    description: t.brand.description,
    images: [{ url: "/brand/logo.png", width: 150, height: 150, alt: "lucrescente — higiene e bem-estar natural artesanal" }],
  },
  icons: { icon: "/brand/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <CartProvider>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <CartDrawer />
          <Toaster />
          <LocaleRuntime />
        </CartProvider>
      </body>
    </html>
  );
}
