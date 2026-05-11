import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString();
    return decoded.includes(process.env.ADMIN_PASSWORD!);
  } catch {
    return false;
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !photo) {
    return Response.json({ error: "Photo not found" }, { status: 404 });
  }

  await supabase.storage.from("exhibit-photos").remove([photo.storage_path]);

  const { error: deleteError } = await supabase
    .from("photos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
