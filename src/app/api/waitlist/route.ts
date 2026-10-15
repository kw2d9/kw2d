import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  email: z.string().trim().email(),
  first_name: z.string().trim().max(80).optional(),
  source: z.string().trim().max(80).optional(),
});

export async function POST(req: Request) {
  const isForm = !req.headers.get("content-type")?.includes("application/json");
  const raw = isForm ? Object.fromEntries(await req.formData()) : await req.json().catch(() => null);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const { email, first_name, source } = parsed.data;
  const { error } = await supabaseAdmin()
    .from("waitlist")
    .upsert({ email: email.toLowerCase(), first_name, source: source ?? "site" }, { onConflict: "email" });
  if (error) {
    console.error("waitlist insert failed", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  return isForm ? NextResponse.redirect(new URL("/?joined=1", req.url), 303) : NextResponse.json({ ok: true });
}
