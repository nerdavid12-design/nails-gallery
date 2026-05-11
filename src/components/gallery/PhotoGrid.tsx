"use client";

import { useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/lib/i18n/useTranslation";
import PhotoCard from "./PhotoCard";
import PhotoModal from "./PhotoModal";
import type { Photo } from "@/types";

interface PhotoGridProps {
  initialPhotos: Photo[];
  initialCursor: string | null;
}

export default function PhotoGrid({
  initialPhotos,
  initialCursor,
}: PhotoGridProps) {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !cursor) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/photos?limit=20&cursor=${encodeURIComponent(cursor)}`
      );
      const data = await res.json();
      setPhotos((prev) => [...prev, ...data.photos]);
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => { if (inView) loadMore(); },
    threshold: 0,
    rootMargin: "300px",
  });

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-5xl">💅</div>
        <p className="text-lg text-nails-gray">{t("noPhotosYet")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex max-w-[470px] flex-col gap-4 pb-8">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>

      {cursor && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loading && (
            <p className="text-sm text-nails-gray/60">{t("loadingMore")}</p>
          )}
        </div>
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
