/** Product images are either a file in /public/images (seeded) or a full URL (admin uploads). */
export function imageSrc(src: string) {
  return /^https?:\/\//.test(src) ? src : `/images/${src}`;
}
