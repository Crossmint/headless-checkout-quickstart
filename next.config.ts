import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": path.resolve(
        "./lib/stubs/async-storage"
      ),
      "pino-pretty": path.resolve("./lib/stubs/pino-pretty"),
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
