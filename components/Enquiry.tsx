"use client";

import Image from "next/image";
import { useBooking } from "./booking/BookingProvider";
import { BookingFields } from "./booking/BookingBar";
import { ArrowRight } from "./icons";
import Reveal from "./Reveal";

/** Enquiry: full photo, centred thin heading, the big pill + two buttons. */
export default function Enquiry() {
  const { dict, openEnquiry, openBooking } = useBooking();
  const t = dict.enquiry;
  return (
    <section id="poptavka" data-tone="dark" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night py-28 text-white">
      <Image src="/img/vineyard-dusk.webp" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="wrap relative w-full">
        <Reveal className="text-center">
          <h2 className="h-thin text-[clamp(46px,4.8vw,92px)]">
            {t.title[0]}
            <br />
            {t.title[1]}
          </h2>
          <p className="sub-thin mt-6">{t.sub}</p>
        </Reveal>
        <Reveal delay={0.12} className="mx-auto mt-16 hidden max-w-[1180px] lg:block">
          <BookingFields tone="dark" withButtons={false} calendarUp={false} />
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex flex-wrap justify-center gap-5">
          <button type="button" onClick={openEnquiry} className="pill pill-line group">
            <span className="roll">
              <span>{dict.bar.enquiry}</span>
              <span aria-hidden>{dict.bar.enquiry}</span>
            </span>
            <ArrowRight className="h-3 w-5" />
          </button>
          <button type="button" onClick={() => openBooking()} className="pill pill-wine group">
            <span className="roll">
              <span>{dict.bar.book}</span>
              <span aria-hidden>{dict.bar.book}</span>
            </span>
            <ArrowRight className="h-3 w-5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
