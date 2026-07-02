"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useInventory } from "@/hooks/useInventory";
import { uploadToIPFS, resolveIPFS, getProviderLabel } from "@/lib/ipfs";
import { useWriteNfTokenMint, useReadNfTokenTotalSupply } from "@/generated";
import { useState, useCallback, useRef, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────

type Tab = "mint" | "inventory";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

// ── Hexagon / Star Logo ───────────────────────────────────────────────

function Logo({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
        fill="url(#logoGrad)"
        stroke="#6366f1"
        strokeWidth="2"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
      >
        N
      </text>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Toast Container ──────────────────────────────────────────────────

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Base64 data URI builder ──────────────────────────────────────────

function buildMetadataUri(metadata: Record<string, unknown>): string {
  const json = JSON.stringify(metadata);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return `data:application/json;base64,${base64}`;
}

// ── Hero / Connect Screen ────────────────────────────────────────────

function ConnectScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-fade-in">
      <div className="animate-pulse-glow rounded-full p-2 mb-6">
        <Logo size={100} />
      </div>

      <h1 className="text-4xl font-bold mb-3 tracking-tight">NFToken</h1>
      <p className="text-[var(--color-text-muted)] text-center max-w-md mb-8 text-lg">
        A complete ERC-721 dApp built with OpenZeppelin, Foundry, and Next.js
      </p>

      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <button
            onClick={openConnectModal}
            className="px-8 py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-xl font-semibold text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
          >
            Connect Wallet
          </button>
        )}
      </ConnectButton.Custom>

      <div className="flex gap-3 mt-8">
        <span className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-dim)] font-mono">
          Anvil Local
        </span>
        <span className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-dim)] font-mono">
          Sepolia Testnet
        </span>
      </div>
    </div>
  );
}

// ── Dashboard Header ─────────────────────────────────────────────────

