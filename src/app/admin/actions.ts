"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { assertAdmin } from "@/lib/admin";
import { productInput, type ProductInput } from "@/lib/product-schema";
import { supabaseAdmin } from "@/lib/supabase";
import { supabaseAuth } from "@/lib/supabase-auth";

export type FormState = { error?: string; email?: string };
export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", email };

  const supabase = await supabaseAuth();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Invalid email or password.", email };
  if (data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access.", email };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await supabaseAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const BUCKET = "product-images";

/** Delete uploaded files (only ones in our bucket) that a product no longer uses. Failures are logged, never fatal. */
async function removeStoredImages(urls: (string | null | undefined)[]) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const paths = urls
    .filter((u): u is string => !!u && u.includes(marker))
    .map((u) => decodeURIComponent(u.split(marker)[1].split("?")[0]));
  if (!paths.length) return;
  const { error } = await supabaseAdmin().storage.from(BUCKET).remove(paths);
  if (error) console.error("storage cleanup failed", error.message);
}

function invalidate(...handles: (string | null | undefined)[]) {
  updateTag("products");
  for (const h of new Set(handles)) if (h) updateTag(`product:${h}`);
}

export async function saveProduct(raw: ProductInput): Promise<SaveResult> {
  await assertAdmin();
  const parsed = productInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product." };
  const p = parsed.data;
  const db = supabaseAdmin();

  const row = {
    handle: p.handle,
    title: p.title,
    collection: p.collection,
    subtitle: p.subtitle,
    description: p.description,
    price_cents: Math.round(p.price * 100),
    images: p.images,
    size_chart_image: p.size_chart_image,
    preorder: p.preorder,
    ships_note: p.ships_note,
    fit_note: p.fit_note,
    active: p.active,
    sort_order: p.sort_order,
  };

  let id = p.id;
  let oldHandle: string | null = null;

  if (id) {
    const { data: prev } = await db.from("products").select("handle, images, size_chart_image").eq("id", id).maybeSingle();
    if (!prev) return { ok: false, error: "That product no longer exists." };
    oldHandle = prev.handle;
    const { error } = await db.from("products").update(row).eq("id", id);
    if (error) return fail(error);
    // Files the admin removed from this product are no longer referenced anywhere.
    const stillUsed = new Set([...p.images, p.size_chart_image]);
    await removeStoredImages([...(prev.images ?? []), prev.size_chart_image].filter((u) => !stillUsed.has(u)));
  } else {
    const { data, error } = await db.from("products").insert(row).select("id").single();
    if (error || !data) return fail(error);
    id = data.id;
  }

  // Sync sizes: drop removed ones, update kept ones (stable ids keep order history linked), insert new ones.
  const { data: existing } = await db.from("product_variants").select("id").eq("product_id", id!);
  const keep = new Set(p.variants.map((v) => v.id).filter(Boolean));
  const remove = (existing ?? []).map((v) => v.id).filter((vid) => !keep.has(vid));
  if (remove.length) {
    const { error } = await db.from("product_variants").delete().in("id", remove);
    if (error) return fail(error);
  }
  for (const [i, v] of p.variants.entries()) {
    const fields = { size: v.size, inventory: v.inventory, sort_order: i };
    const { error } = v.id
      ? await db.from("product_variants").update(fields).eq("id", v.id).eq("product_id", id!)
      : await db.from("product_variants").insert({ ...fields, product_id: id });
    if (error) return fail(error);
  }

  invalidate(p.handle, oldHandle);
  return { ok: true, id: id! };
}

export async function deleteProduct(id: string): Promise<SaveResult> {
  await assertAdmin();
  const db = supabaseAdmin();
  const { data: prev } = await db.from("products").select("handle, images, size_chart_image").eq("id", id).maybeSingle();
  const { error } = await db.from("products").delete().eq("id", id); // sizes cascade; past orders keep their lines
  if (error) return fail(error);
  await removeStoredImages([...(prev?.images ?? []), prev?.size_chart_image]);
  invalidate(prev?.handle);
  return { ok: true, id };
}

function fail(error: { code?: string; message?: string } | null): SaveResult {
  if (error?.code === "23505") return { ok: false, error: "That handle or size is already in use." };
  console.error("admin save failed", error?.message);
  return { ok: false, error: "Could not save. Please try again." };
}
