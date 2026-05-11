"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface UploadSuccessProps {
  previewUrl: string | null;
  onUploadAnother: () => void;
}

export default function UploadSuccess({
  previewUrl,
  onUploadAnother,
}: UploadSuccessProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-md animate-slide-up text-center">
      <div className="mb-4 text-5xl">🎉</div>
      <h2 className="font-display text-2xl font-bold text-nails-green">
        {t("uploadSuccess")}
      </h2>

      {previewUrl && (
        <div className="mx-auto mt-6 max-w-[200px] overflow-hidden rounded-xl border-2 border-nails-green/50">
          <img
            src={previewUrl}
            alt="Uploaded"
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/gallery"
          className="rounded-xl bg-nails-magenta px-6 py-3 font-display font-bold text-white no-underline transition-all hover:bg-nails-magenta-dark hover:shadow-[0_0_20px_rgba(255,0,255,0.5)]"
        >
          {t("viewGallery")}
        </Link>
        <button
          onClick={onUploadAnother}
          className="rounded-xl border border-nails-magenta/50 px-6 py-3 font-display font-bold text-nails-magenta transition-all hover:border-nails-magenta hover:shadow-[0_0_10px_rgba(255,0,255,0.3)]"
        >
          {t("uploadAnother")}
        </button>
      </div>
    </div>
  );
}
