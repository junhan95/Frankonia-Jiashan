import { Open_Sans } from "next/font/google";

/**
 * The Latin typeface, downloaded at build time and served from this origin.
 *
 * Open Sans, because that is what the group homepage runs on —
 * frankonia-solutions.com serves open-sans-v34 at 300/400/600 and sets its
 * headings in the 300. HQ asked in the August review that this site match it;
 * it used to be Inter, which is a different voice at the same weights.
 *
 * It is not fetched from fonts.googleapis.com at runtime. Two reasons, and
 * self-hosting answers both:
 *
 *   - Every visitor's IP reached Google before a single glyph was drawn. This
 *     site is operated from Germany, and German courts have treated an
 *     unconsented Google Fonts embed as a GDPR violation. Nothing here is
 *     worth a data-protection argument.
 *   - `@import` at the top of a stylesheet is the slowest way to load a font:
 *     the browser cannot even discover the request until globals.css has
 *     arrived and parsed, so it is one full round trip behind everything else.
 *
 * Declared as a variable font: one file per unicode range covers every weight
 * from 300 to 800, rather than one file per weight per range.
 *
 * The Korean face is deliberately not here — see fonts-kr.ts for why it is a
 * module of its own.
 */
export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});
