"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "./booking/BookingProvider";

/**
 * Cellar / breakfast / terrace: tab names in a row, one large photo with a small one overlapping it,
 * and the facts as a 2×2 grid of label + text.
 */
export default function Cellar() {
  const { dict } = useBooking();
  const t = dict.cellar;
  const [i, setI] = useState(0);
  const tab = t.tabs[i];

  return (
    <section id="sklep" className="relative overflow-hidden bg-white py-[clamp(90px,10vw,170px)]">
      <div className="wrap">
        <div className="flex flex-wrap items-end gap-8 border-b border-line pb-6">
          <div role="tablist" className="no-scrollbar -mx-1 flex gap-x-8 whitespace-nowrap px-1 max-sm:w-full max-sm:overflow-x-auto sm:gap-x-10">
            {t.tabs.map((x, k) => (
              <button
                key={x.name}
                role="tab"
                aria-selected={k === i}
                type="button"
                onClick={() => setI(k)}
                className={clsx(
                  "relative pb-1 font-serif text-[clamp(20px,1.6vw,26px)] transition-colors after:absolute after:inset-x-0 after:bottom-0 sm:after:-bottom-[25px] after:h-[2px] after:origin-left after:bg-wine after:transition-transform after:duration-500",
                  k === i ? "text-ink after:scale-x-100" : "text-ink/60 after:scale-x-0 hover:text-ink/85",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(50px,6vw,100px)] grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          {/* photos */}
          <div className="relative pb-[18%] pr-[14%]">
            <AnimatePresence mode="wait">
              <motion.div key={tab.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <div className="zoom relative aspect-[5/4] overflow-hidden">
                  <Image src={tab.images[0]} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                </div>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 right-0 aspect-[4/5] w-[38%] overflow-hidden border-[10px] border-white"
                >
                  <Image src={tab.images[1]} alt="" fill sizes="20vw" className="object-cover" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="self-center"
            >
              <h2 className="font-serif text-[clamp(40px,4vw,72px)] font-light leading-[1.02] tracking-[-0.02em]">{tab.name}</h2>
              <p className="sub-thin mt-4 text-soft">{tab.kicker}</p>
              <dl className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
                {tab.facts.map(([k, v]) => (
                  <div key={k} className="border-t border-line pt-4">
                    <dt className="caps text-[11px] tracking-[0.24em] text-soft">{k}</dt>
                    <dd className="mt-2 text-[16px] font-light leading-[1.65] text-ink/85">{v.charAt(0).toUpperCase() + v.slice(1)}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
