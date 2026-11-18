import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Dev hydration waits on this channel over the HMR socket. If that socket
    // cannot connect, every controlled input stays stuck on its server HTML.
    reactDebugChannel: false,
  },
  // Classic static rendering so canonical tags land in <head>.
  // Cache Components would treat a request-host canonical as runtime data
  // and stream it after the shell. Set NEXT_PUBLIC_SITE_URL to prerender.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
