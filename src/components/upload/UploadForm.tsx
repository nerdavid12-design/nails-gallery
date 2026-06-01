"use client";

import { useState, useRef } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { compressImage, generateFileName } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import ImagePreview from "./ImagePreview";
import UploadSuccess from "./UploadSuccess";

type UploadState = "idle" | "choosing" | "preview" | "uploading" | "success" | "error";

export default function UploadForm() {
  const { t } = useTranslation();
  const [state, setState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setState("preview");
    setErrorMsg("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setState("uploading");

    try {
      const compressed = await compressImage(selectedFile);
      const fileName = generateFileName();
      const storagePath = `photos/${fileName}`;
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from("exhibit-photos")
        .upload(storagePath, compressed, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("exhibit-photos").getPublicUrl(storagePath);

      const { error: insertError } = await supabase.from("photos").insert({
        image_url: publicUrl,
        storage_path: storagePath,
        name: name.trim() || null,
      });

      if (insertError) throw insertError;

      setState("success");
    } catch {
      setState("error");
      setErrorMsg(t("uploadError"));
    }
  };

  const handleReset = () => {
    setState("idle");
    setSelectedFile(null);
    setPreviewUrl(null);
    setName("");
    setErrorMsg("");
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  if (state === "success") {
    return <UploadSuccess previewUrl={previewUrl} onUploadAnother={handleReset} />;
  }

  return (
    <div className="mx-auto w-full max-w-md animate-fade-in">
      {/* camera-only input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      {/* gallery / file picker input — no capture */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {state === "idle" && (
        <button
          onClick={() => setState("choosing")}
          className="group relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-nails-magenta/50 bg-nails-dark-surface px-6 py-16 text-center transition-all hover:border-nails-magenta hover:shadow-[0_0_30px_rgba(255,0,255,0.3)]"
        >
          <div className="mb-4 text-5xl">📸</div>
          <div className="font-display text-xl font-bold text-nails-white">
            {t("uploadButton")}
          </div>
        </button>
      )}

      {state === "choosing" && (
        <div className="animate-slide-up overflow-hidden rounded-2xl border-2 border-nails-magenta/50 bg-nails-dark-surface">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-nails-magenta/10"
          >
            <span className="text-2xl">📷</span>
            <span className="font-display font-bold text-nails-white">{t("takePhoto")}</span>
          </button>
          <div className="mx-6 h-px bg-nails-magenta/20" />
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-nails-magenta/10"
          >
            <span className="text-2xl">🖼️</span>
            <span className="font-display font-bold text-nails-white">{t("chooseFromGallery")}</span>
          </button>
          <div className="mx-6 h-px bg-nails-magenta/20" />
          <button
            onClick={() => setState("idle")}
            className="w-full px-6 py-4 text-sm text-nails-gray transition-colors hover:text-nails-white"
          >
            {t("backToUpload")}
          </button>
        </div>
      )}

      {(state === "preview" || state === "uploading" || state === "error") &&
        previewUrl && (
          <div className="animate-slide-up space-y-4">
            <ImagePreview src={previewUrl} onRemove={handleReset} />

            <div>
              <label
                htmlFor="name-input"
                className="mb-1 block text-sm text-nails-gray"
              >
                {t("nameLabel")}
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                maxLength={50}
                disabled={state === "uploading"}
                className="w-full rounded-lg border border-nails-magenta/30 bg-nails-dark-surface px-4 py-3 text-nails-white placeholder-nails-gray/50 outline-none transition-colors focus:border-nails-magenta disabled:opacity-50"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={state === "uploading"}
              className="w-full rounded-xl bg-nails-magenta px-6 py-4 font-display text-lg font-bold text-white transition-all hover:bg-nails-magenta-dark disabled:opacity-50 hover:shadow-[0_0_20px_rgba(255,0,255,0.5)]"
            >
              {state === "uploading" ? t("uploading") : t("uploadButton")}
            </button>

            {state === "error" && (
              <p className="text-center text-sm text-red-400">{errorMsg}</p>
            )}
          </div>
        )}
    </div>
  );
}
