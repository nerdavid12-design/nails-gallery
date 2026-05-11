"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Photo } from "@/types";

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  const { t, lang } = useTranslation();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const date = new Date(photo.created_at);
  const formattedDate = date.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-lg w-full overflow-hidden rounded-xl bg-nails-dark-surface animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          aria-label={t("close")}
        >
          ✕
        </button>

        <div className="relative aspect-[3/4] w-full">
          <Image
            src={photo.image_url}
            alt={photo.name || "Exhibit photo"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
            priority
          />
        </div>

        <div className="p-4">
          <p className="font-display text-lg font-bold text-nails-white">
            {photo.name || t("anonymous")}
          </p>
          <p className="mt-1 text-sm text-nails-gray">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
