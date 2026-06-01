"use client";

import Image from "next/image";
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

      <div className="relative z-10 flex w-full items-center justify-center gap-4 lg:gap-8">
        {/* Left Poster — hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block flex-shrink-0">
          <Image
            src="/nails-poster.jpg"
            alt="NAILS Exhibit Poster"
            width={250}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Center Form Section */}
        <div className="w-full max-w-md text-center">
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

        {/* Right Poster — hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block flex-shrink-0">
          <Image
            src="/nails-poster.jpg"
            alt="NAILS Exhibit Poster"
            width={250}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Mobile Poster — visible only on mobile, centered at bottom */}
      <div className="relative z-10 mt-12 flex justify-center lg:hidden">
        <Image
          src="/nails-poster.jpg"
          alt="NAILS Exhibit Poster"
          width={200}
          height={280}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
