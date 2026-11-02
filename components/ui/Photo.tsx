/** Photographs supplied by the client (processed into public/photos by `npm run frames`). */
export const PHOTOS = {
  stage: { src: "/photos/stage.webp", w: 1206, h: 795, alt: "Anuvamshi Shetty speaking on a TEDx stage" },
  "portrait-warm": { src: "/photos/portrait-warm.webp", w: 1206, h: 998, alt: "Portrait of Anuvamshi Shetty, resting her chin on her hand" },
  "portrait-desk": { src: "/photos/portrait-desk.webp", w: 1206, h: 672, alt: "Anuvamshi Shetty in a black blazer, seated at a desk" },
} as const;

export type PhotoName = keyof typeof PHOTOS;

export function Photo({
  name,
  className,
  position = "50% 30%",
  priority = false,
  decorative = false,
}: {
  name: PhotoName;
  className?: string;
  position?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const p = PHOTOS[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.src}
      width={p.w}
      height={p.h}
      alt={decorative ? "" : p.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={`h-full w-full object-cover ${className ?? ""}`}
      style={{ objectPosition: position }}
    />
  );
}
