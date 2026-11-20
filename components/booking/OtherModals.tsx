"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Modal from "./Modal";
import RangeCalendar from "./RangeCalendar";
import { useBooking } from "./BookingProvider";
import { GuestRow, StaySummary, Thanks, inputCls } from "./BookingModal";
import { rooms } from "@/lib/site";
import { formatKc } from "@/lib/booking";

export function EnquiryModal() {
  const { dict, panel, close } = useBooking();
  const t = dict.booking;
  const open = panel === "enquiry";
  const [editDates, setEditDates] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setSent(false);
      setErrors({});
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = t.required;
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = form.email.trim() ? t.invalidEmail : t.required;
    setErrors(er);
    if (Object.keys(er).length === 0) setSent(true);
  };

  return (
    <Modal open={open} onClose={close} label={t.enquiryTitle} closeLabel={t.close}>
      {sent ? (
        <Thanks title={t.thanksTitle} text={t.thanksEnquiry} onClose={close} />
      ) : (
        <form onSubmit={submit} noValidate className="px-6 pb-10 pt-8 sm:px-12 sm:pt-10">
          <h2 className="h-serif pr-12 text-[clamp(30px,2.6vw,44px)]">{t.enquiryTitle}</h2>
          <p className="body-soft mt-2">{dict.enquiry.sub}</p>
          <div className="mt-8">
            <StaySummary editing={editDates} onEdit={() => setEditDates((v) => !v)} />
            {editDates && (
              <div className="grid gap-8 py-6 md:grid-cols-[1fr_240px]">
                <RangeCalendar months={1} />
                <GuestRow />
              </div>
            )}
          </div>
          <div className="mt-8 grid gap-7 sm:grid-cols-2">
            <label className="block">
              <span className="caps text-[11px] text-soft">{t.name}</span>
              <input data-autofocus className={inputCls} value={form.name} autoComplete="name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <span className="mt-1 block text-[13px] text-wine">{errors.name}</span>}
            </label>
            <label className="block">
              <span className="caps text-[11px] text-soft">{t.email}</span>
              <input type="email" className={inputCls} value={form.email} autoComplete="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <span className="mt-1 block text-[13px] text-wine">{errors.email}</span>}
            </label>
            <label className="block sm:col-span-2">
              <span className="caps text-[11px] text-soft">{t.message}</span>
              <textarea rows={3} className={clsx(inputCls, "resize-none")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>
          </div>
          <div className="mt-10 flex justify-end">
            <button type="submit" className="pill pill-wine group">
              <span className="roll">
                <span>{t.send}</span>
                <span aria-hidden>{t.send}</span>
              </span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export function RoomModal() {
  const { dict, locale, panel, viewRoom, close, openBooking } = useBooking();
  const room = rooms.find((r) => r.id === viewRoom);
  const [img, setImg] = useState(0);
  useEffect(() => setImg(0), [viewRoom]);
  const t = dict.rooms;
  const details = room ? t.details[room.id] : null;

  return (
    <Modal open={panel === "room" && Boolean(room)} onClose={close} label={room?.name ?? ""} closeLabel={dict.booking.close} wide>
      {room && details && (
        <div className="grid lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden bg-mist lg:aspect-auto lg:h-full lg:min-h-[620px]">
              {room.images.map((src, i) => (
                <Image
                  key={src + i}
                  src={src}
                  alt={room.name}
                  fill
                  sizes="(min-width:1024px) 660px, 100vw"
                  className={clsx("object-cover transition-opacity duration-700", i === img ? "opacity-100" : "opacity-0")}
                />
              ))}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {room.images.map((src, i) => (
                  <button
                    key={src + "t" + i}
                    type="button"
                    aria-label={`${i + 1}`}
                    onClick={() => setImg(i)}
                    className={clsx("relative size-14 overflow-hidden ring-2 transition", i === img ? "ring-white" : "ring-transparent opacity-75 hover:opacity-100")}
                  >
                    <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col px-6 pb-10 pt-8 sm:px-10 sm:pt-12">
            <h2 className="mt-6 text-[30px] uppercase tracking-[0.06em]">{room.name}</h2>
            <p className="mt-2 text-[19px] uppercase tracking-[0.04em]">
              {t.from} <strong className="font-medium">{formatKc(room.price, locale)}</strong> {room.maxGuests > 2 ? t.perNightN(room.maxGuests) : t.perNight}
            </p>
            <p className="body-soft mt-6">{details.text}</p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-line py-5">
              <div>
                <dt className="caps text-[11px] text-soft">{t.size}</dt>
                <dd className="mt-1 text-[18px]">{room.size} m²</dd>
              </div>
              <div>
                <dt className="caps text-[11px] text-soft">{t.guests}</dt>
                <dd className="mt-1 text-[18px]">{t.guestsN(room.maxGuests)}</dd>
              </div>
            </dl>
            <p className="caps mt-8 text-[11px] text-soft">{t.features}</p>
            <ul className="mt-3 space-y-2 text-[16px]">
              {[...details.features, t.breakfast].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="h-px w-4 bg-ink/40" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <button type="button" onClick={() => openBooking(room.id)} className="pill pill-wine group w-full">
                <span className="roll">
                  <span>{t.book}</span>
                  <span aria-hidden>{t.book}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function SurroundingsModal() {
  const { dict, panel, close } = useBooking();
  const t = dict.surroundings;
  return (
    <Modal open={panel === "surroundings"} onClose={close} label={t.modalTitle} closeLabel={dict.booking.close} wide>
      <div className="px-6 pb-12 pt-8 sm:px-12 sm:pt-12">
        <h2 className="h-serif mt-6">{t.modalTitle}</h2>
        <p className="body-soft mt-2">{t.modalSub}</p>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {t.places.map((p) => (
            <article key={p.name}>
              <div className="zoom relative aspect-[4/3] overflow-hidden">
                <Image src={p.img} alt={p.name} fill sizes="(min-width:1024px) 360px, 50vw" className="object-cover" />
              </div>
              <p className="caps mt-5 text-[11px] text-soft">{p.meta}</p>
              <h3 className="mt-2 text-[22px] font-light tracking-[0.03em]">{p.name}</h3>
              <p className="body-soft mt-2 text-[15px]">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </Modal>
  );
}
