import type { NextConfig } from "next";
import { getAllRentalSlugs } from "./src/lib/rental-pages";

const rentalRewrites = getAllRentalSlugs().map((slug) => ({
  source: `/${slug}`,
  destination: `/equipment-rental/${slug}`,
}));

const legacyLogoRedirects = [
  "logo.svg",
  "logo-light.svg",
  "logo-mark.svg",
  "logo.png",
  "logo-248.png",
  "logo@2x.png",
  "logo-square-250.png",
  "logo-square-720.png",
  "favicon.ico",
  "favicon.svg",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
].map((file) => ({
  source: `/${file}`,
  destination: `/logo/${file}`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/download",
        destination: "/downloads",
        permanent: true,
      },
      ...legacyLogoRedirects,
    ];
  },
  async rewrites() {
    return rentalRewrites;
  },
};

export default nextConfig;
