"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { imageSrc } from "@/lib/images";
import type { Product } from "@/lib/product-types";
import { saveProduct } from "../../actions";
import PreviewPanel from "./PreviewPanel";

type VariantRow = { id?: string; size: string; inventory: number | null };

export type InitialProduct = {
  id?: string;
  handle: string;
  title: string;
  collection: string;
  subtitle: string;
  description: string;
  price: number;
  images: string[];
  size_chart_image: string | null;
  preorder: boolean;
  ships_note: string;
  fit_note: string;
  active: boolean;
  sort_order: number;
  variants: VariantRow[];
};

const EMPTY: InitialProduct = {
  handle: "",
  title: "",
  collection: "",
  subtitle: "",
  description: "",
  price: 0,
  images: [],
  size_chart_image: null,
  preorder: false,
  ships_note: "",
  fit_note: "",
  active: true,
  sort_order: 0,
  variants: [
    { size: "S", inventory: null },
    { size: "M", inventory: null },
    { size: "L", inventory: null },
  ],
};

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const input = "w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-600";

/** Shrinks large photos in the browser so uploads stay small and fast. */
async function resize(file: File, maxEdge = 2000): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1_500_000) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.86));
  return blob ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
}

/** The form state in the storefront's shape, for the preview. */
function toPreview(p: InitialProduct): Product {
  const blank = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    id: p.id ?? "preview",
    handle: p.handle || "preview",
    title: p.title.trim() || "Untitled product",
    collection: blank(p.collection),
    subtitle: blank(p.subtitle),
    description: blank(p.description),
    price_cents: Math.round((Number(p.price) || 0) * 100),
    currency: "CAD",
    images: p.images,
    size_chart_image: p.size_chart_image,
    preorder: p.preorder,
    ships_note: blank(p.ships_note),
    fit_note: blank(p.fit_note),
    variants: p.variants.filter((v) => v.size.trim()).map((v, i) => ({ id: v.id ?? `preview-${i}`, size: v.size.trim(), inventory: v.inventory })),
  };
}

async function upload(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", await resize(file));
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error(data?.error ?? "Upload failed.");
  return data.url as string;
}

