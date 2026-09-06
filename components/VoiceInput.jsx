"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  RotateCcw,
  Globe2,
  AlertCircle,
  CheckCircle2,
  Volume2,
} from "lucide-react";

export const SUPPORTED_LANGUAGES = [
  { code: "hi-IN", name: "हिंदी (Hindi)", region: "उत्तर भारत (North India)" },
  { code: "en-IN", name: "English (India)", region: "All-India Standard" },
  { code: "bn-IN", name: "বাংলা (Bengali)", region: "পশ্চিমবঙ্গ / বাঁকুড়া / শান্তিনিকেতন" },
  { code: "mr-IN", name: "मराठी (Marathi)", region: "पैठणी / वारली / कोल्हापूर" },
  { code: "ta-IN", name: "தமிழ் (Tamil)", region: "தஞ்சாவூர் / காஞ்சிபுரம்" },
  { code: "te-IN", name: "తెలుగు (Telugu)", region: "కలంకారి / పోచంపల్లి" },
  { code: "gu-IN", name: "ગુજરાતી (Gujarati)", region: "કચ્છ / પાટણ પટોળા" },
  { code: "kn-IN", name: "ಕನ್ನಡ (Kannada)", region: "ಮೈಸೂರು ರೇಷ್ಮೆ / ಚನ್ನಪಟ್ಟಣ" },
  { code: "ml-IN", name: "മലയാളം (Malayalam)", region: "ആറന്മുള കണ്ണാടി / കയർ" },
  { code: "or-IN", name: "ଓଡ଼ିଆ (Odia)", region: "ପିପିଲି ଆପ୍ଲିକ / ରଘୁରାଜପୁର ପଟ୍ଟଚିତ୍ର" },
  { code: "pa-IN", name: "ਪੰਜਾਬੀ (Punjabi)", region: "ਫੁਲਕਾਰੀ ਕਢਾਈ / ਜੁੱਤੀ" },
  { code: "as-IN", name: "অসমীয়া (Assamese)", region: "মুগা সিল্ক / কাঁহ-পিতল" },
  { code: "ur-IN", name: "اردو (Urdu)", region: "چکن کاری لکھنؤ / کشمیری شال" },
];

