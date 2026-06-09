import { describe, it, expect } from "vitest";
import { GET } from "../tokens/route";
import { NextRequest } from "next/server";
import type { TokenConfig } from "@/types/token";

describe("GET /api/tokens", () => {
  it("should return all tokens without filter", async () => {
    const request = new NextRequest("http://localhost:3000/api/tokens");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.count).toBe(data.data.length);
  });

  it("should filter by protocol namespace", async () => {
    const request = new NextRequest("http://localhost:3000/api/tokens?chainId=eip155");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    if (data.data.length > 0) {
      expect(data.data.every((token: TokenConfig) => token.chainId.startsWith("eip155:"))).toBe(true);
    }
  });

  it("should filter by specific chainId", async () => {
    const request = new NextRequest("http://localhost:3000/api/tokens?chainId=eip155:1");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    if (data.data.length > 0) {
      expect(data.data.every((token: TokenConfig) => token.chainId === "eip155:1")).toBe(true);
    }
  });
});
