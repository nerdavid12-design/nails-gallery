"use client";

import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-nails-magenta/20 bg-nails-dark px-4 py-6 text-center">
      <div className="mb-3 flex justify-center">
        <Image
          src="/shaham-logo.png"
          alt="שחם מעבדת תרבות"
          width={160}
          height={27}
          className="opacity-50 brightness-0 invert"
        />
      </div>
      <p className="text-xs text-nails-gray/50">מאיר שחם 5, ירושלים</p>
      <p className="mt-1 text-xs text-nails-gray/40">
        {t("curator")} &middot; {t("date")}
      </p>
    </footer>
  );
}
