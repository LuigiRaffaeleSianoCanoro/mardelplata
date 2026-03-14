import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into the `out/` directory.
  // All pages in this project are already statically rendered (no SSR/ISR),
  // so this is safe and enables GitHub Pages deployment.
  output: "export",

  // Image Optimization requires a Node.js server; disable it for static export.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
