import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["gray-matter"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  async headers() {
    return [
      // Audio tracks are append-only (new songs always get new filenames), safe to cache forever.
      {
        source: "/music/:path*.(mp3|flac|wav|ogg|m4a)",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cover art is edited in place under the same filename, so it must revalidate.
      {
        source: "/music/:path*.(jpg|jpeg|png|webp)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
