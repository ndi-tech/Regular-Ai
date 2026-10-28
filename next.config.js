/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { 
    serverComponentsExternalPackages: ["pdf-parse", "pdfjs-dist", "mammoth"] 
  },
};
module.exports = nextConfig;