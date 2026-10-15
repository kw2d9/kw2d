import { createClient } from "@supabase/supabase-js";

/** Server-only client using the secret key (bypasses RLS). Never import from client components. */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase env vars are not set");
  return createClient(url, key, { auth: { persistSession: false } });
}
