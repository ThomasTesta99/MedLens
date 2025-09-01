import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js'],
  },

};

export default nextConfig;
