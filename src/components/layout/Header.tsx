"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-nails-magenta/20 bg-nails-dark/90 px-4 py-3 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 no-underline">
        <span className="font-pixel text-3xl tracking-widest text-nails-green text-glow-green transition-all hover:text-nails-magenta hover:text-glow-magenta">
          {t("siteTitle")}
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <Image
          src="/shaham-icon.png"
          alt="שחם"
          width={28}
          height={28}
          className="opacity-40 brightness-0 invert"
        />
      </div>
    </header>
  );
}
