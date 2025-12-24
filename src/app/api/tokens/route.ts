import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "@/lib/config-loader";

export const runtime = 'edge';

/**
 * GET /api/tokens
 * Query params:
 *   - chainId: Optional CAIP-2 format chainId to filter (e.g. "eip155:1")
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const chainId = searchParams.get("chainId") || undefined;

    const tokens = getTokens(chainId);

    return NextResponse.json({
      success: true,
      data: tokens,
      count: tokens.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
