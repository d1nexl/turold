"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import Modal from "./Modal";
import RangeCalendar from "./RangeCalendar";
import { useBooking } from "./BookingProvider";
import { rooms } from "@/lib/site";
import { formatDay, formatKc, isRoomFree, nightsBetween, quote } from "@/lib/booking";

type Form = { name: string; email: string; phone: string; note: string; tasting: boolean };
const emptyForm: Form = { name: "", email: "", phone: "", note: "", tasting: false };

export function GuestRow() {
  const { dict, adults, children, setAdults, setChildren } = useBooking();
  const row = (label: string, value: number, set: (n: number) => void, min: number) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-[16px]">{label}</span>
      <span className="flex items-center gap-4">
        <button type="button" aria-label={`${label} −`} disabled={value <= min} onClick={() => set(value - 1)} className="grid size-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink disabled:opacity-30">
          <svg viewBox="0 0 12 12" className="size-3" stroke="currentColor" strokeWidth="1.4"><path d="M2 6h8" /></svg>
        </button>
        <span className="w-5 text-center tabular-nums">{value}</span>
        <button type="button" aria-label={`${label} +`} onClick={() => set(value + 1)} className="grid size-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink">
          <svg viewBox="0 0 12 12" className="size-3" stroke="currentColor" strokeWidth="1.4"><path d="M2 6h8M6 2v8" /></svg>
        </button>
      </span>
    </div>
  );
  return (
    <div className="divide-y divide-line">
      {row(dict.bar.adults, adults, setAdults, 1)}
      {row(dict.bar.children, children, setChildren, 0)}
    </div>
  );
}

export function StaySummary({ onEdit, editing }: { onEdit: () => void; editing: boolean }) {
  const { dict, locale, from, to, adults, children } = useBooking();
  const t = dict.booking;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
      <div className="flex flex-wrap gap-x-10 gap-y-2">
        <div>
          <p className="caps text-[11px] text-soft">{t.stay}</p>
          <p className="mt-1 text-[17px]">
            {from && to ? (
              <>
                {formatDay(from, locale, { day: "numeric", month: "long" })} – {formatDay(to, locale, { day: "numeric", month: "long" })}
                <span className="ml-2 text-soft">· {dict.bar.nights(nightsBetween(from, to))}</span>
              </>
            ) : (
              <span className="text-soft">{t.pickDates}</span>
            )}
          </p>
        </div>
        <div>
          <p className="caps text-[11px] text-soft">{t.guests}</p>
          <p className="mt-1 text-[17px]">
            {t.adultsN(adults)}
            {children > 0 && `, ${t.childrenN(children)}`}
          </p>
        </div>
      </div>
      <button type="button" onClick={onEdit} className="caps ulink">
        {editing ? dict.calendar.done : t.change}
      </button>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="caps text-[11px] text-soft">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[13px] text-wine">{error}</span>}
    </label>
  );
}

export const inputCls =
  "mt-2 block w-full border-0 border-b border-ink/20 bg-transparent px-0 pb-2 text-[17px] outline-none transition-colors placeholder:text-ink/30 focus:border-ink";

export function Thanks({ title, text, onClose }: { title: string; text: string; onClose: () => void }) {
  const { dict } = useBooking();
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="px-8 py-20 text-center sm:px-16">
      <svg viewBox="0 0 64 64" className="mx-auto size-16 text-sage-deep" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="32" cy="32" r="30" />
        <path d="M20 33l8 8 16-17" />
      </svg>
      <h3 className="h-serif mt-8">{title}</h3>
      <p className="body-soft mx-auto mt-4 max-w-md">{text}</p>
      <p className="mt-6 text-[13px] uppercase tracking-[0.18em] text-soft">{dict.booking.demo}</p>
      <button type="button" onClick={onClose} className="pill pill-wine group mt-10">
        <span className="roll">
          <span>{dict.booking.done}</span>
          <span aria-hidden>{dict.booking.done}</span>
        </span>
      </button>
    </motion.div>
  );
}

