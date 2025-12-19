# Work Log

## 2025-12-19

- 2025-12-19 – Initial project setup with Next.js 16, base app router structure, and Tailwind.
- 2025-12-19 – Added Cloudflare Workers support via `@opennextjs/cloudflare`, `wrangler`, `wrangler.jsonc`, and `open-next.config.ts`.
- 2025-12-19 – Defined core TypeScript types for `ChainConfig`, `WalletConfig`, and `TokenConfig` with CAIP-formatted `chainId`.
- 2025-12-19 – Introduced `src/assets` structure combining config + icons for chains, wallets, and tokens (proximity-based layout).
- 2025-12-19 – Implemented example configs for Ethereum mainnet, MetaMask, and USDC on `eip155:1`.
- 2025-12-19 – Implemented `config-loader` utilities and REST APIs for `/api/chains`, `/api/wallets`, and `/api/tokens` with optional `chainId` filtering.
- 2025-12-19 – Refactored icon handling: replaced asset-copy script with ES6 `import` statements in config files. Icons are now imported directly (e.g., `import iconUrl from './icon.svg'`), and Next.js 16 Turbopack handles asset processing automatically without additional configuration. Removed `scripts/copy-assets.ts` and simplified build scripts. Updated all config files (chains, wallets, tokens) to use direct SVG imports.
- 2025-12-19 – Adjusted token directory naming convention to use the pure lowercase contract address only (e.g., `.../0xa0b8...e3606eb48/`), removing any symbol suffix for clarity and standardization.
