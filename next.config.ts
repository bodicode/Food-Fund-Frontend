import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "foodfund.sgp1.cdn.digitaloceanspaces.com",
      "api.vietqr.io",
      "lh3.googleusercontent.com"
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'foodfund.sgp1.cdn.digitaloceanspaces.com' },
      { protocol: 'https', hostname: 'foodfund.sgp1.digitaloceanspaces.com' },
      { protocol: 'https', hostname: 'api.vietqr.io' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
