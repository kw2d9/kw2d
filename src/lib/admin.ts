import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { supabaseAuth } from "@/lib/supabase-auth";

/**
 * Admin = a Supabase Auth user whose app_metadata.role is "admin".
 * app_metadata can only be changed server-side, so a public signup cannot grant it.
 * getUser() re-validates the token with Supabase on every call (never trust the cookie alone).
 */
export async function getAdmin() {
  const supabase = await supabaseAuth();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return user && user.app_metadata?.role === "admin" ? user : null;
}

/** For pages: send non-admins to the login screen. */
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

/** For server actions and route handlers: fail closed. */
export async function assertAdmin() {
  const user = await getAdmin();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/**
 * Privileged database client for admin pages. Checks admin rights first, so admin data can
 * never be read by a page that forgot its own check (layouts render in parallel with pages,
 * so a layout check alone does not protect a page).
 */
export async function adminDb() {
  await requireAdmin();
  return supabaseAdmin();
}
