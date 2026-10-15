# KW2D

Streetwear brand storefront ("Know What 2 Do", KW2D, Vancouver). Migrating from a Shopify theme to a modern web app.

## Source being migrated
`kw2d-theme/theme_export__knowswhat2do-com-kw2d-ayos-design__21JUN2026-0544pm/` is a Shopify **Horizon** theme (Liquid) with custom KW2D parts. Reference only; do not edit it.
- Custom: `sections/kw2d-slideshow`, `kw2d-drop-showcase`, `kw2d-waitlist-popup`, `kw2d-launch-hero`, `blocks/kw2d-countdown`, `layout/password.liquid` (coming-soon page with countdown).
- Stock Horizon: header/footer groups, product, collection, cart (drawer), search, blog, contact, 404 templates.
- Assets: `assets/CatalogIMG*.jpg` (hero slideshow), `Drop1IMG*.jpeg` (Meisai hoodie drop).
- Design tokens in `config/settings_data.json`. Fonts: Barlow (headings), Inter (body). Brand look: dark, minimal, uppercase wide-tracked small type. The new site uses a concrete grey page background (#dcdbd8, near the lookbook studio backdrop) instead of the theme's peach (#f7e5d7). A dark theme exists too; colours are CSS variables in `globals.css` switched by `data-theme` on `<html>`. Use the tokens (`ink`/`paper`/`line`/`field`/`danger`/`foreground`), not raw white/black, in storefront components. Dark is the default; the header sun/moon icon switches themes and is controlled by `site.themeToggle` / `site.defaultTheme` in `src/lib/config.ts`.
- Home page = full-screen slideshow (desktop triptych slides, mobile single images) + "Drop 01" showcase (Meisai Collection Hoodie, $110 CAD, pre-order, ships 4-6 weeks) + "Join the Movement" email signup + footer.
- Waitlist popup: 10% off for email signup, previously posted to Klaviyo (company `TyDmJ8`, list `UwLFLF`).
- Currency CAD. Product handle `kw2d-meisai-collection-hoodie`.

## Target stack
Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres, auth, storage) + Stripe (CAD checkout, later). Deployed on Vercel.

## Conventions
- Secrets only in `.env.local` (gitignored); never commit them.
- Commits are authored solely by the user, with no Claude/AI attribution.
- Record any mistake made twice in `MISTAKES.md`.

## Status
Built: home, catalog, product pages, cart drawer (localStorage), Stripe Checkout (CAD, flat shipping, `KW2D10` promo code, invoices), Stripe webhook saving orders, waitlist + contact (Supabase), policy pages, `/coming-soon` countdown, sitemap/robots.
- Business settings (shipping rates, support email, drop date, promo code) live in `src/lib/config.ts`.
- Emails go through Resend (`src/lib/email.ts`) and are skipped when `RESEND_API_KEY` is unset.
- Stripe tax is off until `STRIPE_AUTOMATIC_TAX=true` and Stripe Tax is set up in the dashboard.
- DB migrations are in `supabase/migrations/` (apply with `psql "$DATABASE_URL" -f ...`); `supabase/seed.sql` seeds the Meisai hoodie.
- Next 16 with Cache Components: no `new Date()` or uncached data in prerendered components outside Suspense or `use cache`.

## Admin (`/admin`)
Product CRUD with image upload. Sign-in is Supabase Auth (email + password); admin = `app_metadata.role = "admin"` on the auth user (cannot be set by a public signup).
- Create the user in Supabase (Authentication -> Users -> Add user, auto-confirm), then grant access: edit the email in `supabase/make-admin.sql` and run `psql "$DATABASE_URL" -f supabase/make-admin.sql`.
- Needs `SUPABASE_PUBLISHABLE_KEY` (sign-in) plus the existing `SUPABASE_URL` / `SUPABASE_SECRET_KEY`.
- Security layers: `src/proxy.ts` redirects non-admins; every admin page uses `requireAdmin()` / `adminDb()` (layouts do NOT protect pages, they render in parallel); every server action and `/api/admin/upload` call `assertAdmin()`. Keep all three when adding admin pages.
- Uploads go to the public Supabase Storage bucket `product-images` (resized in the browser); removing an image or deleting a product deletes its files.
- Preview: the product form's Preview button opens `/admin/preview` in an iframe and sends the unsaved product by `postMessage`. It renders the real `ProductDetail` / `ProductCard` components (shared with the storefront), so change those, not copies.
- The public site lives in `src/app/(site)`; admin pages deliberately do not get the storefront header, cart or popup.

## Checkout switch
`NEXT_PUBLIC_CHECKOUT_ENABLED` (default off). While off, the buy buttons become "Join the Waitlist" (opens the popup via the `kw2d:open-waitlist` event) and `/api/checkout` returns 503. Set it to `true` in Vercel and redeploy once Stripe live keys, the production webhook and (optionally) `STRIPE_AUTOMATIC_TAX` are ready. It is inlined at build time, so a redeploy is required.
