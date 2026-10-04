import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browsers request /favicon.ico directly, so it is routed to the admin-managed
  // favicon instead of the old static app/favicon.ico file.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/favicon" }];
  },
};

export default nextConfig;
