"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import VoiceInput from "@/components/VoiceInput";
import ImageUploader from "@/components/ImageUploader";
import PricingAndExport from "@/components/PricingAndExport";
import Marketplace, { ProductItem, DEFAULT_MARKETPLACE_PRODUCTS } from "@/components/Marketplace";
import InventoryManager from "@/components/InventoryManager";
import VoiceAudioPlayer from "@/components/VoiceAudioPlayer";
import LanguageSelector from "@/components/LanguageSelector";
import { SupportedLanguage, getTranslation } from "@/lib/translations";
import {
  Sparkles,
  Languages,
  Loader2,
  Store,
  Mic2,
  Package,
  Edit3,
  ExternalLink,
  Cpu,
  Quote,
  Compass,
  Tag,
} from "lucide-react";

interface CatalogDataType {
  title_en?: string;
  title_hi?: string;
  category?: string;
  materials?: string[] | string;
  dimensions?: string;
  spoken_transcript?: string;
  dialect_heritage_badge?: string;
  dialect_insights?: string;
  description_en?: string;
  description_hi?: string;
  ai_pricing?: {
    estimated_material_cost?: number;
    estimated_crafting_hours?: number;
    recommended_fair_price?: number;
    valuation_reasoning?: string;
  };
  dialect_analysis?: {
    detected_category?: string;
    region_name?: string;
    gi_tag_state?: string;
    matched_keywords?: string[];
    confidence_score_pct?: number;
  };
}

