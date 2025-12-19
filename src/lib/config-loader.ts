import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import type { ChainConfig } from "@/types/chain";
import type { WalletConfig } from "@/types/wallet";
import type { TokenConfig } from "@/types/token";

const assetsRoot = join(process.cwd(), "src", "assets");

/**
 * Load all chain configurations from src/assets/chains/{namespace}/{reference}/chain.json
 */
function loadChains(): ChainConfig[] {
  const chains: ChainConfig[] = [];
  const chainsDir = join(assetsRoot, "chains");

  if (!existsSync(chainsDir)) return chains;

  const namespaceDirs = readdirSync(chainsDir);
  for (const namespace of namespaceDirs) {
    const namespaceFull = join(chainsDir, namespace);
    if (!statSync(namespaceFull).isDirectory()) continue;

    const referenceDirs = readdirSync(namespaceFull);
    for (const reference of referenceDirs) {
      const refFull = join(namespaceFull, reference);
      if (!statSync(refFull).isDirectory()) continue;

      const jsonPath = join(refFull, "chain.json");
      if (existsSync(jsonPath)) {
        const content = readFileSync(jsonPath, "utf-8");
        const config = JSON.parse(content) as ChainConfig;
        chains.push(config);
      }
    }
  }

  return chains;
}

/**
 * Load all wallet configurations from src/assets/wallets/{walletId}/wallet.json
 */
function loadWallets(): WalletConfig[] {
  const wallets: WalletConfig[] = [];
  const walletsDir = join(assetsRoot, "wallets");

  if (!existsSync(walletsDir)) return wallets;

  const entries = readdirSync(walletsDir);
  for (const entry of entries) {
    const full = join(walletsDir, entry);
    if (!statSync(full).isDirectory()) continue;

    const jsonPath = join(full, "wallet.json");
    if (existsSync(jsonPath)) {
      const content = readFileSync(jsonPath, "utf-8");
      const config = JSON.parse(content) as WalletConfig;
      wallets.push(config);
    }
  }

  return wallets;
}

/**
 * Load all token configurations from src/assets/tokens/{namespace}/{reference}/{address}/token.json
 */
function loadTokens(): TokenConfig[] {
  const tokens: TokenConfig[] = [];
  const tokensDir = join(assetsRoot, "tokens");

  if (!existsSync(tokensDir)) return tokens;

  const namespaceDirs = readdirSync(tokensDir);
  for (const namespace of namespaceDirs) {
    const namespaceFull = join(tokensDir, namespace);
    if (!statSync(namespaceFull).isDirectory()) continue;

    const referenceDirs = readdirSync(namespaceFull);
    for (const reference of referenceDirs) {
      const refFull = join(namespaceFull, reference);
      if (!statSync(refFull).isDirectory()) continue;

      const addressDirs = readdirSync(refFull);
      for (const addressDir of addressDirs) {
        const addrFull = join(refFull, addressDir);
        if (!statSync(addrFull).isDirectory()) continue;

        const jsonPath = join(addrFull, "token.json");
        if (existsSync(jsonPath)) {
          const content = readFileSync(jsonPath, "utf-8");
          const config = JSON.parse(content) as TokenConfig;
          tokens.push(config);
        }
      }
    }
  }

  return tokens;
}

// Cache loaded configs
let cachedChains: ChainConfig[] | null = null;
let cachedWallets: WalletConfig[] | null = null;
let cachedTokens: TokenConfig[] | null = null;

/**
 * Get all chain configurations.
 *
 * Filtering rules:
 * - chainId omitted        -> return all chains
 * - chainId = "eip155"     -> filter by protocol namespace (e.g. all EVM chains)
 * - chainId = "eip155:1"   -> filter by concrete chain (full CAIP id)
 */
export function getChains(chainId?: string): ChainConfig[] {
  if (cachedChains === null) {
    cachedChains = loadChains();
  }

  let result = cachedChains;

  if (chainId) {
    if (!chainId.includes(":")) {
      // Filter by protocol namespace only (e.g. "eip155")
      result = cachedChains.filter((chain) => chain.chainId.startsWith(`${chainId}:`));
    } else {
      // Filter by full CAIP-2 chainId (e.g. "eip155:1")
      result = cachedChains.filter((chain) => chain.chainId === chainId);
    }
  }

  return result;
}

/**
 * Get all wallet configurations.
 */
export function getWallets(): WalletConfig[] {
  if (cachedWallets === null) {
    cachedWallets = loadWallets();
  }
  return cachedWallets;
}

/**
 * Get all token configurations.
 *
 * Filtering rules (same as chains):
 * - chainId omitted      -> return all tokens
 * - chainId = "eip155"   -> tokens on all chains within this protocol
 * - chainId = "eip155:1" -> tokens only on that specific chain
 */
export function getTokens(chainId?: string): TokenConfig[] {
  if (cachedTokens === null) {
    cachedTokens = loadTokens();
  }

  let result = cachedTokens;

  if (chainId) {
    if (!chainId.includes(":")) {
      // Filter by protocol namespace only
      result = cachedTokens.filter((token) => token.chainId.startsWith(`${chainId}:`));
    } else {
      // Filter by full CAIP-2 chainId
      result = cachedTokens.filter((token) => token.chainId === chainId);
    }
  }

  return result;
}
