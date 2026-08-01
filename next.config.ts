import type { NextConfig } from "next";
import { getAllRentalSlugs } from "./src/lib/rental-pages";

const rentalRewrites = getAllRentalSlugs().map((slug) => ({
  source: `/${slug}`,
  destination: `/equipment-rental/${slug}`,
}));

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
  async rewrites() {
    return rentalRewrites;
  },
};

export default nextConfig;
