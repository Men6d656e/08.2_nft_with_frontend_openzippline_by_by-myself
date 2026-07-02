#!/usr/bin/env bash
set -euo pipefail

# ── extract-address.sh ──────────────────────────────────────────────────
# Reads the contract address from a Forge broadcast JSON file and writes
# it to frontend/.env.local as NEXT_PUBLIC_CONTRACT_ADDRESS.
#
# Usage: bash scripts/extract-address.sh <CHAIN_ID>
#   CHAIN_ID = 31337 (Anvil), 11155111 (Sepolia), 1 (Ethereum), etc.
#
# This is called automatically by `make post-deploy-setup`.
# ──────────────────────────────────────────────────────────────────────────

CHAIN_ID="${1:-31337}"
BROADCAST_DIR="contracts/broadcast/DeployNFToken.s.sol/${CHAIN_ID}"
BROADCAST_FILE="${BROADCAST_DIR}/run-latest.json"
ENV_FILE="frontend/.env.local"

if [ ! -f "$BROADCAST_FILE" ]; then
  echo "❌ Broadcast file not found: $BROADCAST_FILE"
  echo "   Make sure you have run the deployment script first."
  exit 1
fi

# Extract the deployed contract address from the broadcast JSON
CONTRACT_ADDRESS=$(jq -r '.transactions[0].contractAddress // .receipts[0].contractAddress // empty' "$BROADCAST_FILE")

if [ -z "$CONTRACT_ADDRESS" ] || [ "$CONTRACT_ADDRESS" = "null" ]; then
  echo "❌ Could not extract contract address from $BROADCAST_FILE"
  exit 1
fi

echo "✅ Extracted contract address: $CONTRACT_ADDRESS"

# Write to frontend/.env.local (create if not exists, update if exists)
if grep -q "^NEXT_PUBLIC_CONTRACT_ADDRESS=" "$ENV_FILE" 2>/dev/null; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/^NEXT_PUBLIC_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" "$ENV_FILE"
  else
    sed -i "s/^NEXT_PUBLIC_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" "$ENV_FILE"
  fi
  echo "📝 Updated existing NEXT_PUBLIC_CONTRACT_ADDRESS in $ENV_FILE"
else
  echo "NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> "$ENV_FILE"
  echo "📝 Appended NEXT_PUBLIC_CONTRACT_ADDRESS to $ENV_FILE"
fi

echo "✅ Post-deploy address extraction complete."
