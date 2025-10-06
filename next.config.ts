import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["foodfund.sgp1.cdn.digitaloceanspaces.com"],
    remotePatterns: [
      { protocol: 'https', hostname: 'foodfund.sgp1.cdn.digitaloceanspaces.com' },
      { protocol: 'https', hostname: 'foodfund.sgp1.digitaloceanspaces.com' },
    ],
  },
};

export default nextConfig;
