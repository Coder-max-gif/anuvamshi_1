import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink pt-24">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12">
        <p className="eyebrow text-amber">404</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] font-light leading-none text-bone">
          This scene <em className="italic text-sand">isn&rsquo;t in the film.</em>
        </h1>
        <Link href="/" className="btn-primary mt-10">Back to the beginning</Link>
      </div>
    </section>
  );
}
