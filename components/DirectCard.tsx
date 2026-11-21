"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "./booking/BookingProvider";
import { ArrowRight } from "./icons";

const SEEN_KEY = "turold-direct-card-seen";
const DELAY_MS = 25_000;
const STAY_MS = 14_000;

/**
 * Small direct-booking offer: appears once per visit, 25 s after load and only below the hero,
 * sits above the booking pill, and leaves on its own after a while.
 */
export default function DirectCard() {
  const { dict, openBooking, panel } = useBooking();
  const t = dict.direct;
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen) return;

    let hideTimer = 0;
    const tryShow = () => {
      if (window.scrollY < window.innerHeight * 0.9) return false;
      setShow(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      hideTimer = window.setTimeout(() => setShow(false), STAY_MS);
      return true;
    };

    let onScroll: (() => void) | null = null;
    const startTimer = window.setTimeout(() => {
      if (tryShow()) return;
      // Still on the hero after the delay: show it the first time the visitor scrolls past it.
      onScroll = () => {
        if (tryShow() && onScroll) window.removeEventListener("scroll", onScroll);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }, DELAY_MS);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(hideTimer);
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && panel === null && (
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[124px] right-[clamp(20px,4vw,64px)] z-40 hidden w-[380px] bg-[#e4e1d9] text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] xl:flex"
        >
          <div className="relative w-[120px] shrink-0">
            <Image src="/img/room-3.webp" alt="" fill sizes="120px" className="object-cover" />
          </div>
          <div className="relative py-5 pl-6 pr-11">
            <button type="button" aria-label={t.close} onClick={() => setShow(false)} className="absolute right-2 top-2 grid size-9 place-items-center transition-transform hover:rotate-90">
              <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 4l12 12M16 4L4 16" /></svg>
            </button>
            <p className="text-[17px] font-medium leading-snug">{t.title}</p>
            <p className="mt-2 text-[14px] leading-snug text-soft">{t.text}</p>
            <button
              type="button"
              onClick={() => {
                setShow(false);
                openBooking();
              }}
              className="arrow-link caps mt-4 text-[12px]"
            >
              {t.cta}
              <ArrowRight className="h-3 w-5" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