export default function ProductForm({ initial }: { initial?: InitialProduct }) {
  const router = useRouter();
  const [p, setP] = useState<InitialProduct>(initial ?? EMPTY);
  const [handleTouched, setHandleTouched] = useState(Boolean(initial));
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, startSave] = useTransition();
  const imgInput = useRef<HTMLInputElement>(null);
  const chartInput = useRef<HTMLInputElement>(null);
  const [previewing, setPreviewing] = useState(false);
  const preview = useMemo(() => toPreview(p), [p]);
  const closePreview = useCallback(() => setPreviewing(false), []);

  const set = <K extends keyof InitialProduct>(k: K, v: InitialProduct[K]) => setP((s) => ({ ...s, [k]: v }));

  async function addImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await upload(f));
      setP((s) => ({ ...s, images: [...s.images, ...urls].slice(0, 12) }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (imgInput.current) imgInput.current.value = "";
    }
  }

  async function setChart(files: FileList | null) {
    if (!files?.[0]) return;
    setUploading(true);
    setError("");
    try {
      set("size_chart_image", await upload(files[0]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (chartInput.current) chartInput.current.value = "";
    }
  }

  const move = (i: number, d: -1 | 1) =>
    setP((s) => {
      const j = i + d;
      if (j < 0 || j >= s.images.length) return s;
      const images = [...s.images];
      [images[i], images[j]] = [images[j], images[i]];
      return { ...s, images };
    });

  const setVariant = (i: number, patch: Partial<VariantRow>) =>
    setP((s) => ({ ...s, variants: s.variants.map((v, k) => (k === i ? { ...v, ...patch } : v)) }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startSave(async () => {
      const res = await saveProduct({
        ...p,
        price: Number(p.price),
        sort_order: Number(p.sort_order) || 0,
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <section className="grid gap-4 border border-neutral-200 bg-white p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="title">Title</label>
          <input
            id="title"
            className={input}
            value={p.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!handleTouched) set("handle", slugify(e.target.value));
            }}
            required
          />
        </div>
        <div>
          <label className={label} htmlFor="handle">URL handle</label>
          <input
            id="handle"
            className={input}
            value={p.handle}
            onChange={(e) => {
              setHandleTouched(true);
              set("handle", slugify(e.target.value));
            }}
            required
          />
          <p className="mt-1 text-xs text-neutral-500">Page address: /products/{p.handle || "…"}</p>
        </div>
        <div>
          <label className={label} htmlFor="price">Price (CAD)</label>
          <input
            id="price"
            className={input}
            type="number"
            min="0"
            step="0.01"
            value={p.price}
            onChange={(e) => set("price", e.target.value as unknown as number)}
            required
          />
        </div>
        <div>
          <label className={label} htmlFor="collection">Collection</label>
          <input id="collection" className={input} value={p.collection} onChange={(e) => set("collection", e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="subtitle">Subtitle</label>
          <input id="subtitle" className={input} value={p.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="description">Description</label>
          <textarea id="description" className={input} rows={4} value={p.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="ships_note">Shipping note</label>
          <input id="ships_note" className={input} placeholder="Ships in 4–6 weeks" value={p.ships_note} onChange={(e) => set("ships_note", e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="fit_note">Fit note</label>
          <input id="fit_note" className={input} placeholder="Model is 6'4 wearing size XL" value={p.fit_note} onChange={(e) => set("fit_note", e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.active} onChange={(e) => set("active", e.target.checked)} />
            Visible on the site
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.preorder} onChange={(e) => set("preorder", e.target.checked)} />
            Pre-order
          </label>
          <label className="flex items-center gap-2 text-sm">
            Sort order
            <input className={`${input} !w-20`} type="number" value={p.sort_order} onChange={(e) => set("sort_order", e.target.value as unknown as number)} />
          </label>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white p-5">
        <h2 className="mb-1 font-semibold">Images</h2>
        <p className="mb-4 text-xs text-neutral-500">The first image is the main one. JPG, PNG or WebP; large photos are resized automatically.</p>
        <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {p.images.map((src, i) => (
            <li key={src + i} className="border border-neutral-200 p-2">
              <div className="relative mb-2 aspect-[4/5] bg-neutral-100">
                <Image src={imageSrc(src)} alt={`Product image ${i + 1}`} fill sizes="160px" className="object-cover" />
                {i === 0 && <span className="absolute left-1 top-1 bg-neutral-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">MAIN</span>}
              </div>
              <div className="flex justify-between text-xs">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier" className="px-1 disabled:opacity-30">←</button>
                <button type="button" onClick={() => set("images", p.images.filter((_, k) => k !== i))} className="text-red-700 underline">Remove</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === p.images.length - 1} aria-label="Move later" className="px-1 disabled:opacity-30">→</button>
              </div>
            </li>
          ))}
        </ul>
        <input ref={imgInput} data-testid="image-input" type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => addImages(e.target.files)} />
        <button type="button" disabled={uploading || p.images.length >= 12} onClick={() => imgInput.current?.click()} className="border border-neutral-900 px-4 py-2 text-sm font-semibold disabled:opacity-50">
          {uploading ? "Uploading…" : "Add images"}
        </button>

        <h3 className="mb-2 mt-6 text-sm font-semibold">Size chart image (optional)</h3>
        {p.size_chart_image && (
          <div className="relative mb-3 aspect-[4/3] max-w-xs bg-neutral-100">
            <Image src={imageSrc(p.size_chart_image)} alt="Size chart" fill sizes="320px" className="object-contain" />
          </div>
        )}
        <input ref={chartInput} data-testid="chart-input" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => setChart(e.target.files)} />
        <div className="flex gap-3">
          <button type="button" disabled={uploading} onClick={() => chartInput.current?.click()} className="border border-neutral-900 px-4 py-2 text-sm font-semibold disabled:opacity-50">
            {p.size_chart_image ? "Replace" : "Add size chart"}
          </button>
          {p.size_chart_image && (
            <button type="button" onClick={() => set("size_chart_image", null)} className="text-sm text-red-700 underline">Remove</button>
          )}
        </div>
      </section>

      <section className="border border-neutral-200 bg-white p-5">
        <h2 className="mb-1 font-semibold">Sizes</h2>
        <p className="mb-4 text-xs text-neutral-500">Leave stock blank to not track it (pre-orders). Enter 0 to mark a size sold out.</p>
        <ul className="mb-4 flex flex-col gap-2">
          {p.variants.map((v, i) => (
            <li key={v.id ?? `new-${i}`} className="flex items-center gap-3">
              <input aria-label={`Size ${i + 1} name`} className={`${input} !w-24`} value={v.size} onChange={(e) => setVariant(i, { size: e.target.value })} />
              <input
                aria-label={`Size ${i + 1} stock`}
                className={`${input} !w-32`}
                type="number"
                min="0"
                placeholder="Stock"
                value={v.inventory ?? ""}
                onChange={(e) => setVariant(i, { inventory: e.target.value === "" ? null : Number(e.target.value) })}
              />
              <button type="button" onClick={() => set("variants", p.variants.filter((_, k) => k !== i))} className="text-sm text-red-700 underline">Remove</button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs text-neutral-500">Add:</span>
          {PRESET_SIZES.filter((s) => !p.variants.some((v) => v.size.toLowerCase() === s.toLowerCase())).map((s) => (
            <button key={s} type="button" onClick={() => set("variants", [...p.variants, { size: s, inventory: null }])} className="border border-neutral-300 px-2.5 py-1">
              {s}
            </button>
          ))}
          <button type="button" onClick={() => set("variants", [...p.variants, { size: "", inventory: null }])} className="border border-neutral-300 px-2.5 py-1">
            Custom
          </button>
        </div>
      </section>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex items-center gap-4">
        <button disabled={saving || uploading} className="bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Saving…" : initial?.id ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => setPreviewing(true)} className="border border-neutral-900 px-6 py-2.5 text-sm font-semibold">
          Preview
        </button>
        <button type="button" onClick={() => router.push("/admin")} className="text-sm underline">Cancel</button>
      </div>
      {previewing && <PreviewPanel product={preview} sortOrder={Number(p.sort_order) || 0} active={p.active} onClose={closePreview} />}
    </form>
  );
}
