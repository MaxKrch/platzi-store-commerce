import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ktsdev.ru',
      },
    ],
  }, 
};

export default nextConfig;
