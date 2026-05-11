"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-nails-magenta/20 bg-nails-dark px-4 py-6 text-center">
      <p className="text-sm text-nails-gray">{t("exhibitInfo")}</p>
      <p className="mt-1 text-xs text-nails-gray/60">
        {t("curator")} &middot; {t("date")}
      </p>
    </footer>
  );
}
