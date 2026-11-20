import Image from "next/image";
import type { Dict } from "@/lib/dictionaries";
import Reveal from "./Reveal";

/** Intro: thin heading, photo on paper, text on the right. */
export default function Intro({ dict }: { dict: Dict }) {
  const t = dict.intro;
  return (
    <section id="dum" className="relative overflow-hidden bg-white pt-[clamp(90px,10vw,170px)]">
      <div className="wrap">
        <Reveal>
          <h2 className="h-thin text-ink/85">
            {t.title[0]}
            <br />
            {t.title[1]}
          </h2>
        </Reveal>
      </div>

      <div className="relative mt-12 grid lg:grid-cols-2">
        {/* paper block with the photo */}
        <div className="paper relative pb-[clamp(60px,7vw,120px)] pt-[clamp(80px,10vw,160px)]">
          <Reveal className="relative ml-auto mr-[8%] w-[min(78%,640px)]">
            <div className="zoom relative aspect-[5/4] overflow-hidden">
              <Image src="/img/courtyard.webp" alt="" fill sizes="(min-width:1024px) 40vw, 80vw" className="object-cover" />
            </div>
          </Reveal>
        </div>

        <div className="relative flex items-center px-[clamp(20px,5.8vw,112px)] py-16 lg:py-0">
          <Reveal className="max-w-[560px]" delay={0.1}>
            <h3 className="sub-thin text-ink">{t.sub}</h3>
            <p className="body-soft mt-7 text-[17px]">{t.p1}</p>
            <p className="body-soft mt-5 text-[17px]">{t.p2}</p>
            <a href="#historie" className="arrow-link caps mt-10 text-sage-deep">
              {t.link}
              <svg viewBox="0 0 24 12" className="h-3 w-6" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M0 6h22M17 1l5 5-5 5" /></svg>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
