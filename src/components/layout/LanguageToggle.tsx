"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export default function LanguageToggle() {
  const { lang, toggleLang } = useTranslation();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1 rounded-full border border-nails-magenta/50 px-3 py-1 text-sm font-medium transition-all hover:border-nails-magenta hover:shadow-[0_0_10px_rgba(255,0,255,0.3)]"
      aria-label={lang === "he" ? "Switch to English" : "החלף לעברית"}
    >
      <span className={lang === "he" ? "text-nails-magenta" : "text-nails-gray"}>
        עב
      </span>
      <span className="text-nails-gray">|</span>
      <span className={lang === "en" ? "text-nails-green" : "text-nails-gray"}>
        EN
      </span>
    </button>
  );
}
