import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Still, type StillName } from "./Still";
import { Photo, type PhotoName } from "./Photo";
import { Container, Eyebrow } from "./Blocks";

type Common = {
  eyebrow: string;
  title: string;
  titleEm?: string;
  intro?: string;
  position?: string;
  /** render title + titleEm as one word (e.g. "AccelRevenue") */
  joined?: boolean;
  children?: React.ReactNode;
};

function Heading({ title, titleEm, joined }: Pick<Common, "title" | "titleEm" | "joined">) {
  return (
    <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.92] tracking-[-0.02em] text-bone">
      {title}
      {titleEm && (
        <>
          {joined ? "" : " "}
          <em className="italic text-sand">{titleEm}</em>
        </>
      )}
    </h1>
  );
}

/**
 * Inner-page opening. Two variants:
 *  - `still`: full-bleed frame from the founder film (text bottom-left over a scrim).
 *  - `photo`: split layout — copy on the left, the client's photograph in a 3D-tilting frame on the right
 *    (photos are ~1200px wide, so they are framed rather than stretched full-bleed).
 */
export function PageHero(props: Common & ({ still: StillName; photo?: never } | { photo: PhotoName; still?: never })) {
  const { eyebrow, title, titleEm, intro, position, joined, children } = props;

  if (props.photo) {
    return (
      <header className="relative isolate overflow-hidden bg-ink pb-16 pt-28 md:pb-24 md:pt-36">
        <div aria-hidden className="pointer-events-none absolute -right-[10%] top-0 -z-10 h-[80%] w-[60%] rounded-full bg-navy/35 blur-[140px]" />
        <Container className="grid items-center gap-12 md:grid-cols-12 md:gap-6">
          <Reveal stagger className="order-2 md:order-1 md:col-span-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading title={title} titleEm={titleEm} joined={joined} />
            {intro && <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-bone/75">{intro}</p>}
            {children && <div className="mt-8">{children}</div>}
          </Reveal>
          <div className="order-1 [perspective:1400px] md:order-2 md:col-span-6 md:col-start-7">
            <Tilt max={5} className="rounded-[22px]">
              <ClipReveal className={`rounded-[22px] ${props.photo === "stage" ? "aspect-[4/3]" : "aspect-[4/5] md:aspect-[5/6]"}`}>
                <Photo name={props.photo} priority position={position} />
              </ClipReveal>
            </Tilt>
          </div>
        </Container>
      </header>
    );
  }

  return (
    // Mobile: image fills the top ~70% and the copy starts below the subject's chin (face sits in the upper third of every portrait still).
    <header className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink pb-16 pt-[56svh] md:min-h-[92svh] md:pb-24 md:pt-32">
      <Parallax amount={6} className="!absolute inset-x-0 top-0 -z-10 h-[72svh] md:inset-0 md:h-auto">
        <Still name={props.still!} priority position={position} />
      </Parallax>
      <div aria-hidden className="absolute inset-x-0 top-[42svh] -z-10 h-[30.5svh] bg-gradient-to-b from-transparent to-ink md:hidden" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,8,12,.85)_0%,rgba(6,8,12,.45)_38%,rgba(6,8,12,0)_60%)] max-md:hidden" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#06080c_0%,rgba(6,8,12,.7)_35%,rgba(6,8,12,0)_70%)]" />
      <Container>
        <Reveal stagger className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading title={title} titleEm={titleEm} joined={joined} />
          {intro && <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-bone/75">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </Container>
    </header>
  );
}
