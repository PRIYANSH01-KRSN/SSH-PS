"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe2, ChevronDown, Check, Search } from "lucide-react";
import { SupportedLanguage, LANGUAGE_OPTIONS, LanguageOption } from "@/lib/translations";

interface LanguageSelectorProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export default function LanguageSelector({
  currentLang,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOpt =
    LANGUAGE_OPTIONS.find((l) => l.code === currentLang) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredOptions = LANGUAGE_OPTIONS.filter((opt) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      opt.name.toLowerCase().includes(query) ||
      opt.nativeName.toLowerCase().includes(query) ||
      opt.region.toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 shadow-xs transition-all text-xs font-bold cursor-pointer"
        title="Change Language / भाषा बदलें"
      >
        <Globe2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span className="font-semibold text-slate-800">
          {selectedOpt.flag} {selectedOpt.nativeName}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-amber-200/90 shadow-2xl py-2 z-50 animate-fadeIn text-xs">
          
          {/* Header */}
          <div className="px-3 pb-2 pt-1 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">
              अपनी भाषा चुनें (14 Regional Languages)
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
              {LANGUAGE_OPTIONS.length} भाषाएं
            </span>
          </div>

          {/* Quick Search */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative flex items-center">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language / खोजें..."
                className="w-full pl-7 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Language Scrollable List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-center text-slate-400 text-xs">
                कोई भाषा नहीं मिली (No matches found)
              </div>
            ) : (
              filteredOptions.map((opt: LanguageOption) => {
                const isSelected = currentLang === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(opt.code);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-amber-50/90 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-amber-50/90 font-bold text-amber-900 border-l-3 border-amber-600"
                        : "text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{opt.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">
                            {opt.nativeName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({opt.name})
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {opt.region}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="px-3 pt-2 pb-0.5 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            🇮🇳 Supports Pan-India Craft Clusters
          </div>
        </div>
      )}
    </div>
  );
}
