import { z } from "zod";

const text = (max: number) =>
  z.string().trim().max(max).transform((v) => (v === "" ? null : v)).nullable();

// A seeded file name (Drop1IMG1.jpeg) or an https URL from Storage.
const image = z.string().trim().min(1).max(500).refine((v) => /^https:\/\//.test(v) || /^[\w.-]+$/.test(v), "Invalid image");

export const productInput = z.object({
  id: z.string().uuid().optional(),
  handle: z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Handle: lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(1, "Title is required").max(120),
  collection: text(120),
  subtitle: text(200),
  description: text(4000),
  price: z.number().finite().min(0).max(100000),
  images: z.array(image).max(12),
  size_chart_image: image.nullable(),
  preorder: z.boolean(),
  ships_note: text(120),
  fit_note: text(200),
  active: z.boolean(),
  sort_order: z.number().int().min(-1000).max(1000),
  variants: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        size: z.string().trim().min(1, "Every size needs a name").max(12),
        inventory: z.number().int().min(0).max(100000).nullable(),
      }),
    )
    .min(1, "Add at least one size")
    .max(20)
    .refine((v) => new Set(v.map((x) => x.size.toLowerCase())).size === v.length, "Sizes must be unique"),
});

export type ProductInput = z.input<typeof productInput>;
