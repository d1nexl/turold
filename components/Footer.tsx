import type { Dict } from "@/lib/dictionaries";
import { site } from "@/lib/site";
import NovaflowCredit from "./NovaflowCredit";

/** Dark wine footer: four plain columns and the credit row. */
export default function Footer({ dict }: { dict: Dict }) {
  const t = dict.footer;
  return (
    <footer id="paticka" data-tone="dark" className="relative overflow-hidden bg-[#1d1214] text-white">
      <div className="wrap">
        <div className="grid gap-12 py-[clamp(70px,7vw,110px)] sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="font-serif text-[30px] tracking-[0.14em]">TUROLD</span>
            <p className="mt-3 text-[13px] uppercase tracking-[0.26em] text-white/75">{dict.header.tagline}</p>
          </div>
          <div>
            <p className="caps text-[11px] tracking-[0.26em] text-white/70">{t.cols.address}</p>
            <p className="mt-4 text-[16px] font-light leading-[1.8]">
              {site.street}
              <br />
              {site.city}
              <br />
              {site.region}
            </p>
          </div>
          <div>
            <p className="caps text-[11px] tracking-[0.26em] text-white/70">{t.cols.contact}</p>
            <p className="mt-4 flex flex-col gap-1 text-[16px] font-light leading-[1.8]">
              <a className="ulink w-fit" href={site.phoneHref}>{site.phone}</a>
              <a className="ulink w-fit" href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-1">
            <div>
              <p className="caps text-[11px] tracking-[0.26em] text-white/70">{t.cols.menu}</p>
              <nav className="mt-4 flex flex-col gap-1 text-[16px] font-light leading-[1.8]">
                {t.links.map((l) => (
                  <a key={l.label} href={`#${l.id}`} className="ulink w-fit">{l.label}</a>
                ))}
              </nav>
            </div>
            <div className="lg:mt-4">
              <p className="caps text-[11px] tracking-[0.26em] text-white/70">{t.cols.follow}</p>
              <div className="mt-4 flex gap-6 text-[16px] font-light">
                <a className="ulink" href={site.instagram} target="_blank" rel="noopener">Instagram</a>
                <a className="ulink" href={site.facebook} target="_blank" rel="noopener">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap flex flex-col items-center justify-between gap-4 border-t border-white/15 py-7 text-[13px] text-white/75 md:flex-row">
        <p>© 2026 TUROLD · {t.concept}</p>
        <NovaflowCredit by={t.credit} aria={t.creditAria} />
      </div>
    </footer>
  );
}
