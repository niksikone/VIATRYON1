import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.perfectcorp.com" },
      { protocol: "https", hostname: "**.makeupar.com" },
      { protocol: "https", hostname: "**.s3-accelerate.amazonaws.com" },
      { protocol: "https", hostname: "yce-us.s3-accelerate.amazonaws.com" },
    ],
  },
  allowedDevOrigins: [
    "http://172.20.10.3:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
