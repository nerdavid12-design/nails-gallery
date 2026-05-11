"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Language, Direction } from "@/types";

interface LanguageContextValue {
  lang: Language;
  dir: Direction;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: "he",
  dir: "rtl",
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("he");

  useEffect(() => {
    const saved = localStorage.getItem("nails-lang") as Language | null;
    if (saved === "he" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("nails-lang", newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "he" ? "en" : "he");
  }, [lang, setLang]);

  const dir: Direction = lang === "he" ? "rtl" : "ltr";

  return (
    <LanguageContext value={{ lang, dir, setLang, toggleLang }}>
      {children}
    </LanguageContext>
  );
}
