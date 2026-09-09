/**
 * The shape a product page's body takes, shared by the two product branches.
 *
 * This started inside chamber-sections, where the 2026 catalogue's spreads set
 * the pattern: opening paragraphs, plates, the configuration tables, then the
 * catalogue's own titled feature groups. The EMC Test Systems branch turned out
 * to want exactly that — the head office's MTS-800 page is three paragraphs, a
 * Special Features list, ten specification tables and eleven photographs — so
 * the types and the renderers moved here rather than being written twice.
 *
 * What did not move is what only one branch has: the chamber branch's panoramas
 * and its reference list stay in chamber-sections, bolted onto this shape by an
 * intersection type. A shared module that knows about panoramas would be a
 * shared module that knows about References, and References is one page.
 */

/**
 * A plate on a product page.
 *
 * `alt` is optional because some plates are decorative: the heading above them
 * already says what the page is about, and the head office marks its own header
 * images `alt=""` for the same reason. A plate that shows something the prose
 * does not — a dome roof, a stirrer mid-turn, the engraved type plate on a
 * pre-amplifier — carries both an `alt` and a `caption`, because then the
 * picture is an argument rather than a band of colour.
 */
export type Plate = { src: string; w: number; h: number; alt?: string; caption?: string };

/**
 * One specification table, carried over as data.
 *
 * Every chamber spread in the catalogue prints one: a row per size or variant,
 * the inner dimensions, and the qualifier the catalogue sets underneath. The
 * head office's instrument pages print the same thing turned on its side — a
 * row per property, a column per model. Both fit here: a cell splits on `\n`,
 * the first line being the figure and the rest that qualifier.
 *
 * Only `head`, `title` and `note` are translated. The cells are measurements
 * and designations — a reader matches them against a drawing and a quotation,
 * so a Korean rendering would be the wrong thing to give them.
 */
export type SpecTable = {
  title: string;
  /** What the table does not say on its own: which frequency range the whole
   *  block shares, or that a row is in the catalogue but not yet in the head
   *  office's published product list. */
  note?: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
  /**
   * A way on, under the table, where the table is a summary of a page that
   * carries the whole subject.
   *
   * One table on this site is in that position: the reverberation page's
   * "Frankonia stirrers", which lists the designs and their speeds while
   * `/chambers/stirrers` carries the package per chamber, the accuracies and
   * the operating modes. Without a link the reader has to find that page in
   * the navigation, having just been shown two thirds of it.
   *
   * `path` is locale-free — `Tables` builds the route — for the same reason
   * `BandCard.path` on the landing is: the copy tables are per locale and a
   * hrefs written into one would have to be written into both.
   */
  link?: { label: string; path: string };
};

/**
 * Page copy for one product page.
 *
 * A page with a body drops the "documents on request" band; a page without one
 * keeps it. The data arrives a page at a time and nothing pretends otherwise.
 *
 * Designations — absorber types, model numbers, standard numbers and the
 * figures beside them — are not translated: they are what a reader matches
 * against a drawing and a quotation.
 */
export type PageBody = {
  lead: readonly string[];
  /** May be empty: a page built from tables alone renders no group band rather
   *  than an empty one. */
  groups: readonly { title: string; items: readonly string[] }[];
  close?: string;
  /** Wide plate under the lead. */
  figure?: Plate;
  /** Three smaller plates beside each other, under the wide one. Used where a
   *  page has to show a range rather than a single object. They are brought to
   *  one ratio before they get here — `.figure-row` is a grid of three equal
   *  columns, and three different ratios put three captions at three heights. */
  figureRow?: readonly Plate[];
  /** The specification tables for this page, in the source's own order. */
  tables?: readonly SpecTable[];
  /**
   * Replaces the branch's standing note over the tables, for a page whose
   * tables are not the branch's usual subject.
   *
   * The chamber branch's note says the figures are the outside of the chamber
   * and not the room the customer gets — true of every model and type page,
   * and false on the stirrers page, whose tables carry rotor diameters and
   * speeds and no chamber dimension at all. A standing note that is wrong on
   * one page is worse than no note, and the branch's other twenty-odd pages
   * still need it, so the page overrides rather than the branch dropping it.
   */
  specsNote?: string;
};
