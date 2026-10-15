# KW2D

Streetwear brand storefront ("Know What 2 Do", KW2D, Vancouver). Migrating from a Shopify theme to a modern web app.

## Source being migrated
`kw2d-theme/theme_export__knowswhat2do-com-kw2d-ayos-design__21JUN2026-0544pm/` is a Shopify **Horizon** theme (Liquid) with custom KW2D parts. Reference only; do not edit it.
- Custom: `sections/kw2d-slideshow`, `kw2d-drop-showcase`, `kw2d-waitlist-popup`, `kw2d-launch-hero`, `blocks/kw2d-countdown`, `layout/password.liquid` (coming-soon page with countdown).
- Stock Horizon: header/footer groups, product, collection, cart (drawer), search, blog, contact, 404 templates.
- Assets: `assets/CatalogIMG*.jpg` (hero slideshow), `Drop1IMG*.jpeg` (Meisai hoodie drop).
- Design tokens in `config/settings_data.json`. Fonts: Barlow (headings), Inter (body). Brand look: dark, minimal, uppercase wide-tracked small type; peach (#f7e5d7) page background on home.
- Home page = full-screen slideshow (desktop triptych slides, mobile single images) + "Drop 01" showcase (Meisai Collection Hoodie, $110 CAD, pre-order, ships 4-6 weeks) + "Join the Movement" email signup + footer.
- Waitlist popup: 10% off for email signup, previously posted to Klaviyo (company `TyDmJ8`, list `UwLFLF`).
- Currency CAD. Product handle `kw2d-meisai-collection-hoodie`.

## Target stack
Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres, auth, storage) + Stripe (CAD checkout, later). Deployed on Vercel.

## Conventions
- Secrets only in `.env.local` (gitignored); never commit them.
- Commits are authored solely by the user, with no Claude/AI attribution.
- Record any mistake made twice in `MISTAKES.md`.
