import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", //standalone
  images: {
    domains: ['www.youtube.com'], 
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
