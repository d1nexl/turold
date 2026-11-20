"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";

/** Modal shell: backdrop, Esc / backdrop close, focus trap, pauses Lenis while open. */
export default function Modal({
  open,
  onClose,
  label,
  closeLabel,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  closeLabel: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus], button, input")?.focus(), 60);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button aria-label={closeLabel} tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-night/55 backdrop-blur-[3px]" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-lenis-prevent
            className={clsx(
              "relative max-h-[92svh] w-full overflow-y-auto overscroll-contain bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] sm:rounded-[6px]",
              wide ? "sm:max-w-[1180px]" : "sm:max-w-[880px]",
            )}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label={closeLabel}
              className="group absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/90 text-ink transition-colors hover:bg-ink hover:text-white"
            >
              <svg viewBox="0 0 20 20" className="size-4 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
