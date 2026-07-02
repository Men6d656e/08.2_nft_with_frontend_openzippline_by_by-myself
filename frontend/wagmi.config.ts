import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      project: "../contracts",
      include: ["NFToken.sol/**/*.json"],
      exclude: ["build-info/**/*.json"],
    }),
    react(),
  ],
});
