import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@react-native-async-storage/async-storage":
          "./lib/stubs/async-storage",
        "pino-pretty": "./lib/stubs/pino-pretty",
      },
    },
  },
};

export default nextConfig;
