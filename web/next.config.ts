import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image already negotiates WebP by default; adding AVIF ahead of it means
    // browsers that support AVIF (most current ones) get the smaller file, and the
    // rest fall back to WebP and then JPEG. No extra files in the repo — the
    // conversion happens per request and is cached at the edge.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
