/** Business settings in one place. Change values here, not in components. */
export const site = {
  name: "KW2D",
  email: "hello@kw2d.com", // TODO: confirm support address
  currency: "CAD",
  shipsTo: ["CA", "US"] as const,
  waitlistDiscountCode: "KW2D10",
  // Set to the real next drop date; the /coming-soon page counts down to it.
  dropDate: process.env.NEXT_PUBLIC_DROP_DATE ?? "2026-12-01T17:00:00.000Z",
};

/** Flat shipping, in cents. TODO: confirm real rates. */
export const shipping = {
  flatCents: 1200,
  freeOverCents: 15000,
  label: "Standard shipping",
  minDays: 5,
  maxDays: 10,
};
