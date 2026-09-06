import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageBase64, text, type } = body || {};

    // 1. Text Enhancement mode
    if (text) {
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are Shilp Sathi AI for Indian traditional artisans. Enhance the following artisan craft text (${type || "description"}): "${text}". Make it compelling, culturally authentic, and SEO-rich in both English and Hindi. Return a JSON object with 'enhanced_en' and 'enhanced_hi'.`,
            config: {
              responseMimeType: "application/json",
            },
          });

          const rawText = response.text || "{}";
          const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
          return NextResponse.json({
            success: true,
            result: JSON.parse(cleanJson),
          });
        } catch (err) {
          console.warn("Text enhance fallback:", err.message);
        }
      }

      return NextResponse.json({
        success: true,
        result: {
          enhanced_en: `Authentic handcrafted artisan craft: ${text}`,
          enhanced_hi: `पारंपरिक कारीगरी से निर्मित उत्कृष्ट शिल्प: ${text}`,
        },
      });
    }

    // 2. Image Vision Enhancement & Studio Analysis Mode
    if (imageBase64 && typeof imageBase64 === "string") {
      let visionAnalysis = {
        subject_detected: "Handicraft Artefact",
        clean_background_recommended: true,
        lighting_correction: { brightness: 1.12, contrast: 1.18, saturation: 1.22 },
        color_palette: ["Earthy Terracotta", "Natural Indigo", "Warm Gold"],
        quality_score: 95,
      };

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
          
          if (match) {
            const contents = [
              {
                inlineData: {
                  mimeType: match[1],
                  data: match[2],
                },
              },
              {
                text: "Analyze this handicraft image for automated e-commerce studio cleanup. Identify the main craft subject, surface texture, background clutter level, and optimal lighting balance. Return strictly JSON matching: { 'subject_name': '...', 'clutter_level': 'HIGH/MEDIUM/LOW', 'lighting_correction': { 'brightness': 1.15, 'contrast': 1.18, 'saturation': 1.20 }, 'craft_material': '...', 'studio_readiness_score': 96 }",
              },
            ];

            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents,
              config: {
                responseMimeType: "application/json",
              },
            });

            const cleanJson = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
            visionAnalysis = { ...visionAnalysis, ...JSON.parse(cleanJson) };
          }
        } catch (err) {
          console.warn("Gemini vision analysis fallback:", err.message);
        }
      }

      return NextResponse.json({
        success: true,
        analysis: visionAnalysis,
      });
    }

    return NextResponse.json(
      { error: "No image or text provided for enhancement." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Enhance Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process enhancement request" },
      { status: 500 }
    );
  }
}
