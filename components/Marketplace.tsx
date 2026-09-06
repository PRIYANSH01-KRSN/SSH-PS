"use client";

import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Truck,
  MessageCircle,
} from "lucide-react";

export interface ProductItem {
  id: string;
  title_en: string;
  title_hi: string;
  category: string;
  materials?: string[] | string;
  dimensions?: string;
  price: number;
  artisan_wage?: number;
  artisan_name?: string;
  image?: string;
  description_en?: string;
  description_hi?: string;
  gi_tagged?: boolean;
  in_stock?: boolean;
  ai_pricing?: {
    estimated_material_cost?: number;
    estimated_crafting_hours?: number;
    recommended_fair_price?: number;
    valuation_reasoning?: string;
  };
}

export const DEFAULT_MARKETPLACE_PRODUCTS: ProductItem[] = [
  {
    id: "PROD-001",
    title_en: "Gorakhpur Terracotta Handcrafted Clay Diya Pot",
    title_hi: "गोरखपुर टेराकोटा पारंपरिक मिट्टी का नक्काशीदार पात्र",
    category: "Terracotta",
    materials: ["प्राकृतिक मिट्टी (Clay)", "जैविक रंग (Organic Dyes)"],
    dimensions: "15cm x 12cm",
    price: 1550,
    artisan_wage: 900,
    artisan_name: "राम प्रसाद प्रजापति (Gorakhpur, UP)",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600",
    description_en:
      "Exquisitely wheel-thrown terracotta pot handcrafted by traditional rural artisans. Fired in conventional open kilns with authentic earthy textures and heritage design.",
    description_hi:
      "पारंपरिक चाक पर हाथ से गढ़ा गया मिट्टी का पात्र। सदियों पुरानी भारतीय विरासत और प्राकृतिक मिट्टी की सौंधी सुगंध से युक्त।",
    gi_tagged: true,
    in_stock: true,
  },
  {
    id: "PROD-002",
    title_en: "Jaipur Traditional Blue Pottery Floral Ceramic Vase",
    title_hi: "जयपुर पारंपरिक ब्लू पॉटरी फ्लोरल सिरेमिक फूलदान",
    category: "Blue Pottery",
    materials: ["क्वार्ट्ज पाउडर (Quartz)", "प्राकृतिक नीला रंग (Natural Cobalt)"],
    dimensions: "12\" Height x 6\" Diameter",
    price: 2450,
    artisan_wage: 1500,
    artisan_name: "गायत्री देवी (Jaipur, Rajasthan)",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600",
    description_en:
      "Authentic Jaipur Blue Pottery crafted without clay using quartz powder and glass. Hand-painted with Persian-inspired cobalt motifs.",
    description_hi:
      "बिना मिट्टी के क्वार्ट्ज और कांच के मिश्रण से तैयार प्रामाणिक जयपुर ब्लू पॉटरी। हाथ से उकेरी गई पारंपरिक नीली आकृतियां।",
    gi_tagged: true,
    in_stock: true,
  },
  {
    id: "PROD-003",
    title_en: "Madhubani Hand-Painted Mithila Heritage Folk Artwork",
    title_hi: "मधुबनी हस्तनिर्मित मिथिला विरासत लोक कला पेंटिंग",
    category: "Madhubani",
    materials: ["हस्तनिर्मित कागज (Handmade Paper)", "प्राकृतिक जैविक रंग (Organic Dyes)"],
    dimensions: "18\" x 12\"",
    price: 3200,
    artisan_wage: 2100,
    artisan_name: "सुनीता झा (Madhubani, Bihar)",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600",
    description_en:
      "Traditional Mithila painting made using bamboo twigs, nibs, and organic dyes extracted from turmeric, indigo, and marigold.",
    description_hi:
      "प्राकृतिक पौधों और फूलों के रंगों से हाथ से बनाई गई पारंपरिक मिथिला लोक कला। भारतीय संस्कृति और आस्था का प्रतीक।",
    gi_tagged: true,
    in_stock: true,
  },
  {
    id: "PROD-004",
    title_en: "Kutchi Bandhani Pure Silk Dupatta with Natural Dyes",
    title_hi: "कच्छी बांधनी शुद्ध रेशमी दुपट्टा प्राकृतिक रंगों से निर्मित",
    category: "Handloom",
    materials: ["शुद्ध सिल्क (Pure Silk)", "प्राकृतिक नील व मजीठ (Natural Dyes)"],
    dimensions: "2.5 m x 0.9 m",
    price: 4100,
    artisan_wage: 2700,
    artisan_name: "इस्माइल खत्री (Kutch, Gujarat)",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600",
    description_en:
      "Exquisite silk dupatta with thousands of microscopic hand-tied knots dyed in vibrant organic hues reflecting the rich desert craft of Kutch.",
    description_hi:
      "हजारों बारीक गांठों को हाथ से बांधकर रंगा गया प्रामाणिक कछौटी बांधनी दुपट्टा। समृद्ध गुजराती शिल्प की पहचान।",
    gi_tagged: true,
    in_stock: true,
  },
];

interface MarketplaceProps {
  products?: ProductItem[];
  onSelectForStudio?: () => void;
}

