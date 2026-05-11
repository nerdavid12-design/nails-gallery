"use client";

import Image from "next/image";
import type { Photo } from "@/types";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "עכשיו";
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דק׳`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שע׳`;
  return `לפני ${Math.floor(diff / 86400)} ימים`;
}

function Avatar({ name }: { name?: string | null }) {
  const letter = name?.trim()[0]?.toUpperCase();
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nails-magenta to-nails-green text-sm font-bold text-white shadow-md">
      {letter || "💅"}
    </div>
  );
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <article className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-sm">
      {/* Post header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar name={photo.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {photo.name || "אנונימי/ת"}
          </p>
          <p className="text-xs text-white/30">
            {timeAgo(photo.created_at)}
          </p>
        </div>
        <span className="text-lg">💅</span>
      </div>

      {/* Photo */}
      <button
        onClick={onClick}
        className="group relative block aspect-square w-full overflow-hidden"
      >
        <Image
          src={photo.image_url}
          alt={photo.name || "תמונה מהתערוכה"}
          fill
          sizes="(max-width: 500px) 100vw, 470px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {/* Double-tap hint overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-active:opacity-100">
          <div className="rounded-full bg-black/30 p-4 text-4xl backdrop-blur-sm">
            💅
          </div>
        </div>
      </button>

      {/* Bottom bar */}
      <div className="px-3 py-3">
        <div className="mb-1.5 flex items-center gap-3 text-xl">
          <span className="cursor-pointer transition-transform hover:scale-110 active:scale-90">
            💅
          </span>
        </div>
        {photo.name && (
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">{photo.name} </span>
            <span className="text-white/50">צילמו/ה בתערוכה</span>
          </p>
        )}
        <p className="mt-0.5 text-[11px] uppercase tracking-widest text-nails-magenta/60">
          NAILZ · שחם מעבדת תרבות
        </p>
      </div>
    </article>
  );
}
