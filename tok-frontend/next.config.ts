import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Esto permite CUALQUIER dominio
      },
    ],
  },
};

export default nextConfig;
