import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// ── Mock wagmi ───────────────────────────────────────────────────────

const mockUseAccount = vi.fn();
const mockUseDisconnect = vi.fn();
const mockUseConfig = vi.fn();

vi.mock("wagmi", () => ({
  useAccount: (...args: unknown[]) => mockUseAccount(...args),
  useDisconnect: () => ({ disconnect: mockUseDisconnect }),
  useConfig: () => mockUseConfig(),
}));

// ── Mock @rainbow-me/rainbowkit ──────────────────────────────────────

vi.mock("@rainbow-me/rainbowkit", () => {
  const ConnectButtonFn = () => <button>Connect Wallet</button>;
  ConnectButtonFn.Custom = ({
    children,
  }: {
    children: (props: { openConnectModal: () => void }) => React.ReactNode;
  }) => children({ openConnectModal: vi.fn() });

  return {
    ConnectButton: ConnectButtonFn,
    RainbowKitProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    darkTheme: () => ({}),
  };
});

// ── Mock @/generated ─────────────────────────────────────────────────

vi.mock("@/generated", () => ({
  useWriteNfTokenMint: () => ({
    writeContractAsync: vi.fn(),
    isPending: false,
  }),
  useReadNfTokenTotalSupply: () => ({
    data: undefined,
  }),
  nfTokenAbi: [],
}));

// ── Mock @/hooks/useInventory ────────────────────────────────────────

vi.mock("@/hooks/useInventory", () => ({
  useInventory: () => ({
    assets: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
    totalSupply: undefined,
  }),
}));

// ── Mock @/lib/ipfs ──────────────────────────────────────────────────

vi.mock("@/lib/ipfs", () => ({
  uploadToIPFS: vi.fn(),
  resolveIPFS: (uri: string) => uri,
  getProviderLabel: () => "Local IPFS",
  getProviderShortLabel: () => "Local",
}));

// ── Mock environment ─────────────────────────────────────────────────

const ORIGINAL_ENV = process.env;

// ── Tests ─────────────────────────────────────────────────────────────

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
    mockUseConfig.mockReturnValue({});
  });

  it("renders connect screen when wallet is not connected", async () => {
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: undefined,
      chain: undefined,
      isConnecting: false,
      isReconnecting: false,
      isDisconnected: true,
    });

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    expect(screen.getByText("NFToken")).toBeInTheDocument();
    expect(screen.getByText("A complete ERC-721 dApp built with OpenZeppelin, Foundry, and Next.js")).toBeInTheDocument();
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
    expect(screen.getByText("Anvil Local")).toBeInTheDocument();
    expect(screen.getByText("Sepolia Testnet")).toBeInTheDocument();
  });

  it("renders dashboard when wallet is connected", async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
      chain: { id: 31337, name: "Anvil" },
      isConnecting: false,
      isReconnecting: false,
      isDisconnected: false,
    });

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Header
    expect(screen.getByText("NFToken")).toBeInTheDocument();
    expect(screen.getByText("NFT")).toBeInTheDocument();

    // Stats bar
    expect(screen.getByText("Total Supply")).toBeInTheDocument();
    expect(screen.getByText("Your Balance")).toBeInTheDocument();
    expect(screen.getByText("Network")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();

    // Tabs
    expect(screen.getByText("Create & Mint")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();

    // Footer
    expect(screen.getByText("Built with Foundry · Next.js · Wagmi · RainbowKit")).toBeInTheDocument();
  });
});
