import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ['www.youtube.com'], // ⚠️ Not needed for YouTube videos, only for actual image hosting domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qlnfilesdev.blob.core.windows.net',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;
