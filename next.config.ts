import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript:{
    ignoreBuildErrors: true, 
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js'],
    
  },

};

export default nextConfig;
