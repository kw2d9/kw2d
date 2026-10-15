import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail, waitlistEmail } from "@/lib/email";

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
  const address = email.toLowerCase();
  const db = supabaseAdmin();
  const { data: existing } = await db.from("waitlist").select("id").eq("email", address).maybeSingle();
  const { error } = await db
    .from("waitlist")
    .upsert({ email: address, first_name, source: source ?? "site" }, { onConflict: "email" });
  if (error) {
    console.error("waitlist insert failed", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  // Only email brand-new signups so repeat submissions can't be used to spam an address.
  if (!existing) await sendEmail({ to: address, ...waitlistEmail(first_name) });
  return isForm ? NextResponse.redirect(new URL("/?joined=1", req.url), 303) : NextResponse.json({ ok: true });
}
