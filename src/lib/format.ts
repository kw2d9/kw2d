export function formatPrice(cents: number, currency = "CAD") {
  return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)} ${currency}`;
}
