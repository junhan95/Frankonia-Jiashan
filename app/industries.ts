import type { Lang } from "./site-config";

/**
 * The five industries the site sorts products by, shared by the chamber and
 * the test-system branches on purpose.
 *
 * The head office keeps these two apart: chambers are filtered by industry,
 * test systems by standard, and nothing crosses between them. But a customer
 * building an automotive EMC laboratory buys both, and the standards that
 * define their work — CISPR 25, ISO 11452 — are the same on either side.
 *
 * Only the chamber branch has industry routes; test systems dropped theirs
 * because an industry page there could only reprint one heading of the
 * standards index. The shared slug set still earns its keep: it is what lets
 * each industry group on /test-systems/standards link straight to
 * /chambers/industry/<same slug>, and what keeps one label set for both.
 */
export const industries = [
  "automotive",
  "military",
  "commercial",
  "powertrain",
  "others",
] as const;

export type Industry = (typeof industries)[number];

export const isIndustry = (value: string): value is Industry =>
  (industries as readonly string[]).includes(value);

/** One label per industry per locale, read by both branches. The four English
 *  names stay English in Korean too: they are how the industry is written in
 *  Korean EMC practice, and translating them would not help a reader. */
export const industryLabel = {
  zh: {
    automotive: "Automotive",
    military: "Military",
    commercial: "Commercial",
    powertrain: "Powertrain",
    others: "特殊/定制",
  },
  en: {
    automotive: "Automotive",
    military: "Military",
    commercial: "Commercial",
    powertrain: "Powertrain",
    others: "Others",
  },
} as const satisfies Record<Lang, Record<Industry, string>>;
