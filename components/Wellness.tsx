"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useBooking } from "./booking/BookingProvider";
import Reveal from "./Reveal";

/** Wellness: asymmetric photos on a light band, big serif word over the photo. */
export default function Wellness() {
  const { dict } = useBooking();
  const t = dict.wellness;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yTall = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yWord = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section id="wellness" ref={ref} className="relative bg-white pt-[clamp(90px,10vw,170px)]">
      <div className="ml-[clamp(0px,5.8vw,112px)] bg-[#efeeea] pb-[clamp(70px,8vw,140px)] pt-[clamp(60px,6vw,100px)]">
        <div className="grid gap-10 pl-[clamp(20px,5.8vw,112px)] pr-[clamp(20px,5.8vw,112px)] lg:grid-cols-[1.35fr_1fr] lg:pl-[clamp(20px,5.8vw,112px)]">
          <div>
            <Reveal>
              <h2 className="h-serif mt-8 max-w-[14ch]">{t.title}</h2>
            </Reveal>
            <div className="relative mt-[clamp(60px,9vw,160px)]">
              <Reveal>
                <div className="zoom relative aspect-[16/11] overflow-hidden">
                  <Image src="/img/sauna-glass.webp" alt="" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
                  <motion.p
                    style={{ y: yWord }}
                    aria-hidden
                    className="pointer-events-none absolute bottom-[0.3em] left-[0.35em] font-serif text-[clamp(52px,7vw,136px)] font-light leading-none text-white"
                  >
                    {t.word}
                  </motion.p>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="flex flex-col">
            <motion.div style={{ y: yTall }} className="relative aspect-[3/4] w-full max-w-[520px] self-end overflow-hidden lg:-mt-6">
              <Image src="/img/mikulov-window.webp" alt="" fill sizes="(min-width:1024px) 34vw, 100vw" className="object-cover" />
            </motion.div>
            <Reveal className="mt-14 max-w-[440px] self-end lg:mt-16" delay={0.1}>
              {t.lines.map((l, i) => (
                <p key={l} className={i === 0 ? "font-serif text-[24px] leading-snug" : "body-soft mt-4"}>
                  {l}
                </p>
              ))}
              <a href="#poptavka" className="caps mt-10 inline-block border-t-2 border-ink pt-4 text-[13px]">
                <span className="ulink">{t.link}</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
