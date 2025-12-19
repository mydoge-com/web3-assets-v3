import { describe, it, expect, beforeEach } from "vitest";
import { getChains, getWallets, getTokens } from "../config-loader";

describe("config-loader", () => {
  describe("getChains", () => {
    it("should return all chains when no filter is provided", () => {
      const chains = getChains();
      expect(chains.length).toBeGreaterThan(0);
      expect(chains.every((chain) => chain.chainId && chain.name && chain.icon)).toBe(true);
    });

    it("should filter by protocol namespace (eip155)", () => {
      const chains = getChains("eip155");
      expect(chains.length).toBeGreaterThan(0);
      expect(chains.every((chain) => chain.chainId.startsWith("eip155:"))).toBe(true);
    });

    it("should filter by specific chainId (eip155:1)", () => {
      const chains = getChains("eip155:1");
      expect(chains.length).toBeGreaterThanOrEqual(0);
      if (chains.length > 0) {
        expect(chains.every((chain) => chain.chainId === "eip155:1")).toBe(true);
      }
    });

    it("should return empty array for non-existent chainId", () => {
      const chains = getChains("eip155:99999");
      expect(chains).toEqual([]);
    });
  });

  describe("getWallets", () => {
    it("should return all wallets", () => {
      const wallets = getWallets();
      expect(wallets.length).toBeGreaterThan(0);
      expect(wallets.every((wallet) => wallet.id && wallet.name && wallet.icon)).toBe(true);
    });

    it("should have unique wallet ids", () => {
      const wallets = getWallets();
      const ids = wallets.map((w) => w.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("getTokens", () => {
    it("should return all tokens when no filter is provided", () => {
      const tokens = getTokens();
      expect(tokens.length).toBeGreaterThan(0);
      expect(
        tokens.every(
          (token) =>
            token.chainId &&
            token.address &&
            token.name &&
            token.symbol &&
            token.decimals !== undefined &&
            token.icon
        )
      ).toBe(true);
    });

    it("should filter by protocol namespace (eip155)", () => {
      const tokens = getTokens("eip155");
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens.every((token) => token.chainId.startsWith("eip155:"))).toBe(true);
    });

    it("should filter by specific chainId (eip155:1)", () => {
      const tokens = getTokens("eip155:1");
      expect(tokens.length).toBeGreaterThanOrEqual(0);
      if (tokens.length > 0) {
        expect(tokens.every((token) => token.chainId === "eip155:1")).toBe(true);
      }
    });

    it("should return empty array for non-existent chainId", () => {
      const tokens = getTokens("eip155:99999");
      expect(tokens).toEqual([]);
    });

    it("should have valid token addresses (lowercase hex)", () => {
      const tokens = getTokens();
      tokens.forEach((token) => {
        expect(token.address).toMatch(/^0x[a-f0-9]{40}$/);
      });
    });
  });
});
