"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { useBooking } from "./BookingProvider";
import { addDays, occupancy, todayISO, toISO, type ISODay } from "@/lib/booking";

function monthDays(year: number, month: number): (ISODay | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (ISODay | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= count; d++) cells.push(toISO(new Date(year, month, d)));
  return cells;
}

/**
 * Two-month range picker. First click = arrival, second click after it = departure;
 * a click on or before the arrival starts a new range. Fully booked nights can't be inside a stay.
 */
export default function RangeCalendar({ onDone, months = 2 }: { onDone?: () => void; months?: number }) {
  const { dict, locale, from, to, setRange } = useBooking();
  const t = dict.calendar;
  const today = todayISO();
  const full = occupancy().full;
  const [cursor, setCursor] = useState(() => {
    const base = from ? new Date(from) : new Date();
    return { y: base.getFullYear(), m: base.getMonth() };
  });
  const [hover, setHover] = useState<ISODay | null>(null);

  const monthsToShow = useMemo(
    () =>
      Array.from({ length: months }, (_, i) => {
        const d = new Date(cursor.y, cursor.m + i, 1);
        return { y: d.getFullYear(), m: d.getMonth() };
      }),
    [cursor, months],
  );

  const fmtMonth = new Intl.DateTimeFormat(locale === "cs" ? "cs-CZ" : "en-GB", { month: "long", year: "numeric" });
  const now = new Date();
  const canPrev = cursor.y > now.getFullYear() || (cursor.y === now.getFullYear() && cursor.m > now.getMonth());

  const rangeHasFull = (a: ISODay, b: ISODay) => {
    for (let d = a; d < b; d = addDays(d, 1)) if (full.has(d)) return true;
    return false;
  };

  const pick = (day: ISODay) => {
    if (!from || to || day <= from) {
      if (full.has(day)) return;
      setRange(day, null);
      return;
    }
    if (rangeHasFull(from, day)) {
      setRange(full.has(day) ? null : day, null);
      return;
    }
    setRange(from, day);
    onDone?.();
  };

  const end = to ?? (from && hover && hover > from && !rangeHasFull(from, hover) ? hover : null);

  return (
    <div className="select-none">
      <div className="mb-4 flex items-center justify-between">
        <p className="caps text-soft">{!from || to ? t.pickArrival : t.pickDeparture}</p>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label={t.prev}
            disabled={!canPrev}
            onClick={() => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: (c.m + 11) % 12 }))}
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-mist disabled:opacity-25"
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12.5 4 6.5 10l6 6" /></svg>
          </button>
          <button
            type="button"
            aria-label={t.next}
            onClick={() => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: (c.m + 1) % 12 }))}
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-mist"
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m7.5 4 6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <div className={clsx("grid gap-8", months > 1 && "sm:grid-cols-2")}>
        {monthsToShow.map(({ y, m }, idx) => (
          <div key={`${y}-${m}`} className={clsx(idx > 0 && "hidden sm:block")}>
            <p className="mb-3 font-serif text-[21px] capitalize">{fmtMonth.format(new Date(y, m, 1))}</p>
            <div className="grid grid-cols-7 text-center text-[12px] uppercase tracking-[0.14em] text-soft">
              {t.weekdays.map((w) => (
                <span key={w} className="pb-2">{w}</span>
              ))}
            </div>
            <div className="grid grid-cols-7" onMouseLeave={() => setHover(null)}>
              {monthDays(y, m).map((day, i) => {
                if (!day) return <span key={`e${i}`} />;
                const past = day < today;
                const isFull = full.has(day);
                const disabled = past || (isFull && !(from && !to && day > from && !rangeHasFull(from, day)));
                const isStart = day === from;
                const isEnd = day === end;
                const inRange = from && end && day > from && day < end;
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabled}
                    onClick={() => pick(day)}
                    onMouseEnter={() => setHover(day)}
                    title={isFull && !past ? t.full : undefined}
                    className={clsx(
                      "relative h-11 text-[15px] transition-colors",
                      inRange && "bg-sage/25",
                      isStart && end && "rounded-l-full bg-sage/25",
                      isEnd && "rounded-r-full bg-sage/25",
                      disabled && "text-ink/25",
                      isFull && !past && "line-through decoration-ink/30",
                    )}
                  >
                    <span
                      className={clsx(
                        "relative z-[1] mx-auto grid size-11 place-items-center rounded-full",
                        (isStart || isEnd) && "bg-ink text-white",
                        !disabled && !isStart && !isEnd && "hover:ring-1 hover:ring-ink/40",
                      )}
                    >
                      {Number(day.slice(8))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <button type="button" className="caps ulink text-soft" onClick={() => setRange(null, null)}>
          {t.clear}
        </button>
        {onDone && (
          <button type="button" className="caps ulink" onClick={onDone}>
            {t.done}
          </button>
        )}
      </div>
    </div>
  );
}
