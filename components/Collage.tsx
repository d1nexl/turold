"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useBooking } from "./booking/BookingProvider";

type Photo = { src: string; aspect: string; offset: string; speed: number };

// A full-width strip of photos in a stepped rhythm under the sentence; each drifts a little at its own pace.
const photos: Photo[] = [
  { src: "/img/mikulov-town.webp", aspect: "aspect-[3/4]", offset: "md:mt-0", speed: 0.6 },
  { src: "/img/breakfast-2.webp", aspect: "aspect-[4/5]", offset: "md:mt-24", speed: -0.4 },
  { src: "/img/grapes-hands.webp", aspect: "aspect-[3/4]", offset: "md:mt-8", speed: 0.3 },
  { src: "/img/hottub.webp", aspect: "aspect-[4/5]", offset: "md:mt-32", speed: -0.5 },
  { src: "/img/room-light.webp", aspect: "aspect-[3/4]", offset: "md:mt-12", speed: 0.45 },
];

function Frame({ p, progress, i }: { p: Photo; progress: MotionValue<number>; i: number }) {
  const y = useTransform(progress, [0, 1], [60 * p.speed, -60 * p.speed]);
  return (
    <motion.div style={{ y }} className={`${i % 2 ? "mt-10" : ""} ${p.offset} ${i > 3 ? "hidden md:block" : ""}`}>
      <div className={`zoom relative overflow-hidden ${p.aspect}`}>
        <Image src={p.src} alt="" fill sizes="(min-width:768px) 20vw, 50vw" className="object-cover" />
      </div>
    </motion.div>
  );
}

export default function Collage() {
  const { dict } = useBooking();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const c = dict.collage;

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-[clamp(90px,10vw,170px)]">
      <h2 className="wrap text-center font-serif text-[clamp(44px,5.4vw,104px)] font-light leading-[1.04] tracking-[-0.02em] text-ink">
        {c.line1}
        <br />
        {c.line2}
      </h2>

      <div className="mt-[clamp(50px,6vw,100px)] grid grid-cols-2 gap-4 px-5 md:grid-cols-5 md:gap-[clamp(14px,1.6vw,28px)] md:px-[clamp(20px,3vw,48px)]">
        {photos.map((p, i) => (
          <Frame key={p.src} p={p} progress={scrollYProgress} i={i} />
        ))}
      </div>
    </section>
  );
}
