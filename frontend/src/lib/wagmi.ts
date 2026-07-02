"use client";

import { createConfig, http } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const anvilRpc = process.env.NEXT_PUBLIC_ANVIL_RPC ?? "http://localhost:8545";

/**
 * Create a minimal wagmi config with just the injected connector.
 * Used as fallback when the WalletConnect project ID is not configured.
 */
function createMinimalConfig() {
  return createConfig({
    chains: [anvil, sepolia] as const,
    connectors: [injected()],
    transports: {
      [anvil.id]: http(anvilRpc),
      [sepolia.id]: http(),
    },
    ssr: true,
  });
}

/**
 * Create a full RainbowKit config with WalletConnect support.
 */
function createRainbowKitConfig(projectId: string) {
  return getDefaultConfig({
    appName: "NFToken",
    projectId,
    chains: [anvil, sepolia] as const,
    transports: {
      [anvil.id]: http(anvilRpc),
      [sepolia.id]: http(),
    },
    ssr: true,
  });
}

/**
 * Get the wagmi config based on available environment.
 * During SSR/build, provides a minimal config to avoid blocking.
 * At runtime, warns if WalletConnect project ID is missing.
 */
function getConfig() {
  // During SSR or build, use minimal config to avoid blocking
  if (typeof window === "undefined") {
    return createMinimalConfig();
  }

  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "";
  if (!projectId) {
    console.warn(
      "⚠️  NEXT_PUBLIC_WC_PROJECT_ID is not set. " +
        "Connect Wallet button will use injected wallets only (MetaMask, etc.). " +
        "Get a project ID at https://cloud.walletconnect.com and add it to frontend/.env.local"
    );
    return createMinimalConfig();
  }

  return createRainbowKitConfig(projectId);
}

export const config = getConfig();
