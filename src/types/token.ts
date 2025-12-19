import type { ChainId } from "./chain";

export interface TokenConfig {
  chainId: ChainId;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  // Additional basic info can be added here
  [key: string]: unknown;
}
