"use client";

import { useBooking } from "./booking/BookingProvider";

/* Entrance runs on CSS keyframes (globals.css), so the headline shows even before hydration. */
export default function Hero() {
  const { dict } = useBooking();
  const t = dict.hero;
  return (
    <section id="top" data-tone="dark" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-night text-white">
      <video
        className="hero-zoom absolute inset-0 size-full object-cover"
        src="/video/hero.mp4"
        poster="/img/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/60" />

      <div className="wrap relative flex h-full flex-col justify-end pb-[120px] lg:pb-[200px] xl:pb-[230px]">
        <h1 className="h-serif-lg rise mt-8 max-w-[15ch] text-[clamp(40px,4.4vw,82px)]" style={{ animationDelay: "0.65s" }}>
          {t.title}
        </h1>
        <p className="rise mt-6 max-w-[42ch] font-serif text-[clamp(18px,1.6vw,28px)] font-normal leading-[1.35]" style={{ animationDelay: "0.85s" }}>
          {t.sub}
        </p>
      </div>
    </section>
  );
}
