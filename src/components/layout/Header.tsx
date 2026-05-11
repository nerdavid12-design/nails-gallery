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
        <span className="font-display text-2xl font-bold tracking-wider text-nails-white transition-colors hover:text-nails-magenta">
          {t("siteTitle")}
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/gallery"
          className="text-sm text-nails-gray no-underline transition-colors hover:text-nails-green"
        >
          {t("viewGallery")}
        </Link>
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
