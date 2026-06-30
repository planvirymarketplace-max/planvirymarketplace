import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@planviry/db", "@planviry/types", "@planviry/ui", "@planviry/shared"],
};
export default nextConfig;
