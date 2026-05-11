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
        <h1 className="font-display text-6xl font-bold tracking-wider text-nails-white sm:text-7xl">
          {t("siteTitle")}
        </h1>
        <p className="mt-2 text-lg text-nails-magenta">{t("subtitle")}</p>

        <WavyDivider />

        <h2 className="mb-8 font-display text-2xl font-bold text-nails-green">
          {t("uploadTitle")}
        </h2>

        <UploadForm />
      </div>
    </div>
  );
}
