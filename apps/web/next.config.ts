import { NextConfig } from "next";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";  

const nextConfig: NextConfig = {
  transpilePackages: ["@monkeyprint/db", "@monkeyprint/utils"],
  env: {
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    UPLOADTHING_REGIONS: process.env.UPLOADTHING_REGIONS,
  },
  images: {
    domains: [
      "c6ha9vzzh0.ufs.sh",
      "ufs.sh",
      "utfs.io",
      "app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com",
      "s3.eu-central-1.amazonaws.com",
    ],
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin());
    }
    config.externals.push("bufferutil", "utf-8-validate");
    return config;
  },
};

export default nextConfig;
module.exports = nextConfig;
