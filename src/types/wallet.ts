export interface WalletConfig {
  id: string;
  name: string;
  icon: string;
  // Additional basic info can be added here
  [key: string]: unknown;
}
