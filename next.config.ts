import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel auto-optimiza (AVIF/WebP, sizes responsive). El flag estaba
    // forzando que se sirvan los originales y eso dolia en mobile.
    formats: ["image/avif", "image/webp"],
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
