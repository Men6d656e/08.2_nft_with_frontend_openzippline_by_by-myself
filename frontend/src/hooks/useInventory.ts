"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useConfig } from "wagmi";
import { readContract } from "wagmi/actions";
import { nfTokenAbi } from "@/generated";
import { resolveIPFS } from "@/lib/ipfs";

const abi = nfTokenAbi;

export interface NFTAsset {
  id: bigint;
  uri: string;
  metadata: NFTMetadata | null;
}

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
}

export interface InventoryState {
  assets: NFTAsset[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalSupply: bigint | undefined;
}

/**
 * Custom hook that fetches the connected wallet's token inventory.
 * Reads balanceOf, iterates through owned tokens, and resolves metadata.
 */
export function useInventory(): InventoryState {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;

  const [assets, setAssets] = useState<NFTAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalSupply, setTotalSupply] = useState<bigint | undefined>(undefined);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((n) => n + 1), []);

  useEffect(() => {
    if (!isConnected || !address || !contractAddress) {
      setAssets([]);
      setTotalSupply(undefined);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      if (cancelled) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Read total supply
        const ts = (await readContract(config, {
          abi,
          address: contractAddress,
          functionName: "totalSupply",
        } as any)) as bigint;
        if (!cancelled) setTotalSupply(ts);

        // 2. Read user balance
        const balance = (await readContract(config, {
          abi,
          address: contractAddress,
          functionName: "balanceOf",
          args: [address],
        } as any)) as bigint;

        if (cancelled) return;

        if (balance === 0n) {
          setAssets([]);
          setLoading(false);
          return;
        }

        // 3. Loop through each owned token index
        const results: NFTAsset[] = [];
        for (let i = 0; i < Number(balance); i++) {
          if (cancelled) break;

          const tokenId = (await readContract(config, {
            abi,
            address: contractAddress,
            functionName: "tokenOfOwnerByIndex",
            args: [address, BigInt(i)],
          } as any)) as bigint;

          const uri = (await readContract(config, {
            abi,
            address: contractAddress,
            functionName: "tokenURI",
            args: [tokenId],
          } as any)) as string;

          // 4. Parse metadata (base64 data URI or ipfs://)
          const metadata = await parseMetadata(uri);

          results.push({ id: tokenId, uri, metadata });
        }

        if (!cancelled) {
          setAssets(results);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load inventory");
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected, contractAddress, config, trigger]);

  return { assets, loading, error, refetch, totalSupply };
}

/**
 * Parse token metadata from a URI.
 * Supports:
 *   - data:application/json;base64,<base64>
 *   - ipfs://<cid> (fetched via gateway)
 *   - http(s)://<url> (fetched directly)
 */
async function parseMetadata(uri: string): Promise<NFTMetadata | null> {
  try {
    if (uri.startsWith("data:application/json")) {
      const base64 = uri.split(",")[1];
      const json = atob(base64);
      return JSON.parse(json);
    }
    const httpUri = resolveIPFS(uri);
    const res = await fetch(httpUri);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
