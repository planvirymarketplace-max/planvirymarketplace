import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Build is permissive during scaffold; tightened in Phase 14 (Testing).
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the sandbox preview origin to fetch Next.js dev assets.
  allowedDevOrigins: [
    "*.space-z.ai",
    "preview-chat-*.space-z.ai",
  ],
  // Transpile the @planviry/* workspace packages so Next can bundle their TS source.
  transpilePackages: [
    "@planviry/db",
    "@planviry/types",
    "@planviry/ui",
    "@planviry/search",
    "@planviry/analytics",
    "@planviry/email-templates",
    "@planviry/shared",
  ],
  // Do NOT bundle @prisma/client — treat it as a native Node module so Prisma's
  // generated-client resolution works at runtime (standard Prisma monorepo fix).
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