export default function BookingModal() {
  const b = useBooking();
  const { dict, locale, from, to, adults, children, roomId, setRoomId, panel, close } = b;
  const t = dict.booking;
  const [step, setStep] = useState(0);
  const [editDates, setEditDates] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sent, setSent] = useState(false);
  const open = panel === "booking";

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setSent(false);
    setErrors({});
    setEditDates(!(from && to));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const hasDates = Boolean(from && to);
  const guests = adults + children;
  const room = rooms.find((r) => r.id === roomId) ?? null;
  const roomOk = room && hasDates && isRoomFree(room, from!, to!) && room.maxGuests >= guests;
  const q = room && hasDates ? quote(room, from!, to!, adults, form.tasting) : null;

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = t.required;
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = form.email.trim() ? t.invalidEmail : t.required;
    if (!form.phone.trim()) e.phone = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && roomOk) setStep(1);
    else if (step === 1 && validate()) setStep(2);
    else if (step === 2) setSent(true);
  };

  return (
    <Modal open={open} onClose={close} label={t.title} closeLabel={t.close} wide>
      {sent ? (
        <Thanks title={t.thanksTitle} text={t.thanksText} onClose={close} />
      ) : (
        <div className="px-6 pb-8 pt-8 sm:px-12 sm:pb-10 sm:pt-10">
          <h2 className="h-serif pr-12 text-[clamp(30px,2.6vw,44px)]">{t.title}</h2>

          {/* Steps */}
          <ol className="mt-6 flex gap-6 sm:gap-10">
            {t.steps.map((s, i) => (
              <li key={s} className={clsx("caps flex items-center gap-3 text-[12px] transition-colors", i === step ? "text-ink" : "text-ink/60")}>
                <span className={clsx("grid size-7 place-items-center rounded-full border text-[11px] tracking-normal", i <= step ? "border-ink" : "border-ink/25", i < step && "bg-ink text-white")}>
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <StaySummary editing={editDates} onEdit={() => setEditDates((v) => !v)} />
            <AnimatePresence initial={false}>
              {editDates && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="grid gap-10 py-6 lg:grid-cols-[1fr_280px]">
                    <RangeCalendar />
                    <GuestRow />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="mt-8">
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {rooms.map((r) => {
                    const free = hasDates ? isRoomFree(r, from!, to!) : true;
                    const fits = r.maxGuests >= guests;
                    const ok = free && fits;
                    const selected = r.id === roomId;
                    const nights = hasDates ? nightsBetween(from!, to!) : 0;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        disabled={!ok || !hasDates}
                        onClick={() => setRoomId(r.id)}
                        className={clsx(
                          "group flex gap-4 border p-3 text-left transition-colors",
                          selected && ok ? "border-ink" : "border-line hover:border-ink/40",
                          (!ok || !hasDates) && "opacity-45",
                        )}
                      >
                        <span className="zoom relative block aspect-[4/3] w-[42%] shrink-0 overflow-hidden">
                          <Image src={r.images[0]} alt="" fill sizes="220px" className="object-cover" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col py-1">
                          <span className="text-[19px] uppercase tracking-[0.06em]">{r.name}</span>
                          <span className="mt-1 text-[14px] text-soft">
                            {r.size} m² · {dict.rooms.guestsN(r.maxGuests)}
                          </span>
                          <span className="mt-auto pt-3 text-[15px]">
                            {!free && hasDates ? (
                              <span className="text-wine">{t.unavailable}</span>
                            ) : !fits ? (
                              <span className="text-wine">{t.tooSmall(r.maxGuests)}</span>
                            ) : (
                              <>
                                <strong className="font-medium">{formatKc(r.price, locale)}</strong> <span className="text-soft">{t.perNight}</span>
                                {nights > 0 && <span className="block text-[13px] text-soft">{formatKc(r.price * nights, locale)} {t.totalFor(dict.bar.nights(nights))}</span>}
                              </>
                            )}
                          </span>
                        </span>
                        <span className={clsx("mt-1 grid size-6 shrink-0 place-items-center rounded-full border", selected && ok ? "border-ink bg-ink text-white" : "border-ink/25")}>
                          {selected && ok && <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m2.5 6.2 2.3 2.3 4.7-5" /></svg>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
                  <div className="grid gap-7 sm:grid-cols-2">
                    <Field label={t.name} error={errors.name}>
                      <input data-autofocus className={inputCls} value={form.name} autoComplete="name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </Field>
                    <Field label={t.email} error={errors.email}>
                      <input type="email" className={inputCls} value={form.email} autoComplete="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </Field>
                    <Field label={t.phone} error={errors.phone}>
                      <input type="tel" className={inputCls} value={form.phone} autoComplete="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </Field>
                    <Field label={t.note}>
                      <input className={inputCls} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                    </Field>
                  </div>
                  <div>
                    <p className="caps text-[11px] text-soft">{t.extras}</p>
                    <div className="mt-3 divide-y divide-line border-y border-line">
                      <div className="flex items-center justify-between py-4">
                        <span>{t.breakfast}</span>
                        <span className="text-[14px] text-sage-deep">{t.breakfastNote}</span>
                      </div>
                      <label className="flex items-center justify-between py-4">
                        <span>
                          {t.tasting}
                          <span className="block text-[13px] text-soft">{t.tastingNote}</span>
                        </span>
                        <input type="checkbox" className="peer sr-only" checked={form.tasting} onChange={(e) => setForm({ ...form, tasting: e.target.checked })} />
                        <span className="relative h-7 w-12 rounded-full bg-ink/15 transition-colors after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-sage peer-checked:after:translate-x-5 peer-focus-visible:ring-1 peer-focus-visible:ring-ink" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && room && q && (
                <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={room.images[0]} alt={room.name} fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover" />
                  </div>
                  <div>
                    <p className="caps text-[11px] text-soft">{t.summary}</p>
                    <p className="mt-2 text-[26px] uppercase tracking-[0.05em]">{room.name}</p>
                    <p className="text-soft">{form.name} · {form.email}</p>
                    <dl className="mt-6 divide-y divide-line border-y border-line text-[16px]">
                      <div className="flex justify-between py-3">
                        <dt>{t.nightsCost} · {dict.bar.nights(q.nights)}</dt>
                        <dd className="tabular-nums">{formatKc(q.stay, locale)}</dd>
                      </div>
                      {q.tasting > 0 && (
                        <div className="flex justify-between py-3">
                          <dt>{t.tastingCost} · {t.adultsN(adults)}</dt>
                          <dd className="tabular-nums">{formatKc(q.tasting, locale)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between py-3 text-sage-deep">
                        <dt>{t.discount}</dt>
                        <dd className="tabular-nums">−{formatKc(q.discount, locale)}</dd>
                      </div>
                      <div className="flex justify-between py-4 text-[20px]">
                        <dt>{t.total}</dt>
                        <dd className="font-medium tabular-nums">{formatKc(q.total, locale)}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-[14px] text-soft">{t.payNote}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer actions */}
          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="caps ulink">
                ← {t.back}
              </button>
            ) : (
              <span className="hidden text-[15px] text-soft sm:block">
                {q && roomOk && (
                  <>
                    {formatKc(q.total, locale)} <span className="text-sage-deep">({t.discount})</span>
                  </>
                )}
              </span>
            )}
            <button type="button" onClick={next} disabled={step === 0 && !roomOk} className={clsx("pill group", "pill-wine")}>
              <span className="roll">
                <span>{step === 2 ? t.confirm : t.continue}</span>
                <span aria-hidden>{step === 2 ? t.confirm : t.continue}</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
