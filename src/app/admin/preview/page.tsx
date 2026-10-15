import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { getProducts } from "@/lib/products";
import PreviewClient from "./PreviewClient";

async function Preview() {
  await requireAdmin();
  // The live catalog, so the preview can show the product next to what is already on sale.
  const live = await getProducts().catch(() => []);
  return <PreviewClient live={live} />;
}

/** Loaded in an iframe by the product form; the unsaved product arrives via postMessage. */
export default function PreviewPage() {
  return (
    <Suspense fallback={null}>
      <Preview />
    </Suspense>
  );
}
