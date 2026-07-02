.PHONY: install-all contracts-build contracts-test wagmi-gen deploy-anvil deploy-sepolia \
        post-deploy-setup frontend-dev frontend-build frontend-start frontend-prod \
        frontend-test clean

# ── Install ───────────────────────────────────────────────────────────

install-all:
	@echo "=== Installing Foundry dependencies ==="
	cd contracts && forge install --no-git foundry-rs/forge-std 2>/dev/null || true
	cd contracts && forge install --no-git OpenZeppelin/openzeppelin-contracts 2>/dev/null || true
	@echo ""
	@echo "=== Installing frontend dependencies ==="
	cd frontend && npm install
	@echo ""
	@echo "✅ All dependencies installed."

# ── Build Contracts ───────────────────────────────────────────────────

contracts-build:
	@echo "=== Building contracts ==="
	cd contracts && forge build
	@echo "✅ Contracts built."

# ── Test Contracts ────────────────────────────────────────────────────

contracts-test:
	@echo "=== Testing contracts ==="
	cd contracts && forge test -vvvv
	@echo "✅ Contract tests passed."

# ── Generate Wagmi Hooks ──────────────────────────────────────────────

wagmi-gen: contracts-build
	@echo "=== Generating Wagmi hooks ==="
	cd frontend && npx wagmi generate
	@echo "✅ Wagmi hooks generated."

# ── Deploy to Anvil ───────────────────────────────────────────────────

deploy-anvil:
	@echo "=== Deploying to Anvil (localhost:8545) ==="
	cd contracts && forge script script/DeployNFToken.s.sol \
		--rpc-url http://localhost:8545 \
		--broadcast \
		--interactives 1
	@echo "✅ Deployed to Anvil."
	$(MAKE) post-deploy-setup CHAIN_ID=31337

# ── Deploy to Sepolia ─────────────────────────────────────────────────

deploy-sepolia:
	@echo "=== Deploying to Sepolia ==="
	cd contracts && set -a && . ../.env && set +a && forge script script/DeployNFToken.s.sol \
		--rpc-url sepolia \
		--broadcast \
		--verify \
		--interactives 1
	@echo "✅ Deployed to Sepolia."
	$(MAKE) post-deploy-setup CHAIN_ID=11155111

# ── Post-Deploy Setup ─────────────────────────────────────────────────

post-deploy-setup:
	@echo "=== Extracting contract address ==="
	chmod +x scripts/extract-address.sh
	./scripts/extract-address.sh $(CHAIN_ID)
	@echo ""
	@echo "=== Regenerating Wagmi hooks ==="
	cd frontend && npx wagmi generate
	@echo "✅ Post-deploy setup complete."

# ── Frontend ──────────────────────────────────────────────────────────

frontend-dev:
	@echo "=== Starting frontend dev server ==="
	cd frontend && npm run dev

frontend-build:
	@echo "=== Building frontend for production ==="
	cd frontend && npm run build
	@echo "✅ Frontend production build complete."

frontend-start:
	@echo "=== Starting production server on http://localhost:3000 ==="
	cd frontend && npm start

frontend-prod:
	$(MAKE) frontend-build
	$(MAKE) frontend-start

frontend-test:
	@echo "=== Running frontend tests ==="
	cd frontend && npm run test
	@echo "✅ Frontend tests passed."

# ── Clean ─────────────────────────────────────────────────────────────

clean:
	@echo "=== Cleaning artifacts ==="
	cd contracts && forge clean
	rm -rf frontend/.next
	rm -rf frontend/node_modules
	rm -rf frontend/src/generated.ts
	@echo "✅ Clean complete."