const REGIONAL_DEMO_PRESETS: Record<string, { image: string; catalog: CatalogDataType }> = {
  bn: {
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600",
    catalog: {
      title_en: "Authentic Bankura Terracotta Horse (GI Tagged)",
      title_hi: "बांकुड़ा पोड़ामार्टी घोड़ा (पश्चिम बंगाल पारंपरिक शिल्प)",
      category: "Terracotta Craft",
      materials: ["পোড়ামাটি (Terracotta Clay)", "প্রাকৃতিক রং (Natural Earth Colors)"],
      dimensions: "১৮ ইঞ্চি x ১২ ইঞ্চি",
      spoken_transcript: "এটি বাঁকুড়ার বিখ্যাত ১৮ ইঞ্চির ঐতিহ্যবাহী পোড়ামাটির ঘোড়া। সম্পূর্ণ হাতে গড়া ও ভাটায় পোড়ানো।",
      dialect_heritage_badge: "📍 বাঁকুড়া / বিষ্ণুপুর (West Bengal) • GI Certified",
      dialect_insights: "শৈল্পিক বিশ্লেষণ: বাঁকুড়া পোড়ামাটি টেরাকোটা ঐতিহ্য ও ভাটায় পোড়ানো মাটির গঠন।",
      description_en: "Iconic GI-tagged Bankura terracotta horse handcrafted by traditional artisans of Bishnupur, West Bengal. Hand-sculpted with erect symmetrical ears according to the artisan's description: 'এটি বাঁকুড়ার বিখ্যাত ১৮ ইঞ্চির ঐতিহ্যবাহী পোড়ামাটির ঘোড়া'.",
      description_hi: "पश्चिम बंगाल के बांकुड़ा का प्रसिद्ध जीआई-प्रमाणित टेराकोटा घोड़ा। कारीगर के मूल विवरण के अनुसार हाथ से गढ़ा गया पारंपरिक मिट्टी शिल्प।",
      ai_pricing: {
        estimated_material_cost: 120,
        estimated_crafting_hours: 3,
        recommended_fair_price: 450,
        valuation_reasoning: "বাঁকুড়া পোড়ামাটি ক্লাস্টার মানদণ্ড ও ৩ ঘণ্টার কারুশিল্পের ভিত্তিতে ন্যায্য গ্রামীণ মূল্যায়ন।",
      },
      dialect_analysis: {
        detected_category: "Terracotta",
        region_name: "বাঁকুড়া (West Bengal)",
        gi_tag_state: "West Bengal",
        matched_keywords: ["পোড়ামাটি", "বাঁকুড়া", "ঘোড়া", "হাতে গড়া"],
        confidence_score_pct: 98,
      },
    },
  },
  mr: {
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600",
    catalog: {
      title_en: "Handwoven Yeola Paithani Pure Silk Saree",
      title_hi: "हस्तनिर्मित येवला पैठणी शुद्ध रेशमी साड़ी (महाराष्ट्र)",
      category: "Handloom Silk",
      materials: ["शुद्ध रेशीम (Mulberry Silk)", "सोनेरी जर (Gold Zari)"],
      dimensions: "६.२५ मीटर (ब्लाउज पीससह)",
      spoken_transcript: "महाराष्ट्राची सुप्रसिद्ध येवला पैठणी शुद्ध रेशमी साडी, अस्सल सोन्याच्या जरकाम मोराच्या पदरासह हाताने विणलेली.",
      dialect_heritage_badge: "📍 येवला / पैठण (Maharashtra) • GI Certified",
      dialect_insights: "बोली विश्लेषण: येवला हातमाग, शुद्ध रेशीम व मोर-पोपट जरकाम पारंपारिक वारसा.",
      description_en: "Masterpiece handwoven Yeola Paithani saree with traditional peacock motif (Mor Bangadi) pallu and pure gold zari borders, precisely as described by the master weaver.",
      description_hi: "महाराष्ट्र की प्रसिद्ध येवला पैठणी शुद्ध रेशमी साड़ी। कारीगर के मूल विवरण के अनुसार मोर डिजाइन और वास्तविक सुनहरे जरी काम से सुसज्जित।",
      ai_pricing: {
        estimated_material_cost: 2200,
        estimated_crafting_hours: 36,
        recommended_fair_price: 6500,
        valuation_reasoning: "पैठणी हातमाग जीआय क्लस्टर मानकांनुसार ३६ तासांच्या कारागिरीचे योग्य मूल्यांकन.",
      },
      dialect_analysis: {
        detected_category: "Handloom Silk",
        region_name: "येवला (Maharashtra)",
        gi_tag_state: "Maharashtra",
        matched_keywords: ["पैठणी", "येवला", "रेशमी", "साडी", "जरकाम"],
        confidence_score_pct: 99,
      },
    },
  },
  default: {
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600",
    catalog: {
      title_en: "Handcrafted Terracotta Clay Diya Pot",
      title_hi: "हस्तनिर्मित पारंपरिक मिट्टी का दीपक पात्र",
      category: "Terracotta Handicraft",
      materials: ["प्राकृतिक मिट्टी (Clay)", "जैविक रंग (Organic Dyes)"],
      dimensions: "15cm x 12cm",
      spoken_transcript: "यह गोरखपुर का 14 इंच का प्राकृतिक मिट्टी से बना नक्काशीदार टेराकोटा पात्र है। हाथ से चाक पर गढ़ा गया है।",
      dialect_heritage_badge: "📍 गोरखपुर (Uttar Pradesh) • GI Tagged Cluster",
      dialect_insights: "बोली विश्लेषण: गोरखपुर टेराकोटा क्लस्टर, पारंपरिक चाक शिल्प व प्राकृतिक दोमट मिट्टी।",
      description_en:
        "Exquisitely wheel-thrown terracotta pot handcrafted by traditional rural artisans according to the artisan's exact spoken words: 'यह गोरखपुर का 14 इंच का प्राकृतिक मिट्टी से बना नक्काशीदार टेराकोटा पात्र है'. Fired in conventional kilns.",
      description_hi:
        "कारीगर के मूल वक्तव्य के अनुसार चाक पर हाथ से गढ़ा गया गोरखपुर का प्रामाणिक मिट्टी का पात्र। सदियों पुरानी भारतीय विरासत और प्राकृतिक मिट्टी की सौंधी सुगंध से युक्त।",
      ai_pricing: {
        estimated_material_cost: 80,
        estimated_crafting_hours: 2.5,
        recommended_fair_price: 320,
        valuation_reasoning:
          "गोरखपुर जीआई प्रमाणित हस्तशिल्प के आधार पर ₹75/घंटा मानदेय व वास्तविक सामग्री का उचित मूल्यांकन।",
      },
      dialect_analysis: {
        detected_category: "Terracotta",
        region_name: "गोरखपुर (UP)",
        gi_tag_state: "Uttar Pradesh",
        matched_keywords: ["मिट्टी", "टेराकोटा", "चाक", "पात्र"],
        confidence_score_pct: 97,
      },
    },
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"studio" | "marketplace" | "inventory">("studio");
  const [appLanguage, setAppLanguage] = useState<SupportedLanguage>("hi");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [catalogData, setCatalogData] = useState<CatalogDataType | null>(null);
  const [isCataloging, setIsCataloging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [customProducts, setCustomProducts] = useState<ProductItem[]>([]);
  const [isEditingCard, setIsEditingCard] = useState<boolean>(false);

  // Load saved app language from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("shilpsathi_app_lang") as SupportedLanguage;
      if (savedLang) {
        setAppLanguage(savedLang);
      }
    } catch {}
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setAppLanguage(lang);
    try {
      localStorage.setItem("shilpsathi_app_lang", lang);
    } catch {}
  };

  const t = (key: string) => getTranslation(appLanguage, key);

  // Load custom products from /api/products & localStorage
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const saved = localStorage.getItem("shilpsathi_artisan_products");
        if (saved) {
          setCustomProducts(JSON.parse(saved));
        }

        const res = await fetch("/api/products");
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setCustomProducts(json.data);
          localStorage.setItem("shilpsathi_artisan_products", JSON.stringify(json.data));
        }
      } catch (e) {
        console.warn("Could not sync with backend /api/products:", e);
      }
    };

    loadProducts();
  }, []);

  // Save to localStorage when customProducts updates
  const handleSaveProducts = (newProducts: ProductItem[]) => {
    setCustomProducts(newProducts);
    try {
      localStorage.setItem("shilpsathi_artisan_products", JSON.stringify(newProducts));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  };

  const handleVoiceComplete = async (transcript: string, language?: string) => {
    if (!transcript) return;
    setIsCataloging(true);
    setError("");

    try {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          language: language || (appLanguage === "bn" ? "bn-IN" : appLanguage === "mr" ? "mr-IN" : "hi-IN"),
          imageBase64: imageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to extract catalog details.");
      }

      const data = await res.json();
      const finalCatalog = data.catalog || data;
      // Guarantee spoken transcript is present
      finalCatalog.spoken_transcript = transcript;
      setCatalogData(finalCatalog);
    } catch (err: any) {
      console.error(err);
      setError("AI विवरण तैयार करने में समस्या आई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsCataloging(false);
    }
  };

  const loadDemoData = () => {
    const preset = REGIONAL_DEMO_PRESETS[appLanguage] || REGIONAL_DEMO_PRESETS.default;
    setImageUrl(preset.image);
    setCatalogData(preset.catalog);
  };

  const handlePublishToStore = async (productItem: ProductItem) => {
    const updated = [productItem, ...customProducts];
    handleSaveProducts(updated);

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productItem),
      });
    } catch (err) {
      console.warn("Could not sync product to backend database:", err);
    }
  };

  const handleUpdateInventoryProduct = async (updatedProduct: ProductItem) => {
    const updated = customProducts.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    handleSaveProducts(updated);

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
    } catch (err) {
      console.warn("Could not sync product update to database:", err);
    }
  };

  const handleDeleteInventoryProduct = async (id: string) => {
    const updated = customProducts.filter((p) => p.id !== id);
    handleSaveProducts(updated);

    try {
      await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Could not delete product from backend:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-6 px-4 font-sans flex flex-col justify-between">
      <div className="max-w-2xl mx-auto space-y-5 w-full">

        {/* MoSJE Official Header with Global Language Switcher */}
        <header className="bg-white border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-sm text-center relative z-20">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-t-2xl" />
          
          <div className="flex items-center justify-between gap-2 mb-2 pt-1">
            <p className="text-[11px] font-semibold text-amber-700 tracking-wider uppercase text-left truncate">
              {t("govt_badge")}
            </p>
            <LanguageSelector
              currentLang={appLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          <h1 className="text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
            {t("app_title")}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t("app_tagline")}
          </p>

          {/* 3 Clean Artisan Navigation Tabs Bar (Studio, Marketplace, Inventory) */}
          <div className="grid grid-cols-3 gap-1.5 mt-4 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("studio")}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "studio"
                  ? "bg-white text-amber-800 shadow-xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              <span>{t("tab_studio")}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("marketplace")}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "marketplace"
                  ? "bg-white text-emerald-800 shadow-xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t("tab_marketplace")}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inventory")}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "inventory"
                  ? "bg-white text-blue-800 shadow-xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t("tab_inventory")}</span>
            </button>
          </div>
        </header>

        {/* ================= TAB 1: AI STUDIO ================= */}
        {activeTab === "studio" && (
          <div className="space-y-5">
            {/* Quick Demo Fill Bar */}
            <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 rounded-xl">
              <span className="text-xs font-semibold text-amber-900">
                {t("instant_demo")}
              </span>
              <button
                type="button"
                onClick={loadDemoData}
                className="text-[11px] text-amber-800 bg-white hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-full font-bold transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t("demo_quick_fill")}</span>
              </button>
            </div>

            {/* Step 1: Image Studio */}
            <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 font-semibold text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>{t("step1_title")}</span>
              </div>
              <ImageUploader onImageSelected={(url: string) => setImageUrl(url)} currentImage={imageUrl} />
            </section>

            {/* Step 2: Voice Input */}
            <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 font-semibold text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>{t("step2_title")}</span>
              </div>
              <VoiceInput
                onTranscriptComplete={handleVoiceComplete}
                currentAppLang={appLanguage}
              />
            </section>

            {/* AI Loading Card */}
            {isCataloging && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-center gap-3 text-amber-800 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-xs font-semibold">
                  {t("loading_catalog")}
                </p>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                {error}
              </p>
            )}

            {/* Step 3: Generated E-Commerce Catalog Preview (Editable) */}
            {catalogData && (
              <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5 animate-fadeIn">
                
                {/* Category & Status Bar */}
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {catalogData.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingCard(!isEditingCard)}
                      className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingCard ? t("save_card") : t("edit_card")}</span>
                    </button>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" /> {t("bilingual_badge")}
                    </span>
                  </div>
                </div>


                {/* Prominent Spoken Audio Voice Transcript Card */}
                {catalogData.spoken_transcript && (
                  <div className="bg-amber-50/90 border border-amber-300/80 rounded-xl p-3 flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">
                        🎙️ कारीगर द्वारा बोला गया मूल विवरण (Spoken Audio Description):
                      </span>
                      <p className="text-xs text-slate-800 font-medium italic mt-0.5 leading-relaxed">
                        "{catalogData.spoken_transcript}"
                      </p>
                      {catalogData.dialect_insights && (
                        <p className="text-[10px] text-amber-700 font-semibold mt-1">
                          💡 {catalogData.dialect_insights}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Editable / Display Titles */}
                {isEditingCard ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600">English Title:</label>
                      <input
                        type="text"
                        value={catalogData.title_en || ""}
                        onChange={(e) => setCatalogData({ ...catalogData, title_en: e.target.value })}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600">हिंदी / क्षेत्रीय शीर्षक:</label>
                      <input
                        type="text"
                        value={catalogData.title_hi || ""}
                        onChange={(e) => setCatalogData({ ...catalogData, title_hi: e.target.value })}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      {catalogData.title_en}
                    </h2>
                    <p className="text-sm font-medium text-slate-600 mt-0.5">
                      {catalogData.title_hi}
                    </p>
                  </div>
                )}

                {/* Materials & Dimensions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Array.isArray(catalogData.materials) ? (
                    catalogData.materials.map((mat, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>{mat}</span>
                      </span>
                    ))
                  ) : typeof catalogData.materials === "string" ? (
                    catalogData.materials.split(",").map((mat, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>{mat.trim()}</span>
                      </span>
                    ))
                  ) : null}
                  {catalogData.dimensions && (
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      आकार: {catalogData.dimensions}
                    </span>
                  )}
                </div>

                {/* Descriptions */}
                <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <p className="italic">{catalogData.description_en}</p>
                  <p className="text-slate-500">{catalogData.description_hi}</p>
                </div>

                {/* Multilingual Voice Audio Readout for Rural Artisans */}
                <div className="pt-2 border-t border-slate-100">
                  <VoiceAudioPlayer
                    titleHindi={catalogData.title_hi}
                    titleEnglish={catalogData.title_en}
                    textHindi={catalogData.description_hi}
                    textEnglish={catalogData.description_en}
                  />
                </div>
              </section>
            )}

            {/* Step 4: Pricing, Store Publish and ONDC Export */}
            {catalogData && (
              <section>
                <PricingAndExport
                  product={catalogData}
                  image={imageUrl}
                  onPublishToStore={handlePublishToStore}
                  onViewStore={() => setActiveTab("marketplace")}
                />
              </section>
            )}
          </div>
        )}

        {/* ================= TAB 2: PUBLIC MARKETPLACE ================= */}
        {activeTab === "marketplace" && (
          <Marketplace
            products={customProducts}
            onSelectForStudio={() => setActiveTab("studio")}
          />
        )}

        {/* ================= TAB 3: ARTISAN INVENTORY ================= */}
        {activeTab === "inventory" && (
          <InventoryManager
            products={customProducts.length > 0 ? customProducts : DEFAULT_MARKETPLACE_PRODUCTS}
            onUpdateProduct={handleUpdateInventoryProduct}
            onDeleteProduct={handleDeleteInventoryProduct}
            onSwitchToStudio={() => setActiveTab("studio")}
          />
        )}

      </div>

      {/* Discreet Footer link for Judges / Technical Evaluators to visit the ML Hub */}
      <footer className="max-w-2xl mx-auto w-full pt-8 pb-4 text-center">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-amber-100 border border-slate-300/80 hover:border-amber-400 transition-all text-[11px] text-slate-600 hover:text-amber-900">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>जूरी व तकनीकी मूल्यांकन (Technical ML Evaluation):</span>
          <Link
            href="/ml"
            className="font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-0.5"
          >
            <span>कस्टम ML मॉडल व रिग्रेशन हब देखें (/ml)</span>
            <ExternalLink className="w-3 h-3 inline" />
          </Link>
        </div>
      </footer>
    </div>
  );
}