"use client";

import Image from "next/image";
import { useBooking } from "./booking/BookingProvider";
import { ArrowRight } from "./icons";
import Reveal from "./Reveal";

/** Surroundings: dark full-bleed photo, thin heading on the left, link opens the trips modal. */
export default function Surroundings() {
  const { dict, openSurroundings } = useBooking();
  const t = dict.surroundings;
  return (
    <section id="okoli" data-tone="dark" className="relative min-h-[min(92svh,900px)] overflow-hidden bg-[#141a1f] text-white">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[68%]">
        <Image src="/img/vineyard-sunset.webp" alt="" fill sizes="(min-width:1024px) 68vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141a1f] via-[#141a1f]/40 to-transparent lg:via-transparent" />
      </div>
      <div className="wrap relative flex min-h-[min(92svh,900px)] items-center py-28">
        <Reveal className="max-w-[560px]">
          <h2 className="h-thin text-[clamp(44px,4.4vw,84px)]">
            {t.title[0]}
            <br />
            {t.title[1]}
          </h2>
          <p className="sub-thin mt-6">{t.sub}</p>
          <button type="button" onClick={openSurroundings} className="arrow-link caps mt-12 text-[14px] font-semibold">
            {t.link}
            <ArrowRight className="h-3 w-6" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
