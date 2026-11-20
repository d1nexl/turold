"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getDict, type Dict } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { ISODay } from "@/lib/booking";
import type { RoomId } from "@/lib/site";
import { MAX_GUESTS } from "@/lib/booking";

export type Panel = "booking" | "enquiry" | "room" | "surroundings" | null;

type BookingState = {
  dict: Dict;
  locale: Locale;
  from: ISODay | null;
  to: ISODay | null;
  adults: number;
  children: number;
  roomId: RoomId | null;
  panel: Panel;
  viewRoom: RoomId | null;
  setRange: (from: ISODay | null, to: ISODay | null) => void;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  setRoomId: (id: RoomId | null) => void;
  openBooking: (roomId?: RoomId) => void;
  openEnquiry: () => void;
  openRoom: (id: RoomId) => void;
  openSurroundings: () => void;
  close: () => void;
};

const Ctx = createContext<BookingState | null>(null);

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking outside BookingProvider");
  return ctx;
}

export default function BookingProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const dict = getDict(locale);
  const [from, setFrom] = useState<ISODay | null>(null);
  const [to, setTo] = useState<ISODay | null>(null);
  const [adults, setAdultsRaw] = useState(2);
  const [kids, setKidsRaw] = useState(0);
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [viewRoom, setViewRoom] = useState<RoomId | null>(null);

  const setRange = useCallback((f: ISODay | null, t: ISODay | null) => {
    setFrom(f);
    setTo(t);
  }, []);
  // Guests: at least 1 adult, children ≥ 0, never more than MAX_GUESTS together.
  const setAdults = useCallback((n: number) => setAdultsRaw(Math.max(1, Math.min(n, MAX_GUESTS - kids))), [kids]);
  const setChildren = useCallback((n: number) => setKidsRaw(Math.max(0, Math.min(n, MAX_GUESTS - adults))), [adults]);

  const value = useMemo<BookingState>(
    () => ({
      dict,
      locale,
      from,
      to,
      adults,
      children: kids,
      roomId,
      panel,
      viewRoom,
      setRange,
      setAdults,
      setChildren,
      setRoomId,
      openBooking: (id) => {
        if (id) setRoomId(id);
        setPanel("booking");
      },
      openEnquiry: () => setPanel("enquiry"),
      openRoom: (id) => {
        setViewRoom(id);
        setPanel("room");
      },
      openSurroundings: () => setPanel("surroundings"),
      close: () => setPanel(null),
    }),
    [dict, locale, from, to, adults, kids, roomId, panel, viewRoom, setRange, setAdults, setChildren],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
