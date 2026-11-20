"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { useBooking } from "./BookingProvider";
import RangeCalendar from "./RangeCalendar";
import { formatDay, nightsBetween } from "@/lib/booking";

type Tone = "dark" | "light";

function ArrowDown() {
  return (
    <svg viewBox="0 0 14 20" className="h-[18px] w-3" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M7 2v15M2 12l5 5 5-5" />
    </svg>
  );
}

function Stepper({ label, value, onChange, min }: { label: string; value: number; onChange: (n: number) => void; min: number }) {
  return (
    <div className="flex flex-1 items-center justify-between gap-3 px-6 xl:px-8">
      <span className="text-[19px] font-light tracking-[0.02em] xl:text-[21px]">
        {label}
        <span className="ml-3 tabular-nums opacity-90">{value}</span>
      </span>
      <span className="flex flex-col">
        <button type="button" aria-label={`${label} +`} onClick={() => onChange(value + 1)} className="grid h-4 w-6 place-items-center opacity-80 hover:opacity-100">
          <svg viewBox="0 0 14 10" className="h-2.5 w-3" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7 9V1M2 5l5-4 5 4" /></svg>
        </button>
        <button
          type="button"
          aria-label={`${label} −`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid h-4 w-6 place-items-center opacity-80 hover:opacity-100 disabled:opacity-25"
        >
          <svg viewBox="0 0 14 10" className="h-2.5 w-3" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7 1v8M2 5l5 4 5-4" /></svg>
        </button>
      </span>
    </div>
  );
}

/** Booking pill: arrival / departure / adults / children (+ optional buttons). */
export function BookingFields({ tone, withButtons = true, calendarUp = true }: { tone: Tone; withButtons?: boolean; calendarUp?: boolean }) {
  const { dict, locale, from, to, adults, children, setAdults, setChildren, openBooking, openEnquiry } = useBooking();
  const t = dict.bar;
  const [cal, setCal] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cal) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setCal(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCal(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [cal]);

  const dateField = (value: string | null, label: string) => (
    <button type="button" onClick={() => setCal((v) => !v)} aria-expanded={cal} className="flex flex-1 items-center justify-between gap-4 px-6 text-left xl:px-8">
      <span className="text-[19px] font-light tracking-[0.02em] xl:text-[21px]">
        {value ? (
          <>
            <span className="mr-2 text-[12px] uppercase tracking-[0.18em] opacity-70">{label}</span>
            {formatDay(value, locale)}
          </>
        ) : (
          label
        )}
      </span>
      <ArrowDown />
    </button>
  );

  return (
    <div ref={root} className="relative">
      <div
        className={clsx(
          "flex h-[88px] items-center rounded-full border transition-colors duration-700 xl:h-[104px]",
          tone === "dark" ? "border-white/80 text-white" : "border-ink/15 bg-white/95 text-ink shadow-[0_14px_40px_-18px_rgba(0,0,0,0.3)] backdrop-blur",
        )}
      >
        <div className="flex flex-[1.15] items-center pl-4">
          {dateField(from, t.arrival)}
          {dateField(to, t.departure)}
        </div>
        <span className={clsx("h-12 w-px", tone === "dark" ? "bg-white/50" : "bg-ink/15")} />
        <Stepper label={t.adults} value={adults} min={1} onChange={setAdults} />
        <span className={clsx("h-12 w-px", tone === "dark" ? "bg-white/50" : "bg-ink/15")} />
        <Stepper label={t.children} value={children} min={0} onChange={setChildren} />
        {withButtons && (
          <>
            <span className={clsx("h-12 w-px", tone === "dark" ? "bg-white/50" : "bg-ink/15")} />
            <div className="flex items-center gap-4 pl-8 pr-6 xl:gap-6 xl:pl-12 xl:pr-8">
              <button type="button" onClick={openEnquiry} className="pill pill-line group">
                <span className="roll">
                  <span>{t.enquiry}</span>
                  <span aria-hidden>{t.enquiry}</span>
                </span>
              </button>
              <button type="button" onClick={() => openBooking()} className="pill pill-wine group">
                <span className="roll">
                  <span>{t.book}</span>
                  <span aria-hidden>{t.book}</span>
                </span>
              </button>
            </div>
          </>
        )}
        {from && to && (
          <span className={clsx("pointer-events-none absolute left-12 text-[12px] uppercase tracking-[0.18em]", calendarUp ? "-top-7" : "-bottom-7", tone === "dark" ? "text-white/80" : "text-soft")}>
            {t.nights(nightsBetween(from, to))}
          </span>
        )}
      </div>

      <AnimatePresence>
        {cal && (
          <motion.div
            initial={{ opacity: 0, y: calendarUp ? 12 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: calendarUp ? 8 : -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className={clsx(
              "absolute left-4 z-30 w-[min(720px,calc(100vw-48px))] rounded-[6px] bg-white p-7 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]",
              calendarUp ? "bottom-[calc(100%+14px)]" : "top-[calc(100%+14px)]",
            )}
          >
            <RangeCalendar onDone={() => setCal(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Fixed bar at the bottom of the screen (both references keep it there the whole page). */
export default function BookingBar() {
  const { dict, locale, from, to, panel, openBooking } = useBooking();
  const [overHero, setOverHero] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const hideOn = ["poptavka", "paticka"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Set<Element>();

    const heroObs = new IntersectionObserver(([e]) => setOverHero(e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] });
    if (hero) heroObs.observe(hero);
    const hideObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setHidden(visible.size > 0);
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    hideOn.forEach((el) => hideObs.observe(el));
    return () => {
      heroObs.disconnect();
      hideObs.disconnect();
    };
  }, []);

  const show = !hidden && panel === null;

  return (
    <>
      {/* Desktop pill */}
      <div
        className={clsx(
          "fixed inset-x-0 bottom-6 z-40 hidden px-[clamp(20px,4vw,64px)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] lg:block",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0",
        )}
      >
        <div className="mx-auto max-w-[1680px]">
          <BookingFields tone={overHero ? "dark" : "light"} />
        </div>
      </div>

      {/* Mobile: one pill that opens the booking modal */}
      <div
        className={clsx(
          "fixed inset-x-4 bottom-4 z-40 transition-all duration-500 lg:hidden",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <button
          type="button"
          onClick={() => openBooking()}
          className="flex h-14 w-full items-center justify-between rounded-full bg-wine pl-6 pr-2 text-white shadow-[0_14px_40px_-14px_rgba(0,0,0,0.45)]"
        >
          <span className="text-[13px] font-medium uppercase tracking-[0.16em]">
            {from && to ? `${formatDay(from, locale)} – ${formatDay(to, locale)}` : dict.bar.mobile}
          </span>
          <span className="grid size-10 place-items-center rounded-full bg-white/20">
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
          </span>
        </button>
      </div>
    </>
  );
}