function DashboardHeader() {
  const { chain } = useAccount();
  const isAnvil = chain?.id === 31337;
  const chainColor = isAnvil ? "#22c55e" : "#f59e0b";
  const chainName = isAnvil ? "Anvil" : chain?.name ?? "Unknown";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Logo size={40} />
        <div>
          <h2 className="font-semibold text-lg tracking-tight">NFToken</h2>
          <span className="text-xs text-[var(--color-text-dim)] font-mono">NFT</span>
        </div>
        <span
          className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono"
          style={{
            background: `${chainColor}20`,
            color: chainColor,
            border: `1px solid ${chainColor}40`,
          }}
        >
          ● {chainName}
        </span>
      </div>

      <ConnectButton />
    </header>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────

function StatsBar() {
  const { address, chain } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;
  const { data: totalSupply } = useReadNfTokenTotalSupply({
    address: contractAddress,
    args: undefined,
    query: { enabled: !!contractAddress },
  });
  const { assets, loading } = useInventory();

  const balance = assets.length;
  const chainName = chain?.name ?? "Unknown";
  const truncated = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "—";

  const stats = [
    { label: "Total Supply", value: totalSupply !== undefined ? String(totalSupply) : "—" },
    { label: "Your Balance", value: loading ? "…" : String(balance) },
    { label: "Network", value: chainName },
    { label: "Account", value: truncated },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4"
        >
          <p className="text-xs text-[var(--color-text-dim)] mb-1 font-medium uppercase tracking-wider">
            {s.label}
          </p>
          <p className="text-lg font-semibold font-mono truncate">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Tab Bar ──────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 px-6 border-b border-[var(--color-border)]">
      {(["mint", "inventory"] as Tab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
            active === tab
              ? "text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] bg-[var(--color-surface)]"
              : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
          }`}
        >
          {tab === "mint" ? "Create & Mint" : "Inventory"}
        </button>
      ))}
    </div>
  );
}

// ── Create & Mint Tab ────────────────────────────────────────────────

function MintTab({ onSuccess, addToast }: { onSuccess: () => void; addToast: (t: Omit<Toast, "id">) => void }) {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { writeContractAsync } = useWriteNfTokenMint();

  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleMint = async () => {
    if (!isConnected || !address || !contractAddress || !title || !imageFile) return;

    setUploading(true);
    try {
      addToast({ message: `Uploading to ${getProviderLabel()}…`, type: "success" });
      const { uri: imageUri } = await uploadToIPFS(imageFile);

      const metadata = {
        name: title,
        description: description || title,
        image: imageUri,
      };
      const metadataUri = buildMetadataUri(metadata);

      setUploading(false);
      setMinting(true);

      addToast({ message: "Confirm the transaction in your wallet…", type: "success" });

      await writeContractAsync({
        address: contractAddress,
        args: [address, metadataUri],
      });

      addToast({ message: `"${title}" minted successfully! 🎉`, type: "success" });
      clearForm();
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Mint failed";
      addToast({ message: msg, type: "error" });
    } finally {
      setUploading(false);
      setMinting(false);
    }
  };

  const canMint = isConnected && !!contractAddress && title.trim().length > 0 && !!imageFile && !uploading && !minting;

  return (
    <div className="grid grid-cols-5 gap-6 p-6">
      <div className="col-span-3 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
            Title <span className="text-[var(--color-error)]">*</span>
          </label>
          <input
            type="text"
            placeholder="My Awesome NFT"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            disabled={minting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
            Description
          </label>
          <textarea
            placeholder="Describe your NFT…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full resize-none"
            disabled={minting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
            Image <span className="text-[var(--color-error)]">*</span>
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--color-accent)] transition-colors ${
              imagePreview ? "bg-transparent" : "bg-[var(--color-surface)]/50"
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
            ) : (
              <div className="text-[var(--color-text-dim)]">
                <svg className="w-10 h-10 mx-auto mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Drop an image here or click to browse</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleMint}
            disabled={!canMint}
            className="px-6 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95"
          >
            {uploading ? "Uploading to IPFS…" : minting ? "Minting…" : "Mint Token"}
          </button>
          <button
            onClick={clearForm}
            disabled={minting || uploading}
            className="px-5 py-2.5 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="col-span-2">
        <p className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Preview</p>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-indigo-900/30 to-purple-900/30 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="NFT preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Logo size={48} />
            )}
          </div>
          <div className="p-4 space-y-1.5">
            <span className="inline-block px-2 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-mono rounded">
              NFT #?
            </span>
            <p className="font-semibold">{title || "Untitled NFT"}</p>
            {description && (
              <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{description}</p>
            )}
            {!description && !title && (
              <p className="text-sm text-[var(--color-text-dim)] italic">Fill in the form to preview</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inventory Tab ────────────────────────────────────────────────────

function InventoryTab({ refreshTrigger }: { refreshTrigger: number }) {
  const { isConnected } = useAccount();
  const { assets, loading, error, refetch } = useInventory();

  useEffect(() => {
    if (refreshTrigger > 0) refetch();
  }, [refreshTrigger, refetch]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-dim)]">
        Connect your wallet to view inventory
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-[var(--color-surface-hover)]" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-[var(--color-surface-hover)] rounded" />
              <div className="h-4 w-24 bg-[var(--color-surface-hover)] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-16 text-[var(--color-error)]">
        <p className="mb-3">Failed to load inventory</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-surface-hover)]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-[var(--color-text-dim)]">
        <Logo size={48} />
        <p className="mt-4 text-lg font-medium">No NFTs found</p>
        <p className="text-sm mt-1">Switch to the Create & Mint tab to mint your first token!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          {assets.length} {assets.length === 1 ? "token" : "tokens"}
        </p>
        <button
          onClick={refetch}
          className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] rounded-lg text-xs transition-all"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id.toString()}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent)] transition-all hover:shadow-lg hover:shadow-indigo-500/5 animate-fade-in"
          >
            <div className="aspect-square bg-gradient-to-br from-indigo-900/20 to-purple-900/20 flex items-center justify-center">
              {asset.metadata?.image ? (
                <img
                  src={resolveIPFS(asset.metadata.image)}
                  alt={asset.metadata.name ?? `Token #${asset.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.classList.add("flex");
                  }}
                />
              ) : (
                <Logo size={36} />
              )}
            </div>
            <div className="p-4 space-y-1">
              <span className="inline-block px-2 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-mono rounded">
                #{asset.id.toString()}
              </span>
              <p className="font-semibold text-sm truncate">
                {asset.metadata?.name ?? `Token #${asset.id}`}
              </p>
              {asset.metadata?.description && (
                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                  {asset.metadata.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Footer ───────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-4 text-center text-xs text-[var(--color-text-dim)]">
      Built with Foundry · Next.js · Wagmi · RainbowKit
    </footer>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export default function Home() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("mint");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const onMintSuccess = useCallback(() => {
    setRefreshTrigger((n) => n + 1);
  }, []);

  if (!isConnected) {
    return (
      <>
        <ConnectScreen />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <StatsBar />
      <TabBar active={activeTab} onChange={setActiveTab} />

      <main className="flex-1">
        {activeTab === "mint" ? (
          <MintTab onSuccess={onMintSuccess} addToast={addToast} />
        ) : (
          <InventoryTab refreshTrigger={refreshTrigger} />
        )}
      </main>

      <Footer />
      <ToastContainer toasts={toasts} />
    </div>
  );
}
