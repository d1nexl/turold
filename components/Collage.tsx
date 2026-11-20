"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useBooking } from "./booking/BookingProvider";

type Photo = { src: string; className: string; speed: number };

// A centred two-line sentence with photos floating around it, each drifting at its own speed.
const photos: Photo[] = [
  { src: "/img/room-light.webp", className: "left-[27%] top-[0%] w-[11vw] aspect-[4/5]", speed: -0.6 },
  { src: "/img/mikulov-town.webp", className: "right-[8%] top-[0%] w-[19vw] aspect-[4/5]", speed: 0.4 },
  { src: "/img/hottub.webp", className: "left-0 top-[34%] w-[11vw] aspect-[4/5]", speed: -0.3 },
  { src: "/img/breakfast-2.webp", className: "left-[6%] bottom-[0%] w-[21vw] aspect-[1/1]", speed: 0.5 },
  { src: "/img/grapes-hands.webp", className: "right-0 bottom-[6%] w-[22vw] aspect-[16/10]", speed: -0.45 },
  { src: "/img/skin.webp", className: "right-[30%] bottom-[-4%] w-[9vw] aspect-[3/4]", speed: 0.8 },
];

function Drift({ p, progress }: { p: Photo; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [180 * p.speed, -180 * p.speed]);
  return (
    <motion.div style={{ y }} className={`absolute hidden overflow-hidden md:block ${p.className}`}>
      <Image src={p.src} alt="" fill sizes="22vw" className="object-cover" />
    </motion.div>
  );
}

export default function Collage() {
  const { dict } = useBooking();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const c = dict.collage;

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-[clamp(80px,9vw,160px)]">
      <div className="relative mx-auto max-w-[1900px] md:h-[min(62vw,1060px)]">
        {photos.map((p) => (
          <Drift key={p.src} p={p} progress={scrollYProgress} />
        ))}
        <div className="pointer-events-none relative z-10 flex flex-col items-center justify-center text-center md:absolute md:inset-0">
          {[c.line1, c.line2].map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 1.1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={
                i === 0
                  ? "font-serif text-[clamp(48px,6vw,118px)] font-light leading-[1.02] tracking-[-0.02em] text-ink"
                  : "font-serif text-[clamp(48px,6vw,118px)] font-light leading-[1.02] tracking-[-0.02em] text-ink"
              }
            >
              {w}
            </motion.span>
          ))}
        </div>
        {/* mobile: two photos under the words */}
        <div className="mt-14 grid grid-cols-2 gap-4 px-5 md:hidden">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/img/mikulov-town.webp" alt="" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative mt-10 aspect-[4/5] overflow-hidden">
            <Image src="/img/grapes-hands.webp" alt="" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
