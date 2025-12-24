# Web3 Assets API

A Next.js-based Web3 resource management middleware layer that provides static configuration APIs for chains, wallets, and tokens. Supports multi-chain, multi-wallet, and multi-token configurations.

## Limitations
- Only deploy to Cloudflare Pages.
- Only use edge runtime for API routes.
> edge runtime is required for Cloudflare Pages deployment. Node.js runtime is not supported. docs: https://nextjs.org/docs/app/api-reference/edge#unsupported-apis

## Features

- ✅ Multi-chain support with CAIP-2 format chainId (e.g., `eip155:1`)
- ✅ Multi-wallet configuration
- ✅ Multi-token configuration with chain-specific organization
- ✅ RESTful API endpoints for querying configurations
- ✅ Filter by chainId support
- ✅ Cloudflare Workers deployment ready
- ✅ Organized directory structure for easy PR submissions

## Project Structure

```
src/
├── assets/                    # Configuration and icon files (follows proximity principle)
│   ├── chains/
│   │   └── eip155-1/
│   │       ├── index.ts      # Chain configuration
│   │       └── icon.svg      # Chain icon
│   ├── wallets/
│   │   └── metamask/
│   │       ├── index.ts      # Wallet configuration
│   │       └── icon.svg      # Wallet icon
│   └── tokens/
│       └── eip155-1/
│           └── 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/    # Token directory (address lowercase)
│               ├── index.ts   # Token configuration
│               └── icon.svg  # Token icon
├── app/
│   └── api/
│       ├── chains/route.ts   # GET /api/chains
│       ├── wallets/route.ts # GET /api/wallets
│       └── tokens/route.ts  # GET /api/tokens
├── lib/
│   └── config-loader.ts      # Configuration loading utilities
└── types/
    ├── chain.ts              # Chain type definitions
    ├── wallet.ts             # Wallet type definitions
    └── token.ts              # Token type definitions
```

## API Endpoints

### Get All Chains

```bash
GET /api/chains
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "chainId": "eip155:1",
      "name": "Ethereum",
      "icon": "/_next/static/media/icon.XXXX.svg" // example URL
    }
  ],
  "count": 1
}
```

### Get Chain by chainId

```bash
GET /api/chains?chainId=eip155:1
```

### Get All Wallets

```bash
GET /api/wallets
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "metamask",
      "name": "MetaMask",
      "icon": "/_next/static/media/icon.XXXX.svg" // example URL
    }
  ],
  "count": 1
}
```

### Get All Tokens

```bash
GET /api/tokens
```

### Get Tokens by chainId

```bash
GET /api/tokens?chainId=eip155:1
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "chainId": "eip155:1",
      "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      "name": "USD Coin",
      "symbol": "USDC",
      "decimals": 6,
      "icon": "/_next/static/media/icon.XXXX.svg" // example URL
    }
  ],
  "count": 1
}
```

## Adding New Configurations

### Adding a New Chain

1. Create directory: `src/assets/chains/eip155-{chainId}/`
2. Add `icon.svg` in the same directory
3. Create `index.ts`:
```typescript
import type { ChainConfig } from "@/types/chain";
import iconUrl from "./icon.svg";

export const chainName: ChainConfig = {
  chainId: "eip155:1",
  name: "Chain Name",
  icon: iconUrl,
};
```
4. Export in `src/assets/chains/index.ts`:
```typescript
export { chainName } from "./eip155-1";
```

### Adding a New Wallet

1. Create directory: `src/assets/wallets/{wallet-id}/`
2. Add `icon.svg` in the same directory
3. Create `index.ts`:
```typescript
import type { WalletConfig } from "@/types/wallet";
import iconUrl from "./icon.svg";

export const walletName: WalletConfig = {
  id: "wallet-id",
  name: "Wallet Name",
  icon: iconUrl,
};
```
4. Export in `src/assets/wallets/index.ts`

### Adding a New Token

1. Create directory: `src/assets/tokens/eip155-{chainId}/{address-lowercase}/`
   - Example: `src/assets/tokens/eip155-1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/`
2. Add `icon.svg` in the same directory
3. Create `index.ts`:
```typescript
import type { TokenConfig } from "@/types/token";
import iconUrl from "./icon.svg";

export const tokenName: TokenConfig = {
  chainId: "eip155:1",
  address: "0x...", // lowercase
  name: "Token Name",
  symbol: "SYMBOL",
  decimals: 18,
  icon: iconUrl,
};
```
4. Export in `src/assets/tokens/eip155-{chainId}/index.ts`

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview with Cloudflare adapter
pnpm preview

# Deploy to Cloudflare Workers
pnpm deploy
```

## Cloudflare Workers Deployment

This project is configured for deployment to Cloudflare Workers using the OpenNext adapter.

### Configuration Files

- `wrangler.jsonc` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext adapter configuration

### Build Process

The build process:
1. Next.js Turbopack automatically processes SVG imports as static assets
2. Builds the Next.js application with all assets bundled
3. Prepares for Cloudflare Workers deployment via OpenNext adapter

**Note**: Icons are imported directly in configuration files using ES6 `import` syntax (e.g., `import iconUrl from './icon.svg'`). Next.js Turbopack handles the asset processing and URL generation automatically - no additional configuration needed.

## Environment Variables & Secrets

This project is designed so that **all sensitive deployment information is provided via environment variables**, not hard-coded in the repository.

- **Next.js environment variables**
  - Use `.env.local` for local development (never commit this file).
  - Use `NEXT_PUBLIC_*` variables only for non-sensitive values that can be exposed to the browser.
  - Server-only secrets (API keys, private endpoints, etc.) should be plain (non-`NEXT_PUBLIC_`) variables and accessed via `process.env.MY_SECRET`.

- **Cloudflare Workers secrets**
  - Configure secrets using `wrangler` (for example: `wrangler secret put MY_SECRET`).
  - Reference them in Workers runtime via the environment bindings configured in `wrangler.jsonc` / `wrangler.toml`.
  - Do not commit any secret values to Git; only commit the names and usage in code.

When adding new chains, wallets, or tokens that require external services (RPC endpoints, indexer APIs, etc.), always:
- Put sensitive URLs/keys into environment variables.
- Reference them from code via `process.env` or Cloudflare env bindings.

## ChainId Format

This project uses the CAIP-2 (Chain Agnostic Improvement Proposal) format for chainId:
- Format: `{namespace}:{reference}`
- Example: `eip155:1` (Ethereum Mainnet)
- Reference: https://chainagnostic.org/

## License

MIT
