"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  Clock,
  Coins,
  Send,
  Copy,
  Check,
  X,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Store,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

export default function PricingAndExport({ product, image, onPublishToStore, onViewStore }) {
  const [materialCost, setMaterialCost] = useState(120);
  const [craftingHours, setCraftingHours] = useState(2.5);
  const [wagePerHour, setWagePerHour] = useState(75); // Realistic rural artisan minimum wage rate (₹75/hr = ~₹600/day)
  const [showOndcModal, setShowOndcModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);

  // Sync AI Appraised pricing benchmarks when product data arrives
  useEffect(() => {
    if (product?.ai_pricing?.estimated_material_cost !== undefined) {
      setMaterialCost(Number(product.ai_pricing.estimated_material_cost));
    }
    if (product?.ai_pricing?.estimated_crafting_hours !== undefined) {
      setCraftingHours(Number(product.ai_pricing.estimated_crafting_hours));
    }
    setPublished(false);
  }, [product]);

  const laborCost = Math.round(craftingHours * wagePerHour);
  const breakEvenCost = Number(materialCost) + laborCost;
  const recommendedPrice = Math.round(breakEvenCost * 1.30); // 30% protected margin
  const artisanProfit = recommendedPrice - breakEvenCost;

  const ondcSchema = {
    context: {
      domain: "ONDC:RET10",
      version: "1.2.0",
      action: "on_search",
      bpp_id: "shilpsathi.mosje.gov.in",
      bpp_uri: "https://shilpsathi.mosje.gov.in/ondc",
      timestamp: new Date().toISOString(),
    },
    message: {
      catalog: {
        "bpp/descriptor": {
          name: "Shilp Sathi Artisan Direct Guild",
          short_desc: "Direct-to-consumer rural artisan handicrafts backed by MoSJE",
        },
        "bpp/providers": [
          {
            id: "ARTISAN_MOSJE_GUILD_01",
            descriptor: {
              name: "Certified Rural Artisan Guild",
            },
            categories: [
              {
                id: "CRAFT_HERITAGE",
                descriptor: {
                  name: product?.category || "Handicrafts & Traditional Art",
                },
              },
            ],
            items: [
              {
                id: `SKU-${Date.now().toString().slice(-6)}`,
                descriptor: {
                  name: product?.title_en || "Handcrafted Heritage Artefact",
                  name_hi: product?.title_hi || "हस्तनिर्मित पारंपरिक भारतीय शिल्प",
                  short_desc:
                    product?.description_en ||
                    "Authentic handmade craft item by certified rural Indian artisan.",
                  images: image ? [image] : [],
                },
                category_id: "CRAFT_HERITAGE",
                price: {
                  currency: "INR",
                  value: String(recommendedPrice),
                  maximum_value: String(Math.round(recommendedPrice * 1.15)),
                },
                tags: [
                  {
                    code: "artisan_protection",
                    list: [
                      { code: "break_even_cost", value: `₹${breakEvenCost}` },
                      { code: "fair_wage_payout", value: `₹${laborCost}` },
                      { code: "artisan_margin", value: `₹${artisanProfit}` },
                      { code: "hourly_rate", value: `₹${wagePerHour}/hr` },
                      { code: "mosje_certified", value: "true" },
                      {
                        code: "ai_valuation_reasoning",
                        value:
                          product?.ai_pricing?.valuation_reasoning ||
                          "Appraised via MoSJE ONDC fair rural artisan benchmark.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };

  const handleCopySchema = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(JSON.stringify(ondcSchema, null, 2));
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy schema:", err);
    }
  };

  const handlePublish = () => {
    const publishedItem = {
      id: `PROD-${Date.now().toString().slice(-4)}`,
      title_en: product?.title_en || "Handcrafted Heritage Artefact",
      title_hi: product?.title_hi || "हस्तनिर्मित शिल्प",
      category: product?.category || "Terracotta",
      materials: product?.materials || ["Natural Materials"],
      dimensions: product?.dimensions || "15cm x 12cm",
      price: recommendedPrice,
      artisan_wage: laborCost,
      artisan_name: "प्रमाणित कारीगर संघ (Certified Artisan)",
      image:
        image ||
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600",
      description_en: product?.description_en || "",
      description_hi: product?.description_hi || "",
      ai_pricing: {
        estimated_material_cost: materialCost,
        estimated_crafting_hours: craftingHours,
        recommended_fair_price: recommendedPrice,
        valuation_reasoning:
          product?.ai_pricing?.valuation_reasoning ||
          "ग्रामीण मानदेय व वास्तविक सामग्री लागत के आधार पर मूल्यांकित।",
      },
      gi_tagged: true,
      in_stock: true,
    };

    onPublishToStore?.(publishedItem);
    setPublished(true);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              उचित मूल्य गणना एवं स्टोर प्रकाशन
            </h3>
            <p className="text-[11px] text-slate-500">
              Realistic Rural Pricing & ONDC Storefront Launch
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>30% संरक्षित लाभ</span>
        </div>
      </div>

      {/* AI Valuation Reasoning Banner (if provided) */}
      {product?.ai_pricing?.valuation_reasoning && (
        <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 block mb-0.5">
              AI उचित मूल्य सुझाव (Realistic Price Reasoning)
            </span>
            <p className="text-slate-600 italic">
              "{product.ai_pricing.valuation_reasoning}"
            </p>
          </div>
        </div>
      )}

      {/* Sliders */}
      <div className="space-y-4">
        {/* Slider 1: Raw Materials */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              कच्चे माल की लागत (Raw Materials)
            </span>
            <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
              ₹{materialCost}
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="3000"
            step="10"
            value={materialCost}
            onChange={(e) => setMaterialCost(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>₹20 (मिट्टी/रंग)</span>
            <span>₹1,500</span>
            <span>₹3,000 (रेशम/धातु)</span>
          </div>
        </div>

        {/* Slider 2: Labor Hours */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              मेहनत के घंटे (Labor Hours)
            </span>
            <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
              {craftingHours} घंटे (मजदूरी: ₹{laborCost})
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="20"
            step="0.5"
            value={craftingHours}
            onChange={(e) => setCraftingHours(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0.5 घंटा (30 मिनट)</span>
            <span>दर: ₹{wagePerHour}/घंटा (~₹600/दिन)</span>
            <span>20 घंटे</span>
          </div>
        </div>

        {/* Slider 3: Hourly Labor Rate */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-600" />
              कारीगर पारिश्रमिक दर (Hourly Wage Rate):
            </span>
            <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              ₹{wagePerHour} / घंटा
            </span>
          </div>
          <div className="flex gap-2">
            {[
              { label: "सरल शिल्प (₹60/hr)", val: 60 },
              { label: "मानक कारीगरी (₹75/hr)", val: 75 },
              { label: "बारीक नक्काशी (₹100/hr)", val: 100 },
              { label: "मास्टर शिल्पी (₹150/hr)", val: 150 },
            ].map((rate) => (
              <button
                key={rate.val}
                type="button"
                onClick={() => setWagePerHour(rate.val)}
                className={`flex-1 py-1 text-[10px] rounded-lg font-semibold border transition-all cursor-pointer ${
                  wagePerHour === rate.val
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {rate.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Metrics Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
          <p className="text-[10px] text-slate-500 font-medium">कुल लागत (Cost)</p>
          <p className="text-sm font-bold text-slate-800 mt-0.5">₹{breakEvenCost}</p>
          <span className="text-[9px] text-slate-400">सामग्री + मजदूरी</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
          <p className="text-[10px] text-emerald-800 font-medium">
            उचित विक्रय मूल्य (Price)
          </p>
          <p className="text-base font-extrabold text-emerald-700 mt-0.5">
            ₹{recommendedPrice}
          </p>
          <span className="text-[9px] text-emerald-600 font-semibold">
            किफायती व न्यायसंगत
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
          <p className="text-[10px] text-amber-800 font-medium">
            कारीगर का शुद्ध लाभ
          </p>
          <p className="text-sm font-bold text-amber-800 mt-0.5">
            +₹{artisanProfit}
          </p>
          <span className="text-[9px] text-amber-600 font-semibold">30% संरक्षित मार्जिन</span>
        </div>
      </div>

      {/* PM-Vishwakarma & MoSJE Scheme Linkage Certificate */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-50 to-amber-500/10 border border-amber-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>🏛️ पीएम-विश्वकर्मा योजना व MoSJE पात्रता लिंकेज</span>
          </div>
          <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
            PM-VISHWAKARMA-2026
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
          <div className="p-2 rounded-lg bg-white border border-amber-200/50">
            <span className="text-slate-500 block text-[10px]">बिना गारंटी ऋण पात्रता:</span>
            <strong className="text-emerald-700 font-bold">₹3,00,000 @ 5% ब्याज</strong>
          </div>
          <div className="p-2 rounded-lg bg-white border border-amber-200/50">
            <span className="text-slate-500 block text-[10px]">टूलकिट प्रोत्साहन अनुदान:</span>
            <strong className="text-amber-700 font-bold">₹15,000 सरकारी सहायता</strong>
          </div>
        </div>
      </div>

      {/* Dual Launch Actions: 1. Publish to Store & 2. ONDC Export */}
      <div className="space-y-2.5 pt-2">
        {published ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center space-y-2 animate-fadeIn">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>उत्पाद बाज़ार में सफलतापूर्वक प्रकाशित हो गया!</span>
            </div>
            <button
              type="button"
              onClick={onViewStore}
              className="text-xs font-bold bg-emerald-600 text-white px-4 py-1.5 rounded-lg shadow-2xs hover:bg-emerald-700 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>बाज़ार में देखें (View in Marketplace)</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>🛍️ मेरी दुकान में प्रकाशित करें (Publish to My Store)</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowOndcModal(true)}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-emerald-400" />
          <span>ONDC / GeM प्रोटोकॉल स्कीमा देखें (View Schema)</span>
        </button>
      </div>

      {/* ONDC / GeM Modal */}
      {showOndcModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold">
                    ONDC v1.2.0 Retail Schema Export
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    Government e-Marketplace (GeM) & ONDC Catalog Integration
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOndcModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: JSON Preview */}
            <div className="p-4 overflow-y-auto bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed flex-1">
              <pre>{JSON.stringify(ondcSchema, null, 2)}</pre>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {product?.title_en || "Artisan Product"} • ₹{recommendedPrice}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowOndcModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  बंद करें (Close)
                </button>
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>कॉपी हो गया!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Schema</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
