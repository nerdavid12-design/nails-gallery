import { NextRequest } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 200);
  const cursor = searchParams.get("cursor");

  const supabase = createAnonClient();

  let query = supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const hasMore = data.length > limit;
  const photos = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? photos[photos.length - 1].created_at : null;

  return Response.json({ photos, nextCursor });
}
