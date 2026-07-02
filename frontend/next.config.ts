import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Polyfill Node.js modules for browser bundles (@metamask/sdk needs these)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: false,
      crypto: false,
      stream: false,
      os: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      pino: false,
      "pino-pretty": false,
      "@react-native-async-storage/async-storage": false,
    };

    return config;
  },
};

export default nextConfig;
