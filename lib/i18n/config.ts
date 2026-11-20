export const locales = ["cs", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "cs";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const intlLocale: Record<Locale, string> = {
  cs: "cs-CZ",
  en: "en-GB",
};
