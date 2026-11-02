/** Frames taken from the founder film (see scripts/extract-frames.mjs). */
export type StillName = "studio" | "turn" | "dusk" | "closeup";

const ALT: Record<StillName, string> = {
  studio: "Anuvamshi Shetty at a desk in a dark studio with a microphone, from the founder film",
  turn: "Anuvamshi Shetty in profile, turning towards the light, from the founder film",
  dusk: "Anuvamshi Shetty looking upward against a navy-to-ember dusk backdrop, from the founder film",
  closeup: "Anuvamshi Shetty smiling towards the camera against a dusk backdrop, from the founder film",
};

type Props = {
  name: StillName;
  className?: string;
  /** CSS object-position, e.g. "50% 35%" */
  position?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function Still({ name, className, position = "50% 40%", priority = false, decorative = false }: Props) {
  return (
    <picture>
      <source media="(max-width: 767px) and (orientation: portrait)" srcSet={`/stills/${name}-portrait.webp`} width={720} height={1080} />
      <img
        src={`/stills/${name}.webp`}
        width={1600}
        height={900}
        alt={decorative ? "" : ALT[name]}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`h-full w-full object-cover ${className ?? ""}`}
        style={{ objectPosition: position }}
      />
    </picture>
  );
}
