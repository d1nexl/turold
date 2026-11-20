type P = { className?: string };

/** Grape leaf silhouette (unused backdrop). */
export function VineLeaf({ className }: P) {
  return (
    <svg viewBox="0 0 400 520" className={className} fill="currentColor" aria-hidden>
      <path d="M200 500c-4-60-6-110-2-160-34 30-80 46-128 40 18-22 30-46 32-72-34 4-70-6-98-30 30-10 52-30 62-58-26-12-46-34-56-62 34 4 64-4 86-24-8-30-2-62 16-88 18 26 44 40 74 42 6-36 24-66 54-86 4 34 22 62 50 78 22-24 54-36 88-34-10 32-6 64 12 92 30-6 62 2 86 22-30 14-48 40-54 72 28 14 46 40 52 70-32-4-62 6-84 28 12 26 12 56 0 82-38-12-74-40-96-76-6 52-4 104 6 156-14 4-28 6-42 8Z" />
      <path d="M198 340c-6 60-6 112-2 160" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" fill="none" />
    </svg>
  );
}

function Ring({ children, className }: P & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="50" cy="50" r="46" strokeWidth="1" opacity="0.7" />
      {children}
    </svg>
  );
}

export function IconSpring({ className }: P) {
  return (
    <Ring className={className}>
      {/* vine shoot with tendril and sun */}
      <path d="M50 74V44" />
      <path d="M50 56c-8-1-14-7-15-15 8 0 14 6 15 15Z" />
      <path d="M50 49c7-1 12-6 13-13-7 0-12 5-13 13Z" />
      <path d="M50 44c0-5 3-8 7-8 3 0 5 2 5 4s-2 3-3 2" />
    </Ring>
  );
}

export function IconHarvest({ className }: P) {
  return (
    <Ring className={className}>
      {/* grape bunch */}
      <path d="M50 26v6M50 30c5-5 11-6 16-3" />
      <circle cx="42" cy="40" r="5" />
      <circle cx="53" cy="40" r="5" />
      <circle cx="37" cy="50" r="5" />
      <circle cx="48" cy="50" r="5" />
      <circle cx="59" cy="50" r="5" />
      <circle cx="42" cy="60" r="5" />
      <circle cx="53" cy="60" r="5" />
      <circle cx="47.5" cy="70" r="5" />
    </Ring>
  );
}

export function IconTaste({ className }: P) {
  return (
    <Ring className={className}>
      {/* wine glass */}
      <path d="M38 26h24c1 12-3 22-12 24-9-2-13-12-12-24Z" />
      <path d="M39 37h22" strokeWidth="1.6" />
      <path d="M50 50v20M40 72h20" />
    </Ring>
  );
}

export function IconWinter({ className }: P) {
  return (
    <Ring className={className}>
      {/* snow crystal */}
      <path d="M50 28v44M31 39l38 22M31 61l38-22" />
      <path d="M45 31l5 4 5-4M45 69l5-4 5 4M33 46l5-1-1-6M67 54l-5 1 1 6M33 54l5 1-1 6M67 46l-5-1 1-6" strokeWidth="1.6" />
    </Ring>
  );
}

export function ArrowRight({ className }: P) {
  return (
    <svg viewBox="0 0 24 12" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}

export function ArrowLeft({ className }: P) {
  return (
    <svg viewBox="0 0 24 12" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M24 6H2M7 1 2 6l5 5" />
    </svg>
  );
}
