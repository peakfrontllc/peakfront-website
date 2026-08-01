import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/download",
        destination: "/downloads",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
