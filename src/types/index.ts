export interface Photo {
  id: string;
  image_url: string;
  storage_path: string;
  name: string | null;
  created_at: string;
}

export interface PhotosResponse {
  photos: Photo[];
  nextCursor: string | null;
}

export type Language = "he" | "en";
export type Direction = "rtl" | "ltr";