const CRAFT_PRESETS = {
  "bn-IN": [
    {
      label: "বাঁকুড়ার পোড়ামাটির ঘোড়া",
      text: "এটি বাঁকুড়ার বিখ্যাত ১৮ ইঞ্চির ঐতিহ্যবাহী পোড়ামাটির ঘোড়া। সম্পূর্ণ হাতে গড়া ও প্রাকৃতিক রোদে শুকিয়ে মাটির ভাটায় পোড়ানো।",
    },
    {
      label: "শান্তিনিকেতন লেদার ব্যাগ",
      text: "শান্তিনিকেতনের ঐতিহ্যবাহী চামড়ার এমবসড হ্যান্ডব্যাগ, সম্পূর্ণ ভেজিটেবল ট্যানড ও হাতে নকশা করা।",
    },
    {
      label: "বালুচরী সিল্ক শাড়ি",
      text: "বিষ্ণুপুরের খাঁটি রেশম সুতোয় বোনা বালুচরী শাড়ি, পৌরাণিক নকশা ও ঐতিহ্যবাহী আঁচল সমন্বিত।",
    },
    {
      label: "ডোকরা পেতল কারুশিল্প",
      text: "পশ্চিমবঙ্গের ঐতিহ্যবাহী মোম ঢালাই পদ্ধতিতে তৈরি ডোকরা পেতলের মা দুর্গা মূর্তি।",
    },
  ],
  "hi-IN": [
    {
      label: "गोरखपुर टेराकोटा",
      text: "यह गोरखपुर का 14 इंच का प्राकृतिक मिट्टी से बना नक्काशीदार टेराकोटा पात्र है। हाथ से चाक पर गढ़ा गया है और प्राकृतिक रंगों से सजाया गया है।",
    },
    {
      label: "जयपुर ब्लू पॉटरी",
      text: "जयपुर की पारंपरिक ब्लू पॉटरी सिरेमिक फूलदान, ऊंचाई 12 इंच, क्वार्ट्ज पाउडर और प्राकृतिक नीले रंगों से हस्तनिर्मित।",
    },
    {
      label: "मधुबनी पेंटिंग",
      text: "बिहार की पारंपरिक मधुबनी हस्तकला पेंटिंग, हाथ से बने हस्तनिर्मित कागज पर प्राकृतिक जैविक रंगों से चित्रित।",
    },
    {
      label: "कच्छ बांधनी दुपट्टा",
      text: "कच्छ का पारंपरिक बंधेज बांधनी रेशमी दुपट्टा, प्राकृतिक नील और मजीठ रंगों से हाथ से बांधकर रंगा गया।",
    },
  ],
  "mr-IN": [
    {
      label: "पैठणी रेशमी साडी",
      text: "महाराष्ट्राची सुप्रसिद्ध येवला पैठणी शुद्ध रेशमी साडी, अस्सल सोन्याच्या जरकाम मोराच्या पदरासह हाताने विणलेली.",
    },
    {
      label: "वारली आदिवासी चित्रकला",
      text: "पारंपारिक वारली आदिवासी हस्तकला चित्रकला, तांदळाच्या पिठाच्या नैसर्गिक रंगाने मातीच्या कॅनव्हासवर रेखाटलेली.",
    },
    {
      label: "कोल्हापुरी चप्पल",
      text: "अस्सल कोल्हापुरी हाताने तयार केलेली लेदर चप्पल, नैसर्गिक वनस्पती रंगाने प्रक्रिया केलेले चामडे.",
    },
  ],
  "ta-IN": [
    {
      label: "தஞ்சாவூர் ஓவியம்",
      text: "பாரம்பரிய தஞ்சாவூர் தங்க இலை ஓவியம், 22 காரட் தங்க தகடு மற்றும் இயற்கை வண்ணங்களால் தேக்கு மர பலகையில் வரையப்பட்டது.",
    },
    {
      label: "காஞ்சிபுரம் பட்டு",
      text: "தூய ஜரிகை கொண்டு கைத்தறியில் நெய்யப்பட்ட பாரம்பரிய காஞ்சிபுரம் பட்டுப் புடவை.",
    },
    {
      label: "சுவாமிமலை வெண்கலம்",
      text: "சுவாமிமலையின் பாரம்பரிய மெழுகு வார்ப்பு வெண்கல நடராஜர் சிலை, கைவினைஞரால் செதுக்கப்பட்டது.",
    },
  ],
  "te-IN": [
    {
      label: "కలంకారి చిత్రకళ",
      text: "శ్రీకాళహస్తి సహజ రంగులతో చేతితో గీసిన సాంప్రదాయ కలంకారి కాటన్ దుపట్టా.",
    },
    {
      label: "పోచంపల్లి ఇకత్",
      text: "తెలంగాణ పోచంపల్లి సాంప్రదాయ టై-అండ్-డై ఇకత్ చేనేత పట్టు చీర.",
    },
  ],
  "gu-IN": [
    {
      label: "કચ્છ બાંધણી",
      text: "કચ્છની પરંપરાગત બાંધણી રેશમ સાડી, કુદરતી રંગો અને હસ્તકલા ટાઈ-ડાઈ પદ્ધતિથી તૈયાર કરેલ.",
    },
    {
      label: "પાટણ પટોળા",
      text: "પાટણનું વિખ્યાત ડબલ ઇકત પટોળા રેશમી શાલ, વારસાગત કુદરતી કલર સાથે હાથવણાટ.",
    },
  ],
  "en-IN": [
    {
      label: "Terracotta Craft",
      text: "Handmade traditional 14-inch terracotta pot wheel-thrown using natural clay and open kiln-fired.",
    },
    {
      label: "Blue Pottery Vase",
      text: "Authentic Jaipur blue pottery 12-inch floral vase made from quartz stone and natural cobalt glaze.",
    },
    {
      label: "Handloom Silk Saree",
      text: "Hand-woven pure mulberry silk saree featuring traditional heritage zari work and organic dyes.",
    },
  ],
};

