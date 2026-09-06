import { NextResponse } from "next/server";
import { calculateFairPriceML, PricingMLInput } from "@/lib/mlEngine";

export async function POST(request: Request) {
  try {
    const body: PricingMLInput = await request.json();

    const prediction = calculateFairPriceML(body);

    return NextResponse.json({
      success: true,
      data: prediction,
    });
  } catch (error: any) {
    console.error("ML Pricing Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate fair pricing" },
      { status: 500 }
    );
  }
}
