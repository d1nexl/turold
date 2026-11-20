import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDict } from "@/lib/dictionaries";
import { isLocale, locales } from "@/lib/i18n/config";
import BookingProvider from "@/components/booking/BookingProvider";
import BookingBar from "@/components/booking/BookingBar";
import BookingModal from "@/components/booking/BookingModal";
import { EnquiryModal, RoomModal, SurroundingsModal } from "@/components/booking/OtherModals";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import DirectCard from "@/components/DirectCard";

// Fonts are self-hosted in /public/fonts and declared in globals.css (no build-time fetch from Google).
const preloadFonts = ["/fonts/newsreader-latin-wght-normal.woff2", "/fonts/jost-latin-wght-normal.woff2"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale).meta;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5300"),
    title: t.title,
    description: t.description,
    alternates: { languages: { cs: "/cs", en: "/en" } },
    openGraph: { title: t.title, description: t.description, images: ["/img/hero-poster.jpg"] },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);

  return (
    <html lang={locale}>
      <head>
        {preloadFonts.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body>
        <BookingProvider locale={locale}>
          <SmoothScroll />
          <Header />
          <main>{children}</main>
          <Footer dict={dict} />
          <BookingBar />
          <DirectCard />
          <BookingModal />
          <EnquiryModal />
          <RoomModal />
          <SurroundingsModal />
        </BookingProvider>
      </body>
    </html>
  );
}
