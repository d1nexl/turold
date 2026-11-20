import "./novaflow-credit.css";

/** Shared NovaFlow footer credit (same look on every client site). */
export default function NovaflowCredit({ by, aria }: { by: string; aria: string }) {
  return (
    <a className="nf-credit" href="https://www.getnovaflow.eu/" target="_blank" rel="noopener" aria-label={aria}>
      <span className="nf-credit__by">{by}</span>
      <svg className="nf-credit__mark" viewBox="0 0 24 24" aria-hidden focusable="false">
        <defs>
          <linearGradient id="nf-credit-grad" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5b2bff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <path className="nf-base" d="M5.5 18.5 9 7.4c.6-1.9 2-1.9 2.6 0l2.8 9.2c.6 1.9 2 1.9 2.6 0L18.5 5.5" />
        <path
          className="nf-flow"
          stroke="url(#nf-credit-grad)"
          d="M5.5 18.5 9 7.4c.6-1.9 2-1.9 2.6 0l2.8 9.2c.6 1.9 2 1.9 2.6 0L18.5 5.5"
        />
      </svg>
      <span className="nf-credit__name">NovaFlow</span>
      <svg className="nf-credit__arrow" viewBox="0 0 12 12" aria-hidden focusable="false">
        <path d="M3 9 9 3M4.5 3H9v4.5" />
      </svg>
    </a>
  );
}
