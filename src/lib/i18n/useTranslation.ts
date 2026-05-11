"use client";

import { useContext, useCallback } from "react";
import { LanguageContext } from "./LanguageContext";
import translations, { type TranslationKey } from "./translations";

export function useTranslation() {
  const { lang, dir, setLang, toggleLang } = useContext(LanguageContext);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key],
    [lang]
  );

  return { t, lang, dir, setLang, toggleLang };
}
