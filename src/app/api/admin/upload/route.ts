import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 4 * 1024 * 1024; // stays under the hosting request-size limit

export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file." }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Use a JPG, PNG or WebP image." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image is too large (max 4 MB)." }, { status: 413 });

  const db = supabaseAdmin();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage
    .from("product-images")
    .upload(path, await file.arrayBuffer(), { contentType: file.type, cacheControl: "31536000" });
  if (error) {
    console.error("upload failed", error.message);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
  return NextResponse.json({ url: db.storage.from("product-images").getPublicUrl(path).data.publicUrl });
}
