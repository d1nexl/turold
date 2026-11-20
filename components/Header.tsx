"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "./booking/BookingProvider";
import { site } from "@/lib/site";
import { scrollToId } from "./SmoothScroll";

const menuImages = ["/img/room-3.webp", "/img/sauna.webp", "/img/cellar-tunnel.webp", "/img/house-arch.webp", "/img/vineyard-hill.webp", "/img/vineyard-dusk.webp"];

export default function Header() {
  const { dict, locale, openBooking } = useBooking();
  const t = dict.header;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
  }, [menu]);

  const go = (id: string) => {
    setMenu(false);
    window.setTimeout(() => scrollToId(id), 80);
  };

  const nav = dict.menu.links.slice(0, 4);

  const langs = (
    <span className="flex items-center gap-3">
      {(["cs", "en"] as const).map((l) => (
        <a key={l} href={`/${l}`} className={clsx("caps text-[12px] transition-opacity", locale === l ? "opacity-100" : "opacity-65 hover:opacity-100")}>
          {l}
        </a>
      ))}
    </span>
  );

  const burger = (
    <button type="button" onClick={() => setMenu(true)} aria-label={t.menu} aria-expanded={menu} className="group grid size-11 place-items-center rounded-full border border-current/30 transition-colors hover:border-current">
      <span className="flex w-[18px] flex-col gap-[5px]">
        <span className="h-px w-full bg-current" />
        <span className="h-px w-2/3 bg-current transition-all duration-500 group-hover:w-full" />
      </span>
    </button>
  );

  const bookBtn = (
    <button type="button" onClick={() => openBooking()} className="group hidden h-11 items-center rounded-full bg-wine px-6 lg:inline-flex text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-wine-deep">
      <span className="roll">
        <span>{t.book}</span>
        <span aria-hidden>{t.book}</span>
      </span>
    </button>
  );

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,height] duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
          scrolled ? "bg-white/92 text-ink shadow-[0_1px_0_rgba(0,0,0,0.08)] backdrop-blur-md" : "bg-transparent text-white",
        )}
      >
        <div className={clsx("wrap grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center transition-[height] duration-700", scrolled ? "h-[76px]" : "h-[120px] lg:h-[150px]")}>
          <nav className="hidden items-center gap-7 whitespace-nowrap xl:flex 2xl:gap-9">
            {nav.map((l) => (
              <button key={l.id} type="button" onClick={() => go(l.id)} className="caps ulink text-[12px]">
                {l.label.split(" & ")[0]}
              </button>
            ))}
          </nav>

          <a href="#top" className="col-start-2 flex flex-col items-center text-center" aria-label="TUROLD">
            <span className={clsx("font-serif font-normal leading-none tracking-[0.14em] transition-[font-size] duration-700", scrolled ? "text-[26px]" : "text-[clamp(34px,3vw,52px)]")}>
              TUROLD
            </span>
            <span
              className={clsx(
                "overflow-hidden text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-500 sm:tracking-[0.34em]",
                scrolled ? "invisible mt-0 max-h-0 opacity-0" : "mt-3 max-h-6 opacity-90",
              )}
            >
              {t.tagline}
            </span>
          </a>

          <div className="flex items-center justify-end gap-5 xl:gap-7">
            <a href={site.phoneHref} className="caps ulink hidden whitespace-nowrap text-[12px] 2xl:inline">{site.phone}</a>
            <span className="hidden sm:block">{langs}</span>
            {bookBtn}
            {burger}
          </div>
        </div>
      </header>

      {/* Full-screen menu: links on the left, a photo that follows the hovered link */}
      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[70] grid overflow-y-auto bg-white text-ink lg:grid-cols-[1.1fr_1fr]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            data-lenis-prevent
          >
            <div className="flex min-h-[100svh] flex-col px-[clamp(20px,5.8vw,112px)] py-8">
              <div className="flex items-center justify-between">
                <span className="font-serif text-[26px] tracking-[0.14em]">TUROLD</span>
                <button type="button" onClick={() => setMenu(false)} className="caps ulink text-[12px]" data-autofocus>
                  {t.close}
                </button>
              </div>
              <nav className="my-auto flex flex-col gap-2 py-12">
                {dict.menu.links.map((l, i) => (
                  <motion.button
                    key={l.id}
                    type="button"
                    onClick={() => go(l.id)}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={clsx(
                      "group flex items-baseline gap-5 text-left font-serif text-[clamp(32px,3.4vw,58px)] font-light leading-[1.15] transition-colors",
                      hover === i ? "text-ink" : "text-ink/45",
                    )}
                  >
                    <span className={clsx("transition-transform duration-500", hover === i && "translate-x-2")}>{l.label}</span>
                  </motion.button>
                ))}
              </nav>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[14px] text-soft">
                <span>
                  {site.street}, {site.city}
                </span>
                <a href={site.phoneHref} className="ulink">{site.phone}</a>
                {langs}
              </div>
            </div>
            <div className="relative hidden lg:block">
              {menuImages.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  fill
                  sizes="50vw"
                  className={clsx("object-cover transition-opacity duration-700", i === hover ? "opacity-100" : "opacity-0")}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
