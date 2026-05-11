"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import QRCode from "react-qr-code";
import Image from "next/image";
import type { Photo } from "@/types";

export default function AdminPage() {
  const { t } = useTranslation();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photos?limit=50");
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
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-nails-white">
          {t("adminTitle")} — {photos.length} {t("photoCount")}
        </h1>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-nails-gray/30 px-4 py-2 text-sm text-nails-gray transition-colors hover:border-nails-magenta hover:text-nails-magenta"
        >
          {t("adminLogout")}
        </button>
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
      ) : (
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
      )}
    </div>
  );
}
