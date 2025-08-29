import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/wp-api/:path*",
        destination:
          "http://localhost:8080/pken-vote/wp-json/:path*", // ←WPのURLに合わせて
      },
    ];
  },
};

export default nextConfig;
