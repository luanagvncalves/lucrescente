import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image already negotiates WebP by default; adding AVIF ahead of it means
    // browsers that support AVIF (most current ones) get the smaller file, and the
    // rest fall back to WebP and then JPEG. No extra files in the repo — the
    // conversion happens per request and is cached at the edge.
    formats: ["image/avif", "image/webp"],
  },
  /*
    "cuidados & sustentabilidade" was a page of seven chapters, five of which
    said what the FAQ already said. The three things it alone knew — the
    hand-sewn wraps, the water that goes into making plastic, what the candles
    are made of — moved into the FAQ, and the page went. Permanent, because the
    address has been in the footer and the sitemap and may be linked from
    outside; a visitor arriving at the old one lands on the answers instead.
  */
  async redirects() {
    return [
      { source: "/cuidados", destination: "/perguntas-frequentes", permanent: true },
      // the two lip balms were renamed; the old addresses may be bookmarked or linked from outside
      { source: "/produtos/batom-tijolo", destination: "/produtos/batom-hidratante-com-cor", permanent: true },
      { source: "/produtos/batom-natural", destination: "/produtos/batom-hidratante-sem-cor", permanent: true },
    ];
  },
};

export default nextConfig;
