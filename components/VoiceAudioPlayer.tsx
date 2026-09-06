"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play, Sparkles } from "lucide-react";

interface VoiceAudioPlayerProps {
  textHindi?: string;
  textEnglish?: string;
  titleHindi?: string;
  titleEnglish?: string;
}

export default function VoiceAudioPlayer({
  textHindi,
  textEnglish,
  titleHindi,
  titleEnglish,
}: VoiceAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLang, setActiveLang] = useState<"hi" | "en" | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (lang: "hi" | "en") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    if (isPlaying && activeLang === lang) {
      setIsPlaying(false);
      setActiveLang(null);
      return;
    }

    const contentToRead =
      lang === "hi"
        ? `${titleHindi || ""}. ${textHindi || ""}`
        : `${titleEnglish || ""}. ${textEnglish || ""}`;

    if (!contentToRead.trim()) return;

    const utterance = new SpeechSynthesisUtterance(contentToRead);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = lang === "hi" ? 0.9 : 0.95; // Slightly slower for clarity in rural listening
    utterance.pitch = 1.0;

    // Try finding an authentic Indian voice
    const trySpeak = (retries = 0) => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0 && retries < 10) {
        setTimeout(() => trySpeak(retries + 1), 100);
        return;
      }

      const targetVoice = voices.find(
        (v) =>
          (lang === "hi" && (v.lang.includes("hi") || v.name.includes("Hindi") || v.name.includes("India"))) ||
          (lang === "en" && (v.lang === "en-IN" || v.name.includes("India")))
      );
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setActiveLang(lang);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setActiveLang(null);
      };

      utterance.onerror = (e) => {
        console.warn("Speech Synthesis Error:", e);
        setIsPlaying(false);
        setActiveLang(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    trySpeak();
  };

  const stop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setActiveLang(null);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-50 to-amber-500/10 dark:from-amber-950/30 dark:via-slate-800/80 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            🔊 बोलकर सुनें (Listen Aloud):
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            ग्रामीण व निरक्षर कारीगरों के लिए AI बहुभाषी वाचन
          </span>
        </div>
      </div>

      {/* Soundwave Animation while speaking */}
      {isPlaying && (
        <div className="flex items-center gap-1 px-2">
          <div className="w-1 h-3 bg-amber-500 rounded-full animate-pulse" style={{ animationDuration: "350ms" }} />
          <div className="w-1 h-5 bg-amber-600 rounded-full animate-pulse" style={{ animationDuration: "500ms" }} />
          <div className="w-1 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDuration: "400ms" }} />
          <div className="w-1 h-4 bg-amber-700 rounded-full animate-pulse" style={{ animationDuration: "300ms" }} />
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 ml-1">
            {activeLang === "hi" ? "हिंदी में वाचन..." : "Speaking English..."}
          </span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => speak("hi")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
            isPlaying && activeLang === "hi"
              ? "bg-amber-600 text-white shadow-xs scale-[1.02]"
              : "bg-white dark:bg-slate-700 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-50"
          }`}
        >
          {isPlaying && activeLang === "hi" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-amber-600" />}
          <span>हिंदी में सुनें</span>
        </button>

        <button
          type="button"
          onClick={() => speak("en")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
            isPlaying && activeLang === "en"
              ? "bg-indigo-600 text-white shadow-xs scale-[1.02]"
              : "bg-white dark:bg-slate-700 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50"
          }`}
        >
          {isPlaying && activeLang === "en" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-indigo-600" />}
          <span>Listen (English)</span>
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={stop}
            className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
            title="रोकें (Stop)"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
