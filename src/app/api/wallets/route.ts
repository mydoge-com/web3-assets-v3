import { NextResponse } from "next/server";
import { getWallets } from "@/lib/config-loader";

export const runtime = 'edge';

/**
 * GET /api/wallets
 */
export async function GET() {
  try {
    const wallets = getWallets();

    return NextResponse.json({
      success: true,
      data: wallets,
      count: wallets.length,
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
