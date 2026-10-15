import Image from "next/image";
import Link from "next/link";
import { imageSrc } from "@/lib/images";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/product-types";

/** A catalog tile. Shared by the catalog page and the admin preview. */
export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link href={`/products/${p.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        {p.images[0] && (
          <Image
            src={imageSrc(p.images[0])}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )}
        {p.preorder && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[8px] font-bold uppercase tracking-[0.25em] text-paper">
            Pre-Order
          </span>
        )}
      </div>
      <h2 className="mt-3 font-heading text-sm font-bold uppercase tracking-wide">{p.title}</h2>
      <p className="text-xs opacity-60">{formatPrice(p.price_cents, p.currency)}</p>
    </Link>
  );
}
