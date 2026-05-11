import { createAnonClient } from "@/lib/supabase/server";
import PhotoGrid from "@/components/gallery/PhotoGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(21);

  const photos = data ?? [];
  const hasMore = photos.length > 20;
  const displayPhotos = hasMore ? photos.slice(0, 20) : photos;
  const nextCursor = hasMore
    ? displayPhotos[displayPhotos.length - 1].created_at
    : null;

  return (
    <div className="px-2 py-6">
      <PhotoGrid
        initialPhotos={error ? [] : displayPhotos}
        initialCursor={error ? null : nextCursor}
      />
    </div>
  );
}
