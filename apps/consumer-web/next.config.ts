import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "*.space-z.ai",
    "preview-chat-*.space-z.ai",
    "127.0.0.1",
    "localhost",
    "21.0.10.198",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  transpilePackages: [
    "@planviry/db",
    "@planviry/types",
    "@planviry/ui",
    "@planviry/search",
    "@planviry/analytics",
    "@planviry/email-templates",
    "@planviry/shared",
  ],
};

export default nextConfig;
