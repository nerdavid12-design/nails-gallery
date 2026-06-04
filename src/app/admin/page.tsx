"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import QRCode from "react-qr-code";
import Image from "next/image";
import type { Photo } from "@/types";

type ViewMode = "grid" | "sheet";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const { t } = useTranslation();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const handleDownloadCsv = () => {
    const rows = [
      ["Name", "Photo URL", "Time"],
      ...photos.map((p) => [
        p.name?.trim() || "Anonymous",
        p.image_url,
        new Date(p.created_at).toLocaleString(),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nailz-photos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photos?limit=200");
      const data = await res.json();
      setPhotos(data.photos);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadPhotos();
  }, [authenticated, loadPhotos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm(t("adminDeleteConfirm"))) return;

    const res = await fetch(`/api/admin/photos/${photo.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    }
  };

  // Group photos by name for sheet view
  const photosByName = photos.reduce<Record<string, Photo[]>>((acc, photo) => {
    const key = photo.name?.trim() || "";
    if (!acc[key]) acc[key] = [];
    acc[key].push(photo);
    return acc;
  }, {});

  const namedGroups = Object.entries(photosByName)
    .filter(([key]) => key !== "")
    .sort(([a], [b]) => a.localeCompare(b));

  const anonymousPhotos = photosByName[""] ?? [];

  if (!authenticated) {
    return (
      <div className="flex min-h-[calc(100dvh-120px)] items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 rounded-xl bg-nails-dark-surface p-6"
        >
          <h1 className="font-display text-2xl font-bold text-nails-white">
            {t("adminLogin")}
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("adminPassword")}
            className="w-full rounded-lg border border-nails-magenta/30 bg-nails-dark px-4 py-3 text-nails-white placeholder-nails-gray/50 outline-none focus:border-nails-magenta"
          />
          {loginError && (
            <p className="text-sm text-red-400">{t("adminLoginError")}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-nails-magenta px-4 py-3 font-bold text-white transition-colors hover:bg-nails-magenta-dark"
          >
            {t("adminLoginButton")}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-nails-white">
          {t("adminTitle")} — {photos.length} {t("photoCount")}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-nails-gray/30 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-nails-magenta text-white"
                  : "text-nails-gray hover:text-nails-white"
              }`}
            >
              {t("adminGridView")}
            </button>
            <button
              onClick={() => setViewMode("sheet")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "sheet"
                  ? "bg-nails-magenta text-white"
                  : "text-nails-gray hover:text-nails-white"
              }`}
            >
              {t("adminSheetView")}
            </button>
          </div>
          <button
            onClick={handleDownloadCsv}
            disabled={photos.length === 0}
            className="rounded-lg border border-nails-green/50 px-4 py-2 text-sm text-nails-green transition-colors hover:bg-nails-green/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ↓ CSV
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-nails-gray/30 px-4 py-2 text-sm text-nails-gray transition-colors hover:border-nails-magenta hover:text-nails-magenta"
          >
            {t("adminLogout")}
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-xl bg-nails-dark-surface p-6 text-center">
        <h2 className="mb-4 font-display text-lg font-bold text-nails-white">
          {t("adminQrTitle")}
        </h2>
        <div className="mx-auto inline-block rounded-lg bg-white p-4">
          <QRCode value={siteUrl} size={200} />
        </div>
        <p className="mt-2 text-sm text-nails-gray">{siteUrl}</p>
      </div>

      {loading ? (
        <p className="text-center text-nails-gray">{t("loading")}</p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg bg-nails-dark-surface">
              <Image
                src={photo.image_url}
                alt={photo.name || "Photo"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                {photo.name && (
                  <p className="text-sm font-medium text-white">{photo.name}</p>
                )}
                <button
                  onClick={() => handleDelete(photo)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
                >
                  {t("adminDelete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {namedGroups.map(([name, groupPhotos]) => (
            <NameGroup
              key={name}
              name={name}
              photos={groupPhotos}
              onDelete={handleDelete}
              deleteLabel={t("adminDelete")}
            />
          ))}
          {anonymousPhotos.length > 0 && (
            <NameGroup
              key="__anonymous__"
              name={t("adminAnonymous")}
              photos={anonymousPhotos}
              onDelete={handleDelete}
              deleteLabel={t("adminDelete")}
              isAnonymous
            />
          )}
          {photos.length === 0 && (
            <p className="text-center text-nails-gray">{t("noPhotosYet")}</p>
          )}
        </div>
      )}
    </div>
  );
}

function NameGroup({
  name,
  photos,
  onDelete,
  deleteLabel,
  isAnonymous = false,
}: {
  name: string;
  photos: Photo[];
  onDelete: (photo: Photo) => void;
  deleteLabel: string;
  isAnonymous?: boolean;
}) {
  return (
    <div className="rounded-xl border border-nails-magenta/20 bg-nails-dark-surface overflow-hidden">
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-nails-magenta/20 ${isAnonymous ? "bg-nails-dark/40" : "bg-nails-magenta/10"}`}>
        <span className={`font-display text-base font-bold ${isAnonymous ? "text-nails-gray" : "text-nails-magenta"}`}>
          {name}
        </span>
        <span className="rounded-full bg-nails-dark px-2 py-0.5 text-xs text-nails-gray">
          {photos.length}
        </span>
      </div>
      <div className="divide-y divide-nails-magenta/10">
        {photos.map((photo) => (
          <div key={photo.id} className="flex items-center gap-4 px-4 py-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-nails-dark">
              <Image
                src={photo.image_url}
                alt={name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <span className="flex-1 text-xs text-nails-gray">
              {formatTime(photo.created_at)}
            </span>
            <button
              onClick={() => onDelete(photo)}
              className="rounded-lg border border-red-600/40 px-3 py-1 text-xs font-bold text-red-400 transition-colors hover:bg-red-600 hover:text-white"
            >
              {deleteLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
