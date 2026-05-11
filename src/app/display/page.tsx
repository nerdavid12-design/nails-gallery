"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { Photo } from "@/types";

type DisplayMode = "grid" | "slideshow" | "mixed";

// ── Grid ─────────────────────────────────────────────────────────────────────
function GridDisplay({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-4">
        <div className="font-display text-7xl font-bold text-nails-magenta animate-pulse-glow tracking-widest">
          NAILS
        </div>
        <div className="text-nails-gray text-xl">מחכים לתמונות ראשונות...</div>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full overflow-hidden grid gap-0.5 content-start p-0.5"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gridAutoRows: "200px",
      }}
    >
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative overflow-hidden bg-nails-dark-surface animate-fade-in"
        >
          <Image
            src={photo.image_url}
            alt={photo.name || ""}
            fill
            className="object-cover"
            sizes="200px"
          />
          {photo.name && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6">
              <p className="text-white text-xs font-medium truncate">
                {photo.name}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Slideshow ─────────────────────────────────────────────────────────────────
function SlideshowDisplay({
  photos,
  currentIndex,
}: {
  photos: Photo[];
  currentIndex: number;
}) {
  if (photos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="font-display text-7xl font-bold text-nails-magenta animate-pulse-glow tracking-widest">
          NAILS
        </div>
      </div>
    );
  }

  const photo = photos[currentIndex % photos.length];
  const dotCount = Math.min(photos.length, 20);

  return (
    <div className="relative h-full w-full bg-black">
      <Image
        key={photo.id}
        src={photo.image_url}
        alt={photo.name || ""}
        fill
        className="object-contain animate-fade-in"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />

      {photo.name && (
        <div className="absolute bottom-14 left-0 right-0 text-center">
          <span className="inline-block bg-black/60 backdrop-blur-sm text-white font-display text-2xl px-8 py-3 rounded-full border border-white/20">
            {photo.name}
          </span>
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
        {Array.from({ length: dotCount }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentIndex % dotCount
                ? "w-6 bg-nails-magenta"
                : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Mixed ─────────────────────────────────────────────────────────────────────
function MixedDisplay({
  photos,
  zoomedPhoto,
}: {
  photos: Photo[];
  zoomedPhoto: Photo | null;
}) {
  return (
    <div className="relative h-full w-full">
      <GridDisplay photos={photos} />

      {zoomedPhoto && (
        <div className="absolute inset-0 bg-black/92 flex items-center justify-center z-10 animate-fade-in">
          <div className="relative w-full h-full max-w-5xl mx-auto">
            <Image
              src={zoomedPhoto.image_url}
              alt={zoomedPhoto.name || ""}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          {zoomedPhoto.name && (
            <div className="absolute bottom-12 left-0 right-0 text-center">
              <span className="inline-block bg-black/60 backdrop-blur-sm text-white font-display text-2xl px-8 py-3 rounded-full border border-nails-magenta/50">
                {zoomedPhoto.name}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DisplayPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [mode, setMode] = useState<DisplayMode>("grid");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [zoomedPhoto, setZoomedPhoto] = useState<Photo | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/photos?limit=200");
      const data = await res.json();
      setPhotos(data.photos ?? []);
    } catch {
      // silent
    }
  }, []);

  // Initial fetch + polling every 15s
  useEffect(() => {
    fetchPhotos();
    const iv = setInterval(fetchPhotos, 15_000);
    return () => clearInterval(iv);
  }, [fetchPhotos]);

  // Show controls briefly, then hide
  const nudgeControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 4_000);
  }, []);

  useEffect(() => {
    nudgeControls();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [nudgeControls]);

  // Slideshow: advance every 5s
  useEffect(() => {
    if (mode !== "slideshow" || photos.length === 0) return;
    const iv = setInterval(
      () => setCurrentIndex((p) => (p + 1) % photos.length),
      5_000
    );
    return () => clearInterval(iv);
  }, [mode, photos.length]);

  // Mixed: zoom into random photo every 20s for 8s
  useEffect(() => {
    if (mode !== "mixed" || photos.length === 0) return;
    const iv = setInterval(() => {
      const pick = photos[Math.floor(Math.random() * photos.length)];
      setZoomedPhoto(pick);
      setTimeout(() => setZoomedPhoto(null), 8_000);
    }, 20_000);
    return () => clearInterval(iv);
  }, [mode, photos]);

  // Keyboard shortcuts: 1 / 2 / 3
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "1") setMode("grid");
      if (e.key === "2") setMode("slideshow");
      if (e.key === "3") setMode("mixed");
      nudgeControls();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudgeControls]);

  const MODES: { key: DisplayMode; label: string; icon: string }[] = [
    { key: "grid", label: "Grid", icon: "⊞" },
    { key: "slideshow", label: "Slideshow", icon: "▶" },
    { key: "mixed", label: "Mixed", icon: "◈" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-nails-dark overflow-hidden"
      style={{ cursor: showControls ? "auto" : "none" }}
      onMouseMove={nudgeControls}
    >
      {/* Mode switcher — fades out after 4s of no interaction */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 transition-opacity duration-700 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex gap-1 bg-black/70 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/10">
          {MODES.map(({ key, label, icon }, i) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                mode === key
                  ? "bg-nails-magenta text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span className="text-xs opacity-40">{i + 1}</span>
            </button>
          ))}
        </div>
        <div className="bg-black/70 backdrop-blur-md rounded-full px-3 py-2 border border-white/10 text-white/40 text-xs font-mono">
          {photos.length} photos
        </div>
      </div>

      {mode === "grid" && <GridDisplay photos={photos} />}
      {mode === "slideshow" && (
        <SlideshowDisplay photos={photos} currentIndex={currentIndex} />
      )}
      {mode === "mixed" && (
        <MixedDisplay photos={photos} zoomedPhoto={zoomedPhoto} />
      )}

      {/* Subtle branding */}
      <div className="absolute bottom-3 right-4 text-white/10 font-display font-bold text-xs select-none pointer-events-none tracking-widest">
        NAILS
      </div>
    </div>
  );
}
