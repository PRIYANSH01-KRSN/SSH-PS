import { NextResponse } from "next/server";
import { verifyCraftAuthenticityML, AuthenticityMLInput } from "@/lib/mlEngine";

export async function POST(request: Request) {
  try {
    const body: AuthenticityMLInput = await request.json();

    const verification = verifyCraftAuthenticityML(body);

    return NextResponse.json({
      success: true,
      data: verification,
    });
  } catch (error: any) {
    console.error("ML Vision Verification Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify authenticity" },
      { status: 500 }
    );
  }
}
