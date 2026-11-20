import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Seasons from "@/components/Seasons";
import Rooms from "@/components/Rooms";
import Wellness from "@/components/Wellness";
import Collage from "@/components/Collage";
import Cellar from "@/components/Cellar";
import History from "@/components/History";
import Surroundings from "@/components/Surroundings";
import Enquiry from "@/components/Enquiry";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);

  return (
    <>
      <Hero />
      <Intro dict={dict} />
      <Seasons />
      <Rooms />
      <Wellness />
      <Collage />
      <Cellar />
      <History dict={dict} />
      <Surroundings />
      <Enquiry />
    </>
  );
}
