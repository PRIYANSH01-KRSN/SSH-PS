import { GoogleGenAI } from "@google/genai";
import { calculateFairPriceML, normalizeDialectML } from "@/lib/mlEngine";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const { transcript, imageBase64, language } = body || {};

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return Response.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const cleanTranscript = transcript.trim();

    // 1. Run Dialect NLP & Regional Taxonomy Engine
    const dialectAnalysis = normalizeDialectML(cleanTranscript);

    // Try Gemini API first if API key is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const systemInstruction = `You are an expert Indian handicraft appraisal & dialect ethnography specialist under the Ministry of Social Justice & Empowerment (MoSJE).

CRITICAL GROUND TRUTH RULES:
1. THE ARTISAN'S SPOKEN TRANSCRIPT IS THE 100% SUPREME GROUND TRUTH:
   - The Product Title, Category, Materials, Dimensions, and Story MUST be built around what the artisan said in their transcript.
   - Identified Regional Cluster: ${dialectAnalysis.region_name} (Category: ${dialectAnalysis.detected_category}, GI Tag: ${dialectAnalysis.gi_tag_state}).
   - Matched Dialect Keywords: ${dialectAnalysis.matched_keywords.join(", ") || "Authentic Regional Craft"}.
   - Even if the image looks generic or shows something else, the catalog MUST match the ARTISAN'S SPOKEN CRAFT DESCRIPTION.
   - Use the image only as secondary visual verification for color hues and surface texture.

2. DIALECT & HERITAGE STORYTELLING:
   - In "description_hi" and "description_en", specifically translate and weave the artisan's spoken dialect story, technique (e.g. हाथ से चाक पर गढ़ा, ভাটায় পোড়ানো, जरकाम, মোম ঢালাই, প্রাকৃতিক জৈব রং), and cultural lineage.
   - Provide a "dialect_heritage_badge" (e.g., "📍 ${dialectAnalysis.region_name} • GI Certified").

3. REALISTIC & FAIR RURAL ARTISAN PRICING BENCHMARKS:
   - Calculate realistic rural market prices (NOT inflated into thousands for simple items).
   - Earthenware / Terracotta Diyas / Pots: Materials ₹30 - ₹100, Labor 1.5 - 3 hrs, Fair Price ₹180 - ₹380.
   - Blue Pottery / Madhubani / Folk Paintings: Materials ₹100 - ₹250, Labor 2.5 - 4.5 hrs, Fair Price ₹380 - ₹680.
   - Handloom Cotton Dupattas / Stoles: Materials ₹200 - ₹450, Labor 4 - 8 hrs, Fair Price ₹600 - ₹1200.
   - Pure Silk Sarees (Paithani / Kanchipuram / Baluchari): Materials ₹2500 - ₹5000, Labor 30 - 50 hrs, Fair Price ₹6000 - ₹12000.

