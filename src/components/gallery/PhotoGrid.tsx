"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/lib/i18n/useTranslation";
import PhotoCard from "./PhotoCard";
import PhotoModal from "./PhotoModal";
import type { Photo } from "@/types";

interface PhotoGridProps {
  initialPhotos: Photo[];
  initialCursor: string | null;
  autoScroll?: boolean;
}

export default function PhotoGrid({
  initialPhotos,
  initialCursor,
  autoScroll = false,
}: PhotoGridProps) {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;

    const scrollInterval = setInterval(() => {
      const now = Date.now();
      // Only scroll if no user interaction in the last 3 minutes
      if (now - lastInteractionTime > 180000) {
        if (containerRef.current) {
          containerRef.current.scrollBy({
            top: 400, // Scroll down one photo card height + gap
            behavior: "smooth",
          });
        }
      }
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(scrollInterval);
  }, [autoScroll, lastInteractionTime]);

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
      <div
        ref={containerRef}
        className="mx-auto flex max-w-[470px] flex-col gap-4 pb-8"
        onClick={handleInteraction}
        onScroll={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => {
              handleInteraction();
              setSelectedPhoto(photo);
            }}
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
