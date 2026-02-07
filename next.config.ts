import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.API_BACKEND_URL;
    if (!apiUrl) return [];
    const base = apiUrl.replace(/\/$/, "");
    return [{ source: "/api/proxy/:path*", destination: `${base}/:path*` }];
  },
};

export default nextConfig;
