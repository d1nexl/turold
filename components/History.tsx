import Image from "next/image";
import type { Dict } from "@/lib/dictionaries";
import Reveal from "./Reveal";

/** Dark history block: the founding year as a huge light numeral, story on the right. */
export default function History({ dict }: { dict: Dict }) {
  const t = dict.history;
  return (
    <section id="historie" data-tone="dark" className="relative overflow-hidden bg-night py-[clamp(90px,10vw,170px)] text-white">
      <Image src="/img/cellar-door.webp" alt="" fill sizes="100vw" className="object-cover opacity-[0.35] grayscale" />
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-night/40" />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-24">
        <Reveal>
          <p className="select-none font-serif text-[clamp(120px,17vw,300px)] font-extralight leading-[0.85] tracking-[-0.03em] text-white/90">
            {t.year}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="font-serif text-[clamp(30px,2.6vw,46px)] font-light leading-[1.15]">{t.title}</h2>
          <div className="mt-10 space-y-5 border-l border-white/25 pl-7">
            {t.lines.map((l) => (
              <p key={l} className="text-[17px] font-light leading-[1.75] text-white/85">
                {l}
              </p>
            ))}
          </div>
          <a href="#dum" className="arrow-link caps mt-10 text-[13px]">
            <span className="ulink">{t.link}</span>
            <svg viewBox="0 0 24 12" className="h-3 w-6" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M0 6h22M17 1l5 5-5 5" /></svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
