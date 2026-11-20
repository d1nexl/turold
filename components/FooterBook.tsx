"use client";

import { useBooking } from "./booking/BookingProvider";
import { ArrowRight } from "./icons";

export default function FooterBook({ label }: { label: string }) {
  const { openBooking } = useBooking();
  return (
    <button type="button" onClick={() => openBooking()} className="pill group bg-white text-[#1d1214] hover:bg-white/85">
      <span className="roll">
        <span>{label}</span>
        <span aria-hidden>{label}</span>
      </span>
      <ArrowRight className="h-3 w-5" />
    </button>
  );
}
