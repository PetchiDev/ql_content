import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
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