Return STRICTLY a valid JSON object matching this schema:
{
  "title_en": "Professional marketing title in English derived strictly from artisan spoken description",
  "title_hi": "Clear product title in Hindi / regional dialect derived strictly from artisan spoken description",
  "category": "${dialectAnalysis.detected_category} Craft",
  "materials": ["Array of raw materials mentioned by artisan or craft type"],
  "dimensions": "Dimensions mentioned by artisan or 'पारंपरिक मानक आकार (Standard Handcrafted Size)'",
  "spoken_transcript": "${cleanTranscript}",
  "dialect_heritage_badge": "📍 ${dialectAnalysis.region_name}",
  "dialect_insights": "1-sentence summary of the regional dialect terms identified in the speech",
  "description_en": "2-3 sentence storytelling description in English capturing the exact craft story and technique described by the artisan",
  "description_hi": "2-3 sentence storytelling description in Hindi honoring the cultural heritage and craftsmanship spoken by the artisan",
  "ai_pricing": {
    "estimated_material_cost": 120,
    "estimated_crafting_hours": 2.5,
    "recommended_fair_price": 380,
    "valuation_reasoning": "उचित सामग्री लागत व ₹75/घंटा ग्रामीण मानदेय के आधार पर प्रमाणित मूल्यांकन"
  }
}`;

        const contents = [];

        // Put spoken transcript FIRST so the model prioritizes speech
        contents.push({
          text: `PRIMARY GROUND TRUTH - Artisan Spoken Craft Description (Language: ${language || "Auto-detect"}):\n"${cleanTranscript}"\n\nTask: Generate an e-commerce catalog listing representing this EXACT spoken craft.`,
        });

        if (imageBase64 && typeof imageBase64 === "string") {
          const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            contents.push({
              inlineData: {
                mimeType: match[1],
                data: match[2],
              },
            });
          }
        }

        let response;
        try {
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
            },
          });
        } catch {
          response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
            },
          });
        }

        const rawText = response.text || "";
        const cleanJson = rawText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        const parsedData = JSON.parse(cleanJson);
        parsedData.spoken_transcript = cleanTranscript;
        parsedData.dialect_analysis = dialectAnalysis;
        if (!parsedData.dialect_heritage_badge) {
          parsedData.dialect_heritage_badge = `📍 ${dialectAnalysis.region_name}`;
        }
        return Response.json(parsedData, { status: 200 });
      } catch (geminiError) {
        console.warn("Gemini API cataloging failed, falling back to built-in ML NLP engine:", geminiError.message);
      }
    }

    // High-precision ML + Regional NLP Heuristic Fallback Engine
    const category = dialectAnalysis.detected_category || "Terracotta";
    
    // Determine realistic material and labor costs based on craft category
    let matCost = 100;
    let laborHrs = 2.5;
    let recPrice = 340;
    let title_en = `Handcrafted ${category} Heritage Craft`;
    let title_hi = `पारंपरिक हस्तनिर्मित ${category} शिल्प`;
    let desc_en = `Authentic handcrafted ${category.toLowerCase()} created according to the artisan's exact spoken words: "${cleanTranscript}". Handcrafted by master artisans preserving generational craft heritage.`;
    let desc_hi = `कारीगर द्वारा बताए गए मूल विवरण के अनुसार हस्तनिर्मित ${category} शिल्प: "${cleanTranscript}"। प्राकृतिक सामग्रियों और पारंपरिक तकनीक से तैयार।`;

    const lower = cleanTranscript.toLowerCase();

    if (lower.includes("বাঁকুড়া") || lower.includes("ঘোড়া") || lower.includes("bankura") || lower.includes("horse") || lower.includes("পোড়ামাটি")) {
      title_en = "Authentic Bankura Terracotta Horse (GI Tagged)";
      title_hi = "बांकुड़ा पोड़ामार्टी घोड़ा (पश्चिम बंगाल पारंपरिक शिल्प)";
      desc_en = `Iconic GI-certified Bankura terracotta horse handcrafted by traditional artisans of Bishnupur, West Bengal. Spoken description: "${cleanTranscript}".`;
      desc_hi = `पश्चिम बंगाल के बांकुड़ा का प्रसिद्ध जीआई-प्रमाणित टेराकोटा घोड़ा। कारीगर का विवरण: "${cleanTranscript}"।`;
      matCost = 120;
      laborHrs = 3;
      recPrice = 420;
    } else if (lower.includes("লেদার") || lower.includes("ব্যাগ") || lower.includes("leather") || lower.includes("bag") || lower.includes("শান্তিনিকেতন")) {
      title_en = "Handcrafted Shantiniketan Embossed Leather Bag";
      title_hi = "शांतिनिकेतन लेदर हैंडबैग (पश्चिम बंगाल)";
      desc_en = `Vegetable-tanned embossed leather bag handcrafted in Shantiniketan, West Bengal. Spoken description: "${cleanTranscript}".`;
      desc_hi = `शांतिनिकेतन का प्रसिद्ध हस्तनिर्मित चमड़े का एम्बोस्ड बैग। कारीगर का विवरण: "${cleanTranscript}"।`;
      matCost = 280;
      laborHrs = 4;
      recPrice = 750;
    } else if (lower.includes("साड़ी") || lower.includes("शাড়ি") || lower.includes("saree") || lower.includes("silk") || lower.includes("रेशम") || lower.includes("पैठणी")) {
      title_en = "Handwoven Pure Heritage Silk Saree";
      title_hi = "हस्तनिर्मित पारंपरिक रेशमी साड़ी";
      desc_en = `Exquisite handwoven pure silk saree featuring traditional motifs and heritage zari borders. Spoken description: "${cleanTranscript}".`;
      desc_hi = `शुद्ध रेशम और पारंपरिक जरी काम से युक्त हस्तनिर्मित रेशमी साड़ी। कारीगर का विवरण: "${cleanTranscript}"।`;
      matCost = 1800;
      laborHrs = 24;
      recPrice = 4800;
    } else if (lower.includes("ब्लू पॉटरी") || lower.includes("blue pottery") || lower.includes("फूलदान") || lower.includes("vase") || lower.includes("जयपुर")) {
      title_en = "Handcrafted Jaipur Blue Pottery Floral Vase";
      title_hi = "जयपुर पारंपरिक ब्लू पॉटरी सिरेमिक फूलदान";
      desc_en = `Authentic Jaipur blue pottery floral vase crafted from quartz stone powder and natural cobalt glaze. Spoken description: "${cleanTranscript}".`;
      desc_hi = `जयपुर की प्रसिद्ध पारंपरिक ब्लू पॉटरी फूलदान। कारीगर का विवरण: "${cleanTranscript}"।`;
      matCost = 140;
      laborHrs = 3;
      recPrice = 480;
    } else if (lower.includes("मधुबनी") || lower.includes("madhubani") || lower.includes("पेंटिंग") || lower.includes("painting") || lower.includes("मिथिला")) {
      title_en = "Traditional Mithila Madhubani Folk Art Painting";
      title_hi = "बिहार की पारंपरिक मधुबनी हस्तकला पेंटिंग";
      desc_en = `Traditional Mithila Madhubani painting created on handmade paper with organic botanical pigments. Spoken description: "${cleanTranscript}".`;
      desc_hi = `बिहार के मिथिलांचल की पारंपरिक मधुबनी पेंटिंग। कारीगर का विवरण: "${cleanTranscript}"।`;
      matCost = 120;
      laborHrs = 3.5;
      recPrice = 450;
    } else if (lower.includes("टेराकोटा") || lower.includes("मिट्टी") || lower.includes("diya") || lower.includes("घड़ा") || lower.includes("pot") || lower.includes("गोरखपुर")) {
      title_en = "Handcrafted Terracotta Clay Diya Pot";
      title_hi = "हस्तनिर्मित पारंपरिक मिट्टी का दीपक / पात्र";
      desc_en = `Wheel-thrown terracotta pot handcrafted by traditional rural artisans using natural clay. Spoken description: "${cleanTranscript}".`;
      desc_hi = `पारंपरिक चाक पर हाथ से गढ़ा गया मिट्टी का पात्र। कारीगर का विवरण: "${cleanTranscript}"।`;
      matCost = 70;
      laborHrs = 2;
      recPrice = 250;
    }

    const fallbackCatalog = {
      title_en,
      title_hi,
      category: category + " Craft",
      materials: ["प्राकृतिक कच्चा माल व जैविक रंग (Natural Materials & Dyes)"],
      dimensions: "पारंपरिक मानक आकार (Standard Handcrafted Size)",
      spoken_transcript: cleanTranscript,
      dialect_heritage_badge: `📍 ${dialectAnalysis.region_name}`,
      dialect_insights: dialectAnalysis.dialect_summary,
      description_en: desc_en,
      description_hi: desc_hi,
      ai_pricing: {
        estimated_material_cost: matCost,
        estimated_crafting_hours: laborHrs,
        recommended_fair_price: recPrice,
        valuation_reasoning: `ग्रामीण मानदेय (₹75/घंटा) व वास्तविक सामग्री लागत के आधार पर उचित मूल्यांकन।`,
      },
      dialect_analysis: dialectAnalysis,
    };

    return Response.json(fallbackCatalog, { status: 200 });
  } catch (error) {
    console.error("Error in catalog generation route:", error);
    return Response.json(
      {
        error: "Failed to generate catalog",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
