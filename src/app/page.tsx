"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import UploadForm from "@/components/upload/UploadForm";
import RadiatingLines from "@/components/decorative/RadiatingLines";
import CrossAccents from "@/components/decorative/CrossAccents";
import WavyDivider from "@/components/decorative/WavyDivider";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-[calc(100dvh-120px)] flex-col items-center justify-center px-4 py-12">
      <RadiatingLines />
      <CrossAccents />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* NAILZ title — large pixel font, centered on the green orb like the poster */}
        <div className="relative mb-2 flex items-center justify-center">
          <h1 className="font-pixel text-8xl tracking-widest text-nails-green text-glow-green sm:text-9xl">
            {t("siteTitle")}
          </h1>
        </div>

        {/* Subtitle in magenta, pixel-style — matches "מחקר תרבות הלק בישראל" feel */}
        <p className="mt-1 font-pixel text-base tracking-widest text-nails-magenta text-glow-magenta sm:text-lg">
          {t("subtitle")}
        </p>

        <WavyDivider />

        <h2 className="mb-8 font-display text-2xl font-bold text-nails-white">
          {t("uploadTitle")}
        </h2>

        <UploadForm />
      </div>
    </div>
  );
}
