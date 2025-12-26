import { NextRequest, NextResponse } from "next/server";
import { getWallets } from "@/lib/config-loader";

export const runtime = "edge";

/**
 * OPTIONS /api/wallets - Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

/**
 * GET /api/wallets
 */
export async function GET(request?: NextRequest) {
  try {
    const searchParams = request?.nextUrl.searchParams || undefined;
    const walletId = searchParams?.get("walletId") || undefined;
    const wallets = getWallets(walletId);

    const response = NextResponse.json({
      success: true,
      data: wallets,
      count: wallets.length,
    });

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    const response = NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );

    // Add CORS headers to error response
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  }
}
