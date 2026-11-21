"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useBooking } from "./booking/BookingProvider";
import { seasonImages } from "@/lib/site";
import { ArrowRight, IconHarvest, IconSpring, IconTaste, IconWinter } from "./icons";
import Reveal from "./Reveal";

const icons = [IconSpring, IconHarvest, IconTaste, IconWinter];
const targets = ["okoli", "okoli", "sklep", "wellness"];

/** Seasons: full-bleed photo, 4 ring icons; hovering one swaps the background. */
export default function Seasons() {
  const { dict } = useBooking();
  const t = dict.seasons;
  const [active, setActive] = useState(0);

  return (
    <section data-tone="dark" className="relative mt-[clamp(80px,9vw,150px)] h-[min(100svh,980px)] min-h-[680px] overflow-hidden text-white">
      {seasonImages.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          className={clsx("object-cover transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]", i === active ? "scale-100 opacity-100" : "scale-105 opacity-0")}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/60" />

      <div className="relative flex h-full flex-col">
        <Reveal className="pt-[clamp(90px,10vw,150px)] text-center">
          <h2 className="h-thin">{t.title}</h2>
          <p className="mx-auto mt-3 max-w-[30ch] px-5 text-[19px] lg:max-w-none font-light tracking-[0.03em] lg:font-normal [text-shadow:0_1px_18px_rgba(0,0,0,0.5)] lg:text-[26px]">{t.sub}</p>
        </Reveal>

        <div className="wrap mt-auto pb-[clamp(110px,10vw,150px)] lg:pb-[150px] xl:pb-[160px]">
          <ul className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
            {t.items.map((item, i) => {
              const Icon = icons[i];
              const on = i === active;
              return (
                <li key={item.title} className="w-[70vw] shrink-0 snap-center md:w-auto">
                  <a
                    href={`#${targets[i]}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex flex-col items-center text-center"
                  >
                    <Icon className={clsx("size-[96px] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] xl:size-[112px]", on && "-translate-y-3")} />
                    <span className={clsx("mt-6 text-[clamp(26px,2vw,36px)] font-light tracking-[0.02em] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]", on && "-translate-y-3")}>
                      {item.title}
                    </span>
                    <span
                      className={clsx(
                        "caps arrow-link mt-1 text-[13px] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
                        on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 md:opacity-0",
                      )}
                    >
                      {item.link}
                      <ArrowRight className="h-3 w-6" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