export default function VoiceInput({ onTranscriptComplete, currentAppLang }) {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [language, setLanguage] = useState("hi-IN");
  const [errorMsg, setErrorMsg] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Sync with global app language if provided
  useEffect(() => {
    if (currentAppLang) {
      const match = SUPPORTED_LANGUAGES.find((l) => l.code.startsWith(currentAppLang));
      if (match) {
        setLanguage(match.code);
      }
    }
  }, [currentAppLang]);

  // Clean up audio streams and speech recognition on unmount
  useEffect(() => {
    return () => {
      stopAudioVisualizer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const startAudioVisualizer = async () => {
    try {
      if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn("Microphone visualizer warning:", err.message);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  const handleToggleRecord = async () => {
    setErrorMsg("");

    // If currently recording, stop it
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      stopAudioVisualizer();
      setIsRecording(false);
      return;
    }

    // Check SpeechRecognition support in browser
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      try {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SpeechRec();

        rec.lang = language;
        rec.continuous = true;
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        rec.onstart = () => {
          setIsRecording(true);
          setErrorMsg("");
          startAudioVisualizer();
        };

        rec.onresult = (e) => {
          let interim = "";
          let finalTranscript = "";

          for (let i = e.resultIndex; i < e.results.length; ++i) {
            const transcript = e.results[i][0].transcript;
            if (e.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interim += transcript;
            }
          }

          if (finalTranscript.trim()) {
            setText((prev) => {
              const cleanPrev = prev.trim();
              const cleanNew = finalTranscript.trim();
              return cleanPrev ? `${cleanPrev} ${cleanNew}` : cleanNew;
            });
          }
          setInterimText(interim);
        };

        rec.onerror = (event) => {
          console.warn("Speech recognition error event:", event.error);
          setIsRecording(false);
          stopAudioVisualizer();

          if (event.error === "not-allowed" || event.error === "permission-denied") {
            setErrorMsg(
              "⚠️ ब्राउज़र में माइक की अनुमति (Permission) अवरुद्ध है। कृपया URL बार में लॉक/माइक आइकन पर क्लिक करके Microphone को 'Allow' करें।"
            );
          } else if (event.error === "no-speech") {
            setErrorMsg("⚠️ कोई आवाज़ नहीं सुनी गई। कृपया माइक के पास स्पष्ट बोलें या उदाहरण चुनें।");
          } else if (event.error === "audio-capture") {
            setErrorMsg("⚠️ माइक हार्डवेयर नहीं मिला। कृपया हेडफ़ोन/माइक कनेक्शन जांचें।");
          } else if (event.error === "network") {
            setErrorMsg("⚠️ स्पीच पहचान नेटवर्क में त्रुटि। नीचे दिए गए उदाहरण पर क्लिक करके परीक्षण करें।");
          } else {
            setErrorMsg(`⚠️ माइक त्रुटि: ${event.error || "कृपया दोबारा बोलें"}`);
          }
        };

        rec.onend = () => {
          setIsRecording(false);
          stopAudioVisualizer();
          setInterimText("");
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.error("SpeechRecognition start error:", err);
        setErrorMsg("⚠️ माइक शुरू करने में असमर्थ। कृपया ब्राउज़र अनुमति जांचें।");
        setIsRecording(false);
        stopAudioVisualizer();
      }
    } else {
      setErrorMsg(
        "⚠️ आपका ब्राउज़र Web Speech API का समर्थन नहीं करता है। कृपया Google Chrome या Microsoft Edge का उपयोग करें।"
      );
    }
  };

  const handleSubmit = () => {
    const combinedText = (text + (interimText ? " " + interimText : "")).trim();
    if (combinedText && onTranscriptComplete) {
      onTranscriptComplete(combinedText, language);
    }
  };

  const handleChipClick = (promptText) => {
    setText(promptText);
    setErrorMsg("");
  };

  // Get presets based on current selected speech language
  const currentPresets = CRAFT_PRESETS[language] || CRAFT_PRESETS["hi-IN"] || [];

  return (
    <div className="space-y-3">
      <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 text-center space-y-3.5">
        
        {/* Regional Language Selector */}
        <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/80 text-left">
          <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-amber-600" />
              <span>शिल्पकार की बोली व भाषा (Voice Recognition Dialect):</span>
            </span>
            <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
              {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name}
            </span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isRecording}
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} — {lang.region}
              </option>
            ))}
          </select>
        </div>

        {/* Big Mic Button & Live Volume Visualizer */}
        <div className="relative flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleToggleRecord}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer relative z-10 ${
              isRecording
                ? "bg-rose-600 text-white animate-pulse ring-8 ring-rose-200 scale-110"
                : "bg-amber-600 hover:bg-amber-700 text-white hover:scale-105"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-7 h-7" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>

          {/* Live Audio Level Equalizer Bars while recording */}
          {isRecording && (
            <div className="flex items-center justify-center gap-1 mt-3">
              {[...Array(9)].map((_, i) => {
                const height = Math.max(4, Math.min(24, Math.round((audioLevel / 100) * 24 * ((i % 3) + 0.5))));
                return (
                  <div
                    key={i}
                    className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          )}

          <p className="text-xs font-bold text-slate-800 mt-2.5 flex items-center justify-center gap-1.5">
            {isRecording ? (
              <span className="text-rose-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block" />
                <span>सुन रहा हूँ ({SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name})... रुकने के लिए माइक दबाएं</span>
              </span>
            ) : (
              <span>माइक दबाकर बोलें (Click to Speak in Your Dialect)</span>
            )}
          </p>
        </div>

        {/* Error Feedback Alert Banner */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 text-left animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{errorMsg}</p>
              <p className="text-[10px] text-rose-600 mt-1">
                सुझाव: यदि आपका माइक म्यूट है, तो नीचे दिए गए <strong>त्वरित उदाहरण (Quick Presets)</strong> पर क्लिक करके भी परीक्षण कर सकते हैं।
              </p>
            </div>
          </div>
        )}

        {/* Live Interim Transcript Display */}
        {interimText && (
          <div className="p-2 rounded-xl bg-amber-100/60 border border-amber-300/80 text-amber-900 text-xs italic text-left">
            <span className="font-bold text-[10px] uppercase text-amber-700 block not-italic">
              लाइव शब्द (Speaking...):
            </span>
            "{interimText}"
          </div>
        )}

        {/* Text Input / Edit Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="बोला गया विवरण यहाँ दिखेगा (Spoken description will appear here)..."
            rows={3}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
          {text && (
            <button
              type="button"
              onClick={() => {
                setText("");
                setInterimText("");
              }}
              title="Clear text"
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="text-left">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            त्वरित क्षेत्रीय उदाहरण (Instant Regional Presets):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {currentPresets.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(item.text)}
                className="text-[10px] font-medium bg-white hover:bg-amber-100/70 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                + {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {(text.trim() || interimText.trim()) && (
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>कैटलॉग तैयार करें (Generate AI Catalog)</span>
          </button>
        )}
      </div>
    </div>
  );
}
