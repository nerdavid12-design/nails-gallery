"use client";

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
}

export default function ImagePreview({ src, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <img
        src={src}
        alt="Preview"
        className="w-full rounded-xl object-cover"
        style={{ maxHeight: 400 }}
      />
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        aria-label="Remove"
      >
        ✕
      </button>
    </div>
  );
}
