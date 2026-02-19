import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=()" },
];

const widgetHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=*, microphone=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.perfectcorp.com" },
      { protocol: "https", hostname: "**.makeupar.com" },
      { protocol: "https", hostname: "yce-us.s3-accelerate.amazonaws.com" },
    ],
  },
  ...(process.env.NODE_ENV === "development" && {
    allowedDevOrigins: ["http://172.20.10.3:3000", "http://localhost:3000"],
  }),
  async headers() {
    return [
      { source: "/widget/:path*", headers: widgetHeaders },
      { source: "/try/:path*", headers: widgetHeaders },
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
