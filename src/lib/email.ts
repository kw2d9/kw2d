import { site } from "@/lib/config";

type Mail = { to: string; subject: string; html: string };

/**
 * Sends via Resend when RESEND_API_KEY is set; otherwise logs and skips so the
 * rest of the flow (waitlist signup, order saving) never depends on email.
 */
export async function sendEmail({ to, subject, html }: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email] RESEND_API_KEY not set, skipped "${subject}"`);
    return false;
  }
  const from = process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) console.error("[email] send failed", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[email] send error", e instanceof Error ? e.message : e);
    return false;
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(inner: string) {
  return `<div style="background:#dcdbd8;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a">
  <div style="max-width:480px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px 32px">
    <p style="letter-spacing:.35em;font-size:10px;text-transform:uppercase;opacity:.5;margin:0 0 16px">${site.name}</p>
    ${inner}
  </div></div>`;
}

export function waitlistEmail(firstName?: string | null) {
  return {
    subject: "You're on the list. Here's 10% off",
    html: layout(`<h1 style="font-size:24px;text-transform:uppercase;letter-spacing:.06em;margin:0 0 12px">You're in${firstName ? `, ${esc(firstName)}` : ""}</h1>
    <p style="font-size:13px;line-height:1.6;opacity:.8">Use this code at checkout for 10% off your first order:</p>
    <p style="font-size:28px;font-weight:900;letter-spacing:.2em;margin:20px 0">${site.waitlistDiscountCode}</p>
    <p style="font-size:11px;opacity:.5">Built for people who execute.</p>`),
  };
}

export function orderEmail(o: { name?: string | null; items: { title: string; size?: string | null; qty: number }[]; totalCents: number; currency: string }) {
  const rows = o.items.map((i) => `<li>${esc(i.title)}${i.size ? ` (${esc(i.size)})` : ""} × ${i.qty}</li>`).join("");
  const total = `$${(o.totalCents / 100).toFixed(2)} ${o.currency.toUpperCase()}`;
  return {
    subject: "Order confirmed",
    html: layout(`<h1 style="font-size:24px;text-transform:uppercase;letter-spacing:.06em;margin:0 0 12px">Thanks${o.name ? `, ${esc(o.name.split(" ")[0])}` : ""}</h1>
    <p style="font-size:13px;line-height:1.6;opacity:.8">We've got your order. Pre-orders ship in 4–6 weeks and we'll email you when yours is on the way.</p>
    <ul style="font-size:13px;line-height:1.8;padding-left:18px">${rows}</ul>
    <p style="font-size:14px;font-weight:700">Total: ${total}</p>
    <p style="font-size:11px;opacity:.5">Stripe also sends your receipt and invoice separately.</p>`),
  };
}
