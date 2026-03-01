import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    transpilePackages: ["@repo/contracts"],
  },
};

export default nextConfig;
