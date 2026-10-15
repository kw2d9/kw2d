/** Checkout stays closed until NEXT_PUBLIC_CHECKOUT_ENABLED=true (set it, then redeploy). */
export const checkoutEnabled = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";

/** Event that opens the waitlist popup from anywhere on the page. */
export const OPEN_WAITLIST_EVENT = "kw2d:open-waitlist";

/** Business settings in one place. Change values here, not in components. */
export const site = {
  name: "KW2D",
  email: "hello@kw2d.com", // TODO: confirm support address
  currency: "CAD",
  shipsTo: ["CA", "US"] as const,
  waitlistDiscountCode: "KW2D10",
  // Set to the real next drop date; the /coming-soon page counts down to it.
  dropDate: process.env.NEXT_PUBLIC_DROP_DATE ?? "2026-12-01T17:00:00.000Z",
  // Shows the light/dark switch on the storefront. Set to false once a theme is picked
  // (and set defaultTheme to the winner).
  themeToggle: true,
  defaultTheme: "dark" as "light" | "dark",
};

/** Flat shipping, in cents. TODO: confirm real rates. */
export const shipping = {
  flatCents: 1200,
  freeOverCents: 15000,
  label: "Standard shipping",
  minDays: 5,
  maxDays: 10,
};
