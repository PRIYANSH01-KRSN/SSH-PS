"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Edit3,
  Trash2,
  PlusCircle,
  X,
  MessageCircle,
} from "lucide-react";
import { ProductItem, DEFAULT_MARKETPLACE_PRODUCTS } from "./Marketplace";

interface InventoryManagerProps {
  products?: ProductItem[];
  onUpdateProduct?: (product: ProductItem) => void;
  onDeleteProduct?: (id: string) => void;
  onSwitchToStudio?: () => void;
}

export default function InventoryManager({
  products = [],
  onUpdateProduct,
  onDeleteProduct,
  onSwitchToStudio,
}: InventoryManagerProps) {
  const [allProducts, setAllProducts] = useState<ProductItem[]>(
    products.length > 0 ? products : DEFAULT_MARKETPLACE_PRODUCTS
  );
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Keep synced with incoming props if changed
  useEffect(() => {
    if (products.length > 0) {
      setAllProducts(products);
    }
  }, [products]);

  const totalValue = allProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const totalArtisanPayout = allProducts.reduce(
    (sum, p) => sum + (Number(p.artisan_wage) || Math.round(Number(p.price) * 0.65) || 0),
    0
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = allProducts.map((p) =>
      p.id === editingProduct.id ? editingProduct : p
    );
    setAllProducts(updated);
    onUpdateProduct?.(editingProduct);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    const updated = allProducts.filter((p) => p.id !== id);
    setAllProducts(updated);
    onDeleteProduct?.(id);
  };

  const generateWhatsAppShare = (product: ProductItem) => {
    const text = `🛍️ *कारीगर सारथी - शिल्प उत्पाद*\n\n*${product.title_en}*\n(हिंदी: ${product.title_hi})\n\n💰 मूल्य: ₹${product.price}\n📦 श्रेणी: ${product.category}\n\n✨ 100% प्रामाणिक हस्तशिल्प (MoSJE Fair Wage Certified)\nसीधे ऑर्डर करने के लिए संपर्क करें!`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-5">
      {/* Overview Analytics Dashboard */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 font-semibold uppercase">कुल शिल्प (Listings)</p>
          <p className="text-xl font-black text-slate-800 mt-1">{allProducts.length}</p>
          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block mt-1">
            🟢 ONDC Live
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 font-semibold uppercase">इन्वेंट्री मूल्य (Value)</p>
          <p className="text-xl font-black text-emerald-700 mt-1">₹{totalValue}</p>
          <span className="text-[9px] text-slate-400 font-medium block mt-1">मार्केटप्लेस दर</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 font-semibold uppercase">कारीगर अंश (Wage)</p>
          <p className="text-xl font-black text-amber-700 mt-1">₹{totalArtisanPayout}</p>
          <span className="text-[9px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-full inline-block mt-1">
            संरक्षित पारिश्रमिक
          </span>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Package className="w-4 h-4 text-amber-600" />
          <span>मेरी इन्वेंट्री एवं उत्पाद प्रबंधन ({allProducts.length})</span>
        </h3>
        <button
          type="button"
          onClick={onSwitchToStudio}
          className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>नया शिल्प जोड़ें</span>
        </button>
      </div>

      {/* Product List Table / Cards */}
      <div className="space-y-3">
        {allProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-amber-300 transition-colors"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <img
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600"
                }
                alt={product.title_en}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                    {product.category || "Handicraft"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {product.id}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{product.title_en}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{product.title_hi}</p>
                <div className="flex items-center gap-3 pt-1 text-[11px]">
                  <span className="font-extrabold text-emerald-700">₹{product.price}</span>
                  {product.dimensions && (
                    <span className="text-slate-400">• {product.dimensions}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
              {/* WhatsApp Share Button */}
              <a
                href={generateWhatsAppShare(product)}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => setEditingProduct({ ...product })}
                title="Edit details"
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">संपादित करें</span>
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleDelete(product.id)}
                title="Delete product"
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {allProducts.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-3">
          <Package className="w-10 h-10 mx-auto text-slate-300" />
          <h4 className="text-xs font-bold text-slate-700">आपकी इन्वेंट्री अभी खाली है</h4>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            AI स्टूडियो में बोलकर या तस्वीर अपलोड करके अपना पहला शिल्प उत्पाद बनाएं।
          </p>
          <button
            type="button"
            onClick={onSwitchToStudio}
            className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-amber-700 transition-colors cursor-pointer"
          >
            + पहला उत्पाद जोड़ें (Create Craft)
          </button>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold">शिल्प उत्पाद विवरण संपादित करें (Edit Craft)</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-3 text-xs text-slate-700">
              <div>
                <label className="font-semibold block mb-1">अंग्रेज़ी शीर्षक (English Title) *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title_en || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title_en: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">हिंदी शीर्षक (Hindi Title) *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title_hi || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title_hi: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">श्रेणी (Category)</label>
                  <input
                    type="text"
                    value={editingProduct.category || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">मूल्य (Price in ₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">आकार व माप (Dimensions)</label>
                <input
                  type="text"
                  value={editingProduct.dimensions || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">विवरण (Description English)</label>
                <textarea
                  rows={2}
                  value={editingProduct.description_en || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description_en: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  परिवर्तन सहेजें (Save Changes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
