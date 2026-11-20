import { rooms, type Room, type RoomId } from "./site";

/** Dates are local calendar days stored as "YYYY-MM-DD". */
export type ISODay = string;

export const MAX_GUESTS = 6;
export const TASTING_PRICE = 450; // Kč per adult, once per stay
export const DIRECT_DISCOUNT = 0.1;

export function toISO(d: Date): ISODay {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISO(s: ISODay): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: ISODay, n: number): ISODay {
  const d = fromISO(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function todayISO(): ISODay {
  return toISO(new Date());
}

export function nightsBetween(from: ISODay, to: ISODay): number {
  return Math.round((fromISO(to).getTime() - fromISO(from).getTime()) / 86_400_000);
}

/** Every night of a stay: from (inclusive) .. to (exclusive). */
export function stayNights(from: ISODay, to: ISODay): ISODay[] {
  const out: ISODay[] = [];
  for (let d = from; d < to; d = addDays(d, 1)) out.push(d);
  return out;
}

/* ---------- Demo occupancy (deterministic, relative to today) ---------- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let cache: { day: ISODay; map: Map<RoomId, Set<ISODay>>; full: Set<ISODay> } | null = null;

/** Booked nights per room for the next ~6 months, plus nights when the whole house is full. */
export function occupancy() {
  const today = todayISO();
  if (cache?.day === today) return cache;

  const map = new Map<RoomId, Set<ISODay>>();
  rooms.forEach((room, i) => {
    const rnd = mulberry32(17 + i * 101);
    const set = new Set<ISODay>();
    let d = Math.floor(rnd() * 4);
    while (d < 190) {
      const len = 2 + Math.floor(rnd() * 2);
      for (let k = 0; k < len; k++) set.add(addDays(today, d + k));
      d += len + 6 + Math.floor(rnd() * 14);
    }
    map.set(room.id, set);
  });

  // A couple of fully booked weekends (wine festival etc.).
  const full = new Set<ISODay>();
  for (const offset of [9, 10, 23, 24, 25, 51, 52]) full.add(addDays(today, offset));
  for (const set of map.values()) for (const d of full) set.add(d);

  cache = { day: today, map, full };
  return cache;
}

export function isRoomFree(room: Room, from: ISODay, to: ISODay): boolean {
  const booked = occupancy().map.get(room.id)!;
  return stayNights(from, to).every((d) => !booked.has(d));
}

export type Quote = { nights: number; stay: number; tasting: number; subtotal: number; discount: number; total: number };

export function quote(room: Room, from: ISODay, to: ISODay, adults: number, withTasting: boolean): Quote {
  const nights = nightsBetween(from, to);
  const stay = room.price * nights;
  const tasting = withTasting ? TASTING_PRICE * adults : 0;
  const subtotal = stay + tasting;
  const discount = Math.round(stay * DIRECT_DISCOUNT);
  return { nights, stay, tasting, subtotal, discount, total: subtotal - discount };
}

export function formatKc(n: number, locale: string): string {
  return new Intl.NumberFormat(locale === "cs" ? "cs-CZ" : "en-GB").format(n) + " Kč";
}

export function formatDay(s: ISODay, locale: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }): string {
  return new Intl.DateTimeFormat(locale === "cs" ? "cs-CZ" : "en-GB", opts).format(fromISO(s));
}
