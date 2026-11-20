"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useBooking } from "./booking/BookingProvider";
import { rooms } from "@/lib/site";
import { formatKc } from "@/lib/booking";
import { ArrowLeft, ArrowRight } from "./icons";
import Reveal from "./Reveal";

/** Rooms: thin heading and a horizontal card carousel. */
export default function Rooms() {
  const { dict, locale, openBooking, openRoom } = useBooking();
  const t = dict.rooms;
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
      setIndex(Math.min(rooms.length - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    el.scrollTo({ left: Math.max(0, (index + dir) * step), behavior: "smooth" });
  };

  return (
    <section id="pokoje" className="relative bg-white pt-[clamp(90px,10vw,170px)]">
      <div className="wrap flex flex-wrap items-end justify-between gap-8">
        <Reveal>
          <h2 className="h-thin text-ink/85">
            {t.title[0]}
            <br />
            {t.title[1]}
          </h2>
          <p className="sub-thin mt-5 text-soft">{t.sub}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex items-center gap-10">
          <span className="caps hidden text-[13px] sm:inline">{t.label}</span>
          <span className="caps tabular-nums text-[13px]">
            {index + 1}/{rooms.length}
          </span>
          <span className="flex gap-6">
            <button type="button" aria-label={t.prev} onClick={() => go(-1)} disabled={index === 0} className="p-2 transition-opacity disabled:opacity-25">
              <ArrowLeft className="h-3.5 w-8" />
            </button>
            <button type="button" aria-label={t.next} onClick={() => go(1)} disabled={index >= rooms.length - 1} className="p-2 transition-opacity disabled:opacity-25">
              <ArrowRight className="h-3.5 w-8" />
            </button>
          </span>
        </Reveal>
      </div>

      <div className="relative mt-14">
        {/* grey band behind the lower part of the cards */}
        <div className="paper absolute inset-x-0 bottom-0 top-[38%]" />
        <div
          ref={track}
          data-lenis-prevent-wheel
          className="no-scrollbar relative flex snap-x snap-mandatory gap-[clamp(20px,3vw,56px)] overflow-x-auto scroll-smooth px-[clamp(20px,5.8vw,112px)] pb-[clamp(70px,8vw,130px)]"
          style={{ scrollPaddingInline: "clamp(20px,5.8vw,112px)" }}
        >
          {rooms.map((r) => (
            <article key={r.id} data-card className="w-[min(82vw,640px)] shrink-0 snap-start">
              <div className="group relative">
                <button type="button" onClick={() => openRoom(r.id)} className="zoom relative block aspect-[4/3] w-full overflow-hidden" aria-label={`${t.more}: ${r.name}`}>
                  <Image src={r.images[0]} alt={r.name} fill sizes="(min-width:1024px) 640px, 82vw" className="object-cover" />
                </button>
                <span className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/92 px-4 py-2 text-[13px] tracking-[0.04em] text-ink backdrop-blur">
                  {r.size} m² · {t.guestsN(r.maxGuests)}
                </span>
              </div>
              <div className="mt-7 flex items-baseline justify-between gap-6">
                <h3 className="font-serif text-[clamp(26px,2vw,36px)] font-light">{r.name}</h3>
                <p className="shrink-0 text-[16px] text-soft">
                  {t.from} <strong className="font-medium text-ink">{formatKc(r.price, locale)}</strong> {t.perNightShort}
                </p>
              </div>
              <div className="mt-5 flex items-center gap-8 border-t border-ink/10 pt-5">
                <button type="button" onClick={() => openBooking(r.id)} className="arrow-link caps text-[12px] text-wine">
                  {t.book}
                  <ArrowRight className="h-3 w-6" />
                </button>
                <button type="button" onClick={() => openRoom(r.id)} className="caps ulink text-[12px] text-soft">
                  {t.more}
                </button>
              </div>
            </article>
          ))}
          <span className="w-px shrink-0" aria-hidden />
        </div>
      </div>
    </section>
  );
}
