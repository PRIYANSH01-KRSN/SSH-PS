import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request) {
  try {
    const { text, type } = await request.json();

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are Shilp Sathi AI for Indian traditional artisans. Enhance the following artisan craft text (${type || "description"}): "${text}". Make it compelling, culturally authentic, and SEO-rich in both English and Hindi. Return a JSON object with 'enhanced_en' and 'enhanced_hi'.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

    return NextResponse.json({
      success: true,
      result: JSON.parse(cleanJson),
    });
  } catch (error) {
    console.error("Gemini Enhance Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance description" },
      { status: 500 }
    );
  }
}

