"use client";

import { useRef, useState } from "react";
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
  const track = useRef<HTMLUListElement>(null);

  const onTrackScroll = () => {
    const el = track.current;
    if (!el || el.scrollWidth <= el.clientWidth) return; // desktop grid doesn't scroll
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" });

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

        <div className="wrap mt-auto pb-[clamp(96px,10vw,150px)] lg:pb-[150px] xl:pb-[160px]">
          {/* Phones: one season per screen, swipe; the visible one sets the photo. Desktop: 4 columns, hover sets it. */}
          <ul
            ref={track}
            onScroll={onTrackScroll}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:grid md:grid-cols-4 md:gap-6 md:overflow-visible"
          >
            {t.items.map((item, i) => {
              const Icon = icons[i];
              const on = i === active;
              return (
                <li key={item.title} className="w-full shrink-0 snap-center md:w-auto">
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
                        on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
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

          {/* dots (phones only) */}
          <div className="mt-6 flex justify-center md:hidden">
            {t.items.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={item.title}
                aria-current={i === active}
                onClick={() => goTo(i)}
                className="grid size-11 place-items-center"
              >
                <span className={clsx("block h-[2px] rounded-full bg-white transition-all duration-500", i === active ? "w-7 opacity-100" : "w-3 opacity-50")} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
