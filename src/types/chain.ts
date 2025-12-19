// CAIP-2 format chainId, e.g. "eip155:1"
export type ChainId = string;

export interface ChainConfig {
  chainId: ChainId;
  name: string;
  icon: string;
  // Additional basic info can be added here
  [key: string]: unknown;
}