export default function Marketplace({ products = [], onSelectForStudio }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [checkoutProduct, setCheckoutProduct] = useState<ProductItem | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const allProducts: ProductItem[] = [...DEFAULT_MARKETPLACE_PRODUCTS, ...products];

  // Unique categories
  const categories = ["All", ...Array.from(new Set(allProducts.map((p) => p.category || "Handicrafts")))];

  // Filtered list
  const filteredProducts = allProducts.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (p.title_en || "").toLowerCase().includes(query) ||
      (p.title_hi || "").toLowerCase().includes(query) ||
      (p.category || "").toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleBuyNow = (product: ProductItem) => {
    setCheckoutProduct(product);
    setOrderSuccess(false);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);

    try {
      if (checkoutProduct) {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: checkoutProduct.id,
            product_title: checkoutProduct.title_en,
            buyer_name: buyerName,
            buyer_phone: buyerPhone,
            shipping_address: buyerAddress,
            total_amount: checkoutProduct.price,
            payment_method: "UPI / ONDC Direct",
          }),
        });
      }
    } catch (err) {
      console.warn("Could not sync order to backend:", err);
    }
  };

  const generateWhatsAppLink = (product: ProductItem) => {
    const msg = `नमस्ते! मैं कारीगर सारथी पोर्टल पर आपका उत्पाद खरीदना चाहता हूँ:\n\n*${product.title_en}*\nमूल्य: ₹${product.price}\nश्रेणी: ${product.category}\n\nकृपया डिलीवरी और ऑर्डर विवरण बताएं।`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-5">
      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="शिल्प या उत्पाद खोजें (Search Terracotta, Madhubani, Handloom)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "All" ? "सभी शिल्प (All Crafts)" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map((product, idx) => (
          <div
            key={product.id || idx}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
          >
            {/* Image Box */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600"
                }
                alt={product.title_en}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2.5 left-2.5 bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                {product.category || "Handicraft"}
              </span>
              <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>MoSJE Fair Wage</span>
              </span>
            </div>

            {/* Content Details */}
            <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                  {product.title_en}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {product.title_hi}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>📍</span>
                  <span>{product.artisan_name || "Certified Rural Artisan Guild"}</span>
                </p>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">उचित मूल्य (ONDC Price)</span>
                  <span className="text-base font-extrabold text-emerald-700">₹{product.price}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={generateWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Order via WhatsApp"
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(product)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>खरीदें (Buy)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
          <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold">कोई शिल्प नहीं मिला (No crafts found)</p>
          <p className="text-[11px] text-slate-400 mt-1">अन्य खोज शब्द या श्रेणी चुनकर प्रयास करें।</p>
        </div>
      )}

      {/* Checkout / Buy Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold">ONDC Direct Artisan Checkout</h4>
                  <p className="text-[10px] text-slate-300">100% Guaranteed Direct Payout to Rural Artisan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutProduct(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {orderSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">ऑर्डर सफलतापूर्वक दर्ज हुआ!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    धन्यवाद <b>{buyerName || "ग्राहक"}</b>! आपका ऑर्डर ONDC नेटवर्क के माध्यम से सीधे शिल्पकार तक भेज दिया गया है।
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left space-y-1 text-xs">
                    <p className="font-bold text-emerald-800">MoSJE आजीविका सुरक्षा प्रमाण पत्र:</p>
                    <p className="text-slate-600">उत्पाद: {checkoutProduct.title_en}</p>
                    <p className="text-slate-600">कुल भुगतान: ₹{checkoutProduct.price}</p>
                    <p className="text-emerald-700 font-semibold">कारीगर पारिश्रमिक हिस्सा: 85% डायरेक्ट बैंक ट्रांसफर (DBT)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutProduct(null)}
                    className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    बाज़ार में वापस जाएं (Back to Store)
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmOrder} className="space-y-4">
                  {/* Selected Item Summary */}
                  <div className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <img
                      src={
                        checkoutProduct.image ||
                        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600"
                      }
                      alt={checkoutProduct.title_en}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-xs">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{checkoutProduct.title_en}</h4>
                      <p className="text-[11px] text-slate-500">{checkoutProduct.category}</p>
                      <p className="text-sm font-extrabold text-emerald-700 mt-1">₹{checkoutProduct.price}</p>
                    </div>
                  </div>

                  {/* Buyer Form Fields */}
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div>
                      <label className="font-semibold block mb-1">आपका नाम (Full Name) *</label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="उदा. अमित शर्मा"
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">मोबाइल नंबर (WhatsApp/Phone) *</label>
                      <input
                        type="tel"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">डिलीवरी का पता (Shipping Address) *</label>
                      <textarea
                        required
                        rows={2}
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        placeholder="घर का पता, पिनकोड व शहर..."
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                      सुरक्षित ONDC भुगतान विकल्प
                    </p>
                    <p className="text-[10px] text-slate-600">UPI / QR कोड / कैश ऑन डिलीवरी (COD) उपलब्ध है।</p>
                  </div>

                  {/* Action */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>ऑर्डर पक्का करें (Confirm Order • ₹{checkoutProduct.price})</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
