import type { Locale } from "@/lib/i18n/config";
import cs, { type Dict } from "./cs";
import en from "./en";

const dictionaries: Record<Locale, Dict> = { cs, en };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

export type { Dict };
