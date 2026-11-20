"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "./booking/BookingProvider";
import { ArrowRight } from "./icons";

/** Small direct-booking offer card, bottom right, closable. */
export default function DirectCard() {
  const { dict, openBooking, panel } = useBooking();
  const t = dict.direct;
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.9) setShow(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // It covers content, so it only stays for a while.
  useEffect(() => {
    if (!show) return;
    const id = window.setTimeout(() => setClosed(true), 12000);
    return () => window.clearTimeout(id);
  }, [show]);

  return (
    <AnimatePresence>
      {show && !closed && panel === null && (
        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[150px] right-[clamp(20px,4vw,64px)] z-40 hidden w-[400px] bg-[#e4e1d9] text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] xl:flex"
        >
          <div className="relative w-[130px] shrink-0">
            <Image src="/img/room-3.webp" alt="" fill sizes="170px" className="object-cover" />
          </div>
          <div className="relative py-5 pl-6 pr-11">
            <button type="button" aria-label={t.close} onClick={() => setClosed(true)} className="absolute right-3 top-3 grid size-8 place-items-center transition-transform hover:rotate-90">
              <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 4l12 12M16 4L4 16" /></svg>
            </button>
            <p className="text-[18px] font-medium leading-snug">{t.title}</p>
            <p className="mt-2 text-[14px] leading-snug text-soft">{t.text}</p>
            <button type="button" onClick={() => openBooking()} className="arrow-link caps mt-4 text-[13px]">
              {t.cta}
              <ArrowRight className="h-3 w-5" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
