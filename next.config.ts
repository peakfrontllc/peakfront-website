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
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/manage",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/manage/:path*",
        destination: "/dashboard/:path*",
        permanent: false,
      },
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
