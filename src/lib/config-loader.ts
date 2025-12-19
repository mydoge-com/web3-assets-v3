import type { ChainConfig } from "@/types/chain";
import type { WalletConfig } from "@/types/wallet";
import type { TokenConfig } from "@/types/token";

// Import pre-generated assets index (generated at build time)
import { chains, wallets, tokens } from "./assets-index";

/**
 * Generic filter function for chainId-based filtering.
 * Supports both protocol namespace (e.g., "eip155") and full CAIP-2 (e.g., "eip155:1").
 */
function filterByChainId<T extends { chainId: string }>(
  items: T[],
  chainId?: string
): T[] {
  if (!chainId) return items;

  if (!chainId.includes(":")) {
    // Filter by protocol namespace only (e.g., "eip155")
    return items.filter((item) => item.chainId.startsWith(`${chainId}:`));
  } else {
    // Filter by full CAIP-2 chainId (e.g., "eip155:1")
    return items.filter((item) => item.chainId === chainId);
  }
}

/**
 * Get all chain configurations.
 *
 * Filtering rules:
 * - chainId omitted        -> return all chains
 * - chainId = "eip155"     -> filter by protocol namespace (e.g., all EVM chains)
 * - chainId = "eip155:1"   -> filter by concrete chain (full CAIP id)
 */
export function getChains(chainId?: string): ChainConfig[] {
  return filterByChainId(chains, chainId);
}

/**
 * Get all wallet configurations.
 */
export function getWallets(): WalletConfig[] {
  return wallets;
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
  return filterByChainId(tokens, chainId);
}
