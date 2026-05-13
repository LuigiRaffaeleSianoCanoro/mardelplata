import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel auto-optimiza (AVIF/WebP, sizes responsive). El flag estaba
    // forzando que se sirvan los originales y eso dolia en mobile.
    formats: ["image/avif", "image/webp"],
    // Default deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840].
    // Agregamos 1440 para que iPhones DPR 3 con viewport ~400-480 caigan
    // ahi en vez de saltar al 1920 (~138KB para un hero mobile).
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
  },
  async headers() {
    return [
      {
        source: "/admin/scanner",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=(self)",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
