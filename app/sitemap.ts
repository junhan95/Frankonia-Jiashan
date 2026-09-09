import type { MetadataRoute } from "next";
import { cartPath } from "./cart-sections";
import {
  chamberIndustries,
  chamberModelSlugs,
  chamberTopics,
  chamberTypes,
  chambersPath,
  industryPath,
  modelPath,
  topicPath,
  typePath,
} from "./chamber-sections";
import { companySections, sectionPath } from "./company-sections";
import { contactPath } from "./contact-sections";
import { downloadsPath } from "./downloads-sections";
import { legalPath, legalSections } from "./legal-sections";
import { mychamberPath } from "./mychamber-sections";
import {
  shownTestProducts,
  testProductPath,
  testSystemsPath,
} from "./test-system-sections";
import { languages, localeUrl } from "./site-config";

export const dynamic = "force-static";

/** Every locale of a page carries the full alternate set. */
const alternates = (path: string) => ({
  languages: Object.fromEntries(
    languages.map(([code]) => [code === "zh" ? "zh-CN" : code, localeUrl(code, path)]),
  ),
});

/** Same entry for every locale of one path. */
const perLocale = (
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: "monthly" | "yearly",
) =>
  languages.map(([code]) => ({
    url: localeUrl(code, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: alternates(path),
  }));

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-09");

  return [
    ...languages.map(([code, , , path]) => ({
      url: localeUrl(code),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.9,
      alternates: alternates(""),
    })),
    ...languages.map(([code]) => ({
      url: localeUrl(code, "/cybershield"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: alternates("/cybershield"),
    })),
    ...companySections.flatMap((section) =>
      languages.map(([code]) => ({
        url: localeUrl(code, sectionPath(section)),
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.5,
        alternates: alternates(sectionPath(section)),
      })),
    ),
    // Ranked with the branch overviews rather than below them: it is a way
    // into the chamber range, and for a reader who does not yet know a model
    // name it is the better one.
    ...perLocale(mychamberPath, lastModified, 0.9, "monthly"),
    // Listed, but at the bottom of the range with the legal pages: a crawler
    // reaching My Enquiry finds an empty basket, because the basket is in the
    // reader's browser and nowhere else. It is here so the page is not a hole
    // in the map — every other route in the chrome is on it — rather than
    // because anyone should arrive by search.
    ...perLocale(cartPath, lastModified, 0.3, "yearly"),
    // The chamber branch. The overview outranks its two index axes, which in
    // turn outrank the technology pages — the order a crawler should read them
    // in, and the order the dropdown presents them.
    ...perLocale(chambersPath, lastModified, 0.9, "monthly"),
    ...chamberIndustries.flatMap((i) => perLocale(industryPath(i), lastModified, 0.7, "monthly")),
    ...chamberTypes.flatMap((t) => perLocale(typePath(t), lastModified, 0.7, "monthly")),
    // Below the two index axes that lead to them, above the technology pages:
    // a model page is what a reader who already knows the designation is
    // looking for, but it is not a way into the range.
    ...chamberModelSlugs.flatMap((s) => perLocale(modelPath(s), lastModified, 0.65, "monthly")),
    ...chamberTopics.flatMap((t) => perLocale(topicPath(t), lastModified, 0.6, "yearly")),
    // The test-system branch: the overview, then the product families that are
    // on show.
    //
    // The four families that are held back, the four `test/*` discipline pages
    // and the standards index are not listed. They still build and still
    // resolve — this is the same hold the index band and the header dropdown
    // make, carried through to the one place that would otherwise hand a
    // crawler a door the site itself does not offer. Listing a page nothing
    // links to is how it gets indexed and arrived at from a search result,
    // which is precisely what "not on show" has to rule out. Put a family back
    // in `shownTestProducts` and it comes back here with it; the two axes come
    // back by restoring the two lines below. See the note on
    // `shownTestProducts` in test-system-sections.
    ...perLocale(testSystemsPath, lastModified, 0.9, "monthly"),
    ...shownTestProducts.flatMap((p) => perLocale(testProductPath(p), lastModified, 0.7, "monthly")),
    ...perLocale(downloadsPath, lastModified, 0.5, "yearly"),
    // With the branch overviews rather than below them: every CTA in the
    // header, the footer and the closing band of all 86 pages leads here, and
    // it is the page a reader arrives at ready to act.
    ...perLocale(contactPath, lastModified, 0.9, "monthly"),
    // Lowest priority of anything on the site, but listed: these are the two
    // pages a regulator or a reader looks for by name, and leaving them out of
    // the sitemap would be the one place they are hard to find.
    ...legalSections.flatMap((s) => perLocale(legalPath(s), lastModified, 0.3, "yearly")),
  ];
}
