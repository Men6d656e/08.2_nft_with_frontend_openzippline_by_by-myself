"use client";

// ── Provider Configuration ────────────────────────────────────────────

const PROVIDER = (process.env.NEXT_PUBLIC_IPFS_PROVIDER ?? "local") as "local" | "pinata";
const LOCAL_API = process.env.NEXT_PUBLIC_LOCAL_IPFS_API ?? "http://127.0.0.1:5001";
const LOCAL_GATEWAY = process.env.NEXT_PUBLIC_LOCAL_IPFS_GATEWAY ?? "http://127.0.0.1:8080";
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT ?? "";
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? "https://gateway.pinata.cloud";

// ── Types ─────────────────────────────────────────────────────────────

export interface IPFSResult {
  cid: string;
  uri: string; // ipfs://<cid>
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Upload a File to IPFS using the configured provider.
 * For "local": proxies through the Next.js API route to avoid CORS.
 * For "pinata": uploads directly to Pinata.
 */
export async function uploadToIPFS(file: File): Promise<IPFSResult> {
  if (PROVIDER === "pinata") {
    return _uploadToPinata(file);
  }
  return _uploadToLocal(file);
}

/**
 * Resolve an ipfs:// URI to an HTTP gateway URL.
 * Falls back to the raw uri if it's not ipfs://.
 */
export function resolveIPFS(uri: string): string {
  if (!uri.startsWith("ipfs://")) return uri;
  const cid = uri.replace("ipfs://", "");
  return `${getGatewayBase()}/ipfs/${cid}`;
}

/**
 * Get the base gateway URL (no trailing slash).
 */
export function getGatewayBase(): string {
  if (PROVIDER === "pinata") return PINATA_GATEWAY;
  return LOCAL_GATEWAY;
}

/**
 * Human-readable provider label for the UI.
 */
export function getProviderLabel(): string {
  if (PROVIDER === "pinata") return "Pinata";
  return "Local IPFS";
}

/**
 * Short label for badges.
 */
export function getProviderShortLabel(): string {
  if (PROVIDER === "pinata") return "Pinata";
  return "Local";
}

// ── Internals ─────────────────────────────────────────────────────────

async function _uploadToLocal(file: File): Promise<IPFSResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/ipfs/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IPFS upload failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const cid = data.Hash ?? data.cid ?? data.IpfsHash;
  if (!cid) throw new Error("No CID returned from IPFS node");

  return { cid, uri: `ipfs://${cid}` };
}

async function _uploadToPinata(file: File): Promise<IPFSResult> {
  if (!PINATA_JWT) throw new Error("Pinata JWT not configured");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pinata upload failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return { cid: data.IpfsHash, uri: `ipfs://${data.IpfsHash}` };
}
