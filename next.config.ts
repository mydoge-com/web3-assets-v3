import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   sri: {
  //     algorithm: 'sha256', 
  //   },
  // },
  async headers() {
    return [
      {
        // Apply CORS headers to all static assets
        source: "/assets/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
