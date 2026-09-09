import type { Industry } from "./industries";
import type { PageBody } from "./page-body";
import type { Lang } from "./site-config";

/**
 * The EMC Test Systems branch: two ways into one set of instruments.
 *
 * The head office's own menu runs four levels deep over three axes it never
 * reconciles — Emission/Immunity at the top, a "Search products" list in the
 * middle, and a "Select standard" list of 24 entries at the bottom. That is
 * the right instinct (an engineer arrives holding a standard, a test setup or
 * a model number) buried in a structure nobody can scan.
 *
 * Here those axes sit side by side, two levels deep: what the test is, and
 * what the equipment is. The standards keep their own index, where they are
 * grouped by the industry that buys the test — the third axis this branch used
 * to carry in the menu. It was dropped because an industry page could only
 * list that industry's standards, which is exactly what the standards index
 * already prints under the same heading; industry is a way of ordering that
 * list, not a separate way in.
 */

/** Test discipline — the head office's top-level Emission / Immunity split,
 *  with the magnetic field system pulled out of "Radiated" where it hid. */
export const testCategories = ["emission", "conducted", "radiated", "magnetic"] as const;

/**
 * Product family, in the order every list of them prints — the dropdown
 * column, the index, and the equipment list on a test page.
 *
 * Integrated systems lead. The five families under them are components of a
 * setup the buyer assembles; the CIT series, the ECU-6, the PSG-300 and the
 * MTS-800 are the setup, bought whole. A reader who can use one should meet it
 * before the parts list, and a reader who cannot loses one line to reach the
 * amplifiers.
 * The rest keep the signal chain's own order: what drives the field, what
 * radiates it, what measures it, what conditions the measurement, what routes
 * it.
 */
export const testProducts = [
  "system",
  "amplifier",
  "antenna",
  "emission",
  "efs",
  "preamp",
  "meter",
  "coupling",
] as const;

export type TestCategory = (typeof testCategories)[number];
export type TestProduct = (typeof testProducts)[number];

/**
 * Which families are on show — a hold, not a deletion.
 *
 * The head office's August 2026 mail names the instruments it wants promoted:
 * the CIT series, the ECU-6, the ERX receivers, the MTS-800, the PSG-300, the
 * RSU, the PMS and the EFS probes. They sat in four of the eight families, and
 * those four were what the index at `/test-systems/` and the header dropdown
 * drew. The amplifiers, antennas and pre-amplifiers are the parts a laboratory
 * adds around them, and the mail does not ask for them.
 *
 * The follow-up asks for the fifth: "for the CIT please also list CDNs/EMCL and
 * BCI probes", and "for the PSG please list CNs". Those are the whole of the
 * coupling family — every row in it is a coupling/decoupling network, an EM
 * clamp or a BCI probe — so the family goes on show rather than being split, and
 * the CIT and the PSG each carry a list of what couples to them on the systems
 * page as well. Nothing unasked-for arrives with it.
 *
 * Nothing under the three that are down has been taken away: every family is
 * still a page, still carries its models and its body in both locales, and is
 * still in the sitemap. Putting one back on show is adding it to this list.
 * The order is `testProducts`'s own, so it does not need restating here — the
 * index filters rather than maps.
 */
export const shownTestProducts: readonly TestProduct[] = [
  "system",
  "emission",
  "efs",
  "meter",
  "coupling",
];

export const isTestCategory = (v: string): v is TestCategory =>
  (testCategories as readonly string[]).includes(v);
export const isTestProduct = (v: string): v is TestProduct =>
  (testProducts as readonly string[]).includes(v);

export type TestModel = {
  /** Model designation as the head office writes it. */
  name: string;
  /** One-line specification from the source page. May be empty: the head
   *  office's amplifier pages are a matrix of band against model name and
   *  publish nothing else per model, so those rows carry their band in `group`
   *  and nothing here. Inventing a figure to fill the column is the one thing
   *  that would be worse than an empty one. */
  desc: string;
  product: TestProduct;
  /**
   * The heading the source files this model under — a band for the amplifiers,
   * an antenna form for the antennas. Not translated, for the same reason the
   * model name is not: "10 kHz – 300 MHz" and "Horn" are what a reader matches
   * against a quotation.
   *
   * It is a group *heading*, not the model's own range. The head office prints
   * FLL-25A, FLL-25 and FLL-75 under "10 kHz – 300 MHz" while its own 2019
   * selection book gives them 10 kHz–230 MHz, 100 kHz–250 MHz and
   * 100 kHz–300 MHz. The heading is the group's envelope; the per-model range
   * is in that catalogue and is not carried here yet.
   */
  group?: string;
};

/**
 * Instruments named on the head office's own product pages, in the order and
 * under the headings it prints them.
 *
 * Two sources. The solid-state amplifiers to 1 GHz, the field strength meters,
 * the pre-amplifiers, the meters, the antennas and the integrated systems come
 * from the product pages. The WBA microwave amplifiers come from the 2020
 * `Wideband-Amplifiers_web.pdf`, which is the only place the head office
 * publishes them — its own amplifier menu stops at 1 GHz, so a reader who needs
 * 18 GHz would leave the site thinking Frankonia does not build one.
 */
export const testModels: readonly TestModel[] = [
  // RF power amplifiers. The band is the head office's own column heading —
  // see the note on `group`.
  //
  // The four groups to 1 GHz are the website's own matrix, and so are their
  // figures: that page prints a full specification table per model, of which
  // the band and the typical output power are carried here. Everything from
  // "20 MHz – 1 GHz" down is from the 2019 Amplifier Selection Book, which is
  // the only place the head office publishes those sixty-nine models — its
  // website matrix stops at 1 GHz. See docs/source/test-systems-source.md §2.10.
  { name: "FLL-25", desc: "100 kHz – 250 MHz, 25 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "FLL-25A", desc: "10 kHz – 230 MHz, 25 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "FLL-75", desc: "100 kHz – 300 MHz, 75 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "FLL-75A", desc: "150 kHz – 230 MHz, 75 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "FLL-100A", desc: "10 kHz – 250 MHz, 100 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-140", desc: "10 kHz – 250 MHz, 140 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-300", desc: "10 kHz – 250 MHz, 300 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-500L", desc: "100 kHz – 200 MHz, 500 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-600", desc: "10 kHz – 250 MHz, 600 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-1000L", desc: "100 kHz – 200 MHz, 1000 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-1300", desc: "10 kHz – 250 MHz, 1300 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-2000L", desc: "100 kHz – 200 MHz, 2000 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-2500", desc: "10 kHz – 250 MHz, 2500 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-3500L", desc: "100 kHz – 200 MHz, 3500 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-5000", desc: "10 kHz – 250 MHz, 5000 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-7000L", desc: "100 kHz – 200 MHz, 7000 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLL-12000L", desc: "100 kHz – 200 MHz, 12000 W", product: "amplifier", group: "10 kHz – 300 MHz" },
  { name: "VLC-60", desc: "10 kHz – 400 MHz, 60 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "VLC-110", desc: "10 kHz – 400 MHz, 110 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "FLC-75", desc: "100 kHz – 400 MHz, 75 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "FLC-180", desc: "1 – 400 MHz, 180 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "VLC-220", desc: "10 kHz – 400 MHz, 220 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "VLC-400", desc: "10 kHz – 400 MHz, 400 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "VLC-1100", desc: "10 kHz – 400 MHz, 1100 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "VLC-1200", desc: "10 kHz – 400 MHz, 1200 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "VLC-2000", desc: "10 kHz – 400 MHz, 2000 W", product: "amplifier", group: "10 kHz – 400 MHz" },
  { name: "VLLH-25", desc: "10 kHz – 1000 MHz, 25 W", product: "amplifier", group: "10 kHz – 1000 MHz" },
  { name: "VLLH-70", desc: "10 kHz – 1000 MHz, 70 W", product: "amplifier", group: "10 kHz – 1000 MHz" },
  { name: "VLLH-150", desc: "10 kHz – 1000 MHz, 150 W", product: "amplifier", group: "10 kHz – 1000 MHz" },
  { name: "VLLH-260", desc: "10 kHz – 200 MHz / 200 – 1000 MHz, 260 W", product: "amplifier", group: "10 kHz – 1000 MHz" },
  { name: "VLLH-800", desc: "10 kHz – 200 MHz / 200 – 1000 MHz, 800 W", product: "amplifier", group: "10 kHz – 1000 MHz" },
  { name: "FLH-4A", desc: "1 – 1000 MHz, 4 W", product: "amplifier", group: "1 – 1000 MHz" },
  { name: "FLH-50A", desc: "1 – 1000 MHz, 50 W", product: "amplifier", group: "1 – 1000 MHz" },
  { name: "FLH-100A", desc: "1 – 1000 MHz, 100 W", product: "amplifier", group: "1 – 1000 MHz" },
  { name: "FLH-100C", desc: "20 – 500 MHz, 100 W", product: "amplifier", group: "1 – 1000 MHz" },
  { name: "FLH-200C", desc: "20 – 500 MHz, 200 W", product: "amplifier", group: "1 – 1000 MHz" },

  // From here on the 2019 selection book is the only source — see the note
  // above, and §2.10 of the ledger for what the book prints and the website
  // does not.
  { name: "FLH-20B", desc: "20 MHz – 1 GHz, 20 W", product: "amplifier", group: "20 MHz – 1 GHz" },
  { name: "FLH-70B", desc: "20 MHz – 1 GHz, 70 W", product: "amplifier", group: "20 MHz – 1 GHz" },
  { name: "VLH-90B", desc: "20 MHz – 1 GHz, 90 W", product: "amplifier", group: "20 MHz – 1 GHz" },
  { name: "VLH-160B", desc: "20 MHz – 1 GHz, 160 W", product: "amplifier", group: "20 MHz – 1 GHz" },
  { name: "FLH-200B", desc: "20 MHz – 1 GHz, 200 W", product: "amplifier", group: "20 MHz – 1 GHz" },
  { name: "VLH-320B", desc: "20 MHz – 1 GHz, 320 W", product: "amplifier", group: "20 MHz – 1 GHz" },
  { name: "VLH-600B", desc: "20 MHz – 1 GHz, 600 W", product: "amplifier", group: "20 MHz – 1 GHz" },
  { name: "VLH-100B1", desc: "80 MHz – 1 GHz, 100 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "FLH-250B1", desc: "80 MHz – 1 GHz, 250 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "VLH-400B1", desc: "80 MHz – 1 GHz, 400 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "FLH-500B1", desc: "80 MHz – 1 GHz, 500 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "VLH-900B1", desc: "80 MHz – 1 GHz, 900 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "VLH-1450B1", desc: "80 MHz – 1 GHz, 1450 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "VLH-1650B1", desc: "80 MHz – 1 GHz, 1650 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "VLH-2400B1", desc: "80 MHz – 1 GHz, 2400 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "VLH-3500B1", desc: "80 MHz – 1 GHz, 3500 W", product: "amplifier", group: "80 MHz – 1 GHz" },
  { name: "FLG-7A", desc: "0,8 – 2 GHz, 7 W", product: "amplifier", group: "0,8 – 2 GHz" },
  { name: "FLG-12A", desc: "0,8 – 2 GHz, 12 W", product: "amplifier", group: "0,8 – 2 GHz" },
  { name: "FLG-25A", desc: "1 – 2 GHz, 25 W", product: "amplifier", group: "0,8 – 2 GHz" },
  { name: "FLG-50A", desc: "0,8 – 2 GHz, 50 W", product: "amplifier", group: "0,8 – 2 GHz" },
  { name: "FLG-100A", desc: "0,8 – 2 GHz, 120 W", product: "amplifier", group: "0,8 – 2 GHz" },
  { name: "FLG-200A", desc: "0,8 – 2 GHz, 200 W", product: "amplifier", group: "0,8 – 2 GHz" },
  { name: "FLG-300A", desc: "0,8 – 2 GHz, 300 W", product: "amplifier", group: "0,8 – 2 GHz" },
  { name: "FLG-500A", desc: "0,8 – 2 GHz, 500 W", product: "amplifier", group: "0,8 – 2 GHz" },
  { name: "FLG-10C", desc: "1 – 3 GHz, 10 W", product: "amplifier", group: "0,8 – 3,2 GHz" },
  { name: "FLG-30C", desc: "1 – 3 GHz, 30 W", product: "amplifier", group: "0,8 – 3,2 GHz" },
  { name: "VLG-40CA", desc: "0,8 – 3,2 GHz, 40 W", product: "amplifier", group: "0,8 – 3,2 GHz" },
  { name: "VLG-70CA", desc: "0,8 – 3,2 GHz, 70 W", product: "amplifier", group: "0,8 – 3,2 GHz" },
  { name: "VLG-120CA", desc: "0,8 – 3,2 GHz, 120 W", product: "amplifier", group: "0,8 – 3,2 GHz" },
  { name: "VLG-220CA", desc: "0,8 – 3,2 GHz, 220 W", product: "amplifier", group: "0,8 – 3,2 GHz" },
  { name: "VLG-450CA", desc: "0,8 – 3,2 GHz, 450 W", product: "amplifier", group: "0,8 – 3,2 GHz" },
  { name: "VLG-1000CA", desc: "0,8 – 3,2 GHz, 1000 W", product: "amplifier", group: "0,8 – 3,2 GHz" },
  { name: "VLG-25D", desc: "0,8 – 4 GHz, 25 W", product: "amplifier", group: "0,8 – 4 GHz" },
  { name: "VLG-45D", desc: "0,8 – 4 GHz, 45 W", product: "amplifier", group: "0,8 – 4 GHz" },
  { name: "VLG-80D", desc: "0,8 – 4 GHz, 80 W", product: "amplifier", group: "0,8 – 4 GHz" },
  { name: "VLG-100D", desc: "0,8 – 4 GHz, 100 W", product: "amplifier", group: "0,8 – 4 GHz" },
  { name: "VLG-200D", desc: "0,8 – 4 GHz, 200 W", product: "amplifier", group: "0,8 – 4 GHz" },
  { name: "VLG-420D", desc: "0,8 – 4 GHz, 420 W", product: "amplifier", group: "0,8 – 4 GHz" },
  { name: "VLG-800D", desc: "0,8 – 4 GHz, 800 W", product: "amplifier", group: "0,8 – 4 GHz" },
  { name: "FLG-15E", desc: "2 – 4 GHz, 15 W", product: "amplifier", group: "2 – 4 GHz" },
  { name: "FLG-30E", desc: "2 – 4 GHz, 30 W", product: "amplifier", group: "2 – 4 GHz" },
  { name: "FLG-60E", desc: "2 – 4 GHz, 60 W", product: "amplifier", group: "2 – 4 GHz" },
  { name: "FLG-100E", desc: "2 – 4 GHz, 100 W", product: "amplifier", group: "2 – 4 GHz" },
  { name: "FLG-200E", desc: "2 – 4 GHz, 200 W", product: "amplifier", group: "2 – 4 GHz" },
  { name: "FLG-9F", desc: "2 – 6 GHz, 9 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "VLG-15F", desc: "2 – 6 GHz, 15 W", product: "amplifier", group: "2 – 6 GHz" },
  // Named for 15 W and rated at 20 W: that is what the book's own table says,
  // and correcting a part number to match a figure is not our call.
  { name: "FLG-15F", desc: "2 – 6 GHz, 20 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "FLG-30F", desc: "2 – 6 GHz, 30 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "VLG-30F", desc: "2 – 6 GHz, 30 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "FLG-50F", desc: "2 – 6 GHz, 50 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "VLG-55F", desc: "2 – 6 GHz, 55 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "FLG-100F", desc: "2 – 6 GHz, 100 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "VLG-100F", desc: "2 – 6 GHz, 100 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "VLG-180F", desc: "2 – 6 GHz, 180 W", product: "amplifier", group: "2 – 6 GHz" },
  { name: "FLG-15G", desc: "0,7 – 6 GHz, 15 W", product: "amplifier", group: "0,7 – 6 GHz" },
  { name: "FLG-25G", desc: "0,7 – 6 GHz, 25 W", product: "amplifier", group: "0,7 – 6 GHz" },
  { name: "FLG-50G", desc: "0,7 – 6 GHz, 50 W", product: "amplifier", group: "0,7 – 6 GHz" },
  { name: "FLG-100G", desc: "0,7 – 6 GHz, 100 W", product: "amplifier", group: "0,7 – 6 GHz" },
  { name: "FLG-200G", desc: "0,7 – 6 GHz, 200 W", product: "amplifier", group: "0,7 – 6 GHz" },
  // Two output figures per model, because these are two amplifiers in one case
  // — the book prints them as "40 W / 15 W" and so do we.
  { name: "VLG-40/15G", desc: "0,8 – 6 GHz, 40 W / 15 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-40/30G", desc: "0,8 – 6 GHz, 40 W / 30 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-70/15G", desc: "0,8 – 6 GHz, 70 W / 15 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-70/30G", desc: "0,8 – 6 GHz, 70 W / 30 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-70/55G", desc: "0,8 – 6 GHz, 70 W / 55 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-120/30G", desc: "0,8 – 6 GHz, 120 W / 30 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-120/55G", desc: "0,8 – 6 GHz, 120 W / 55 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-120/100G", desc: "0,8 – 6 GHz, 120 W / 100 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-220/55G", desc: "0,8 – 6 GHz, 220 W / 55 W", product: "amplifier", group: "0,8 – 6 GHz" },
  { name: "VLG-220/100G", desc: "0,8 – 6 GHz, 220 W / 100 W", product: "amplifier", group: "0,8 – 6 GHz" },
  // WBA microwave amplifiers. These carry a description because the wideband
  // catalogue prints output power and gain per model, which the website's
  // amplifier matrix does not.
  { name: "WBA-0,5/18 – 10", desc: "10 W, 43 dB", product: "amplifier", group: "500 MHz – 18 GHz" },
  { name: "WBA-0,5/18 – 20", desc: "10 – 20 W, 43 dB", product: "amplifier", group: "500 MHz – 18 GHz" },
  { name: "WBA-0,5/18 – 50", desc: "50 W, 47 dB", product: "amplifier", group: "500 MHz – 18 GHz" },
  { name: "WBA-1/20 – 4", desc: "4 W, 36 dB", product: "amplifier", group: "1 – 20 GHz" },
  { name: "WBA-1/20 – 20", desc: "20 W, 43 dB", product: "amplifier", group: "1 – 20 GHz" },
  { name: "WBA-2/18 – 5", desc: "5 W, 37 dB", product: "amplifier", group: "2 – 18 GHz" },
  { name: "WBA-2/18 – 10", desc: "10 W, 40 dB", product: "amplifier", group: "2 – 18 GHz" },
  { name: "WBA-2/20 – 5", desc: "5 W, 37 dB", product: "amplifier", group: "2 – 20 GHz" },
  { name: "WBA-2/20 – 20", desc: "20 W, 43 dB", product: "amplifier", group: "2 – 20 GHz" },
  { name: "WBA-6/10 – 50", desc: "50 W, 47 dB", product: "amplifier", group: "6 – 10 GHz" },
  { name: "WBA-6/10 – 100", desc: "100 W, 50 dB", product: "amplifier", group: "6 – 10 GHz" },
  { name: "WBA-6/12 – 20", desc: "20 W, 43 dB", product: "amplifier", group: "6 – 12 GHz" },
  { name: "WBA-6/12 – 50", desc: "50 W, 47 dB", product: "amplifier", group: "6 – 12 GHz" },
  { name: "WBA-6/18 – 10", desc: "10 W, 40 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/18 – 20", desc: "20 W, 43 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/18 – 40", desc: "40 W, 46 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/18 – 50", desc: "50 W, 47 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/18 – 60", desc: "60 W, 47 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/18 – 100", desc: "100 W, 50 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/18 – 150", desc: "150 W, 52 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/18 – 200", desc: "200 W, 53 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/18 – 300", desc: "300 W, 55 dB", product: "amplifier", group: "6 – 18 GHz" },
  { name: "WBA-6/26.5 – 20", desc: "20 W, 43 dB", product: "amplifier", group: "6 – 26.5 GHz" },
  { name: "WBA-18/26.5 – 5", desc: "5 W, 37 dB", product: "amplifier", group: "18 – 26.5 GHz" },
  { name: "WBA-18/26.5 – 10", desc: "10 W, 40 dB", product: "amplifier", group: "18 – 26.5 GHz" },
  { name: "WBA-18/26.5 – 20", desc: "20 W, 43 dB", product: "amplifier", group: "18 – 26.5 GHz" },
  { name: "WBA-18/26.5 – 25", desc: "25 W, 44 dB", product: "amplifier", group: "18 – 26.5 GHz" },
  { name: "WBA-18/26.5 – 40", desc: "40 W, 46 dB", product: "amplifier", group: "18 – 26.5 GHz" },
  { name: "WBA-18/26.5 – 80", desc: "80 W, 49 dB", product: "amplifier", group: "18 – 26.5 GHz" },
  { name: "WBA-18/40 – 10", desc: "8 – 10 W, 40 dB", product: "amplifier", group: "18 – 40 GHz" },
  { name: "WBA-26.5/40 – 5", desc: "5 W, 37 dB", product: "amplifier", group: "26.5 – 40 GHz" },
  { name: "WBA-26.5/40 – 10", desc: "10 W, 40 dB", product: "amplifier", group: "26.5 – 40 GHz" },
  { name: "WBA-26.5/40 – 40", desc: "40 W, 46 dB", product: "amplifier", group: "26.5 – 40 GHz" },
  { name: "WBA-26.5/40 – 80", desc: "80 W, 49 dB", product: "amplifier", group: "26.5 – 40 GHz" },

  // Antennas, under the five headings the head office's antenna page uses.
  // The form names stay in English for the same reason `industryLabel` keeps
  // Automotive: that is how they are written in Korean EMC practice.
  { name: "ALX-4000", desc: "25 MHz – 4 GHz, 900 W at 100 MHz", product: "antenna", group: "Broadband" },
  { name: "ALX-4000E", desc: "25 MHz – 4 GHz, 100 W cont. / 200 W intermitt.", product: "antenna", group: "Broadband" },
  { name: "ALX-8000E", desc: "25 MHz – 8 GHz, 100 W cont. / 200 W intermitt.", product: "antenna", group: "Broadband" },
  // The double-stacked range, from the 2024 antenna catalogue. Two log-periodic
  // structures on one boom: about 2.5 dB more gain than a single one, which is
  // amplifier power the buyer does not have to pay for.
  { name: "AXL-80", desc: "70 MHz – 4 GHz, 1.5 kW intermitt. / 1 kW cont.", product: "antenna", group: "Double stacked log.-periodic" },
  { name: "AXL-80S", desc: "70 MHz – 4 GHz, folded elements, 1,480 mm wide", product: "antenna", group: "Double stacked log.-periodic" },
  { name: "AXL-80ES", desc: "80 MHz – 2.7 GHz, folded longest elements", product: "antenna", group: "Double stacked log.-periodic" },
  { name: "AXL-80-6G", desc: "70 MHz – 10 GHz, 8.6 dBi ± 2.3 dB", product: "antenna", group: "Double stacked log.-periodic" },
  { name: "AXL-200", desc: "150 MHz – 4 GHz, 2 kW intermitt. / 1 kW cont.", product: "antenna", group: "Double stacked log.-periodic" },
  { name: "MAX-9", desc: "600 MHz – 10.5 GHz, 300 W at 1 GHz", product: "antenna", group: "Stacked log.-periodic" },
  { name: "MAX-9-7/16", desc: "0.6 – 7.5 GHz, 950 W at 1 GHz", product: "antenna", group: "Stacked log.-periodic" },
  { name: "MAX-18", desc: "700 MHz – 20 GHz, 50 W", product: "antenna", group: "Stacked log.-periodic" },
  { name: "HAX-6", desc: "500 MHz – 6 GHz, 6 – 18 dBi", product: "antenna", group: "Horn" },
  { name: "HAX-6-KFZ", desc: "800 MHz – 6.2 GHz, 1 kW at 1 GHz", product: "antenna", group: "Horn" },
  { name: "HAX-18", desc: "800 MHz – 18 GHz, 6 – 18 dBi", product: "antenna", group: "Horn" },
  { name: "HAX-40", desc: "14 – 40 GHz, 15 – 20 dBi", product: "antenna", group: "Horn" },
  // The microwave biconicals. They exist because above 3 GHz there is no
  // omnidirectional broadband antenna on the market — which is what a
  // site-VSWR validation to CISPR 16-1-4 needs.
  { name: "SAM-6", desc: "1 – 6 GHz, 20 W", product: "antenna", group: "Biconical, microwave" },
  { name: "SAM-18", desc: "3 – 18 GHz, 10 W", product: "antenna", group: "Biconical, microwave" },
  { name: "SAX-10", desc: "9 kHz – 30 MHz, antenna factor +10 dB/m", product: "antenna", group: "Active rod" },
  { name: "LAX-10", desc: "9 kHz – 30 MHz, 0.5 m loop", product: "antenna", group: "Active loop" },
  // What holds the antenna up and turns it over. Filed with the antennas
  // because the head office's own 2024 antenna catalogue files them here —
  // they are bought with the antenna and sized by it.
  { name: "FSM-1.6", desc: "Telescopic mast, 0.9 – 1.6 m, fibre glass, 6 kg", product: "antenna", group: "Masts and positioners" },
  { name: "FSM-2.0", desc: "Telescopic mast, 1.2 – 2.0 m, fibre glass, 7 kg", product: "antenna", group: "Masts and positioners" },
  { name: "FSM-4.0", desc: "Manual winch mast, 0.4 – 4.15 m, 13 kg", product: "antenna", group: "Masts and positioners" },
  { name: "FAM2-4", desc: "Fully automatic mast, up to 4.0 m, 12 kg load", product: "antenna", group: "Masts and positioners" },
  { name: "FAM2-6", desc: "Fully automatic mast, 0.9 – 6.0 m, 12 kg load", product: "antenna", group: "Masts and positioners" },
  { name: "FBM 1-4", desc: "Boresight mast, 1.0 – 4.0 m, pneumatic polarisation", product: "antenna", group: "Masts and positioners" },
  { name: "FPD-01", desc: "Electrical polarisation switch, 0° – 90° in approx. 5 s", product: "antenna", group: "Masts and positioners" },

  // Electrical field strength meters.
  { name: "EFS-10", desc: "10 kHz – 9.25 GHz, 0.5 – 500 V/m", product: "efs" },
  { name: "EFS-100", desc: "100 kHz – 9.25 GHz, 0.14 – 140 V/m", product: "efs" },
  { name: "EFS-300", desc: "300 kHz – 18 GHz, 1.5 – 1500 V/m", product: "efs" },
  { name: "EFS-500", desc: "300 kHz – 26.5 GHz, 0.4 – 800 V/m", product: "efs" },
  // Withdrawn by the head office in its August 2026 follow-up and held off the
  // page through `hiddenTestModels`. The row stays so that the figures and the
  // paragraph stay with it — see the note on that list.
  { name: "EFS-Laser", desc: "10 kHz – 6 GHz, 0.1 V/m – 10 kV/m, laser-powered", product: "efs" },
  // Last rather than in numeric order: it is not an EFS-10 with a wider band
  // but the next generation of the probe — a triaxial diode-dipole sensor with
  // its own housing, its own software and its own datasheet
  // (EFS-18-datasheet_2026.pdf). Filing it between the EFS-10 and the EFS-100
  // would put it inside a table it does not share a single row with.
  { name: "EFS-18", desc: "1 MHz – 18 GHz, 0.8 – 340 V/m, triaxial isotropic", product: "efs" },

  // Pre-amplifiers for emission measurement.
  { name: "FPA-2", desc: "9 kHz – 2 GHz, +30 dB, NF 2.5 dB", product: "preamp" },
  { name: "FPA-6A", desc: "10 MHz – 6 GHz, +28 dB, NF 2.5 dB", product: "preamp" },
  { name: "FPA-6B", desc: "9 kHz – 6 GHz, +28 dB, NF 2.5 dB", product: "preamp" },
  { name: "FPA-18", desc: "1 – 18 GHz, ~33 dB, NF 2 dB", product: "preamp" },
  { name: "FPA-26", desc: "18 – 26.5 GHz, ~33 dB, NF 3.5 dB", product: "preamp" },
  { name: "FPA-40", desc: "18 – 40 GHz, ~35 dB, NF 5.5 dB", product: "preamp" },

  // Meters and switching.
  { name: "PMS 1084", desc: "100 kHz – 6 GHz, 2 channels (4 max)", product: "meter" },
  { name: "PMS 1084 B", desc: "10 kHz – 500 MHz", product: "meter" },
  { name: "RSU", desc: "DC – 12.4 GHz, extendable to 18 / 40 GHz", product: "meter" },

  // Integrated systems.
  //
  // This family was held back to the CIT series for a while, on the reasoning
  // that its page was answering three questions at once. The head office's
  // August 2026 mail settles which products it wants promoted, and four of
  // them are here: the CIT series for IEC/EN 61000-4-6, ISO 11452-4 and CS114;
  // the ECU-6 for radiated immunity to IEC 61000-4-3, ISO 11452-2 and RS103;
  // the PSG-300 for IEC/EN 61000-4-16 and -4-19; the MTS-800 for the MIL-STD
  // 461 magnetic methods. So the family is four products and the page answers
  // four questions, each under its own heading.
  //
  // Figures come from the 2026 datasheets that arrived with that mail
  // (D:\FRANKONIA\FRF\Datasheet) rather than from the older website pages, and
  // they moved: the CIT amplifier options are 25 / 75 / 200 W where the site
  // said 25 / 75 and 180, the ECU generator reaches 6.2 GHz where the 2016
  // catalogue said 6.5, and the PSG-300 is rated 260 W where it said 250.
  // See docs/source/test-systems-source.md §6.
  //
  // ECU-3 and the GTEM cells are the two the old list held that are still not
  // here. Neither is in the head office's promotion list and neither has a
  // 2026 datasheet — the only figures this site could print for them are the
  // ones off a website page that the ECU-6.2 datasheet has already overtaken.
  { name: "CIT-100", desc: "Compact immunity test system, 4 kHz – 1.2 GHz, 25 / 75 / 200 W", product: "system" },
  { name: "CIT-1000", desc: "Compact immunity test system, 4 kHz – 1.2 GHz, 25 / 75 / 200 W, touch-screen PC", product: "system" },
  { name: "ECU-6", desc: "EMC test and control unit, generator 8 kHz – 6.2 GHz", product: "system" },
  { name: "PSG-300", desc: "Precision power generator, DC – 300 kHz, 5 A / 260 W", product: "system" },
  { name: "PSG-300A", desc: "Precision power generator, DC – 300 kHz, 16 A / 800 W", product: "system" },
  { name: "MTS-800", desc: "Magnetic field generator and analyzer, DC – 250 kHz, up to 1000 A/m", product: "system" },

  // Emission measuring systems, from the 2021 catalogue of that name. The
  // receivers are the family the overview paragraph has named since the branch
  // was built — "Full-compliant EMI-Receiver with FFT" — and had no page for.
  { name: "ERX-6", desc: "EMI test receiver, 10 Hz – 6 GHz (7 GHz option), hardware FFT", product: "emission", group: "EMI test receivers" },
  { name: "ERC-6", desc: "EMI test receiver, 9 kHz – 6 GHz, integrated 10″ touch PC", product: "emission", group: "EMI test receivers" },
  { name: "C2-16", desc: "Single-phase LISN, 9 kHz – 30 MHz, 16 A", product: "emission", group: "Line impedance stabilization networks" },
  { name: "C4-32", desc: "Three-phase LISN, 9 kHz – 30 MHz, 32 A", product: "emission", group: "Line impedance stabilization networks" },
  { name: "LISN-KFZ", desc: "Automotive LISN, 100 kHz – 150 MHz, 70 A", product: "emission", group: "Line impedance stabilization networks" },
  { name: "LISN-MIL", desc: "MIL-STD-461 LISN, 150 kHz – 100 MHz, 70 A", product: "emission", group: "Line impedance stabilization networks" },
  { name: "NFS-100", desc: "Near-field probe set, E 80 – 500 MHz / H 10 – 500 MHz", product: "emission", group: "Probes and clamps" },
  { name: "LVVL", desc: "2.0 m large loop antenna, 9 kHz – 30 MHz, three axes", product: "emission", group: "Probes and clamps" },
  { name: "ACF-01B", desc: "Absorbing clamp, 30 – 1000 MHz, 17 dB ± 4 dB", product: "emission", group: "Probes and clamps" },

  // Coupling and decoupling accessories. Listed by type rather than by order
  // code: each of these is a family with ten or more variants for connector,
  // current rating and voltage class, and a page that printed all of them would
  // be a parts list.
  //
  // The IEC/EN 61000-4-6 rows are the 2026 `_cdn_digital.pdf` rather than the
  // older conducted immunity catalogue the branch was first built from. Three
  // types the catalogue did not carry arrive with it — the balanced CDN-T, the
  // RJ45 and the CAN networks — and one leaves: the AF9. The 2026 sheet prints
  // the AF family as AF2 to AF8 and says nothing about a nine-pole build or
  // about the 300 MHz upper edge the catalogue gave the small AF types, so
  // neither is carried forward. See docs/source/test-systems-source.md §7.
  { name: "CDN-AF2 … AF8", desc: "Unscreened unbalanced lines, 2 to 8 poles, (10 kHz) 150 kHz – 230 MHz", product: "coupling", group: "Coupling / decoupling networks, IEC/EN 61000-4-6" },
  { name: "CDN-M1 … M5", desc: "Power supply lines, to 1000 V and 125 A", product: "coupling", group: "Coupling / decoupling networks, IEC/EN 61000-4-6" },
  { name: "CDN-T2 / T4 / T8", desc: "Unscreened balanced lines, (10 kHz) 150 kHz – 230 MHz", product: "coupling", group: "Coupling / decoupling networks, IEC/EN 61000-4-6" },
  { name: "CDN-RJ45", desc: "Unscreened balanced data lines, RJ45 8-pin, to 1 Gbit/s", product: "coupling", group: "Coupling / decoupling networks, IEC/EN 61000-4-6" },
  { name: "CDN-CAN-L4 / L5", desc: "CAN bus lines on 9-pin Sub-D, 150 kHz – 230 MHz", product: "coupling", group: "Coupling / decoupling networks, IEC/EN 61000-4-6" },
  { name: "CDN-S1 … S25", desc: "Screened lines, coupled to the shield through 100 Ω, 10 kHz – 230 MHz", product: "coupling", group: "Coupling / decoupling networks, IEC/EN 61000-4-6" },
  { name: "CDN-USB / HDMI / Firewire / RJ45-S", desc: "Screened data interfaces, 10 kHz – 230 MHz", product: "coupling", group: "Coupling / decoupling networks, IEC/EN 61000-4-6" },

  // Coupling networks for IEC/EN 61000-4-16 — the disturbance the PSG-300
  // generates has to reach the cable the same way the 4-6 disturbance does, and
  // these are what does it. A different standard, a different network: 15 Hz to
  // 150 kHz against 150 kHz to 230 MHz, resistor-capacitor rather than a choke,
  // and separate AC and DC builds of the M-types because short-circuiting the
  // capacitor with alternating current applied destroys the network.
  //
  // "CN" is the head office's own short form — its mail asks for "CNs" and the
  // sheet is filed `Frankonia_DS_CN16+IT`, footed "Coupling networks -16". The
  // type designations after it (AF2, M2/AC, T2, RJ45) are the sheet's own
  // column. Neither half is invented here, but the two had not been written
  // together before, which is why this note exists.
  { name: "CN AF2 / AF4 / AF8", desc: "Unscreened unbalanced lines, 2 to 8 poles, DC / 15 Hz – 150 kHz", product: "coupling", group: "Coupling networks, IEC/EN 61000-4-16" },
  { name: "CN M2 / M3 / M4 / M5", desc: "Power supply lines, separate AC and DC units, 250 VAC / 32 A", product: "coupling", group: "Coupling networks, IEC/EN 61000-4-16" },
  { name: "CN T2 / T4 / T8", desc: "Unscreened balanced lines, conversion loss 60 dB", product: "coupling", group: "Coupling networks, IEC/EN 61000-4-16" },
  { name: "CN RJ45", desc: "Balanced data lines on an 8-pole interface, DC / 15 Hz – 150 kHz", product: "coupling", group: "Coupling networks, IEC/EN 61000-4-16" },
  { name: "IT-6 / IT-16 / IT-20", desc: "Isolation transformer, 1380 / 3680 / 4600 VA, 230 V", product: "coupling", group: "Coupling networks, IEC/EN 61000-4-16" },

  { name: "EMCL-20", desc: "EM coupling clamp, 10 kHz – 1 GHz, cable ≤ 20 mm", product: "coupling", group: "Clamps and probes" },
  { name: "EMCL-35", desc: "EM coupling clamp, 10 kHz – 1 GHz, cable ≤ 35 mm", product: "coupling", group: "Clamps and probes" },
  { name: "ABCL-20", desc: "EM decoupling clamp, 100 kHz – 1000 MHz, cable ≤ 20 mm", product: "coupling", group: "Clamps and probes" },
  { name: "BCI probe", desc: "Bulk current injection probe, 4 kHz – 400 MHz, 40 mm harness", product: "coupling", group: "Clamps and probes" },
  { name: "MP50", desc: "Bulk current monitoring probe", product: "coupling", group: "Clamps and probes" },
];

/**
 * Models held off the page inside a family that is otherwise on show.
 *
 * `shownTestProducts` decides which families are drawn; this decides which
 * models inside them are. The two are separate because one family — Emission
 * Measuring Systems — carries the instrument the head office's August 2026
 * mail asks for (the ERX receiver) alongside eight it does not: four LISNs,
 * the near-field probe set, the large loop antenna and the absorbing clamp.
 * Dropping the whole family would take the mail's own emission product with
 * it; leaving it whole would put eight unasked-for instruments on a page the
 * mail is the reason for.
 *
 * The second reason a name lands here is the head office asking for it by name.
 * Its August 2026 follow-up says "EFS-LASER pls remove", so the laser-powered
 * probe comes off the field strength meter page: the row, and with it the lead
 * paragraph, the Special Features bullet and the specification table that the
 * page wrote by hand around it. That is a withdrawal rather than a hold, but it
 * is the same mechanism and the same one-line reversal, and keeping the two
 * kinds in one list is better than a second list that behaves identically.
 *
 * ERC-6 is on this list and it is the one entry worth a second look. It is the
 * ERX-6's cheaper sibling and sits in the same "EMI test receivers" group, so
 * an argument can be made that the mail's "ERX-7 … as system for emission"
 * covers it. The mail names ERX and ERC is a different designation, so it is
 * held; taking it off this list is the whole change if that reading is wrong.
 *
 * Nothing here is deleted. Every model keeps its entry in `testModels`, its
 * figures in `modelFacts`, its paragraph in `modelLead` and its photograph in
 * the gallery, so a name coming off this list is one line and no re-typing.
 * The specification tables on those families' pages follow the same cut by
 * hand — see the note on `productBody`.
 */
export const hiddenTestModels: readonly string[] = [
  "EFS-Laser",
  "ERC-6",
  "C2-16",
  "C4-32",
  "LISN-KFZ",
  "LISN-MIL",
  "NFS-100",
  "LVVL",
  "ACF-01B",
];

/** A family's models, less the ones held back. Every count, row, dropdown
 *  caption and basket entry on the branch comes through here, so the hold is
 *  made once rather than at each surface. */
export const modelsByProduct = (product: TestProduct) =>
  testModels.filter((m) => m.product === product && !hiddenTestModels.includes(m.name));

/**
 * A product family's models, split under the source's own headings.
 *
 * Order comes from `testModels`, not from a sort: the head office prints its
 * amplifier bands lowest-first and its antennas broadband-first, and a reader
 * comparing this page against theirs should find the same sequence. A family
 * whose models carry no `group` comes back as one untitled run, which is what
 * the meters, the pre-amplifiers and the systems want.
 */
export const modelGroups = (product: TestProduct) => {
  const groups: { title?: string; models: TestModel[] }[] = [];
  for (const model of modelsByProduct(product)) {
    const last = groups[groups.length - 1];
    if (last && last.title === model.group) last.models.push(model);
    else groups.push({ title: model.group, models: [model] });
  }
  return groups;
};

export type TestStandard = {
  name: string;
  industry: Industry;
  zh: string;
  en: string;
};

/**
 * The 24 standards the head office's "Select standard" menu offers, each
 * assigned to the industry that buys the test for it. Nothing is invented and
 * nothing is dropped: this is that list, re-sorted.
 *
 * Powertrain gets none of its own. Electric drivetrains are tested to the same
 * automotive standards — CISPR 25, ISO 11452 — under different conditions, and
 * saying otherwise would put a claim on the page that no standards body backs.
 * So the index shows four headings, not five: an industry with no standards of
 * its own has nothing to head.
 */
export const testStandards: readonly TestStandard[] = [
  { name: "CISPR 12 / EN 55012", industry: "automotive", zh: "车辆发射——车外接收器保护", en: "Vehicle emissions — protection of off-board receivers" },
  { name: "CISPR 25 / EN 55025", industry: "automotive", zh: "车辆部件发射——车载接收器保护", en: "Component emissions — protection of on-board receivers" },
  { name: "ISO 11451-2", industry: "automotive", zh: "整车、外部辐射源", en: "Whole vehicle, off-vehicle radiation source" },
  { name: "ISO 11451-4", industry: "automotive", zh: "整车，传导注入（BCI）", en: "Whole vehicle, bulk current injection" },
  { name: "ISO 11452-2 / -3 / -5 / -7", industry: "automotive", zh: "组件 — 电波暗室、TEM 室、带状线、导电注入", en: "Components — anechoic chamber, TEM cell, stripline, conducted injection" },
  { name: "SAE J1113-2 / -22", industry: "automotive", zh: "元件导通电阻和磁场", en: "Component conducted immunity and magnetic fields" },
  { name: "Ford ES-XW7T-1A278AC", industry: "automotive", zh: "福特内部标准", en: "Ford company standard" },
  { name: "GM W 3097", industry: "automotive", zh: "GM内标", en: "GM company standard" },
  { name: "PSA B21 7110", industry: "automotive", zh: "PSA内部标准", en: "PSA company standard" },
  { name: "Renault 36-00-808, DC-11224, DC 10614", industry: "automotive", zh: "雷诺内部标准", en: "Renault company standards" },

  { name: "MIL-STD-461 CE 101 · RE 101 · CS 101 · CS 109", industry: "military", zh: "传导/辐射发射和传导抗扰度", en: "Conducted and radiated emissions, conducted susceptibility" },
  { name: "MIL-STD-461 RS 103", industry: "military", zh: "辐射电磁场抗扰度", en: "Radiated electromagnetic field susceptibility" },

  { name: "CISPR 11 / EN 55011", industry: "commercial", zh: "工业、科学和医疗（ISM）设备", en: "Industrial, scientific and medical equipment" },
  { name: "CISPR 14 / EN 55014", industry: "commercial", zh: "家用电器及电动工具", en: "Household appliances and power tools" },
  { name: "CISPR 15 / EN 55015", industry: "commercial", zh: "照明设备", en: "Lighting equipment" },
  { name: "CISPR 22 / EN 55022", industry: "commercial", zh: "信息技术设备（ITE）", en: "Information technology equipment" },
  { name: "CISPR 32 / EN 55032", industry: "commercial", zh: "多媒体设备", en: "Multimedia equipment" },
  { name: "EN 55103-1 / -2 / -3", industry: "commercial", zh: "专业音视频灯光设备", en: "Professional audio, video and lighting equipment" },
  { name: "IEC / EN 61000-4-3", industry: "commercial", zh: "射频电磁场辐射抗扰度", en: "Radiated RF electromagnetic field immunity" },
  { name: "IEC / EN 61000-4-6", industry: "commercial", zh: "传导射频抗扰度", en: "Conducted RF immunity" },
  { name: "IEC / EN 61000-4-16 / -19", industry: "commercial", zh: "传导共模/直流电源抗扰度", en: "Conducted common mode and DC power port immunity" },

  { name: "IEC / EN 61000-4-8", industry: "others", zh: "工频磁场抗扰度", en: "Power frequency magnetic field immunity" },
  { name: "IEC / EN 61000-4-20", industry: "others", zh: "TEM波导测试", en: "Testing in TEM waveguides" },
  { name: "IEC / EN 61000-4-22", industry: "others", zh: "全电波暗室（FAR）辐射发射和抗扰度", en: "Radiated emission and immunity in a fully anechoic room" },
];

export const standardsByIndustry = (industry: Industry) =>
  testStandards.filter((s) => s.industry === industry);

/** Which product families a test discipline is built from. Curated, not
 *  derived: it is the equipment list for a setup, not a category membership.
 *  A set, though — the order it prints in comes from `testProducts`. */
const categoryProducts: Record<TestCategory, readonly TestProduct[]> = {
  emission: ["antenna", "emission", "preamp", "meter"],
  conducted: ["system", "amplifier", "coupling", "meter"],
  radiated: ["system", "amplifier", "antenna", "efs", "meter"],
  magnetic: ["system"],
};

/** Sorted rather than printed as written, so the equipment list on a test page
 *  reads in the same order as the menu column and the index — one order for
 *  the branch, and editing the table above cannot put it out of step. */
export const productsOfCategory = (category: TestCategory) =>
  testProducts.filter((p) => categoryProducts[category].includes(p));

type Entry = { label: string; description: string; note?: string };

export const testCategoryMeta = {
  zh: {
    emission: {
      label: "发射",
      note: "9kHz~40GHz",
      description:
        "辐射和传导发射测量配置——天线、EMI接收器和LISN、FPA前置放大器和射频功率计。覆盖从 9kHz 到 40GHz。",
    },
    conducted: {
      label: "传导电阻 传导",
      note: "9kHz~400MHz",
      description:
        "传导射频抗扰度和BCI测试配置——CIT-100·CIT-1000紧凑型系统、9kHz~400MHz频段放大器、CDN、耦合/分离钳和功率计。",
    },
    radiated: {
      label: "抗辐射",
      note: "20MHz~18GHz",
      description:
        "射频辐射抗扰度测试配置——ECU控制单元、20MHz~18GHz频段放大器、天线、EFS场强计、功率计和开关单元。",
    },
    magnetic: {
      label: "磁场电阻 磁性",
      note: "DC~250kHz",
      description:
        "磁场发射和抗扰度测试配置——MTS-800 和亥姆霍兹线圈和回路传感器。 DC~250kHz，高达 1000 A/m。",
    },
  },
  en: {
    emission: {
      label: "Emission",
      note: "9 kHz – 40 GHz",
      description:
        "Radiated and conducted emission setups — antennas, the EMI receivers and their LISNs, the FPA pre-amplifiers and RF power meters, covering 9 kHz to 40 GHz.",
    },
    conducted: {
      label: "Conducted Immunity",
      note: "9 kHz – 400 MHz",
      description:
        "Conducted RF immunity and BCI setups — the CIT-100 and CIT-1000 compact systems, amplifiers over 9 kHz to 400 MHz, and the CDNs and clamps that put the disturbance on the cable.",
    },
    radiated: {
      label: "Radiated Immunity",
      note: "20 MHz – 18 GHz",
      description:
        "Radiated RF immunity setups — the ECU control units, amplifiers over 20 MHz to 18 GHz, antennas, EFS field strength meters, power meters and switching units.",
    },
    magnetic: {
      label: "Magnetic Field",
      note: "DC – 250 kHz",
      description:
        "Magnetic field emission and immunity setups — the MTS-800 with Helmholtz coils and loop sensors, DC to 250 kHz and up to 1000 A/m.",
    },
  },
} as const satisfies Record<Lang, Record<TestCategory, Entry>>;

export const testProductMeta = {
  zh: {
    amplifier: {
      label: "射频功率放大器",
      note: "用于抗扰度测试驱动的固态装置，宽带宽——高达12kW",
      description:
        "用于抗扰度测试驱动的射频功率放大器——10kHz~6GHz固态放大器（最高12kW）和500MHz~40GHz宽带WBA。",
    },
    antenna: {
      label: "天线",
      note: "发射和抗扰度，传输和接收",
      description:
        "用于发射和抗扰度测试的天线 — 宽带 ALX、堆叠对数周期 MAX、喇叭 HAX、有源加载 SAX-10 和环路 LAX-10。从 9kHz 到 40GHz。",
    },
    efs: {
      label: "电场强度计EFS",
      note: "暗室安全现场测量——光纤传输",
      description:
        "EFS-10·100·300·500及新一代EFS-18 — 10kHz~26.5GHz，0.14~1500V/m，光纤传输。",
    },
    preamp: {
      label: "前置放大器FPA",
      note: "接收器前端发射信号的放大",
      description:
        "发射测量宽带前置放大器—FPA-2·6A·6B·18·26·40，9kHz~40GHz，增益28~35dB。",
    },
    meter: {
      label: "功率计/开关",
      note: "渐进/反射功率测量和射频路径切换",
      description:
        "PMS 1084·1084B射频功率计和RSU射频继电器切换单元—DC~12.4GHz，18/40GHz扩展。",
    },
    system: {
      label: "集成测试系统",
      note: "一机架完成测试配置",
      description:
        "CIT-100·CIT-1000紧凑型传导抗扰度测试系统，用于辐射抗扰度的ECU-6 EMC控制单元，用于IEC/EN 61000-4-16·-4-19的PSG-300·300A精密信号发生器，用于MIL-STD 461磁场测试的MTS-800。",
    },
    emission: {
      label: "发射测量系统",
      note: "测量辐射的一面——完全合规的EMI接收器",
      description:
        "EMI 测试接收器 ERX-6 — 10 Hz 至 6 GHz（7 GHz 可选），内置 FFT 硬件，适用于 CISPR 16-1-1 Ed 3.1 和 MIL-STD 461G。",
    },
    coupling: {
      label: "耦合/去耦配件",
      note: "在传导抗扰度测试中将信号放置在电缆上的装置",
      description:
        "IEC/EN 61000-4-6耦合/断开网络（CDN）全系列、IEC/EN 61000-4-16耦合网络（CN）和隔离变压器、EM耦合钳EMCL、隔离钳ABCL-20、BCI注入/监测探头。",
    },
  },
  en: {
    amplifier: {
      label: "RF Power Amplifiers",
      note: "Immunity drive, solid-state and wideband — to 12 kW",
      description:
        "RF power amplifiers for immunity drive — solid-state models from 10 kHz to 6 GHz, up to 12 kW, and the WBA wideband models from 500 MHz to 40 GHz.",
    },
    antenna: {
      label: "Antennas",
      note: "Transmit and receive, emission and immunity",
      description:
        "Antennas for emission and immunity testing — the broadband ALX, the stacked log-periodic MAX, the HAX horns, and the SAX-10 rod and LAX-10 loop, covering 9 kHz to 40 GHz.",
    },
    efs: {
      label: "Field Strength Meters",
      note: "Reads the field inside the chamber, over fibre",
      description:
        "EFS-10, 100, 300 and 500 and the new-generation EFS-18 — 10 kHz to 26.5 GHz, 0.14 to 1500 V/m, over a fibre optic link.",
    },
    preamp: {
      label: "Pre-Amplifiers",
      note: "Lifts the emission signal ahead of the receiver",
      description:
        "Broadband pre-amplifiers for emission measurement — FPA-2, 6A, 6B, 18, 26 and 40, from 9 kHz to 40 GHz with 28 to 35 dB gain.",
    },
    meter: {
      label: "Meters & Switching",
      note: "Forward and reflected power, and the RF paths between",
      description:
        "PMS 1084 and 1084 B RF power meters and the RSU relay switching unit — DC to 12.4 GHz, extendable to 18 or 40 GHz.",
    },
    system: {
      label: "Integrated Systems",
      note: "A whole test in one rack unit",
      description:
        "The CIT-100 and CIT-1000 compact conducted immunity test systems, the ECU-6 control unit for radiated immunity, the PSG-300 and 300A precision power generators for IEC/EN 61000-4-16 and -4-19, and the MTS-800 magnetic field system for MIL-STD 461.",
    },
    emission: {
      label: "Emission Measuring Systems",
      note: "The measuring half — the full-compliance EMI receiver",
      description:
        "The ERX-6 EMI test receiver — 10 Hz to 6 GHz (7 GHz as an option), with the FFT hardware for CISPR 16-1-1 Ed 3.1 and MIL-STD 461G fitted as standard.",
    },
    coupling: {
      label: "Coupling & Decoupling",
      note: "What puts the disturbance on the cable",
      description:
        "The full range of coupling/decoupling networks for IEC/EN 61000-4-6, the CN coupling networks and IT isolation transformers for IEC/EN 61000-4-16, the EMCL coupling clamps, the ABCL-20 decoupling clamp and the BCI injection and monitoring probes.",
    },
  },
} as const satisfies Record<Lang, Record<TestProduct, Entry>>;

/**
 * The second sentence used to name the two ways in, because the index printed
 * both. While the index is held back to one list (see the note on
 * `showTestAxis` in test-system-content.tsx) it says what the division supplies
 * instead — a line that sits above one list and above three equally well, so
 * restoring the other lists does not oblige a second edit here.
 *
 * This string is the page's own intro *and* its meta description, which is why
 * it is a sentence about the branch rather than an instruction about the page.
 */
export const testSystemsOverviewMeta = {
  zh: {
    label: "EMC 测试系统",
    title: "EMC Test Systems",
    description:
      "我们提供发射和抗扰度测试所需的设备，从 EMI 接收器到场强计、射频功率计和集成测试系统。",
  },
  en: {
    label: "EMC Test Systems",
    title: "EMC Test Systems",
    description:
      "From EMI receivers to field strength meters, RF power meters and integrated systems — the instruments an emission or immunity setup is built from.",
  },
} as const satisfies Record<Lang, { label: string; title: string; description: string }>;

export const testStandardsMeta = {
  zh: {
    label: "按标准检索",
    description:
      "Frankonia 测试设备支持的所有 EMC 标准。它由经过该标准测试的行业团体分组和组织。",
  },
  en: {
    label: "Standards",
    description:
      "The EMC standards Frankonia's test equipment addresses, grouped by the industry that tests to them.",
  },
} as const satisfies Record<Lang, { label: string; description: string }>;

/**
 * Page copy, carried over from the head office's own product pages and — for
 * the WBA amplifiers — from its 2020 wideband catalogue. See
 * docs/source/test-systems-source.md for the verbatim originals and for what
 * was left behind.
 *
 * English is the head office's wording. Korean is a translation of it, not new
 * copy written for a Korean market. Model designations, bands, gains, field
 * strengths and standard numbers are not translated: they are what a reader
 * matches against a quotation.
 *
 * The standards index has no body. Its 24 entries and the industry groupings
 * over them are the page; the head office's `/select-standard/` is a bare list
 * with no prose, and writing an introduction for it would mean writing
 * something the head office never said.
 */
export const overviewBody: Record<Lang, PageBody> = {
  en: {
    lead: [
      "Our Test System division offers a wide range of EMC Test Systems for emission and immunity testing as well as the planning, delivery and installation of turn-key EMC-Laboratories acc. to industrial, automotive and military standards.",
      "Next to the complete systems we offer also single instruments/components, like Signal Generators, RF-Power-Meters, E-Field Sensors, EMI-Receiver and many other accessories for EMC-testing.",
    ],
    groups: [
      {
        /* The head office's own list, less the lines whose products are not on
           show. Four came out with them — antennas, RF power amplifiers, the
           GTEM cells and the “ECU 3/6” line, which named a control unit this
           page carries as the ECU-6 alone. The remaining seven are verbatim.
           See the note on `shownTestProducts`. */
        title: "During the last 25 years, the following product lines were developed",
        items: [
          "Compact Immunity Test System for immunity testing acc. to IEC/EN 61000-4-6 with integrated signal generator, RF-power-amplifier, directional coupler and 3-channel RF-power-meter",
          "Compact Immunity Test System for immunity testing acc. to IEC/EN 61000-4-16",
          "Radiated immunity test systems acc. to IEC/EN 61000-4-3, ISO 11452-2, MIL-STD 461, RS 103",
          "Full-compliant EMI-Receiver with FFT for emission measurements from 9 kHz to 6 GHz",
          "Control software for automated emission and immunity testing",
          "EMC Control-Unit with integrated signal-generator, relay-switching-unit, directional couplers, RF-power-meters, EUT-monitoring",
          "E-field-sensors, battery-powered",
          "Low-frequency- / Magnetic-field-test-system for emission and immunity tests, for example magnetic-field-testing up to 1000 A/m, MIL-STD 461 testing, parts CE101, CS101, CS109, RE101, RS101",
        ],
      },
    ],
  },
  zh: {
    lead: [
      "Frankonia测试设备事业部提供用于辐射和抗扰度测试的整体EMC测试系统，并负责按照工业、汽车和军事标准设计、交付和安装交钥匙EMC实验室。",
      "除了完整的系统外，我们还提供用于 EMC 测试的单独产品和配件，包括信号发生器、射频功率计、电场传感器和 EMI 接收器。",
    ],
    groups: [
      {
        /* 본사 원본 목록에서 화면에 올리지 않는 제품 줄을 뺐다 — 안테나, RF
           파워앰프, GTEM 셀, 그리고 이 페이지가 ECU-6 하나로만 싣는 “ECU 3/6”
           줄. 나머지 일곱 줄은 원문 그대로다. `shownTestProducts` 주석 참조. */
        title: "过去25年开发的产品",
        items: [
          "用于 IEC/EN 61000-4-6 抗扰度测试的紧凑型抗扰度测试系统 — 内置信号发生器、射频功率放大器、定向耦合器和 3 通道射频功率计",
          "用于IEC/EN 61000-4-16抗扰度测试的紧凑型抗扰度测试系统",
          "符合 IEC/EN 61000-4-3、ISO 11452-2、MIL-STD 461 RS 103 标准的辐射抗扰度测试系统",
          "完全兼容的 EMI 接收器，具有 FFT，可进行 9 kHz 至 6 GHz 发射测量",
          "发射和抗扰度测试自动化控制软件",
          "EMC控制单元集成信号发生器、继电器开关单元、定向耦合器、射频功率计和EUT监控",
          "电池供电电场传感器",
          "用于发射/抗扰度测试的低频/磁场测试系统 — 高达 1000 A/m 的磁场测试，MIL-STD 461 CE101·CS101·CS109·RE101·RS101",
        ],
      },
    ],
  },
};

/**
 * The four test disciplines.
 *
 * The head office has no prose of its own on these: its Emission and Immunity
 * pages are card menus. So each page's lead is taken from the instruments that
 * setup is actually built from — the magnetic page from the MTS-800, the
 * conducted page from the CIT-100, the emission page from the FPA
 * pre-amplifiers, the radiated page from the amplifier catalogue's own
 * statement of what it is for. Nothing here is written from scratch.
 */
export const categoryBody: Record<Lang, Partial<Record<TestCategory, PageBody>>> = {
  en: {
    emission: {
      lead: [
        "The wide frequency range up to 2/6 GHz allows measurements acc. CISPR 22. Due to the high gain and the low noise figure the system noise is nearly independent of the other components including cable and receiver. These features make the FPA-x very useful for the measurement of very low limits, as required for CISPR 25. In this case it will be connected directly to the antenna.",
        "It must be noted that the use of pre-amplifier is generally not recommended for the measurement of impulsive signals. Such broadband noise is typical for many EMC measurements. This means that any broadband pre-amplifier is not suitable for EMC measurement of a broadband pulse spectrum.",
      ],
      figure: {
        src: "/test-systems/images/preamp-fpa.webp",
        w: 1200,
        h: 920,
        alt: "An FPA pre-amplifier: a machined metal housing with N-type flange connectors at each end and an engraved type plate on the lid",
        caption: "The type plate carries the band and the gain — the two figures an emission measurement is set up around.",
      },
      groups: [],
    },
    conducted: {
      lead: [
        "The CIT-100 is a complete test system for conducted RF-immunity testing and BCI-testing acc. to IEC/EN 61000-4-6, ISO 11452-4, MIL-STD 461, CS114 and similar standards.",
        "As a “stand-alone” test system the CIT-100 is convincing by its easy and comfortable handling and the excellent cost-performance ratio. We also offer the full range of coupling/decoupling networks (CDN's), EM-coupling clamp, BCI- and current clamps.",
        "For immunity tests to conducted common mode disturbances acc. to IEC/EN 61000-4-16 and differential mode disturbances acc. to IEC/EN 61000-4-19, the PSG-300 provides a linear precision power amplifier over DC – 300 kHz.",
      ],
      figure: {
        src: "/test-systems/images/system-cit-100.webp",
        w: 1600,
        h: 609,
        alt: "The CIT-100 in a 19-inch case, front panel lettered “Conducted Immunity Test System”",
        caption: "Generator, amplifier, power meter and directional coupler in one case — and each still reachable on its own connector.",
      },
      groups: [],
    },
    radiated: {
      lead: [
        "FRANKONIA offers RF-power amplifiers whose frequency range and output power have been tailored especially to the applications in immunity test systems like radiated immunity test systems acc. to IEC/EN 61000-4-3, ISO 11452-2 and MIL-STD 461 RS 103.",
        "A radiated setup is the amplifier, the antenna that carries its power into the chamber, and the field probe that says what arrived. All three are here.",
      ],
      figure: {
        src: "/test-systems/images/antenna-hax-6.webp",
        w: 1600,
        h: 1200,
        alt: "The HAX-6 broadband horn antenna on its mast, aperture facing the camera",
        caption: "500 MHz to 6 GHz. The gain rises with frequency, which is what compensates the cable loss at the top of the band.",
      },
      groups: [],
    },
    magnetic: {
      lead: [
        "The MTS-800 is a compact test system for broadband generation and measurement of magnetic fields. Its internal components allow automatic EMC tests according to automotive standards where high field strength need to be generated or measured.",
        "In combination with our triaxial Helmholtz coils full automated susceptibility tests are possible at magnetic field strength up to 1000 A/m for frequencies from DC to 1 kHz. Lower field strength can be generated for frequencies up to 250 kHz. Due to the triaxial setup of our Helmholtz coil major improvement in device handling is achieved because there is no need to turn an EUT during tests.",
        "Tests and measurements are controlled by a program which will set most parameter automatically. For any relevant standard, which are fulfilled by the MTS-800, limit values are already included into the software package, although any different value can be defined by a user. After every test full reports will be created automatically.",
      ],
      figure: {
        src: "/test-systems/images/system-mts-800.webp",
        w: 1400,
        h: 782,
        alt: "The MTS-800 front panel, lettered “Magnetic Test System”, with banana jacks, BNC inputs and a mains switch",
        caption: "An 800 W power amplifier, a signal generator and a spectrum analyser in one unit — each usable stand-alone.",
      },
      groups: [
        {
          title: "Special features",
          items: [
            "Frequency range for emission and immunity measurements: DC – 250 kHz",
            "800 W precision power amplifier, signal generator and spectrum analyzer in one compact unit",
            "All instruments may as well be used as stand-alone devices",
            "Powerful but easy to operate software, fully expandable for future standards modifications",
            "Standard software allows easy operation, report generation and integration of external measuring instrument for EUT monitoring",
            "Fully automated tests with triaxial Helmholtz coil — software controlled generation of magnetic field in x-, y- and z-direction; no need to turn the EUT",
            "The MTS-800 complies to all magnetic field requirements of relevant EMC and military standards",
          ],
        },
        {
          title: "Automatic testing capabilities",
          items: [
            "Full compliance with ISO 11452-8, MIL-STD-461 RS101, CS101, CS109, IEC/EN 55103-2, IEC/EN 61000-4-8, SAE J1113-2 and J1113-22",
            "The OEM standards Ford ES-XW7T-1A278-AC, GM W3097, PSA B21 7110 and Renault 36-00-808, DC-11224, DC 10614",
            "Emission measurements according to MIL-STD-461E/F RE101, CE101 and IEC/EN 55103-1",
          ],
        },
      ],
      tables: [
        {
          title: "MTS-800",
          head: ["", "Specification"],
          rows: [
            ["Generator — frequency range", "DC – 250 kHz"],
            ["Generator — signal", "Sine wave / triangular / square wave / DC"],
            ["Generator — amplitude", "0 to 10 VAC, −10 V to +10 VDC"],
            ["Amplifier — frequency range", "DC – 1 MHz"],
            ["Amplifier — current", "16 Arms"],
            ["Amplifier — voltage", "50 Vrms / 75 VDC"],
            ["Amplifier — distortion", "< 0.10 %\nDC – 100 kHz, load ≥ 4 Ω"],
            ["Analyzer — voltage input", "DC – 250 kHz\n1 MΩ / 50 Ω switchable"],
            ["Analyzer — current input", "DC – 250 kHz\nshunts 10 mΩ / 1 Ω / 100 Ω, max 20 A continuous"],
            ["AD converter", "16 bit, 1.0 MSPS"],
            ["Connection to computer", "USB"],
            ["Dimensions (W×H×D)", "449 × 177 × 580 mm"],
            ["Weight", "approx. 34 kg net"],
          ],
        },
        {
          title: "MIL-STD-461 methods the system covers",
          note: "The head office's own definition of each method, with the band it applies over.",
          head: ["Method", "Test", "Band"],
          rows: [
            ["CE101", "Conducted emission, power leads", "30 Hz – 10 kHz"],
            ["CS101", "Conducted susceptibility, power lead", "30 Hz – 150 kHz"],
            ["CS109", "Conducted susceptibility, structure current", "60 Hz – 100 kHz"],
            ["RE101", "Radiated emission, magnetic field", "30 Hz – 100 kHz"],
            ["RS101", "Radiated susceptibility, magnetic field", "30 Hz – 100 kHz"],
          ],
        },
      ],
    },
  },
  zh: {
    emission: {
      lead: [
        "FPA 前置放大器支持 CISPR 22 测量，带宽高达 2/6 GHz。增益高且噪声系数低，因此系统噪声实际上独立于电缆和接收器等其他组件。它在限值非常低的测量中特别有用，例如 CISPR 25，它直接耦合到天线。",
        "但是，不建议使用前置放大器来测量脉冲信号。宽带噪声在 EMC 测量中很常见，但没有宽带前置放大器适合宽带脉冲频谱测量。",
      ],
      figure: {
        src: "/test-systems/images/preamp-fpa.webp",
        w: 1200,
        h: 920,
        alt: "FPA前置放大器—金属外壳，两端带有N型法兰连接器，盖子上刻有铭牌",
        caption: "铭牌上列出的带宽和增益是配置发射测量的起点。",
      },
      groups: [],
    },
    conducted: {
      lead: [
        "CIT-100是一套完整的测试系统，用于传导射频抗扰度测试和BCI测试，符合IEC/EN 61000-4-6、ISO 11452-4、MIL-STD 461 CS114等标准。",
        "作为独立的测试系统，操作简单，性价比优良。我们还提供全系列的耦合/断开网络 (CDN)、EM 耦合钳、BCI 钳和电流钳。",
        "对于IEC/EN 61000-4-16共模、IEC/EN 61000-4-19差模传导抗扰度测试，使用带有DC~300kHz线性精密功率放大器的PSG-300。",
      ],
      figure: {
        src: "/test-systems/images/system-cit-100.webp",
        w: 1600,
        h: 609,
        alt: "19英寸机箱中的CIT-100，前面板上标有“传导抗扰度测试系统”",
        caption: "发生器、放大器、功率计和定向耦合器包含在一个箱子中，并且每一个都可以通过单独的连接器单独使用。",
      },
      groups: [],
    },
    radiated: {
      lead: [
        "Frankonia 的 RF 功率放大器设计有适合抗扰度测试应用的频率范围和功率输出 — 根据 IEC/EN 61000-4-3、ISO 11452-2 和 MIL-STD 461 RS 103 进行辐射抗扰度测试。",
        "辐射测试配置由三个组件组成：放大器、将输出传送到室中的天线以及报告所达到的电场的电场探头。这三个人都在这个分支。",
      ],
      figure: {
        src: "/test-systems/images/antenna-hax-6.webp",
        w: 1600,
        h: 1200,
        alt: "HAX-6 宽带喇叭天线安装在桅杆上，孔径朝前",
        caption: "500MHz~6GHz。随着频率增加，增益增加以补偿频带顶部的电缆损耗。",
      },
      groups: [],
    },
    magnetic: {
      lead: [
        "MTS-800是一种紧凑的测试系统，结合了宽带磁场产生和测量。自动执行需要生成或测量高磁场强度的汽车标准 EMC 测试。",
        "当与三轴亥姆霍兹线圈结合时，可以进行从直流到1kHz直至1000A/m的全自动抗扰度测试，并且可以产生高达250kHz的较低磁场强度。由于采用三轴配置，测试期间无需转动 EUT。",
        "测试和测量由自动设置大多数参数的程序控制。 MTS-800对应的标准的极限值已经包含在软件中，其他值可以由用户定义。测试结束时，自动生成报告。",
      ],
      figure: {
        src: "/test-systems/images/system-mts-800.webp",
        w: 1400,
        h: 782,
        alt: "MTS-800 前面板带有“磁性测试系统”符号 — 香蕉插孔、BNC 输入、电源开关",
        caption: "800W功率放大器、信号发生器、频谱分析仪三合一，可单独使用。",
      },
      groups: [
        {
          title: "主要特点",
          items: [
            "发射/抗扰度测量频率范围：DC 至 250 kHz",
            "800W精密功率放大器、信号发生器和频谱分析仪集成于一体",
            "所有内置仪器也可作为独立设备使用",
            "操作简单但功能强大的软件——可扩展以满足未来的标准修订",
            "用于操作和生成报告以及与外部仪器连接以进行 EUT 监控的标准软件",
            "使用三轴亥姆霍兹线圈进行全自动测试 — 无需转动 EUT，因为 x、y 和 z 方向的磁场由软件控制",
            "符合相关EMC和军用标准的所有磁场要求",
          ],
        },
        {
          title: "自动测试响应标准",
          items: [
            "完全符合ISO 11452-8、MIL-STD-461 RS101·CS101·CS109、IEC/EN 55103-2、IEC/EN 61000-4-8、SAE J1113-2·J1113-22",
            "OEM标准 福特 ES-XW7T-1A278-AC、通用 W3097、PSA B21 7110、雷诺 36-00-808·DC-11224·DC 10614",
            "MIL-STD-461E/F RE101·CE101、IEC/EN 55103-1发射测量",
          ],
        },
      ],
      tables: [
        {
          title: "MTS-800",
          head: ["", "规格"],
          rows: [
            ["Generator — frequency range", "DC – 250 kHz"],
            ["Generator — signal", "Sine wave / triangular / square wave / DC"],
            ["Generator — amplitude", "0 to 10 VAC, −10 V to +10 VDC"],
            ["Amplifier — frequency range", "DC – 1 MHz"],
            ["Amplifier — current", "16 Arms"],
            ["Amplifier — voltage", "50 Vrms / 75 VDC"],
            ["Amplifier — distortion", "< 0.10 %\nDC – 100 kHz, load ≥ 4 Ω"],
            ["Analyzer — voltage input", "DC – 250 kHz\n1 MΩ / 50 Ω switchable"],
            ["Analyzer — current input", "DC – 250 kHz\nshunts 10 mΩ / 1 Ω / 100 Ω, max 20 A continuous"],
            ["AD converter", "16 bit, 1.0 MSPS"],
            ["Connection to computer", "USB"],
            ["Dimensions (W×H×D)", "449 × 177 × 580 mm"],
            ["Weight", "approx. 34 kg net"],
          ],
        },
        {
          title: "对应MIL-STD-461测试方法",
          note: "各方法的定义及适用范围由本公司规定。",
          head: ["Method", "测试", "乐队"],
          rows: [
            ["CE101", "传导发射，电源线", "30 Hz – 10 kHz"],
            ["CS101", "导通电阻、电源线", "30 Hz – 150 kHz"],
            ["CS109", "导通电阻、结构电流", "60 Hz – 100 kHz"],
            ["RE101", "辐射发射、磁场", "30 Hz – 100 kHz"],
            ["RS101", "抗辐射、磁场", "30 Hz – 100 kHz"],
          ],
        },
      ],
    },
  },
};

/**
 * The six product families.
 *
 * Tables are the point of these pages. A reader arrives holding a band and a
 * field strength and leaves with a model number, and the specification tables
 * are the only thing on the site that closes that gap — so where the head
 * office prints a table, it is here, in its own row order and its own units.
 *
 * Where two models share a table's rows they share a table, as the head office
 * does for EFS-10/EFS-100. Where they do not, they get their own.
 */
export const productBody: Record<Lang, Partial<Record<TestProduct, PageBody>>> = {
  en: {
    emission: {
      lead: [
        "The ERX-6 combines the advantages of a traditional EMI-receiver with the ultra-fast FFT-technology (time domain). Furthermore it offers the full functionality of a real-time spectrum analyzer, which is very helpful to see immediate results of modifications on an EUT.",
        "By default it is equipped with hardware that significantly accelerates the measurement according to CISPR 16-1-1 Ed 3.1 and MIL-STD 461G; for standards that do not allow an FFT-based instrument it has a classic stepped scan mode, and single frequency points can be measured as at a final maximization. The delivery includes a control software that runs on the receiver's own touch screen, so no external PC is required.",
      ],
      /* The head office's own hero shot from the 2026 ERX-6 datasheet. It
         replaces the 2021 catalogue's LISN photograph, which was the only
         product plate that source had and stopped being the right one when the
         page became the receiver's — see docs/source/test-systems-assets.md. */
      figure: {
        src: "/test-systems/images/emission-erx-6.webp",
        w: 1400,
        h: 1003,
        alt: "The ERX-6 in three-quarter view: a grey bench case with a carrying bail, a red side panel lettered ERX-6, and an 8.4-inch touch screen showing a frequency scan with the FREQ. SCAN, TRANSDUCER, LIMIT LINES, CURVES, SETTINGS, MARKER, SAVE SETTINGS and RUN keys down its right edge",
        caption: "Quasi-peak over a whole band in seconds rather than hours — and the receiver runs the scan from its own screen, with no PC beside it.",
      },
      groups: [
        {
          title: "ERX-6 key features",
          items: [
            "Frequency range 10 Hz to 6 GHz (7 GHz as option)",
            "Traditional EMI-receiver mode acc. to CISPR 16-1",
            "Ultra-fast FFT-based (time domain) EMI-receiver mode acc. to CISPR 16-1-1, Ed. 3.1",
            "Real-time spectrum analyzer mode",
            "About 6000 times faster than traditional receivers",
            "Quasi-Peak, Peak, Average, RMS and RMS-AVG detectors",
            "Remote control of the receiver, antenna mast and turntable with the EM-LAB software",
            "Measurements acc. to CISPR, MIL, DO, VG and ETSI standards",
          ],
        },
      ],
      tables: [
        {
          title: "ERX-6",
          note: "Figures from the 2026 datasheet. The ERX-7 the head office announced in August 2026 is not published yet — see docs/source/test-systems-source.md §6.3.",
          head: ["", "Specification"],
          rows: [
            ["Frequency range", "10 Hz – 6 GHz\n7 GHz with option ERX-FE7"],
            ["Operating modes", "EMI receiver (superheterodyne), FFT-based receiver,\nspectrum analyzer"],
            ["Detectors", "Quasi-Peak, Average, RMS, RMS-Average,\nCISPR-AVG, CISPR-RMS"],
            ["Displayed average noise level", "−163 dBm over 30 – 1000 MHz (LNA off)\n−169 dBm (LNA on)"],
            ["Noise indication", "< −6 dBµV over 30 – 1000 MHz (LNA off)\n< −12 dBµV (LNA on)"],
            ["Scan speed, quasi-peak, dwell 1 s", "Band A 2 s, Band B 2 s, Band C/D 30 s\nBand E (1 – 6 GHz) 2 s at dwell 100 ms"],
            ["Pre-amplifier", "typ. 20 dB, noise figure typ. 3.5 dB"],
            ["IF bandwidths", "3 dB: 1 Hz – 30 MHz\n6 dB CISPR: 200 Hz, 9 kHz, 120 kHz, 1 MHz\n6 dB MIL/DO: 10 Hz, 100 Hz, 1 kHz, 100 kHz, 1 MHz"],
            ["Total measurement uncertainty", "0.5 dB, CW signal, S/N > 20 dB, 95 % confidence"],
            ["RF input", "N type, 50 Ω"],
            ["Attenuator", "0 – 50 dB in 10 dB steps"],
            ["Display", "8.4″ touchscreen, 800 × 600"],
            ["Interfaces", "Ethernet/LAN, USB, VGA, HDMI, audio; SCPI remote control"],
            ["Power supply", "+11 … +14 V DC; 230 V ± 20 % 50 Hz\nor 110 V ± 10 % 60 Hz, approx. 60 W"],
            ["Weight", "approx. 8 kg"],
          ],
        },
      ],
    },
    coupling: {
      lead: [
        "According to IEC/EN 61000-4-6 the preferred coupling and decoupling devices are the CDNs, for reasons of test reproducibility and protection of the AE. However, if they are not suitable or available, clamp injection should be used.",
        "CDN-AF type networks are required for coupling and decoupling disturbing signals to an unscreened cable with non-balanced lines; the CDN-T and CDN-RJ45 types do the same where those lines are balanced, and the CDN-CAN types where they are a bus. CDN M-types are used for all power supply lines, with types available for EUT voltages of up to 1000 V and EUT currents of up to 125 A. For coupling and decoupling on screened lines the CDN S-types are used, where the interference signal is in all cases coupled to the cable shield via a 100 Ω resistor — the RJ45-S, USB, HDMI and FireWire networks are S-types carrying the connector of that interface.",
        "The EM clamp establishes both capacitive and inductive coupling to the cable connected to the EUT. In contrast to the conventional current injection clamp it has a directivity above 10 dB over 10 MHz, so that a defined impedance between the common-mode point of the AE and the ground reference plane is no longer required — above 10 MHz the behaviour of the EM clamp is similar to that of a CDN.",
        "IEC/EN 61000-4-16 is a different test and takes a different network. Its coupling networks — the CNs — put common mode disturbance from 15 Hz to 150 kHz onto the line through a resistor and a capacitor rather than through a choke, and they are what the PSG-300 drives. The M-types come as separate AC and DC units, the T-types carry a bifilar-wound inductor so that a balanced communication line keeps its conversion loss, and the IT isolation transformers supply an EUT whose mains cannot be disturbed.",
      ],
      /* The 2026 CDN datasheet's own cover shot. Every model row below opens
         onto its own plates from the same five sheets — the enclosure and the
         simplified circuit — so this one is the family, not a type. */
      figure: {
        src: "/test-systems/images/coupling-cdn-hero.webp",
        w: 1400,
        h: 1035,
        alt: "A CDN-AF2-3 seen from above and to the side: a white enclosure with a red band and the type strip on its top face, an N socket for RF in, and a black end panel of yellow, blue and black safety sockets. A calibration adapter and its mounting bracket lie beside it.",
        caption: "One box per cable type, and a calibration adapter for every one of them.",
      },
      groups: [
        {
          // The list above is by type, not by order code. This group is where a
          // reader finds out that each type is a family: the head office prints
          // roughly eighty ordering variants of the M-types alone.
          title: "How a type becomes an order code",
          items: [
            "The connector — 2 mm safety sockets on the signal-line types, 4 mm MC safety sockets on the power supply types, a push-in spring terminal to 35 mm² above 32 A, or the interface's own socket on the RJ45, USB, HDMI, FireWire and CAN networks",
            "The bottom of the band — 150 kHz as standard, 10 kHz on the “-10K” types",
            "The current rating — 5 A on the AF types, 1.5 A on the screened ones, 32 A on the power supply networks and 125 A on the large build",
            "The voltage class — 500 V AC / 1000 V DC on the 32 A power supply networks, 1000 V AC / 1000 V DC on the 125 A ones",
            "A calibration adapter is available for every type, and a mounting bracket with a 50/150 Ω adapter and a 50 Ω termination for the adapters",
          ],
        },
        {
          title: "The clamp injection setup",
          items: [
            "The EM coupling clamp EMCL couples to the cable under test; less than 15 W of amplifier output is required to obtain a test level of 10 V",
            "A calibration set and individual calibration data are supplied with each EMCL — two mounting brackets with the 50/150 Ω transition, a 50 Ω BNC termination, a calibration adapter and a 4 mm brass rod for setting the test level",
            "A 6 dB attenuator sits between amplifier and clamp as standard. Between 10 kHz and 150 kHz the insertion loss is too high for that, and the CDN-EMCL-NW_10 matching network is used instead — it lifts the clamp's low impedance to a level the amplifier can drive, and 10 V at 80 % AM can then be reached without the attenuator",
            "The decoupling clamp ABCL-20 is a ferrite tube clamp fitted to every cable between EUT and AE except the cable under test, so that the test signal does not reach the rest of the setup",
            "The BCI probe injects RF current into a harness of up to 40 mm diameter for ISO 11452-4 and MIL-STD 461 CS 114, at secondary currents of 300 mA and more; a calibration jig to ISO 11452-4:2005 and IEC 61000-4-6 is available for its insertion loss measurement",
          ],
        },
        {
          title: "Coupling networks for IEC/EN 61000-4-16",
          items: [
            "One resistor-capacitor pair per wire — C = 1.0 µF and R = 100 × n Ω, where n is the number of wires — both matched to within 1 %",
            "Communication and similar lines take a “T” network instead: C = 4.7 µF, R = 200 Ω and a bifilar-wound inductor of 2 × 38 mH, so that the EUT's differential to common mode conversion loss is not significantly reduced",
            "M2 and M3 are separate units for DC tests and for AC tests. For direct current the 1.0 µF capacitors are short-circuited, and doing that by mistake while an alternating current is applied inevitably destroys the network",
            "Every connection not under test must be grounded, and an isolated BNC jumper plug is included for it",
            "On AC above 30 V or DC above 60 V: keep the network in tight contact with the ground reference plane, ground it before connecting any power line to the AE port, and never open that ground before the supply lines are off the port",
          ],
        },
      ],
      tables: [
        {
          title: "Coupling / decoupling networks, IEC/EN 61000-4-6",
          note: "One column per type family; the M column carries the 32 A and the 125 A builds together. The 10 kHz lower edge is the “-10K” variant of each type. Which variant of a family a setup needs is set by the connector, the current and the voltage class — see the list above. One row to confirm against a quotation: the datasheet's table gives the AF types 5 A, while the type plate in its own photograph of a CDN-AF8 reads “max 100 V 1 A”. The M and T columns agree with their plates.",
          head: ["", "CDN-AF", "CDN-M", "CDN-T", "CDN-S"],
          rows: [
            ["Frequency range (RF in)", "150 kHz – 230 MHz\n10 kHz – 230 MHz (-10K)", "150 kHz – 230 MHz\n10 kHz – 230 MHz (-10K)", "150 kHz – 230 MHz\n10 kHz – 230 MHz (-10K)", "10 kHz – 230 MHz"],
            ["Power rating (RF in)", "6 W continuous", "6 W continuous", "6 W continuous", "6 W continuous"],
            ["Decoupling attenuation (RF in → AE)", "20 dB (150 kHz – 230 MHz)\n40 dB (1 – 100 MHz)", "30 dB (150 kHz – 80 MHz)\n15 dB (80 – 230 MHz)", "20 dB (150 kHz – 230 MHz)", "> 35 dB (150 kHz – 80 MHz)\n> 30 dB (80 – 230 MHz)"],
            ["Insertion loss (RF in → EUT)", "10 dB ± 1 dB (150 kHz – 80 MHz)\n10 dB + 3 dB (150 kHz – 230 MHz)", "10 dB +2 / −1 dB (150 kHz – 80 MHz)\n10 dB + 5 dB (80 – 230 MHz)", "10 dB ± 1 dB\n(150 kHz – 230 MHz)", "10 dB ± 1 dB (150 kHz – 80 MHz)\n10 dB + 3 dB (80 – 230 MHz)"],
            ["Connector (RF in)", "N", "N (female)", "N", "N"],
            ["Operating voltage (EUT / AE)", "100 VAC / 150 VDC", "500 VAC / 1000 VDC\n1000 VAC / 1000 VDC (125 A)", "100 VAC / 150 VDC", "150 VAC / 200 VDC"],
            ["Rated current (AE → EUT)", "5 A", "32 A / 125 A", "0.5 A", "1.5 A"],
            ["Through attenuation (AE → EUT)", "< 1 dB (DC – 100 kHz)", "< 1 dB (DC – 100 kHz)", "< 1 dB (DC – 1 MHz)\n< 10 dB (1 – 100 MHz)", "< 1 dB (0 – 10 MHz)\n< 10 dB (10 – 500 MHz)"],
            ["Connector (EUT / AE)", "2 mm safety sockets", "4 mm MC safety sockets\npush-in spring terminal to 35 mm² (125 A)", "2 mm safety socket", "BNC, XLR or Sub-D,\n5 to 25 poles"],
            ["Dimensions (W × H × D)", "160 × 82 × 240 mm", "160 × 102 × 240 mm\n200 × 122 × 400 mm (125 A)", "160 × 82 × 240 mm", "160 × 82 × 240 mm"],
          ],
        },
        {
          title: "Data interfaces and bus lines",
          note: "The RJ45 and CAN networks couple to unscreened balanced lines; the last column is the screened S-type built with the connector of the interface it serves. The CDN-RJ45's rated current is the same case as the AF types above — the table says 1.5 A and the type plate in the datasheet's own photograph reads “max 100 V 0.5 A”. Confirm against the quotation.",
          head: ["", "CDN-RJ45", "CDN-CAN-L4 / L5", "CDN-RJ45-S / USB / HDMI / FireWire"],
          rows: [
            ["Frequency range (RF in)", "150 kHz – 230 MHz\n10 kHz – 230 MHz (-10K)", "150 kHz – 230 MHz", "10 kHz – 230 MHz"],
            ["Power rating (RF in)", "6 W continuous", "6 W continuous", "6 W continuous"],
            ["Decoupling attenuation (RF in → AE)", "20 dB (150 kHz – 230 MHz)", "> 35 dB on pin 2+7 (150 kHz – 230 MHz)\n> 35 dB on pin 3+9 to 200 MHz, > 25 dB above", "> 30 dB (RJ45-S, USB)\n50 dB / 25 dB (HDMI, above and below 80 MHz)"],
            ["Insertion loss (RF in → EUT)", "10 dB ± 1 dB (150 kHz – 80 MHz)\n10 dB + 3 dB (80 – 230 MHz)", "10 dB ± 1 dB\n(150 kHz – 230 MHz)", "10 dB ± 1 dB (150 kHz – 80 MHz)\n10 dB + 3 dB (80 – 230 MHz)"],
            ["Operating voltage", "100 VAC / 150 VDC", "50 V AC / 50 V DC", "100 VAC / 150 VDC"],
            ["Rated current (AE → EUT)", "1.5 A", "0.5 A on pin 2+7\n3 A on pin 3+9 (and +6)", "1.0 A (RJ45-S), 0.9 A (USB)\n0.5 A (HDMI, FireWire)"],
            ["Data rate", "to 1 Gbit/s", "—", "to 10 Gbit/s (RJ45-S)"],
            ["Connector (EUT / AE)", "RJ45 socket, 8-pin", "9-pin Sub-D socket", "Screened RJ45 8-pin, USB-A / B / C,\nscreened HDMI, 6-pin FireWire"],
            ["Dimensions (W × H × D)", "160 × 82 × 240 mm", "160 × 82 × 240 mm", "160 × 82 × 240 mm"],
          ],
        },
        {
          title: "EM clamps",
          note: "The EMCL columns are the 2026 datasheets. The ABCL-20 column is the older conducted immunity catalogue — the head office has not published a 2026 sheet for the decoupling clamp.",
          head: ["", "EMCL-20", "EMCL-35", "ABCL-20"],
          rows: [
            ["Frequency range", "10 kHz – 1 GHz", "10 kHz – 1 GHz", "100 kHz – 1000 MHz"],
            ["Nominal impedance", "50 Ω", "50 Ω", "—"],
            ["Connector", "N-type female", "N-type female", "—"],
            ["Max. input 0.01 (10 kHz) – 100 MHz", "100 W, 15 min", "100 W, 15 min", "—"],
            ["Max. input 100 – 230 MHz", "100 W, 5 min", "100 W, 5 min", "—"],
            ["Max. input 230 – 1000 MHz", "50 W, 3 min", "50 W, 3 min", "—"],
            ["Max. cable diameter", "< 20 mm", "< 35 mm", "< 20 mm"],
            ["Dimensions (L × W × H)", "640 × 120 × 135 mm", "665 × 160 × 135 mm", "632 × 120 × 80 mm"],
            ["Weight", "approx. 10.5 kg", "approx. 14 kg", "7 kg"],
          ],
        },
        {
          title: "BCI probe",
          note: "The 2026 datasheet opens the band at 4 kHz in its feature list and at 1 MHz in the specification table below; the table is followed here. That same table prints an inner diameter of 120 mm against an outer diameter of 40 mm, which is the wrong way round for a clamp that closes over a 40 mm harness — the harness figure above is the sheet's own description. Confirm both against the quotation.",
          head: ["", "Specification"],
          rows: [
            ["Frequency range", "1 MHz – 400 MHz"],
            ["Cable harness diameter", "up to 40 mm"],
            ["Secondary current", "300 mA and more"],
            ["Input connector", "Type N female"],
            ["Width", "40 mm"],
            ["Turns ratio", "1 : 1"],
            ["Primary inductance", "5.1 µH at 100 kHz"],
            ["Max. core temperature", "90 °C"],
            ["Ambient temperature", "0 to 40 °C"],
            ["Input power to a 90 °C core", "70 W (48.45 dBm) for 90 min\n100 W (50 dBm) for 45 min"],
            ["Fastening", "1 clip"],
          ],
        },
        {
          title: "Coupling networks, IEC/EN 61000-4-16",
          note: "The networks the PSG-300 drives. Test level is 50 V continuous and 300 V for one second at power frequency on every type. The M-types are ordered as an AC unit or a DC unit, and M3 and M5 are the builds for an EUT with a functional earth.",
          head: ["", "AF2 / AF4 / AF8", "M2 / M3 / M4 / M5", "T2 / T4 / T8", "RJ45"],
          rows: [
            ["Lines", "Unscreened, unbalanced", "Unscreened powerline conductors", "Unscreened, balanced", "Unscreened, balanced"],
            ["Frequency range", "DC / 15 Hz – 150 kHz", "15 Hz – 150 kHz (AC unit)\nDC (DC unit)", "DC / 15 Hz – 150 kHz", "DC / 15 Hz – 150 kHz"],
            ["EUT / AE port", "50 V / 0.5 A", "250 VAC / 32 A\n(50 VDC / 32 A)", "50 V / 0.5 A", "50 V / 0.5 A"],
            ["Connector (EUT / AE)", "Clamp terminal", "4 mm safety banana jack", "Clamp terminal", "Clamp terminal"],
            ["Differential to common mode\nconversion loss (15 Hz – 150 kHz)", "—", "—", "60 dB", "—"],
            ["Insulation", "—", "—", "> 1 kV (50/60 Hz)", "—"],
            ["For DC tests", "Capacitors short-circuited —\nrocker switch (AF2), rotary switch (AF4, AF8)", "Separate DC unit", "Rocker switch (T2)\nrotary switch (T4, T8)", "Rotary switch"],
          ],
        },
        {
          title: "Isolation transformers IT-6 / IT-16 / IT-20",
          note: "Three identical single-phase transformers in star configuration make a balanced three-phase supply. That needs a balanced load, because the neutral wire then carries no current, and for safety the neutral is not connected to the EUT.",
          head: ["", "IT-6", "IT-16", "IT-20"],
          rows: [
            ["Rating", "1380 VA", "3680 VA", "4600 VA"],
            ["Primary", "230 V", "230 V", "230 V"],
            ["Secondary", "230 V / 6 A", "230 V / 16 A", "230 V / 20 A"],
            ["Differential to common mode\nconversion loss (15 Hz – 150 kHz)", "60 dB", "60 dB", "60 dB"],
            ["Insulation", "> 1 kV (50/60 Hz)", "> 1 kV (50/60 Hz)", "> 1 kV (50/60 Hz)"],
            ["Dimensions (W × D × H)", "330 × 230 × 111 mm", "400 × 310 × 181 mm", "400 × 310 × 181 mm"],
            ["Weight", "approx. 18 kg", "approx. 34 kg", "approx. 45 kg"],
          ],
        },
      ],
    },
    amplifier: {
      lead: [
        "FRANKONIA offers RF-power amplifiers whose frequency range and output power have been tailored especially to the applications in immunity test systems: radiated immunity acc. to IEC/EN 61000-4-3, ISO 11452-2 and MIL-STD 461 RS 103; conducted immunity acc. to IEC/EN 61000-4-6; and BCI testing acc. to ISO 11452-4 and MIL-STD 461 CS 114.",
        "Two ranges sit side by side. The solid-state amplifiers reach from 10 kHz to 6 GHz at up to 12 kW; the WBA wideband series takes over from 500 MHz and runs to 40 GHz.",
        "Each row below carries the band and the typical output power of that model. The four bands to 1 GHz are the website's own matrix; the nine above them are the 2019 Amplifier Selection Book, which is where the head office publishes them.",
      ],
      groups: [
        {
          title: "Special features",
          items: [
            "Modular design",
            "Easy repair by change of modules",
            "Rapid remote diagnostics",
            "Output power of many models upgradable",
            "3 years standard warranty",
            "Upgrade of the output power over the operational frequency range is possible for most models",
          ],
        },
        {
          title: "Available versions",
          items: [
            "V-type, class A, 2U and 4U: −S standard · −SD with integrated directional coupler · −D with display, digital control and IEEE 488 GPIB · −DC as −D with directional coupler and display of instantaneous power",
            "V-type, 7U and 8U: −D and −DC only. 18U and larger are available as −DC only",
            "F-type, class A / AB: −S standard · −E with display, digital control, communication interface and circuit protection",
          ],
        },
      ],
      tables: [
        {
          title: "Solid-state range – band and output power",
          note: "From the head office's 2019 Amplifier Selection Book. The bands overlap because the ranges are built for different applications, not to partition the spectrum.",
          head: ["Band", "Output power"],
          rows: [
            ["10 kHz – 300 MHz", "25 W – 12000 W"],
            ["10 kHz – 400 MHz", "75 W – 2000 W"],
            ["10 kHz – 1000 MHz", "25 W – 800 W"],
            ["1 MHz – 1000 MHz", "4 W – 200 W"],
            ["20 MHz – 1 GHz", "20 W – 600 W"],
            ["80 MHz – 1 GHz", "100 W – 3500 W"],
            ["0,8 – 2 GHz", "7 W – 500 W"],
            ["0,8 – 3,2 GHz", "10 W – 1000 W"],
            ["0,8 – 4 GHz", "18 W – 800 W"],
            ["2 – 4 GHz", "15 W – 200 W"],
            ["2 – 6 GHz", "9 W – 180 W"],
            ["0,7 – 6 GHz", "15 W – 200 W"],
            ["0,8 – 6 GHz", "40 W / 15 W – 220 W / 100 W"],
          ],
        },
      ],
    },
    antenna: {
      lead: [
        "The ALX-4000E is an especially optimized version for emission measurements. It offers lower antenna factors and improved VSWR. Additionally it can be used for immunity tests which require an input power of less than 100 W cw (200 W intermitt.). The ALX-8000E has an extended frequency range up to 8 GHz. All antennas are supplied with antenna factors for 3.0 m and 10.0 m measuring distance (1.0 m on request).",
        "The MAX series is a stacked logarithmic-periodic broadband antenna for radiated immunity tests and emission measurements in the microwave frequency range, its structure made of laser-cut brass and protected by a low loss plastic cover. It is especially suitable for immunity testing acc. to IEC 61000-4-3 because of its good field uniformity.",
        "The horn antennas HAX offer a very low SWR in their nominal frequency range and a very broad bandwidth. The gain increases with frequency up to approx. 18 dBi, which helps to compensate cable losses. The HAX series is suitable for both transmission and receiving applications.",
      ],
      figure: {
        src: "/test-systems/images/antenna-alx-4000.webp",
        w: 1600,
        h: 1200,
        alt: "The ALX-4000E on a mast: a bow-tie element at the back and a tapering log-periodic boom of red-tipped elements in front",
        caption: "One antenna over 25 MHz to 4 GHz — the biconical element carries the bottom of the band, the log-periodic boom the rest.",
      },
      figureRow: [
        {
          src: "/test-systems/images/antenna-max-9.webp",
          w: 1200,
          h: 900,
          alt: "The MAX-9 under its red plastic protection cover, mounted on a tube",
          caption: "MAX-9 — 300 W at 1 GHz through a laser-cut brass structure.",
        },
        {
          src: "/test-systems/images/antenna-hax-18.webp",
          w: 1200,
          h: 900,
          alt: "The HAX-18, a silver pyramidal horn on a mounting tube",
          caption: "HAX-18 — 800 MHz to 18 GHz from a 245 mm aperture.",
        },
        {
          src: "/test-systems/images/antenna-hax-40.webp",
          w: 1200,
          h: 900,
          alt: "The HAX-40, a small horn with a waveguide transition and an SMA-compatible connector",
          caption: "HAX-40 — 14 to 40 GHz, and it weighs 0.3 kg.",
        },
      ],
      groups: [],
      tables: [
        {
          title: "Broadband antennas",
          head: ["", "ALX-4000E", "ALX-8000E"],
          rows: [
            ["Frequency range", "25 MHz to 4 GHz", "25 MHz to 8 GHz"],
            ["Max. input power", "200 W (intermtt.)\n100 W (cont.)", "200 W (intermtt.)\n100 W (cont.)"],
            ["Nominal impedance", "50 Ω", "50 Ω"],
            ["Connector", "type N female", "type N female"],
            ["Isotropic gain (LP-Section)", "6.4 ± 1.2 dBi", "6.4 ± 1.2 dBi"],
            ["Antenna factor", "7 … 34 dB/m", "7 … 43 dB/m"],
            ["Standing wave ratio SWR typ.", "< 1.5", "< 1.5 (f > 150 MHz)"],
            ["Front to back ratio", "20 dB (f > 150 MHz)", "20 dB (f > 150 MHz)"],
            ["Cross polarization", "> 20 dB (30 MHz … 1 GHz)", "> 20 dB (30 MHz … 1 GHz)"],
            ["3 dB beamwidth typ. (E-plane)", "45° – 65° (f > 150 MHz)\n≈ 78° (f < 150 MHz)", "45° – 65° (f > 150 MHz)\n≈ 78° (f < 150 MHz)"],
            ["3 dB beamwidth typ. (H-plane)", "90° – 120° (f > 150 MHz)", "90° – 120° (f > 150 MHz)"],
            ["Dimensions (W × L × D)", "1500 × 910 (1240) × 620 mm", "1500 × 920 (1253) × 620 mm"],
            ["Weight", "3.1 kg", "3.1 kg"],
            ["Fixation (indexing ring)", "22 mm tube", "22 mm tube"],
          ],
        },
        {
          title: "Stacked log.-periodic antennas",
          note: "The MAX-9-7/16 is the MAX-9 with a 7/16 connector: 0,6 – 7,5 GHz, isotropic gain typ. 10.3 dBi, max. input power 950 W at 1 GHz and 380 W at 5 GHz. Everything else is as the MAX-9 column.",
          head: ["", "MAX-9", "MAX-18"],
          rows: [
            ["Frequency range", "600 MHz – 10.5 GHz", "700 MHz – 20 GHz"],
            ["Max input power", "300 W (f = 1 GHz)\n150 W (f = 6 GHz)", "50 W"],
            ["Nominal impedance", "50 Ω", "50 Ω"],
            ["Connection", "type N female", "type N female"],
            ["Isotropic gain", "typ. 10.3 dBi ± 1.5 dB", "typ. 8.6 dBi ± 1 dB"],
            ["Antenna factor", "18 … 41 dB/m", "20 … 49 dB/m"],
            ["SWR typical", "< 1.5 (f < 7 GHz)", "< 2"],
            ["Front to back ratio", "> 25 dB typ.", "> 25 dB typ."],
            ["Cross polarization rejection", "> 30 dB typ.", "> 28 dB typ."],
            ["Half-power beamwidth (E-plane)", "46° ± 10°", "58°"],
            ["Half-power beamwidth (H-plane)", "48° ± 10°", "60°"],
            ["Dimensions (W × L × D)", "460 (+215) × 270 × 270 mm", "490 × 270 × 270 mm"],
            ["Weight", "3.7 kg", "1.2 kg"],
          ],
        },
        {
          title: "Broadband horn antennas",
          head: ["", "HAX-6", "HAX-18", "HAX-40"],
          rows: [
            ["Frequency range", "500 MHz – 6 GHz", "800 MHz – 18 GHz", "14 GHz – 40 GHz"],
            ["Max input power", "limited only by N-connector", "—", "10 W (cont.)\n25 W peak"],
            ["Connection", "type N female", "N-female", "SMA-compatible, female"],
            ["Isotropic gain", "6 … 18 dBi", "6 … 18 dBi", "15 … 20 dBi"],
            ["Antenna factor", "19 … 29 dB/m", "24 … 50 dB/m", "38 … 45 dB/m"],
            ["SWR typical", "< 2", "≈ 1.5", "≈ 2"],
            ["Front to back ratio", "—", "> 25 dB (f > 1.3 GHz)", "> 30 dB"],
            ["Cross polarization rejection", "—", "> 25 dB (1 … 18 GHz)", "> 25 dB"],
            ["Dimensions (W × L × D)", "424 × 314 × 820 mm", "245 × 195 (408) × 142 mm", "75 × 86 × 60 mm"],
            ["Weight", "4.1 kg", "1.3 kg", "0.3 kg"],
            ["Fixation", "Ø 22 mm mounting tube", "Ø 22 mm mounting tube", "3/8″, 1/4″"],
          ],
        },
        {
          title: "Active rod and loop antennas",
          head: ["", "SAX-10", "LAX-10"],
          rows: [
            ["Frequency range", "9 kHz – 30 MHz", "9 kHz – 30 MHz"],
            ["Antenna factor", "+10 dB/m ± 1.5 dB", "20 dB/m for fictitious E-field\n−31.5 dB/Ω for H-field"],
            ["Connector, female", "BNC, 50 Ω nom.", "BNC, 50 Ω"],
            ["Measuring range", "up to 1 V/m at 1 MHz, 1 dB compression\ninput attenuator optional for higher field strength", "QP detector, 9 kHz IF: 30 – 130 dBμV/m\nAV detector, 200 Hz IF: 8 – 130 dBμV/m"],
            ["Loop diameter", "—", "0.5 m"],
            ["Power supply", "9.6 V / 1100 mAh NiMH", "12 V NiMH 1.9 Ah"],
            ["Operation time", "typ. at least 50 hours", "typ. 12 hours"],
            ["Dimensions", "rod 1.0 m including thread connection\namplifier top plate 220 × 120 mm", "520 × 585 × 120 mm"],
            ["Weight", "rod approx. 0.2 kg\namplifier approx. 0.7 kg", "1.9 kg"],
            ["Threads for tripods", "1/4″, 3/8″", "1/4″, 3/8″"],
          ],
        },
      ],
    },
    efs: {
      lead: [
        "The Frankonia EFS field strength meters especially have been designed for field strength measurements / field homogeneity measurements during radiated immunity tests according to IEC/EN 61000-4-3 / -20. But it could also be used to measure the radiation exposure of the environment, for example at workplaces or flats.",
        "The EFS is an isotropic miniature E-field sensor to ensure that the E-field will not be influenced by the size of the sensor itself. It even does not need any metering unit, because of its direct fibre optic output which allows direct connection of the sensor to the USB-interface of the control PC or laptop.",
        "EFS-18 is the new generation: an isotropic electric field sensor based on triaxial diode dipoles, designed for the characterization of the electric field in TEM and GTEM cells, in anechoic chambers, and for monitoring areas and critical points for electromagnetic safety. The supplied EMCViewer software shows the isotropic value, the single axis components and the amplitude/time response, and can manage up to eight sensors at once; the battery runs for more than 50 hours, and for four more after a twenty-minute charge.",
      ],
      figure: {
        src: "/test-systems/images/efs-probe.webp",
        w: 360,
        h: 595,
        alt: "An EFS probe on a slim white tripod, the sensor body no thicker than a finger",
        caption: "17 mm across and 25 g. The probe is that small so that it does not disturb the field it is measuring.",
      },
      groups: [
        {
          title: "Special features",
          items: [
            "PC connection via fibre optic link",
            "Excellent isotropy (0.3 dB typical)",
            "Frequency range: 10 kHz to 26.5 GHz",
            "Field strength measurements from 0.14 V/m to 500 V/m",
            "Up to 100 hours operating time before recharging",
            "EFS-18: triaxial isotropic sensor, 1 MHz to 18 GHz, 20 ms sampling rate, up to eight sensors connected simultaneously",
          ],
        },
      ],
      tables: [
        {
          title: "EFS-10 and EFS-100",
          head: ["", "EFS-10", "EFS-100"],
          rows: [
            ["Frequency range", "10 kHz – 9.25 GHz", "100 kHz – 9.25 GHz"],
            ["Dynamic range (single range)", "0.5 – 500 V/m (60 dB)", "0.14 – 140 V/m (60 dB)"],
            ["Flatness, frequency correction on", "0.05 – 7500 MHz: 0.4 dB", "0.3 – 7500 MHz: 0.4 dB"],
            ["Overload", "1000 V/m", "300 V/m"],
            ["Resolution", "0.01 V/m", "0.01 V/m"],
            ["Sensors", "6 monopoles", "6 monopoles"],
            ["Isotropicity", "0.5 dB (0.3 dB typical) at 50 MHz", "0.5 dB (0.3 dB typical) at 50 MHz"],
            ["Sampling rate", "22 S/s to 0.03 S/s\ndepending on filter setting", "22 S/s to 0.03 S/s\ndepending on filter setting"],
            ["Internal battery", "3 V / 5 mAh rechargeable Li-Mn", "3 V / 5 mAh rechargeable Li-Mn"],
            ["Operation time", "100 hours at 0.4 S/s, 28 Hz filter", "100 hours at 0.4 S/s, 28 Hz filter"],
            ["Communication", "bidirectional fibre optic link", "bidirectional fibre optic link"],
            ["Fibre optic length", "10.0 m standard, 20 / 40.0 m optional", "10.0 m standard, 20 / 40.0 m optional"],
            ["Dimensions", "53 mm overall, body 17 mm diameter", "53 mm overall, body 17 mm diameter"],
            ["Weight", "25 g including 1.0 m pigtail", "25 g including 1.0 m pigtail"],
          ],
        },
        {
          title: "EFS-300 and EFS-500",
          note: "The head office publishes two different dynamic ranges for the EFS-300 — 1.5 – 1500 V/m on the product page and 0.17 – 170 V/m on the overview page. The product page is followed here; confirm against the quotation.",
          head: ["", "EFS-300", "EFS-500"],
          rows: [
            ["Frequency range", "300 kHz – 18 GHz", "300 kHz – 26.5 GHz"],
            ["Dynamic range (single range)", "1.5 – 1500 V/m (60 dB)", "0.4 – 800 V/m (66 dB)"],
            ["Flatness, frequency correction on", "0.05 – 7500 MHz: 0.4 dB", "0.3 – 26500 MHz: 0.4 dB"],
            ["Overload", "350 V/m", "1600 V/m"],
            ["Resolution", "0.01 V/m", "0.01 V/m"],
            ["Sensors", "6 monopoles", "6 monopoles"],
            ["Sampling rate", "22 S/s to 0.03 S/s", "22 S/s to 0.03 S/s"],
            ["Operation time", "100 hours at 0.4 S/s, 28 Hz filter", "100 hours at 0.4 S/s, 28 Hz filter"],
            ["Dimensions", "53 mm overall, body 17 mm diameter", "53 mm overall, body 17 mm diameter"],
            ["Weight", "25 g including 1.0 m pigtail", "25 g including 1.0 m pigtail"],
          ],
        },
        {
          title: "EFS-18",
          head: ["", "Specification"],
          rows: [
            ["Sensor type", "Triaxial isotropic, diode dipole"],
            ["Data read", "X, Y, Z and ISO"],
            ["Bandwidth", "1 MHz – 18 GHz"],
            ["Amplitude frequency response", "± 1.5 dB (10 MHz – 1 GHz)\n± 3 dB (1 – 16 GHz)"],
            ["Sensitivity", "0.8 V/m"],
            ["Dynamic range", "0.8 – 340 V/m (52 dB)"],
            ["Linearity at 100 MHz", "2 – 300 V/m, 0.5 dB"],
            ["Isotropy at 100 MHz", "0.5 dB"],
            ["Temperature stability", "0.5 dB over the operating temperature range"],
            ["Max. sampling rate", "50 sps"],
            ["Operating temperature", "5 – 45 °C, 5 – 90 % humidity without condensation"],
            ["Dimensions / weight", "length 145 mm, ø 32 – 60 mm / 100 g"],
            ["Recommended calibration interval", "24 months"],
          ],
        },
      ],
    },
    preamp: {
      lead: [
        "The FPA-x is a general purpose broadband pre-amplifier with high gain and low internal noise. The wide frequency range up to 2/6 GHz allows measurements acc. CISPR 22. Due to the high gain and the low noise figure the system noise is nearly independent of the other components including cable and receiver. These features make the FPA-x very useful for the measurement of very low limits, as required for CISPR 25. In this case it will be connected directly to the antenna.",
        "The amplifiers FPA-2 and FPA-6A are ESD protected to prevent defects by unintentional electrostatic discharge. The FPA-6B offers a frequency range from 9 kHz to 6 GHz; for technical reasons it cannot be ESD-protected and special care is necessary. Pre-amplifiers are generally ESD-sensitive devices, therefore it is very important to discharge coaxial cables before being connected.",
      ],
      figure: {
        src: "/test-systems/images/preamp-fpa.webp",
        w: 1200,
        h: 920,
        alt: "An FPA pre-amplifier: a machined metal housing with N-type flange connectors at each end and an engraved type plate on the lid",
        caption: "An aluminium enclosure and N-type flanges. The 12 V supply is deliberately a linear one — a switching supply raises the interference level the amplifier is there to measure.",
      },
      groups: [],
      tables: [
        {
          title: "FPA-2, FPA-6A and FPA-6B",
          note: "The FPA-18, FPA-26 and FPA-40 continue the range to 40 GHz; their figures are in the model list above.",
          head: ["", "FPA-2", "FPA-6A", "FPA-6B"],
          rows: [
            ["Frequency range", "9 kHz – 2 GHz", "10 MHz – 6 GHz", "9 kHz – 6 GHz"],
            ["Noise figure", "2.5 dB (1.0 GHz)", "2.5 dB (1.0 GHz)", "2.5 dB (1.0 GHz)"],
            ["Gain", "+ 30 dB", "+ 28 dB", "+ 28 dB"],
            ["Amplitude flatness", "< ± 3 dB", "< ± 3 dB", "< ± 3 dB"],
            ["1 dB compression point at input", "≥ −20 dBm (87 dBμV)", "≥ −18 dBm (89 dBμV)", "> 100 dBμV"],
            ["Impedance", "50 Ω", "50 Ω", "50 Ω"],
            ["VSWR input / output", "< 2:1", "< 2:1", "< 2:1"],
            ["Power supply", "+ 12 V (± 2 V)", "+ 12 V (± 2 V)", "+ 12 V (± 2 V)"],
            ["Current consumption", "< 120 mA", "< 130 mA", "< 120 mA"],
          ],
        },
      ],
    },
    meter: {
      lead: [
        "The PMS 1084 is in the standard version a 2-channel RF-Power Meter for the frequency range from 100 kHz up to 6 GHz or from 10 kHz to 500 MHz (PMS 1084 B). The measuring range reaches from −60 dBm to +20 dBm. It is possible to upgrade the PMS 1084 up to max. 4 measuring channels at any time. Hence the PMS 1084 is very good suitable for the automated measurement of forward and reverse power in immunity test systems acc. to IEC/EN 61000-4-3 / -6.",
        "The RSU RF-Relay Switching Unit is applicable for all fields of RF- and EMC measurements to switch, manually or remote controlled, from one input to 2 or 3 outputs. Typical applications in measuring systems are changeover switching between different amplifiers, antennas or power meters. This does also prevent circuit faults due to wrong cabling.",
      ],
      figure: {
        src: "/test-systems/images/meter-pms-1084.webp",
        w: 1600,
        h: 249,
        alt: "The PMS 1084 as a 1U rack unit, front panel lettered “RF Power Meter”",
        caption: "One rack unit high, two channels as standard and four at most — the count a forward-and-reverse measurement on two amplifiers needs.",
      },
      groups: [],
      tables: [
        {
          title: "PMS 1084 and PMS 1084 B",
          head: ["", "PMS 1084", "PMS 1084 B"],
          rows: [
            ["Number of channels", "2 standard, up to 4 optional", "2 standard, up to 4 optional"],
            ["Frequency range", "100 kHz – 6 GHz", "10 kHz – 500 MHz"],
            ["Measuring range", "−60 dBm to +20 dBm (10 kHz ≤ f ≤ 4 GHz)\n−45 dBm to +20 dBm (4 GHz < f ≤ 6 GHz)", "−60 dBm to +20 dBm"],
            ["Accuracy", "± 1 dB (0.5 dB typical)", "± 1 dB (0.5 dB typical)"],
            ["Resolution", "0.1 dB", "0.1 dB"],
            ["Integration time", "0.5 – 200 ms (firmware)", "0.5 – 200 ms (firmware)"],
            ["Max. input level", "+27 dBm (= 500 mW)", "+27 dBm (= 500 mW)"],
            ["VSWR", "1:1.15 to 2 GHz\n1:1.25 over 2 – 4 GHz\n1:1.35 over 4 – 6 GHz", "1:1.15"],
            ["Interface (PC)", "USB, RS232", "USB, RS232"],
            ["Input", "N-type female connector", "N-type female connector"],
            ["Dimensions (D × W × H)", "172 × 482.6 × 44.3 mm", "172 × 482.6 × 44.3 mm"],
            ["Weight", "approx. 2.5 kg", "approx. 2.5 kg"],
          ],
        },
        {
          title: "RSU relay switching unit",
          note: "DC to 12.4 GHz as standard, extendable to 18 or 40 GHz. Up to four relays of 2 or 3 outputs each; test level 50 V continuous, 300 V for 1 s.",
          head: ["", "DC … 1 GHz", "1 … 5 GHz", "5 … 10 GHz", "10 … 12.4 GHz"],
          rows: [
            ["VSWR", "< 1.04", "< 1.14", "< 1.3", "< 1.5"],
            ["Isolation", "> 90 dB", "> 80 dB", "> 70 dB", "> 70 dB"],
            ["Insertion loss", "< 0.05 dB", "< 0.1 dB", "< 0.2 dB", "< 0.3 dB"],
            ["Max. power input", "< 1.00 kW", "< 0.44 kW", "< 0.31 kW", "< 0.28 kW"],
          ],
        },
      ],
    },
    system: {
      lead: [
        "The CIT-100 is a complete test system for conducted RF-immunity testing and BCI-testing acc. to IEC/EN 61000-4-6, ISO 11452-4, MIL-STD 461, CS114 and similar standards. The system consists of a built-in signal generator (4 kHz – 1.2 GHz), an RF-power amplifier (25 / 75 / 200 W), a 3-channel RF-power-meter, a directional coupler and the control software.",
        "The CIT-1000 is the larger of the two. The generator, directional coupler and RF voltmeter reach 1.2 GHz, so it can drive a radiated immunity test to IEC/EN 61000-4-3 as well with an external power amplifier connected; the frequency extension for MIL-STD 461 reaches down to 4 kHz through the external CIT-4K and its 250 W amplifier; and it runs stand-alone from an integrated touch-screen PC.",
        "The ECU-6 is a central EMC test and control unit, which combines in just one compact box many major test components like signal generator, power meter, directional couplers and relay switching unit, which are needed for EMC tests. That reduces the cabling work and possible cabling mistakes to a minimum. It is the unit a radiated immunity system to IEC 61000-4-3, ISO 11452-2 and MIL-STD 461 RS103 is built around: it switches automatically between up to three external amplifiers, up to three antennas or coupling devices, and up to two receivers or spectrum analyzers.",
        "The PSG-300 is an ultra-wideband linear power amplifier developed for signal frequencies from DC to 300 kHz, for immunity tests to conducted common mode disturbances acc. to IEC/EN 61000-4-16 and differential mode disturbances acc. to IEC/EN 61000-4-19. A built-in waveform generator provides sine, square and triangle signals, which are amplified internally by the power stage; the output stage delivers 5 A and 260 W, or 16 A and 800 W in the PSG-300A.",
        "The MTS-800 is a space-saving test system for generating and analyzing magnetic fields from DC to 250 kHz. Thanks to the integrated 800 W power amplifier, the high field strengths required by many military and automotive standards are reached without additional effort — MIL-STD-461 CE101, CS101, CS109, RE101 and RS101, and ISO 11452-8, up to 1000 A/m with the optional triaxial Helmholtz coil.",
      ],
      figure: {
        src: "/test-systems/images/system-cit-100.webp",
        w: 1600,
        h: 609,
        alt: "The CIT-100 in a 19-inch case, front panel lettered “Conducted Immunity Test System”",
        caption: "The whole 61000-4-6 chain in one case — and every instrument in it still reachable on its own connector.",
      },
      figureRow: [
        {
          src: "/test-systems/images/system-ecu-6.webp",
          w: 1032,
          h: 519,
          alt: "The ECU-6 in a 4U rack case, front panel lettered “EMC CONTROL UNIT”, with an interlock button, a yellow OLED readout and a power switch",
          caption: "ECU-6 — the generator, the power meter and the switching between three amplifiers, in the box the cables would otherwise run between.",
        },
        {
          src: "/test-systems/images/system-psg-300.webp",
          w: 1400,
          h: 531,
          alt: "The PSG-300 front panel, lettered “POWER SIGNAL GENERATOR DC … 300 kHz”, with an earth terminal, the OUT 50 Ω socket and the red and black OUT terminals, the PROTECTION and READY lamps, the POWER SUPPLY HIGH and AMPLIFIER ON buttons, a round ON / OFF button and a silver bow handle at each end",
          caption: "PSG-300 — 260 W, and 800 W in the PSG-300A.",
        },
        {
          src: "/test-systems/images/system-mts-800.webp",
          w: 1400,
          h: 782,
          alt: "The MTS-800 front panel, lettered “Magnetic Test System”, with banana jacks, BNC inputs and a mains switch",
          caption: "MTS-800 — magnetic fields to 1000 A/m, generated and measured by the same unit.",
        },
      ],
      groups: [
        {
          title: "CIT-100",
          items: [
            "Conducted RF immunity tests acc. to IEC/EN 61000-4-6 and BCI tests acc. to ISO 11452-4 and MIL-STD 461 CS 114",
            "Signal generator, RF-power amplifier, RF-power meter and directional coupler in one 19″-case",
            "All built in instruments can also be used separately, via existing input / output connector",
            "Stand-alone operation possible with optional available netbook",
            "Most important parameters are shown on an integrated display",
            "Automatic EUT-monitoring, and the complete range of CDNs available",
          ],
        },
        {
          title: "CIT-1000",
          items: [
            "Everything the CIT-100 does, with integrated amplifier modules of 25, 75 and 200 W",
            "Generator, directional coupler and RF voltmeter to 1.2 GHz — radiated immunity to IEC/EN 61000-4-3 with an external amplifier",
            "Frequency extension to 4 kHz for MIL-STD 461, through the external CIT-4K with its 250 W amplifier",
            "Stand-alone from an integrated touch-screen PC, no external computer needed",
            "Temperature measuring input for control and display of the BCI clamp temperature",
          ],
        },
        // The head office's August 2026 follow-up: "for the CIT please also list
        // CDNs/EMCL and BCI probes", and "for the PSG please list CNs". Both
        // lists are here rather than only on the coupling page, because a reader
        // arrives at this page holding a standard and a system and leaves
        // needing to know what puts the disturbance on the cable. The figures
        // stay on the coupling page — this is the list, not the specification.
        {
          title: "CDNs, EM clamps and BCI probes for the CIT",
          items: [
            "CDN-AF for unscreened unbalanced lines, CDN-T and CDN-RJ45 where those lines are balanced, CDN-CAN for a bus — 150 kHz to 230 MHz, and from 10 kHz on the “-10K” types",
            "CDN-M for power supply lines, to 1000 V and 125 A",
            "CDN-S for screened lines, coupled to the shield through 100 Ω, and the RJ45-S, USB, HDMI and FireWire networks built on the same principle",
            "The EM coupling clamps EMCL-20 and EMCL-35 for cables up to 20 and 35 mm, with the ABCL-20 decoupling clamp on every other cable in the setup",
            "The BCI probe for ISO 11452-4 and MIL-STD 461 CS 114 — a harness up to 40 mm, secondary currents of 300 mA and more — and the MP50 monitoring probe",
            "Every specification, and how a type becomes an order code, is on the Coupling & Decoupling page",
          ],
        },
        {
          title: "ECU-6",
          items: [
            "Radiated immunity tests according to IEC 61000-4-3, ISO 11452-2 and MIL-STD 461 RS103",
            "Conducted immunity tests according to IEC/EN 61000-4-6, 10 kHz – 230 MHz",
            "BCI-testing according to ISO 11452-4 and MIL-STD 461 CS114",
            "Automatic switching between up to three external power amplifiers and the connected coupling units or antennas",
            "Automatic switching between up to two EMI receivers or spectrum analyzers and three different antennas",
            "Easy integration into any control software by SCPI commands, and an integrated interlock safety system",
          ],
        },
        {
          title: "PSG-300 and PSG-300A",
          items: [
            "Immunity testing according to IEC/EN 61000-4-16, IEC/EN 61000-4-19, IEC/EN 61543 and IEC 60255",
            "Frequency range from DC to 300 kHz, available as 5 A / 260 W (PSG-300) or 16 A / 800 W (PSG-300A)",
            "Function generator for DC, sine, triangle and square signals; external signals can be fed in separately",
            "Simulation of DC and AC supply lines, control of piezo actors, generation of magnetic fields with Helmholtz or similar coils",
            "Option: control input for an external voltage source, suitable for short tests up to 300 V",
            "Software-based remote control over USB, with an interface command set for automated test systems",
          ],
        },
        {
          title: "Coupling networks for the PSG-300",
          items: [
            "CN AF2, AF4 and AF8 for unscreened unbalanced lines, DC and 15 Hz to 150 kHz",
            "CN M2 to M5 for power supply lines, ordered as an AC unit or a DC unit — 250 VAC / 32 A, and M3 and M5 for an EUT with a functional earth",
            "CN T2, T4 and T8 for balanced communication lines, differential to common mode conversion loss 60 dB",
            "CN RJ45 for a balanced eight-pole data interface",
            "Isolation transformers IT-6, IT-16 and IT-20 — 1380, 3680 and 4600 VA — where the EUT's own supply cannot be disturbed",
            "Test level 50 V continuous and 300 V for one second at power frequency, on every type. Specifications are on the Coupling & Decoupling page",
          ],
        },
        {
          title: "MTS-800",
          items: [
            "Magnetic field measurements and tests from DC to 250 kHz, field strengths up to 1000 A/m to 1000 Hz",
            "Signal generator, 800 W power amplifier and 16-bit spectrum analyzer at 1 MS/s in one unit — each usable stand-alone",
            "ISO 11452-8 and MIL-STD-461 CE101, CS101, CS109, RE101 and RS101",
            "SAE J1113-2 and J1113-22, Ford ES-XW7T-1A278-AC, PSA B21 7110, Renault 36-00-808, DC-11224 and DC-10614",
            "Fully automated testing with the optional triaxial Helmholtz coil — no need to turn the EUT during a test",
            "Windows application software with preconfigured parameters and limit values, and room for custom test sequences",
          ],
        },
      ],
      tables: [
        {
          title: "CIT-100",
          note: "The 2026 datasheet's own amplifier table prints four variants — CIT-100/25, /75 MIL, /75 and /200 — while the paragraph beside it still reads “highest output power can be 75 W”. The table is followed here; confirm the module against the quotation.",
          head: ["", "Specification"],
          rows: [
            ["RF generator — outputs", "2 × SMA, one usable at a time"],
            ["RF generator — frequency range", "4 kHz to 1.2 GHz"],
            ["RF generator — frequency resolution", "1 Hz"],
            ["RF generator — output level", "0 to −63 dBm, resolution 0.1 dB"],
            ["RF generator — harmonics / spurious", "< 30 dBc / < 45 dBc"],
            ["LF generator (modulation)", "1 Hz to 100 kHz, sine / square / triangular, 0 … 1 V"],
            ["Amplitude modulation", "internal 0 – 100 %, resolution 1 %"],
            ["Internal RF power amplifier", "25 W, 75 W and 200 W modules\n25 W: 100 kHz – 250 MHz; 75 W MIL: (4) 10 kHz – 250 (400) MHz;\n75 W and 200 W: 100 kHz – 400 MHz"],
            ["RF voltmeter 1 (test level)", "4 kHz to 1.2 GHz, −40 to +30 dBm"],
            ["RF voltmeter 2 + 3 (forward, reverse)", "4 kHz to 1.2 GHz, −40 to +33 dBm\nplus directional coupler typ. 40 dB"],
            ["EUT monitor input", "0 – 10 V, resolution 2.5 mV, 100 kΩ"],
            ["Interfaces", "USB 2.0, LAN 100 Mbit, GPIB optional"],
          ],
        },
        {
          title: "ECU-6",
          note: "The 2026 datasheet writes the unit ECU-6.2 and the part list ECU-6; the power meter, the directional coupler and the antenna outputs are ordered as options against it, so the coupling attenuation of a given system depends on which coupler is fitted.",
          head: ["", "Specification"],
          rows: [
            ["Signal generator — frequency range", "8 kHz – 6.2 GHz, resolution 0.001 Hz"],
            ["Signal generator — output level", "−65 dBm to +13 dBm, accuracy ± 1 dBm"],
            ["Signal generator — outputs", "50 Ω SMA female, relay switched 1:3"],
            ["Amplitude modulation", "10 Hz – 20 kHz, depth 0 – 95 %, sine or triangle"],
            ["Pulse modulation", "on/off ratio 70 dB, pulse width 1 µs to 10 s"],
            ["RF power meter", "max. 7 channels\nLF module 10 kHz – 500 MHz, RF module 100 kHz – 6 GHz\n−60 … +20 dBm (10 kHz – 4 GHz), −45 … +20 dBm (4 – 6 GHz)"],
            ["Relay switching unit — max. power", "2000 W (8 kHz – 100 MHz), 1000 W (100 – 600 MHz),\n600 W (600 MHz – 1 GHz), 400 W (1 – 3 GHz), 300 W (3 – 6 GHz)"],
            ["EUT monitor input", "2 × 0 – 10 V, resolution 2.5 mV, < 1 kΩ, BNC female"],
            ["Temperature measurement", "PT1000, 5 – 100 °C, SMB female"],
            ["Remote control", "USB-B, LAN 10/100 Mbit (TCP/IP), GPIB — SCPI"],
            ["Dimensions (W×H×D) / weight", "449 × 177 × 580 mm / 18 kg"],
          ],
        },
        {
          title: "PSG-300 and PSG-300A",
          note: "The optional external power source is a control input for a voltage source of up to 300 V for short tests. Isolating transformers IT-06, IT-16 and IT-20 (1380 VA to 4600 VA) are available to EN 61558.",
          head: ["", "PSG-300", "PSG-300A"],
          rows: [
            ["Frequency range", "DC – 1 MHz (small signal −3 dB)", "DC – 1 MHz (small signal −3 dB)"],
            ["Performance range", "DC – 300 kHz", "DC – 300 kHz"],
            ["Slew rate", "100 V/µs", "100 V/µs"],
            ["Voltage amplification", "10 ± 0.1 % (± 0.01 % / °C)", "10 ± 0.1 % (± 0.01 % / °C)"],
            ["Output voltage", "50 Vrms / ± 75 Vpeak", "50 Vrms / ± 75 Vpeak"],
            ["Output current", "5 Arms / ± 7.5 Apeak", "16 Arms / ± 24 Apeak"],
            ["Output power", "260 W", "800 W"],
            ["Distortion", "< 0.10 %\nDC – 100 kHz, load ≥ 4 Ω", "< 0.10 %\nDC – 100 kHz, load ≥ 4 Ω"],
            ["Generator frequency range", "DC, 0.05 Hz – 300 kHz\nresolution 0.05 Hz", "DC, 0.05 Hz – 300 kHz\nresolution 0.05 Hz"],
            ["Waveform", "sine, square, triangular", "sine, square, triangular"],
            ["Remote control", "USB", "USB"],
            ["Dimensions (W × H × D)", "449 × 133 × 436 mm (3 RU)", "449 × 177 × 585.5 mm (4 RU)"],
            ["Weight", "approx. 24 kg", "approx. 32 kg"],
          ],
        },
        {
          title: "MTS-800",
          note: "The full specification, the MIL-STD-461 method table and the accessories are on the magnetic field test page.",
          head: ["", "Specification"],
          rows: [
            ["Generator — frequency range", "DC – 250 kHz"],
            ["Generator — signal", "Sine / triangular / square / DC, 0 – 10 V AC, −10 to +10 V DC"],
            ["Amplifier — frequency range", "DC – 1 MHz"],
            ["Amplifier — output", "16 Arms, 50 Vrms / 75 Vdc, distortion < 0.10 %"],
            ["Analyzer — voltage input", "DC – 250 kHz, 1 MΩ / 50 Ω switchable"],
            ["Analyzer — current input", "DC – 250 kHz, shunts 10 mΩ / 1 Ω / 100 Ω, max. 20 A continuous"],
            ["AD converter", "16 bit, 1.0 MSPS"],
            ["Connection to PC", "USB; EUT control over 9-pin Sub-D, RS-232"],
            ["Dimensions (W×H×D) / weight", "449 × 177 × 580 mm / approx. 34 kg net"],
          ],
        },
      ],
    },
  },
  zh: {
    emission: {
      lead: [
        "ERX-6是一款结合了传统EMI接收器与超快速FFT（时域）技术优点的仪器。此外，它还配备了实时频谱分析仪的所有功能，因此您可以现场检查EUT修改的结果。",
        "它标配硬件，可显着加速 CISPR 16-1-1 Ed 3.1 和 MIL-STD 461G 测量。对于不允许基于 FFT 的仪器的规格，您可以使用传统的步进扫描模式并仅测量单个频率点，例如最终最大化。无需外部 PC，因为它包含在接收器自己的触摸屏上运行的控制软件。",
      ],
      figure: {
        src: "/test-systems/images/emission-erx-6.webp",
        w: 1400,
        h: 1003,
        alt: "从某个角度看 ERX-6 — 带把手的灰色工作台箱，红色侧面板上写有 ERX-6，右侧边缘是频率扫描屏幕和 FREQ。 8.4英寸触摸屏，带有可视扫描·传感器·限制线·曲线·设置·标记·保存设置·运行键",
        caption: "整个频段的准峰值测量需要几秒钟，而不是几小时。此外，您可以直接在接收器屏幕上运行它，而无需在旁边放置 PC。",
      },
      groups: [
        {
          title: "ERX-6主要特点",
          items: [
            "频率范围 10 Hz 至 6 GHz（选项 7 GHz）",
            "符合 CISPR 16-1 的传统 EMI 接收器模式",
            "CISPR 16-1-1 Ed。符合 3.1 的超快速 FFT（时域）接收器模式",
            "实时频谱分析仪模式",
            "测量速度比传统接收器快约6,000倍",
            "准峰值·峰值·平均·RMS·RMS-AVG检波器",
            "使用EM-LAB软件远程控制接收机、天线杆和转盘",
            "支持CISPR、MIL、DO、VG、ETSI标准测量",
          ],
        },
      ],
      tables: [
        {
          title: "ERX-6",
          note: "这是2026年的数据表图。总部在2026-08宣布的ERX-7尚未发布——参见docs/source/test-systems-source.md §6.3。",
          head: ["", "规格"],
          rows: [
            ["Frequency range", "10 Hz – 6 GHz\n7 GHz with option ERX-FE7"],
            ["Operating modes", "EMI receiver (superheterodyne), FFT-based receiver,\nspectrum analyzer"],
            ["Detectors", "Quasi-Peak, Average, RMS, RMS-Average,\nCISPR-AVG, CISPR-RMS"],
            ["Displayed average noise level", "−163 dBm over 30 – 1000 MHz (LNA off)\n−169 dBm (LNA on)"],
            ["Noise indication", "< −6 dBµV over 30 – 1000 MHz (LNA off)\n< −12 dBµV (LNA on)"],
            ["Scan speed, quasi-peak, dwell 1 s", "Band A 2 s, Band B 2 s, Band C/D 30 s\nBand E (1 – 6 GHz) 2 s at dwell 100 ms"],
            ["Pre-amplifier", "typ. 20 dB, noise figure typ. 3.5 dB"],
            ["IF bandwidths", "3 dB: 1 Hz – 30 MHz\n6 dB CISPR: 200 Hz, 9 kHz, 120 kHz, 1 MHz\n6 dB MIL/DO: 10 Hz, 100 Hz, 1 kHz, 100 kHz, 1 MHz"],
            ["Total measurement uncertainty", "0.5 dB, CW signal, S/N > 20 dB, 95 % confidence"],
            ["RF input", "N type, 50 Ω"],
            ["Attenuator", "0 – 50 dB in 10 dB steps"],
            ["Display", "8.4″ touchscreen, 800 × 600"],
            ["Interfaces", "Ethernet/LAN, USB, VGA, HDMI, audio; SCPI remote control"],
            ["Power supply", "+11 … +14 V DC; 230 V ± 20 % 50 Hz\nor 110 V ± 10 % 60 Hz, approx. 60 W"],
            ["Weight", "approx. 8 kg"],
          ],
        },
      ],
    },
    coupling: {
      lead: [
        "由于测试再现性和辅助设备（AE）保护，IEC/EN 61000-4-6优先考虑CDN作为耦合/去耦设备。当 CDN 不适合或不可用时，使用钳位注入。",
        "CDN-AF系列用于对非平衡线路非屏蔽电缆的干扰信号进行合并和分离。如果同一条电缆线路是平衡的，则使用CDN-T和CDN-RJ45，如果是总线，则使用CDN-CAN。 CDN-M系列适用于所有电源线，有型号支持高达1000V的EUT电压和高达125A的电流。CDN-S系列用于屏蔽线，在这种情况下，干扰信号总是通过100Ω电阻耦合到电缆屏蔽层——RJ45-S·USB·HDMI·FireWire网络属于带有接口连接器的S系列。",
        "EM钳位同时对连接到EUT的电缆产生电容和电感耦合。与典型的电流注入钳位（在 10 MHz 以上方向性超过 10 dB）不同，AE 的共模点和参考地之间不需要定义阻抗 — 在 10 MHz 以上，它的行为类似于 CDN。",
        "IEC/EN 61000-4-16是不同的测试并使用不同的电路。该标准的耦合网络 — CN — 通过电阻器和电容器而不是扼流圈将 15 Hz 至 150 kHz 共模干扰加载到线路中，PSG-300 对此进行驱动。 M系列具有交流和直流独立单元，T系列具有双柱绕线电感，以防止平衡通信线路的转换损耗恶化，而不会干扰系统的EUT由IT隔离变压器供电。",
      ],
      figure: {
        src: "/test-systems/images/coupling-cdn-hero.webp",
        w: 1400,
        h: 1035,
        alt: "CDN-AF2-3 从斜上方观察 — 白色外壳，顶部带有红色带和类型标记，用于射频输入的 N 插座，黑色横截面，带有黄色、蓝色和黑色安全插座。正畸适配器和安装支架放置在其旁边。",
        caption: "每种电缆类型一个盒子，以及所有电缆类型的校准适配器。",
      },
      groups: [
        {
          // 위 모델 목록을 주문 코드가 아니라 타입 단위로 실은 이유가 여기 있다.
          // 본사는 M 계열만 해도 주문 변형을 여든 가지 가까이 인쇄한다.
          title: "输入订购代码",
          items: [
            "连接器 — 用于信号线的 2 mm 安全插座、用于电源线的 4 mm MC 安全插座、咬合面积达 35 mm²、电流超过 32 A 的推入式弹簧端子、用于 RJ45·USB·HDMI·FireWire·CAN 相应接口的连接器",
            "频段下限 — 标准为 150 kHz，“-10K”型号为 10 kHz",
            "额定电流 — AF系列5A，屏蔽系列1.5A，电源线32A，大型号125A",
            "额定电压 — 32 A 电源线为 500 V AC/1000 V DC，125 A 型号为 1000 V AC/1000 V DC。",
            "所有类型都有校准适配器，适配器安装支架包括50/150 Ω适配器和50 Ω终端",
          ],
        },
        {
          title: "夹具注入配置",
          items: [
            "EM耦合夹EMCL连接到被测电缆。要达到 10 V 测试电平，需要小于 15 W 的放大器输出。",
            "EMCL 提供校准套件和单独的校准数据作为标准 — 两个带 50/150 Ω 转换的安装支架、50 Ω BNC 端子、校准适配器和用于设置测试级别的 4 mm 黄铜杆。",
            "放大器和钳位器之间标准安装有 6 dB 衰减器。然而，10 kHz 至 150 kHz 范围内的插入损耗太大，无法以这种方式使用，而是使用匹配网络 CDN-EMCL-NW_10 — 它将钳位器的低阻抗提高到放大器可以驱动的水平，因此可以在 80% AM 下进行高达 10 V 的测试，无需衰减器。",
            "隔离夹 ABCL-20 是一种铁氧体管夹，可夹住 EUT-AE 之间除被测电缆之外的所有电缆，防止测试信号泄漏到配置的其余部分。",
            "BCI 探头将射频电流注入直径最大为 40 mm 的线束（次级电流 > 300 mA），符合 ISO 11452-4 和 MIL-STD 461 CS 114 标准。还可提供符合 ISO 11452-4:2005/IEC 61000-4-6 标准的插入损耗测量校准夹具。",
          ],
        },
        {
          title: "IEC/EN 61000-4-16 的耦合网络 CN",
          items: [
            "每条线一对电阻和电容 — C = 1.0 µF，R = 100 × n Ω（n 是线数）。将两个值设置在 1% 误差范围内。",
            "通信线和等效线使用“T”网络 — C = 4.7 µF，R = 200 Ω，双柱绕组 2 × 38 mH 电感。这是为了确保 EUT 的差模到共模转换损耗不会显着恶化。",
            "M2和M3是用于直流测试和交流测试的独立单元。在直流测试中，1.0μF的电容器被短路，但如果在施加交流电时错误地短路，电路网络将不可避免地被损坏。",
            "所有不进行测试的连接都必须接地，并且包括用于此目的的绝缘 BNC 跳线插头。",
            "对于超过 30 V AC 和 60 V DC 的电源线 — 保持电路网络靠近参考地平面，在将电源线连接到 AE 端口之前先将其接地，并且在将电源线与端口断开之前切勿断开接地。",
          ],
        },
      ],
      tables: [
        {
          title: "耦合/去耦网络CDN – IEC/EN 61000-4-6",
          note: "这是一个按类型系列的立柱，M立柱有32A型号和125A型号。 10 kHz 的下限是每种类型的“-10K”变体。连接器、电流和电压额定值决定了需要一个系列中的哪个变体 - 请参阅上面的列表。检查报价单上的一行 — 数据表将 AF 系列列为 5 A，但同一张图片中 CDN-AF8 上的铭牌上写着“最大 100 V 1 A”。 M 和 T 列与铭牌相对应。",
          head: ["", "CDN-AF", "CDN-M", "CDN-T", "CDN-S"],
          rows: [
            ["Frequency range (RF in)", "150 kHz – 230 MHz\n10 kHz – 230 MHz (-10K)", "150 kHz – 230 MHz\n10 kHz – 230 MHz (-10K)", "150 kHz – 230 MHz\n10 kHz – 230 MHz (-10K)", "10 kHz – 230 MHz"],
            ["Power rating (RF in)", "6 W continuous", "6 W continuous", "6 W continuous", "6 W continuous"],
            ["Decoupling attenuation (RF in → AE)", "20 dB (150 kHz – 230 MHz)\n40 dB (1 – 100 MHz)", "30 dB (150 kHz – 80 MHz)\n15 dB (80 – 230 MHz)", "20 dB (150 kHz – 230 MHz)", "> 35 dB (150 kHz – 80 MHz)\n> 30 dB (80 – 230 MHz)"],
            ["Insertion loss (RF in → EUT)", "10 dB ± 1 dB (150 kHz – 80 MHz)\n10 dB + 3 dB (150 kHz – 230 MHz)", "10 dB +2 / −1 dB (150 kHz – 80 MHz)\n10 dB + 5 dB (80 – 230 MHz)", "10 dB ± 1 dB\n(150 kHz – 230 MHz)", "10 dB ± 1 dB (150 kHz – 80 MHz)\n10 dB + 3 dB (80 – 230 MHz)"],
            ["Connector (RF in)", "N", "N (female)", "N", "N"],
            ["Operating voltage (EUT / AE)", "100 VAC / 150 VDC", "500 VAC / 1000 VDC\n1000 VAC / 1000 VDC (125 A)", "100 VAC / 150 VDC", "150 VAC / 200 VDC"],
            ["Rated current (AE → EUT)", "5 A", "32 A / 125 A", "0.5 A", "1.5 A"],
            ["Through attenuation (AE → EUT)", "< 1 dB (DC – 100 kHz)", "< 1 dB (DC – 100 kHz)", "< 1 dB (DC – 1 MHz)\n< 10 dB (1 – 100 MHz)", "< 1 dB (0 – 10 MHz)\n< 10 dB (10 – 500 MHz)"],
            ["Connector (EUT / AE)", "2 mm safety sockets", "4 mm MC safety sockets\npush-in spring terminal to 35 mm² (125 A)", "2 mm safety socket", "BNC, XLR or Sub-D,\n5 to 25 poles"],
            ["Dimensions (W × H × D)", "160 × 82 × 240 mm", "160 × 102 × 240 mm\n200 × 122 × 400 mm (125 A)", "160 × 82 × 240 mm", "160 × 82 × 240 mm"],
          ],
        },
        {
          title: "数据接口及总线",
          note: "RJ45和CAN组合成非屏蔽平衡线。最后一排是屏蔽S系列，带有相应接口的连接器。 CDN-RJ45 的额定电流与上述 AF 系列相同 — 表中为 1.5 A，同一数据表照片中铭牌上的“最大 100 V 0.5 A”。请对照报价单进行核对。",
          head: ["", "CDN-RJ45", "CDN-CAN-L4 / L5", "CDN-RJ45-S / USB / HDMI / FireWire"],
          rows: [
            ["Frequency range (RF in)", "150 kHz – 230 MHz\n10 kHz – 230 MHz (-10K)", "150 kHz – 230 MHz", "10 kHz – 230 MHz"],
            ["Power rating (RF in)", "6 W continuous", "6 W continuous", "6 W continuous"],
            ["Decoupling attenuation (RF in → AE)", "20 dB (150 kHz – 230 MHz)", "> 35 dB on pin 2+7 (150 kHz – 230 MHz)\n> 35 dB on pin 3+9 to 200 MHz, > 25 dB above", "> 30 dB (RJ45-S, USB)\n50 dB / 25 dB (HDMI, above and below 80 MHz)"],
            ["Insertion loss (RF in → EUT)", "10 dB ± 1 dB (150 kHz – 80 MHz)\n10 dB + 3 dB (80 – 230 MHz)", "10 dB ± 1 dB\n(150 kHz – 230 MHz)", "10 dB ± 1 dB (150 kHz – 80 MHz)\n10 dB + 3 dB (80 – 230 MHz)"],
            ["Operating voltage", "100 VAC / 150 VDC", "50 V AC / 50 V DC", "100 VAC / 150 VDC"],
            ["Rated current (AE → EUT)", "1.5 A", "0.5 A on pin 2+7\n3 A on pin 3+9 (and +6)", "1.0 A (RJ45-S), 0.9 A (USB)\n0.5 A (HDMI, FireWire)"],
            ["Data rate", "to 1 Gbit/s", "—", "to 10 Gbit/s (RJ45-S)"],
            ["Connector (EUT / AE)", "RJ45 socket, 8-pin", "9-pin Sub-D socket", "Screened RJ45 8-pin, USB-A / B / C,\nscreened HDMI, 6-pin FireWire"],
            ["Dimensions (W × H × D)", "160 × 82 × 240 mm", "160 × 82 × 240 mm", "160 × 82 × 240 mm"],
          ],
        },
        {
          title: "电磁钳",
          note: "EMCL 两栏为 2026 年数据表。 ABCL-20 色谱柱来自旧的导通目录 - 隔离夹不在 2026 规格表中。",
          head: ["", "EMCL-20", "EMCL-35", "ABCL-20"],
          rows: [
            ["Frequency range", "10 kHz – 1 GHz", "10 kHz – 1 GHz", "100 kHz – 1000 MHz"],
            ["Nominal impedance", "50 Ω", "50 Ω", "—"],
            ["Connector", "N-type female", "N-type female", "—"],
            ["Max. input 0.01 (10 kHz) – 100 MHz", "100 W, 15 min", "100 W, 15 min", "—"],
            ["Max. input 100 – 230 MHz", "100 W, 5 min", "100 W, 5 min", "—"],
            ["Max. input 230 – 1000 MHz", "50 W, 3 min", "50 W, 3 min", "—"],
            ["Max. cable diameter", "< 20 mm", "< 35 mm", "< 20 mm"],
            ["Dimensions (L × W × H)", "640 × 120 × 135 mm", "665 × 160 × 135 mm", "632 × 120 × 80 mm"],
            ["Weight", "approx. 10.5 kg", "approx. 14 kg", "7 kg"],
          ],
        },
        {
          title: "BCI探头",
          note: "2026 数据表在功能列表中将频带下限列为 4 kHz，在下面的规格表中将频带下限列为 1 MHz。在这里我遵循了规格表。同一张表列出的内径为 120 毫米，外径为 40 毫米，但对于固定直径为 40 毫米线束的夹具，这些值是相反的 - 上面的线束值来自同一张纸上的主要文本描述。请对照报价检查两者。",
          head: ["", "规格"],
          rows: [
            ["Frequency range", "1 MHz – 400 MHz"],
            ["Cable harness diameter", "up to 40 mm"],
            ["Secondary current", "300 mA and more"],
            ["Input connector", "Type N female"],
            ["Width", "40 mm"],
            ["Turns ratio", "1 : 1"],
            ["Primary inductance", "5.1 µH at 100 kHz"],
            ["Max. core temperature", "90 °C"],
            ["Ambient temperature", "0 to 40 °C"],
            ["Input power to a 90 °C core", "70 W (48.45 dBm) for 90 min\n100 W (50 dBm) for 45 min"],
            ["Fastening", "1 clip"],
          ],
        },
        {
          title: "组合网络 CN – IEC/EN 61000-4-16",
          note: "这是PSG-300驱动的电路网络。所有型号的测试电平均为连续 50 V，施加电源频率 1 秒时为 300 V。 M系列订购时分为交流单元和直流单元，M3和M5为带功能接地的EUT型号。",
          head: ["", "AF2 / AF4 / AF8", "M2 / M3 / M4 / M5", "T2 / T4 / T8", "RJ45"],
          rows: [
            ["Lines", "Unscreened, unbalanced", "Unscreened powerline conductors", "Unscreened, balanced", "Unscreened, balanced"],
            ["Frequency range", "DC / 15 Hz – 150 kHz", "15 Hz – 150 kHz (AC unit)\nDC (DC unit)", "DC / 15 Hz – 150 kHz", "DC / 15 Hz – 150 kHz"],
            ["EUT / AE port", "50 V / 0.5 A", "250 VAC / 32 A\n(50 VDC / 32 A)", "50 V / 0.5 A", "50 V / 0.5 A"],
            ["Connector (EUT / AE)", "Clamp terminal", "4 mm safety banana jack", "Clamp terminal", "Clamp terminal"],
            ["Differential to common mode\nconversion loss (15 Hz – 150 kHz)", "—", "—", "60 dB", "—"],
            ["Insulation", "—", "—", "> 1 kV (50/60 Hz)", "—"],
            ["For DC tests", "Capacitors short-circuited —\nrocker switch (AF2), rotary switch (AF4, AF8)", "Separate DC unit", "Rocker switch (T2)\nrotary switch (T4, T8)", "Rotary switch"],
          ],
        },
        {
          title: "隔离变压器IT-6 / IT-16 / IT-20",
          note: "如果将相同的单相变压器连接成星形，就会得到平衡的三相电源。此时，必须平衡负载，使中性线上没有电流流过。出于安全原因，中性线不连接到 EUT。",
          head: ["", "IT-6", "IT-16", "IT-20"],
          rows: [
            ["Rating", "1380 VA", "3680 VA", "4600 VA"],
            ["Primary", "230 V", "230 V", "230 V"],
            ["Secondary", "230 V / 6 A", "230 V / 16 A", "230 V / 20 A"],
            ["Differential to common mode\nconversion loss (15 Hz – 150 kHz)", "60 dB", "60 dB", "60 dB"],
            ["Insulation", "> 1 kV (50/60 Hz)", "> 1 kV (50/60 Hz)", "> 1 kV (50/60 Hz)"],
            ["Dimensions (W × D × H)", "330 × 230 × 111 mm", "400 × 310 × 181 mm", "400 × 310 × 181 mm"],
            ["Weight", "approx. 18 kg", "approx. 34 kg", "approx. 45 kg"],
          ],
        },
      ],
    },
    amplifier: {
      lead: [
        "Frankonia 的射频功率放大器的设计频率范围和功率输出适合抗扰度测试应用 — IEC/EN 61000-4-3、ISO 11452-2、MIL-STD 461 RS 103 辐射抗扰度、IEC/EN 61000-4-6 传导抗扰度、ISO 11452-4 和 MIL-STD 461 CS。 114 BCI 测试是主题。",
        "两个系列并列。固态放大器可在 10 kHz 至 6 GHz 范围内产生高达 12 kW 的功率，而 WBA 宽带系列则从 500 MHz 开始，覆盖高达 40 GHz 的频率。",
        "下面每行写有该型号的频段和额定输出。 1 GHz以下的四个频段是我们网站上的型号矩阵，上面的九个频段是2019年放大器选型手册，这是我们列出型号的唯一材料。",
      ],
      groups: [
        {
          title: "主要特点",
          items: [
            "模块结构",
            "只能通过更换模块来修复",
            "远程诊断快捷",
            "多种机型可输出升级",
            "基本保修3年",
            "大多数型号的输出可在整个工作频率范围内升级",
          ],
        },
        {
          title: "可选版本",
          items: [
            "V型，A级，2U·4U：−S基本型·−SD内置定向耦合器·−D显示·数字控制·IEEE 488 GPIB·−DC在−D基础上增加定向耦合器和瞬时功率显示",
            "V型，7U·8U：仅限-D和-DC。对于 18U 或以上，仅限 -DC",
            "F型，A/AB级：−S基本型·−E 显示/数字控制/通讯接口/电路保护",
          ],
        },
      ],
      tables: [
        {
          title: "固体器件系列-频带与输出",
          note: "基于我公司2019年放大器选型手册。频段重叠的原因是它们是为不同的目的而设计的，并且频谱没有划分。",
          head: ["乐队", "输出"],
          rows: [
            ["10 kHz – 300 MHz", "25 W – 12000 W"],
            ["10 kHz – 400 MHz", "75 W – 2000 W"],
            ["10 kHz – 1000 MHz", "25 W – 800 W"],
            ["1 MHz – 1000 MHz", "4 W – 200 W"],
            ["20 MHz – 1 GHz", "20 W – 600 W"],
            ["80 MHz – 1 GHz", "100 W – 3500 W"],
            ["0,8 – 2 GHz", "7 W – 500 W"],
            ["0,8 – 3,2 GHz", "10 W – 1000 W"],
            ["0,8 – 4 GHz", "18 W – 800 W"],
            ["2 – 4 GHz", "15 W – 200 W"],
            ["2 – 6 GHz", "9 W – 180 W"],
            ["0,7 – 6 GHz", "15 W – 200 W"],
            ["0,8 – 6 GHz", "40 W / 15 W – 220 W / 100 W"],
          ],
        },
      ],
    },
    antenna: {
      lead: [
        "ALX-4000E 是针对发射测量而优化的型号，具有低天线系数和改进的 VSWR。如果小于100W CW（间歇200W），也可用于抗扰度测试。 ALX-8000E是频段扩展到8 GHz的型号。所有天线均配备用于测量 3.0 m 和 10.0 m 距离（根据要求可提供 1.0 m）的天线系数。",
        "MAX系列是堆叠式对数周期宽带天线，用于微波频段的辐射抗扰度测试和发射测量。激光切割的黄铜结构由低损耗塑料盖保护。其良好的场均匀性使其特别适合 IEC 61000-4-3 抗扰度测试。",
        "HAX喇叭天线在额定频段具有极低的驻波比和宽的带宽。随着频率升高，增益增加到大约 18 dBi 以补偿电缆损耗。它既可以用于发送，也可以用于接收。",
      ],
      figure: {
        src: "/test-systems/images/antenna-alx-4000.webp",
        w: 1600,
        h: 1200,
        alt: "ALX-4000E 安装在桅杆上 — 后部的双锥元件和向前延伸的对数周期吊杆",
        caption: "25 MHz 至 4 GHz，使用一根天线。带的下部由双锥元件负责，其余部分由对数周期动臂负责。",
      },
      figureRow: [
        {
          src: "/test-systems/images/antenna-max-9.webp",
          w: 1200,
          h: 900,
          alt: "带有红色塑料保护盖的 MAX-9，如图所示安装在安装管上",
          caption: "MAX-9 — 300 W @ 1 GHz，采用激光切割黄铜结构。",
        },
        {
          src: "/test-systems/images/antenna-hax-18.webp",
          w: 1200,
          h: 900,
          alt: "安装在安装管上的银色金字塔喇叭天线HAX-18",
          caption: "HAX-18 — 800 MHz 至 18 GHz，孔径 245 mm。",
        },
        {
          src: "/test-systems/images/antenna-hax-40.webp",
          w: 1200,
          h: 900,
          alt: "带有波导过渡部分和 SMA 兼容连接器的紧凑型喇叭天线 HAX-40",
          caption: "HAX-40 — 14~40 GHz，重量 0.3 kg。",
        },
      ],
      groups: [],
      tables: [
        {
          title: "宽带天线",
          head: ["", "ALX-4000E", "ALX-8000E"],
          rows: [
            ["Frequency range", "25 MHz to 4 GHz", "25 MHz to 8 GHz"],
            ["Max. input power", "200 W (intermtt.)\n100 W (cont.)", "200 W (intermtt.)\n100 W (cont.)"],
            ["Nominal impedance", "50 Ω", "50 Ω"],
            ["Connector", "type N female", "type N female"],
            ["Isotropic gain (LP-Section)", "6.4 ± 1.2 dBi", "6.4 ± 1.2 dBi"],
            ["Antenna factor", "7 … 34 dB/m", "7 … 43 dB/m"],
            ["Standing wave ratio SWR typ.", "< 1.5", "< 1.5 (f > 150 MHz)"],
            ["Front to back ratio", "20 dB (f > 150 MHz)", "20 dB (f > 150 MHz)"],
            ["Cross polarization", "> 20 dB (30 MHz … 1 GHz)", "> 20 dB (30 MHz … 1 GHz)"],
            ["3 dB beamwidth typ. (E-plane)", "45° – 65° (f > 150 MHz)\n≈ 78° (f < 150 MHz)", "45° – 65° (f > 150 MHz)\n≈ 78° (f < 150 MHz)"],
            ["3 dB beamwidth typ. (H-plane)", "90° – 120° (f > 150 MHz)", "90° – 120° (f > 150 MHz)"],
            ["Dimensions (W × L × D)", "1500 × 910 (1240) × 620 mm", "1500 × 920 (1253) × 620 mm"],
            ["Weight", "3.1 kg", "3.1 kg"],
            ["Fixation (indexing ring)", "22 mm tube", "22 mm tube"],
          ],
        },
        {
          title: "叠层对数周期天线",
          note: "MAX-9-7/16 是 MAX-9 的 7/16 连接器规格 — 0,6~7,5 GHz，各向同性增益典型值。 10.3 dBi，最大输入 1 GHz 时 950 W·5 GHz 时最大输入 380 W。其余内容按照 MAX-9 列。",
          head: ["", "MAX-9", "MAX-18"],
          rows: [
            ["Frequency range", "600 MHz – 10.5 GHz", "700 MHz – 20 GHz"],
            ["Max input power", "300 W (f = 1 GHz)\n150 W (f = 6 GHz)", "50 W"],
            ["Nominal impedance", "50 Ω", "50 Ω"],
            ["Connection", "type N female", "type N female"],
            ["Isotropic gain", "typ. 10.3 dBi ± 1.5 dB", "typ. 8.6 dBi ± 1 dB"],
            ["Antenna factor", "18 … 41 dB/m", "20 … 49 dB/m"],
            ["SWR typical", "< 1.5 (f < 7 GHz)", "< 2"],
            ["Front to back ratio", "> 25 dB typ.", "> 25 dB typ."],
            ["Cross polarization rejection", "> 30 dB typ.", "> 28 dB typ."],
            ["Half-power beamwidth (E-plane)", "46° ± 10°", "58°"],
            ["Half-power beamwidth (H-plane)", "48° ± 10°", "60°"],
            ["Dimensions (W × L × D)", "460 (+215) × 270 × 270 mm", "490 × 270 × 270 mm"],
            ["Weight", "3.7 kg", "1.2 kg"],
          ],
        },
        {
          title: "宽带喇叭天线",
          head: ["", "HAX-6", "HAX-18", "HAX-40"],
          rows: [
            ["Frequency range", "500 MHz – 6 GHz", "800 MHz – 18 GHz", "14 GHz – 40 GHz"],
            ["Max input power", "高达 N 连接器额定值", "—", "10 W (cont.)\n25 W peak"],
            ["Connection", "type N female", "N-female", "SMA-compatible, female"],
            ["Isotropic gain", "6 … 18 dBi", "6 … 18 dBi", "15 … 20 dBi"],
            ["Antenna factor", "19 … 29 dB/m", "24 … 50 dB/m", "38 … 45 dB/m"],
            ["SWR typical", "< 2", "≈ 1.5", "≈ 2"],
            ["Front to back ratio", "—", "> 25 dB (f > 1.3 GHz)", "> 30 dB"],
            ["Cross polarization rejection", "—", "> 25 dB (1 … 18 GHz)", "> 25 dB"],
            ["Dimensions (W × L × D)", "424 × 314 × 820 mm", "245 × 195 (408) × 142 mm", "75 × 86 × 60 mm"],
            ["Weight", "4.1 kg", "1.3 kg", "0.3 kg"],
            ["Fixation", "Ø 22 mm mounting tube", "Ø 22 mm mounting tube", "3/8″, 1/4″"],
          ],
        },
        {
          title: "有源负载环形天线",
          head: ["", "SAX-10", "LAX-10"],
          rows: [
            ["Frequency range", "9 kHz – 30 MHz", "9 kHz – 30 MHz"],
            ["Antenna factor", "+10 dB/m ± 1.5 dB", "20 dB/m（假设电场）\n−31.5 dB/Ω（磁场）"],
            ["Connector, female", "BNC, 50 Ω nom.", "BNC, 50 Ω"],
            ["Measuring range", "从 1 MHz 到 1 V/m，1 dB 压缩\n更高电场是可选的输入衰减器", "QP 检测，9 kHz IF：30 – 130 dBμV/m\nAV 检测，200 Hz IF：8 – 130 dBμV/m"],
            ["Loop diameter", "—", "0.5 m"],
            ["Power supply", "9.6 V / 1100 mAh NiMH", "12 V NiMH 1.9 Ah"],
            ["Operation time", "典型值50小时以上", "典型值12小时"],
            ["Dimensions", "杆1.0m（含螺丝连接）\n放大器顶板 220 × 120 mm", "520 × 585 × 120 mm"],
            ["Weight", "负载约。 0.2公斤\n放大器约0.7公斤", "1.9 kg"],
            ["Threads for tripods", "1/4″, 3/8″", "1/4″, 3/8″"],
          ],
        },
      ],
    },
    efs: {
      lead: [
        "Frankonia EFS 场强计设计用于根据 IEC/EN 61000-4-3 / -20 进行辐射抗扰度测试期间的场强测量和场均匀性测量。它还可用于测量工作场所或住宅空间的电磁波暴露。",
        "EFS 是一种各向同性超小型电场传感器，其设计使得传感器本身的尺寸不会影响电场。由于光纤输出直接发送，无需单独的测量单元，直接连接到控制PC或笔记本电脑的USB接口。",
        "EFS-18 是采用基于二极管偶极子的三轴各向同性传感器的新一代型号。它旨在测量TEM·GTEM室和电波暗室内的电场特性，并监测工作区域和关键点的电磁波安全。随附的 EMCViewer 软件可显示各向同性值、轴特定分量、幅度和时间响应，并同时管理多达 8 个传感器。电池续航时间超过 50 小时，只需充电 20 分钟即可额外使用 4 小时。",
      ],
      figure: {
        src: "/test-systems/images/efs-probe.webp",
        w: 360,
        h: 595,
        alt: "EFS探头安装在一个薄薄的白色三脚架上，传感器主体约为手指宽度。",
        caption: "直径 17 毫米为 25 克。它做得这么小是为了不干扰正在测量的电场。",
      },
      groups: [
        {
          title: "主要特点",
          items: [
            "通过光纤链路连接PC",
            "出色的各向同性（典型值 0.3 dB）",
            "频率范围 10 kHz 至 26.5 GHz",
            "电场强度测量 0.14~500 V/m",
            "无需充电即可运行长达 100 小时",
            "EFS-18 是一款三轴各向同性传感器 — 1 MHz 至 18 GHz，20 ms 采样，最多可同时连接 8 个传感器",
          ],
        },
      ],
      tables: [
        {
          title: "EFS-10 · EFS-100",
          head: ["", "EFS-10", "EFS-100"],
          rows: [
            ["Frequency range", "10 kHz – 9.25 GHz", "100 kHz – 9.25 GHz"],
            ["Dynamic range (single range)", "0.5 – 500 V/m (60 dB)", "0.14 – 140 V/m (60 dB)"],
            ["Flatness, frequency correction on", "0.05 – 7500 MHz: 0.4 dB", "0.3 – 7500 MHz: 0.4 dB"],
            ["Overload", "1000 V/m", "300 V/m"],
            ["Resolution", "0.01 V/m", "0.01 V/m"],
            ["Sensors", "6 monopoles", "6 monopoles"],
            ["Isotropicity", "0.5 dB (0.3 dB typical) at 50 MHz", "0.5 dB (0.3 dB typical) at 50 MHz"],
            ["Sampling rate", "22 S/s to 0.03 S/s\ndepending on filter setting", "22 S/s to 0.03 S/s\ndepending on filter setting"],
            ["Internal battery", "3 V / 5 mAh rechargeable Li-Mn", "3 V / 5 mAh rechargeable Li-Mn"],
            ["Operation time", "100 hours at 0.4 S/s, 28 Hz filter", "100 hours at 0.4 S/s, 28 Hz filter"],
            ["Communication", "bidirectional fibre optic link", "bidirectional fibre optic link"],
            ["Fibre optic length", "10.0 m standard, 20 / 40.0 m optional", "10.0 m standard, 20 / 40.0 m optional"],
            ["Dimensions", "53 mm overall, body 17 mm diameter", "53 mm overall, body 17 mm diameter"],
            ["Weight", "25 g including 1.0 m pigtail", "25 g including 1.0 m pigtail"],
          ],
        },
        {
          title: "EFS-300 · EFS-500",
          note: "我们公司在两个地方列出了 EFS-300 的动态范围：产品页面上的 1.5 至 1500 V/m，概述页面上的 0.17 至 170 V/m。在这里我关注了产品页面。请对照报价单进行核对。",
          head: ["", "EFS-300", "EFS-500"],
          rows: [
            ["Frequency range", "300 kHz – 18 GHz", "300 kHz – 26.5 GHz"],
            ["Dynamic range (single range)", "1.5 – 1500 V/m (60 dB)", "0.4 – 800 V/m (66 dB)"],
            ["Flatness, frequency correction on", "0.05 – 7500 MHz: 0.4 dB", "0.3 – 26500 MHz: 0.4 dB"],
            ["Overload", "350 V/m", "1600 V/m"],
            ["Resolution", "0.01 V/m", "0.01 V/m"],
            ["Sensors", "6 monopoles", "6 monopoles"],
            ["Sampling rate", "22 S/s to 0.03 S/s", "22 S/s to 0.03 S/s"],
            ["Operation time", "100 hours at 0.4 S/s, 28 Hz filter", "100 hours at 0.4 S/s, 28 Hz filter"],
            ["Dimensions", "53 mm overall, body 17 mm diameter", "53 mm overall, body 17 mm diameter"],
            ["Weight", "25 g including 1.0 m pigtail", "25 g including 1.0 m pigtail"],
          ],
        },
        {
          title: "EFS-18",
          head: ["", "规格"],
          rows: [
            ["Sensor type", "Triaxial isotropic, diode dipole"],
            ["Data read", "X, Y, Z and ISO"],
            ["Bandwidth", "1 MHz – 18 GHz"],
            ["Amplitude frequency response", "± 1.5 dB (10 MHz – 1 GHz)\n± 3 dB (1 – 16 GHz)"],
            ["Sensitivity", "0.8 V/m"],
            ["Dynamic range", "0.8 – 340 V/m (52 dB)"],
            ["Linearity at 100 MHz", "2 – 300 V/m, 0.5 dB"],
            ["Isotropy at 100 MHz", "0.5 dB"],
            ["Temperature stability", "在工作温度范围内为 0.5 dB"],
            ["Max. sampling rate", "50 sps"],
            ["Operating temperature", "5 – 45 °C，湿度 5 – 90%"],
            ["Dimensions / weight", "长度 145 毫米，直径 32 – 60 毫米/100 克"],
            ["Recommended calibration interval", "24 months"],
          ],
        },
      ],
    },
    preamp: {
      lead: [
        "FPA系列是一款通用型宽带前置放大器，具有高增益、低内部噪声的特点。它支持 CISPR 22 测量，带宽高达 2/6 GHz，并具有高增益和低噪声系数，因此系统噪声几乎不受电缆和接收器等其他组件的影响。它在限值非常低的测量中特别有用，例如 CISPR 25，它直接连接到天线。",
        "FPA-2 和 FPA-6A 具有 ESD 保护，可防止意外静电放电造成的损坏。 FPA-6B 的频段为 9 kHz 至 6 GHz，但由于技术原因，它没有 ESD 保护，因此处理时必须小心。前置放大器本质上对 ESD 敏感，必须在连接同轴电缆之前对其进行放电。",
      ],
      figure: {
        src: "/test-systems/images/preamp-fpa.webp",
        w: 1200,
        h: 920,
        alt: "FPA前置放大器—金属外壳，两端带有N型法兰连接器，盖子上刻有铭牌",
        caption: "铝制外壳中的 N 型法兰。 12 V 电源的线性使用是有意为之的——开关电源会提高放大器要测量的噪声水平。",
      },
      groups: [],
      tables: [
        {
          title: "FPA-2 · FPA-6A · FPA-6B",
          note: "FPA-18、FPA-26、FPA-40 高达 40 GHz。这些数字位于上面的型号列表中。",
          head: ["", "FPA-2", "FPA-6A", "FPA-6B"],
          rows: [
            ["Frequency range", "9 kHz – 2 GHz", "10 MHz – 6 GHz", "9 kHz – 6 GHz"],
            ["Noise figure", "2.5 dB (1.0 GHz)", "2.5 dB (1.0 GHz)", "2.5 dB (1.0 GHz)"],
            ["Gain", "+ 30 dB", "+ 28 dB", "+ 28 dB"],
            ["Amplitude flatness", "< ± 3 dB", "< ± 3 dB", "< ± 3 dB"],
            ["1 dB compression point at input", "≥ −20 dBm (87 dBμV)", "≥ −18 dBm (89 dBμV)", "> 100 dBμV"],
            ["Impedance", "50 Ω", "50 Ω", "50 Ω"],
            ["VSWR input / output", "< 2:1", "< 2:1", "< 2:1"],
            ["Power supply", "+ 12 V (± 2 V)", "+ 12 V (± 2 V)", "+ 12 V (± 2 V)"],
            ["Current consumption", "< 120 mA", "< 130 mA", "< 120 mA"],
          ],
        },
      ],
    },
    meter: {
      lead: [
        "PMS 1084 是一款具有基本规格的双通道射频功率计，可在 100 kHz 至 6 GHz（PMS 1084 B 为 10 kHz 至 500 MHz）频段内测量 -60 dBm 至 +20 dBm。您可以随时扩展最多 4 个通道。适用于自动测量 IEC/EN 61000-4-3 / -6 抗扰度测试系统中的正向和反向功率。",
        "RSU 继电器开关单元将一个输入转换为两个或三个输出（手动或远程）。主要用于放大器、天线、功率计交替使用的测量系统，也可防止由于错误连接电缆而引起的电路事故。",
      ],
      figure: {
        src: "/test-systems/images/meter-pms-1084.webp",
        w: 1600,
        h: 249,
        alt: "PMS 1084采用1U机架单元形式，前面板上标有“RF Power Meter”",
        caption: "1U高度，2个基本通道，最大4个通道——这是同时查看两个放大器正向和反向所需的数量。",
      },
      groups: [],
      tables: [
        {
          title: "PMS 1084 · PMS 1084 B",
          head: ["", "PMS 1084", "PMS 1084 B"],
          rows: [
            ["Number of channels", "2 standard, up to 4 optional", "2 standard, up to 4 optional"],
            ["Frequency range", "100 kHz – 6 GHz", "10 kHz – 500 MHz"],
            ["Measuring range", "−60 dBm to +20 dBm (10 kHz ≤ f ≤ 4 GHz)\n−45 dBm to +20 dBm (4 GHz < f ≤ 6 GHz)", "−60 dBm to +20 dBm"],
            ["Accuracy", "± 1 dB (0.5 dB typical)", "± 1 dB (0.5 dB typical)"],
            ["Resolution", "0.1 dB", "0.1 dB"],
            ["Integration time", "0.5 – 200 ms (firmware)", "0.5 – 200 ms (firmware)"],
            ["Max. input level", "+27 dBm (= 500 mW)", "+27 dBm (= 500 mW)"],
            ["VSWR", "1:1.15 to 2 GHz\n1:1.25 over 2 – 4 GHz\n1:1.35 over 4 – 6 GHz", "1:1.15"],
            ["Interface (PC)", "USB, RS232", "USB, RS232"],
            ["Input", "N-type female connector", "N-type female connector"],
            ["Dimensions (D × W × H)", "172 × 482.6 × 44.3 mm", "172 × 482.6 × 44.3 mm"],
            ["Weight", "approx. 2.5 kg", "approx. 2.5 kg"],
          ],
        },
        {
          title: "RSU继电器切换单元",
          note: "默认 DC~12.4 GHz，可选最高 18 GHz 或 40 GHz。最多可安装4个2输出或3输出继电器，测试电平为50V连续，300V持续1秒。",
          head: ["", "DC … 1 GHz", "1 … 5 GHz", "5 … 10 GHz", "10 … 12.4 GHz"],
          rows: [
            ["VSWR", "< 1.04", "< 1.14", "< 1.3", "< 1.5"],
            ["Isolation", "> 90 dB", "> 80 dB", "> 70 dB", "> 70 dB"],
            ["Insertion loss", "< 0.05 dB", "< 0.1 dB", "< 0.2 dB", "< 0.3 dB"],
            ["Max. power input", "< 1.00 kW", "< 0.44 kW", "< 0.31 kW", "< 0.28 kW"],
          ],
        },
      ],
    },
    system: {
      lead: [
        "CIT-100是一套完整的传导射频抗扰度测试和BCI测试系统，符合IEC/EN 61000-4-6、ISO 11452-4、MIL-STD 461 CS114等标准。它具有内置信号发生器（4 kHz至1.2 GHz）、射频功率放大器（25 / 75 / 200 W）、3通道射频功率计、定向耦合器和控制软件。",
        "CIT-1000是两者中较高的型号。发生器、定向耦合器和射频电压表的频率高达 1.2 GHz，并且通过连接外部功率放大器可满足 IEC/EN 61000-4-3 辐射抗扰度测试。通过配备 250 W 放大器的外部 CIT-4K，MIL-STD 461 的低频扩展可降至 4 kHz，并通过内置触摸屏 PC 独立运行。",
        "ECU-6是一款中央EMC测试和控制单元，它将EMC测试所需的主要组件——信号发生器、功率计、定向耦合器和继电器开关单元集中在一个盒子中。将接线工作和接线错误减少到最低限度。围绕该装置构建了 IEC 61000-4-3、ISO 11452-2、MIL-STD 461 RS103 辐射抗扰系统。在最多 3 个外部放大器、最多 3 个天线/耦合设备和最多 2 个接收器/频谱分析仪之间自动切换。",
        "PSG-300是一款适用于DC至300kHz信号的超宽带线性功率放大器，用于IEC/EN 61000-4-16共模和IEC/EN 61000-4-19差模传导抗扰度测试。内置发生器产生正弦波、方波和三角波，并在内部输出级进行放大，输出功率为 5 A·260 W，更高型号的 PSG-300A 输出为 16 A·800 W。",
        "MTS-800 是一款节省空间的测试系统，可生成并分析 DC 至 250 kHz 磁场。内置 800 W 功率放大器，无需任何额外设备即可获得军事和汽车标准所需的高磁场强度 — MIL-STD-461 CE101·CS101·CS109·RE101·RS101 和 ISO 11452-8，可选三轴亥姆霍兹线圈高达 1000 A/m。",
      ],
      figure: {
        src: "/test-systems/images/system-cit-100.webp",
        w: 1600,
        h: 609,
        alt: "19英寸机箱中的CIT-100，前面板上标有“传导抗扰度测试系统”",
        caption: "61000-4-6 整个测试链在一个案例中。同时，内部的仪器可以通过单独的连接器单独使用。",
      },
      figureRow: [
        {
          src: "/test-systems/images/system-ecu-6.webp",
          w: 1032,
          h: 519,
          alt: "4U 机架中的 ECU-6 — 前面板上的“EMC CONTROL UNIT”符号、互锁按钮、黄色 OLED 指示灯、电源开关",
          caption: "ECU-6 — 信号发生器、功率计，甚至三个放大器之间的转换。一个盒子取代了它们之间的电缆。",
        },
        {
          src: "/test-systems/images/system-psg-300.webp",
          w: 1400,
          h: 531,
          alt: "PSG-300 前面板 — “电源信号发生器 DC … 300 kHz”符号、接地端子和 OUT 50 Ω 插座、红色/黑色 OUT 端子、保护/就绪指示灯、电源高/放大器开按钮、圆形开/关按钮、两端银色弓形手柄",
          caption: "PSG-300 — 260 W，PSG-300A 为 800 W。",
        },
        {
          src: "/test-systems/images/system-mts-800.webp",
          w: 1400,
          h: 782,
          alt: "MTS-800 前面板带有“磁性测试系统”符号 — 香蕉插孔、BNC 输入、电源开关",
          caption: "MTS-800 — 单个装置可生成并测量高达 1000 A/m 的磁场。",
        },
      ],
      groups: [
        {
          title: "CIT-100",
          items: [
            "IEC/EN 61000-4-6 传导射频抗扰度测试、ISO 11452-4 和 MIL-STD 461 CS 114 BCI 测试",
            "信号发生器、射频功率放大器、射频功率计和定向耦合器集成在一个 19 英寸机箱中",
            "内置仪器可以通过现有的输入/输出连接器单独使用",
            "可选配上网本可独立操作",
            "内置显示屏显示主要参数",
            "EUT自动监测，CDN全阵容供应",
          ],
        },
        {
          title: "CIT-1000",
          items: [
            "CIT-100 的所有功能，加上 25·75·200 W 内置放大器模块",
            "发生器、定向耦合器、射频电压表 1.2 GHz — 通过连接外部放大器进行 IEC/EN 61000-4-3 辐射抗扰度测试",
            "具有低通扩展 4 kHz — 250 W 放大器的外部 CIT-4K，适用于 MIL-STD 461",
            "内置触摸屏PC，独立操作，无需外接电脑",
            "BCI钳式温度测量/显示输入",
          ],
        },
        {
          title: "CIT-CDN·EM夹具·BCI探头耦合/去耦装置",
          items: [
            "CDN-AF 用于非屏蔽非平衡线路，CDN-T 和 CDN-RJ45（如果线路平衡），CDN-CAN 用于总线 — 150 kHz 至 230 MHz，“-10K”型号从 10 kHz",
            "电源线上的 CDN-M — 高达 1000 V、125 A",
            "屏蔽线通过CDN-S — 100 Ω 连接到屏蔽层。 RJ45-S·USB·HDMI·火线网络同法制作",
            "EM耦合夹EMCL-20·EMCL-35 — 最大电缆直径20 mm·35 mm。用于剩余电缆的分离夹 ABCL-20",
            "BCI 探头，适用于 ISO 11452-4·MIL-STD 461 CS 114 — 直径 40 mm 线束，次级电流 300 mA 或以上。监控探头MP50",
            "规格和订购代码配置位于耦合/去耦附件页面。",
          ],
        },
        {
          title: "ECU-6",
          items: [
            "IEC 61000-4-3、ISO 11452-2、MIL-STD 461 RS103辐射抗扰度测试",
            "IEC/EN 61000-4-6 传导抗扰度测试，10 kHz 至 230 MHz",
            "ISO 11452-4 和 MIL-STD 461 CS114 BCI 测试",
            "在最多3个外部功率放大器和与其连接的耦合装置/天线之间自动切换",
            "最多 2 个 EMI 接收器和频谱分析仪以及 3 个天线系统之间自动切换",
            "可集成到任何带有SCPI命令的控制软件中，内置联锁安全系统",
          ],
        },
        {
          title: "PSG-300 · PSG-300A",
          items: [
            "IEC/EN 61000-4-16、IEC/EN 61000-4-19、IEC/EN 61543、IEC 60255 抗扰度测试",
            "DC~300 kHz，5 A/260 W (PSG-300) 或 16 A/800 W (PSG-300A)",
            "内置直流、正弦、三角、方波函数发生器，也可作为外部信号单独输入",
            "DC/AC电力线模拟、压电执行器驱动、亥姆霍兹线圈产生的磁场等。",
            "选项 — 用于短期测试的外部电源（最大 300 V）控制输入",
            "提供USB远程控制软件，集成到带有命令集的自动测试系统中",
          ],
        },
        {
          title: "PSG-300耦合网络CN",
          items: [
            "非屏蔽非平衡线包括 CN AF2、AF4、AF8 — DC 和 15 Hz 至 150 kHz",
            "对于电源线，CN M2~M5 — 交流单元和直流单元分开订购。 250 VAC / 32 A，M3·M5，适用于带功能接地的 EUT",
            "平衡通信线包括 CN T2、T4、T8 — 差模-共模转换损耗 60 dB",
            "8极平衡数据接口包括CN RJ45",
            "当EUT系统不受干扰时，隔离变压器IT-6·IT-16·IT-20 — 1380·3680·4600VA",
            "所有型号的测试电平为连续50V，施加工频1秒时为300V。规格位于配合/分离附件页面。",
          ],
        },
        {
          title: "MTS-800",
          items: [
            "DC 至 250 kHz 磁场测量/测试，高达 1000 Hz，高达 1000 A/m",
            "信号发生器、800 W 功率放大器和 1 MS/s 16 位频谱分析仪三合一 — 每一个都可以单独使用",
            "ISO 11452-8 和 MIL-STD-461 CE101·CS101·CS109·RE101·RS101",
            "SAE J1113-2·J1113-22, Ford ES-XW7T-1A278-AC, PSA B21 7110, Renault 36-00-808, DC-11224, DC-10614",
            "使用可选的三轴亥姆霍兹线圈进行全自动测试——测试期间无需转动 EUT",
            "Windows应用软件包含标准特定参数和极限值，也可以添加用户定义的序列",
          ],
        },
      ],
      tables: [
        {
          title: "CIT-100",
          note: "2026年数据表中的放大器表列出了四种类型：CIT-100/25、/75 MIL、/75和/200，但旁边的文字仍然写着“最大输出75 W”。在这里，我按照表进行操作。请根据报价检查模块规格。",
          head: ["", "规格"],
          rows: [
            ["RF generator — outputs", "2×SMA，只能同时使用1个"],
            ["RF generator — frequency range", "4 kHz to 1.2 GHz"],
            ["RF generator — frequency resolution", "1 Hz"],
            ["RF generator — output level", "0 to −63 dBm, resolution 0.1 dB"],
            ["RF generator — harmonics / spurious", "< 30 dBc / < 45 dBc"],
            ["LF generator (modulation)", "1 Hz to 100 kHz, sine / square / triangular, 0 … 1 V"],
            ["Amplitude modulation", "internal 0 – 100 %, resolution 1 %"],
            ["Internal RF power amplifier", "25W·75W·200W模组\n25 W：100 kHz – 250 MHz / 75 W MIL：(4) 10 kHz – 250 (400) MHz\n75 瓦·200 瓦：100 kHz – 400 MHz"],
            ["RF voltmeter 1 (test level)", "4 kHz to 1.2 GHz, −40 to +30 dBm"],
            ["RF voltmeter 2 + 3 (forward, reverse)", "4 kHz 至 1.2 GHz，−40 至 +33 dBm\n定向耦合器类型包括 40 分贝"],
            ["EUT monitor input", "0 – 10 V, resolution 2.5 mV, 100 kΩ"],
            ["Interfaces", "USB 2.0、LAN 100 Mbit、GPIB 可选"],
          ],
        },
        {
          title: "ECU-6",
          note: "2026年数据表将该设备列为ECU-6.2，零件清单将其列为ECU-6。由于功率计、定向耦合器和天线输出作为选件订购，因此组合衰减会根据安装的耦合器而变化。",
          head: ["", "规格"],
          rows: [
            ["Signal generator — frequency range", "8 kHz – 6.2 GHz, resolution 0.001 Hz"],
            ["Signal generator — output level", "−65 dBm to +13 dBm, accuracy ± 1 dBm"],
            ["Signal generator — outputs", "50 Ω SMA female, relay switched 1:3"],
            ["Amplitude modulation", "10 Hz – 20 kHz, depth 0 – 95 %, sine or triangle"],
            ["Pulse modulation", "on/off ratio 70 dB, pulse width 1 µs to 10 s"],
            ["RF power meter", "max. 7 channels\nLF module 10 kHz – 500 MHz, RF module 100 kHz – 6 GHz\n−60 … +20 dBm (10 kHz – 4 GHz), −45 … +20 dBm (4 – 6 GHz)"],
            ["Relay switching unit — max. power", "2000 W (8 kHz – 100 MHz), 1000 W (100 – 600 MHz),\n600 W (600 MHz – 1 GHz), 400 W (1 – 3 GHz), 300 W (3 – 6 GHz)"],
            ["EUT monitor input", "2 × 0 – 10 V, resolution 2.5 mV, < 1 kΩ, BNC female"],
            ["Temperature measurement", "PT1000, 5 – 100 °C, SMB female"],
            ["Remote control", "USB-B, LAN 10/100 Mbit (TCP/IP), GPIB — SCPI"],
            ["Dimensions (W×H×D) / weight", "449 × 177 × 580 mm / 18 kg"],
          ],
        },
        {
          title: "PSG-300 · PSG-300A",
          note: "外部电源选项是一个控制输入，可连接到高达 300 V 的电压源以进行短期测试。还提供符合 EN 61558 标准的隔离变压器 IT-06·IT-16·IT-20 (1380 VA~4600 VA)。",
          head: ["", "PSG-300", "PSG-300A"],
          rows: [
            ["Frequency range", "DC – 1 MHz (small signal −3 dB)", "DC – 1 MHz (small signal −3 dB)"],
            ["Performance range", "DC – 300 kHz", "DC – 300 kHz"],
            ["Slew rate", "100 V/µs", "100 V/µs"],
            ["Voltage amplification", "10 ± 0.1 % (± 0.01 % / °C)", "10 ± 0.1 % (± 0.01 % / °C)"],
            ["Output voltage", "50 Vrms / ± 75 Vpeak", "50 Vrms / ± 75 Vpeak"],
            ["Output current", "5 Arms / ± 7.5 Apeak", "16 Arms / ± 24 Apeak"],
            ["Output power", "260 W", "800 W"],
            ["Distortion", "< 0.10 %\nDC – 100 kHz, load ≥ 4 Ω", "< 0.10 %\nDC – 100 kHz, load ≥ 4 Ω"],
            ["Generator frequency range", "DC, 0.05 Hz – 300 kHz\nresolution 0.05 Hz", "DC, 0.05 Hz – 300 kHz\nresolution 0.05 Hz"],
            ["Waveform", "sine, square, triangular", "sine, square, triangular"],
            ["Remote control", "USB", "USB"],
            ["Dimensions (W × H × D)", "449 × 133 × 436 mm (3 RU)", "449 × 177 × 585.5 mm (4 RU)"],
            ["Weight", "approx. 24 kg", "approx. 32 kg"],
          ],
        },
        {
          title: "MTS-800",
          note: "磁场测试页面上提供完整规格、MIL-STD-461 测试方法表和附件。",
          head: ["", "规格"],
          rows: [
            ["Generator — frequency range", "DC – 250 kHz"],
            ["Generator — signal", "Sine / triangular / square / DC, 0 – 10 V AC, −10 to +10 V DC"],
            ["Amplifier — frequency range", "DC – 1 MHz"],
            ["Amplifier — output", "16 Arms, 50 Vrms / 75 Vdc, distortion < 0.10 %"],
            ["Analyzer — voltage input", "DC – 250 kHz, 1 MΩ / 50 Ω switchable"],
            ["Analyzer — current input", "DC – 250 kHz, shunts 10 mΩ / 1 Ω / 100 Ω, max. 20 A continuous"],
            ["AD converter", "16 bit, 1.0 MSPS"],
            ["Connection to PC", "USB; EUT control over 9-pin Sub-D, RS-232"],
            ["Dimensions (W×H×D) / weight", "449 × 177 × 580 mm / approx. 34 kg net"],
          ],
        },
      ],
    },
  },
};

/**
 * The label on one "at a glance" figure, as a key rather than a string.
 *
 * The chamber branch writes its `overview` pairs out once per locale, which is
 * right there: everything else on a chamber's page is prose, so the pair is
 * just two more sentences. Here it would have meant two copies of a hundred and
 * thirty measurements — and the copy nobody reads twice is the copy that
 * drifts. So the label is looked up per locale and the value is written once,
 * which is the same division this branch already makes everywhere else: a
 * heading is translated, a figure a reader matches against a quotation is not.
 */
export type TestFactKey = keyof (typeof factLabel)["en"];

export const factLabel = {
  zh: {
    band: "频率范围",
    isoGain: "各向同性增益",
    gain: "效益",
    noise: "噪声系数",
    compression: "1 dB压缩点（输入）",
    antennaFactor: "天线系数",
    maxInput: "最大输入功率",
    connector: "连接器",
    fixation: "已修复",
    loopDia: "环径",
    dynamic: "动态范围",
    overload: "过载限制",
    fieldStrength: "电场强度",
    magField: "磁场强度",
    isotropy: "各向同性",
    channels: "频道",
    measuring: "测量范围",
    accuracy: "准确度",
    isolation: "隔离",
    insertion: "插入损耗",
    conversion: "转换损失",
    outputs: "配置",
    amplifier: "内置放大器",
    voltmeter: "射频电压表",
    eutMonitor: "EUT监控输入",
    powerBw: "功率带宽",
    generator: "内置信号发生器",
    output: "输出电压/电流",
    level: "输出电平",
    testLevel: "测试等级",
    port: "EUT·AE端口",
    powerOut: "输出",
    adc: "AD转换器",
    interface: "接口",
    supply: "电源",
    operation: "运行时间",
    dimensions: "尺寸",
    weight: "重量",
  },
  en: {
    band: "Frequency range",
    isoGain: "Isotropic gain",
    gain: "Gain",
    noise: "Noise figure",
    compression: "1 dB compression at input",
    antennaFactor: "Antenna factor",
    maxInput: "Max. input power",
    connector: "Connector",
    fixation: "Fixation",
    loopDia: "Loop diameter",
    dynamic: "Dynamic range",
    overload: "Overload",
    fieldStrength: "Field strength",
    magField: "Magnetic field strength",
    isotropy: "Isotropy",
    channels: "Channels",
    measuring: "Measuring range",
    accuracy: "Accuracy",
    isolation: "Isolation",
    insertion: "Insertion loss",
    /** Differential to common mode, on the 61000-4-16 networks and the
     *  transformers. Not the same measurement as `insertion`, and printing it
     *  under that label read as "Insertion loss — conversion loss 60 dB". */
    conversion: "Conversion loss",
    outputs: "Configuration",
    amplifier: "Internal amplifier",
    voltmeter: "RF voltmeters",
    eutMonitor: "EUT monitor input",
    powerBw: "Power bandwidth",
    generator: "Generator",
    output: "Output voltage and current",
    level: "Output level",
    testLevel: "Test level",
    port: "EUT / AE port",
    powerOut: "Power output",
    adc: "AD converter",
    interface: "Interface",
    supply: "Power supply",
    operation: "Operation time",
    dimensions: "Dimensions",
    weight: "Weight",
  },
} as const satisfies Record<Lang, Record<string, string>>;

/**
 * What a model row opens onto: four to six figures out of the specification
 * tables above, and — where there is one — the sentence the head office writes
 * about that model.
 *
 * **Every value here is a cell from a table further up this file**, which is
 * itself the head office's own table. A long cell is cut to its leading figure
 * rather than rewritten (`−60 dBm to +20 dBm (10 kHz ≤ f ≤ 4 GHz)` becomes
 * `−60 … +20 dBm`); the full row is in the specification band on the same page,
 * a screen below. Nothing here is computed, converted or rounded, and no model
 * gets a figure its own column does not carry — which is why the three
 * microwave pre-amplifiers show three pairs where the others show five.
 *
 * `lead` follows one rule, and it is the reason most rows have none: **a panel
 * carries a lead only where the head office writes about that model by name.**
 * The horn antennas, the four EFS probes and the FPA-18/26/40 are described by
 * a paragraph about their series, and that paragraph is already the page's own
 * lead, three hundred pixels above the row. Printing it again under each of
 * three rows would be the same text three times, in the place a reader opened
 * expecting the thing they had not already read.
 *
 * Keyed by `TestModel.name`.
 *
 * The seventy amplifiers are absent on purpose — see
 * the note on `TestModel.desc`, and docs/source/test-systems-source.md §4.
 */
export type TestModelBody = {
  lead?: string;
  facts?: readonly { key: TestFactKey; value: string }[];
};

/** The figures, written once — see `factLabel`. */
const modelFacts: Record<string, readonly { key: TestFactKey; value: string }[]> = {
  // Antennas. Bands, gains and antenna factors are the head office's antenna
  // tables; `fixation` stands in for `maxInput` on the two horns whose input
  // power the source states in words rather than in watts.
  "ALX-4000E": [
    { key: "band", value: "25 MHz – 4 GHz" },
    { key: "isoGain", value: "6.4 ± 1.2 dBi" },
    { key: "antennaFactor", value: "7 … 34 dB/m" },
    { key: "maxInput", value: "100 W cont. / 200 W int." },
    { key: "weight", value: "3.1 kg" },
  ],
  "ALX-8000E": [
    { key: "band", value: "25 MHz – 8 GHz" },
    { key: "isoGain", value: "6.4 ± 1.2 dBi" },
    { key: "antennaFactor", value: "7 … 43 dB/m" },
    { key: "maxInput", value: "100 W cont. / 200 W int." },
    { key: "weight", value: "3.1 kg" },
  ],
  "MAX-9": [
    { key: "band", value: "600 MHz – 10.5 GHz" },
    { key: "isoGain", value: "typ. 10.3 dBi ± 1.5 dB" },
    { key: "antennaFactor", value: "18 … 41 dB/m" },
    { key: "maxInput", value: "300 W at 1 GHz" },
    { key: "weight", value: "3.7 kg" },
  ],
  "MAX-9-7/16": [
    { key: "band", value: "0,6 – 7,5 GHz" },
    { key: "isoGain", value: "typ. 10.3 dBi" },
    { key: "maxInput", value: "950 W at 1 GHz" },
    { key: "connector", value: "7/16" },
  ],
  "MAX-18": [
    { key: "band", value: "700 MHz – 20 GHz" },
    { key: "isoGain", value: "typ. 8.6 dBi ± 1 dB" },
    { key: "antennaFactor", value: "20 … 49 dB/m" },
    { key: "maxInput", value: "50 W" },
    { key: "weight", value: "1.2 kg" },
  ],
  "HAX-6": [
    { key: "band", value: "500 MHz – 6 GHz" },
    { key: "isoGain", value: "6 … 18 dBi" },
    { key: "antennaFactor", value: "19 … 29 dB/m" },
    { key: "fixation", value: "Ø 22 mm mounting tube" },
    { key: "weight", value: "4.1 kg" },
  ],
  "HAX-18": [
    { key: "band", value: "800 MHz – 18 GHz" },
    { key: "isoGain", value: "6 … 18 dBi" },
    { key: "antennaFactor", value: "24 … 50 dB/m" },
    { key: "fixation", value: "Ø 22 mm mounting tube" },
    { key: "weight", value: "1.3 kg" },
  ],
  "HAX-40": [
    { key: "band", value: "14 – 40 GHz" },
    { key: "isoGain", value: "15 … 20 dBi" },
    { key: "antennaFactor", value: "38 … 45 dB/m" },
    { key: "maxInput", value: "10 W cont. / 25 W peak" },
    { key: "weight", value: "0.3 kg" },
  ],
  "SAX-10": [
    { key: "band", value: "9 kHz – 30 MHz" },
    { key: "antennaFactor", value: "+10 dB/m ± 1.5 dB" },
    { key: "connector", value: "BNC, 50 Ω" },
    { key: "supply", value: "9.6 V / 1100 mAh NiMH" },
    { key: "operation", value: "typ. ≥ 50 h" },
  ],
  "LAX-10": [
    { key: "band", value: "9 kHz – 30 MHz" },
    { key: "loopDia", value: "0.5 m" },
    { key: "antennaFactor", value: "20 dB/m (E-field)" },
    { key: "operation", value: "typ. 12 h" },
    { key: "weight", value: "1.9 kg" },
  ],

  // Field strength meters. The four probes share a housing, so `dimensions` is
  // the same figure four times — it is in the table four times too, and a
  // reader comparing two probes is entitled to see that it does not change.
  "EFS-10": [
    { key: "band", value: "10 kHz – 9.25 GHz" },
    { key: "dynamic", value: "0.5 – 500 V/m (60 dB)" },
    { key: "overload", value: "1000 V/m" },
    { key: "operation", value: "100 h at 0.4 S/s" },
    { key: "dimensions", value: "53 mm, body ø 17 mm" },
  ],
  "EFS-100": [
    { key: "band", value: "100 kHz – 9.25 GHz" },
    { key: "dynamic", value: "0.14 – 140 V/m (60 dB)" },
    { key: "overload", value: "300 V/m" },
    { key: "operation", value: "100 h at 0.4 S/s" },
    { key: "dimensions", value: "53 mm, body ø 17 mm" },
  ],
  "EFS-300": [
    { key: "band", value: "300 kHz – 18 GHz" },
    { key: "dynamic", value: "1.5 – 1500 V/m (60 dB)" },
    { key: "overload", value: "350 V/m" },
    { key: "operation", value: "100 h at 0.4 S/s" },
    { key: "dimensions", value: "53 mm, body ø 17 mm" },
  ],
  "EFS-500": [
    { key: "band", value: "300 kHz – 26.5 GHz" },
    { key: "dynamic", value: "0.4 – 800 V/m (66 dB)" },
    { key: "overload", value: "1600 V/m" },
    { key: "operation", value: "100 h at 0.4 S/s" },
    { key: "dimensions", value: "53 mm, body ø 17 mm" },
  ],
  "EFS-Laser": [
    { key: "band", value: "10 kHz – 6 GHz" },
    { key: "fieldStrength", value: "0.1 V/m – 10 kV/m" },
    { key: "dynamic", value: "up to 100 dB" },
    { key: "isotropy", value: "< 1 dB at 900 MHz" },
    { key: "interface", value: "USB 2.0" },
  ],
  "EFS-18": [
    { key: "band", value: "1 MHz – 18 GHz" },
    { key: "dynamic", value: "0.8 – 340 V/m (52 dB)" },
    { key: "isotropy", value: "0.5 dB at 100 MHz" },
    { key: "operation", value: "> 50 h, 2.5 h recharge" },
    { key: "weight", value: "100 g" },
  ],

  // Pre-amplifiers. The first three are a table; the last three are the model
  // list's own line, which is all the head office publishes of them.
  "FPA-2": [
    { key: "band", value: "9 kHz – 2 GHz" },
    { key: "gain", value: "+ 30 dB" },
    { key: "noise", value: "2.5 dB (1.0 GHz)" },
    { key: "compression", value: "≥ −20 dBm" },
    { key: "supply", value: "+ 12 V (± 2 V)" },
  ],
  "FPA-6A": [
    { key: "band", value: "10 MHz – 6 GHz" },
    { key: "gain", value: "+ 28 dB" },
    { key: "noise", value: "2.5 dB (1.0 GHz)" },
    { key: "compression", value: "≥ −18 dBm" },
    { key: "supply", value: "+ 12 V (± 2 V)" },
  ],
  "FPA-6B": [
    { key: "band", value: "9 kHz – 6 GHz" },
    { key: "gain", value: "+ 28 dB" },
    { key: "noise", value: "2.5 dB (1.0 GHz)" },
    { key: "compression", value: "> 100 dBμV" },
    { key: "supply", value: "+ 12 V (± 2 V)" },
  ],
  "FPA-18": [
    { key: "band", value: "1 – 18 GHz" },
    { key: "gain", value: "≈ 33 dB" },
    { key: "noise", value: "2 dB" },
  ],
  "FPA-26": [
    { key: "band", value: "18 – 26.5 GHz" },
    { key: "gain", value: "≈ 33 dB" },
    { key: "noise", value: "3.5 dB" },
  ],
  "FPA-40": [
    { key: "band", value: "18 – 40 GHz" },
    { key: "gain", value: "≈ 35 dB" },
    { key: "noise", value: "5.5 dB" },
  ],

  // Meters and switching. The RSU's table is a column per band rather than a
  // row per property, so its three figures carry the band they hold over.
  "PMS 1084": [
    { key: "channels", value: "2 standard, up to 4" },
    { key: "band", value: "100 kHz – 6 GHz" },
    { key: "measuring", value: "−60 … +20 dBm" },
    { key: "accuracy", value: "± 1 dB (0.5 dB typ.)" },
    { key: "interface", value: "USB, RS232" },
  ],
  "PMS 1084 B": [
    { key: "channels", value: "2 standard, up to 4" },
    { key: "band", value: "10 kHz – 500 MHz" },
    { key: "measuring", value: "−60 … +20 dBm" },
    { key: "accuracy", value: "± 1 dB (0.5 dB typ.)" },
    { key: "interface", value: "USB, RS232" },
  ],
  RSU: [
    { key: "band", value: "DC – 12.4 GHz" },
    { key: "outputs", value: "1 in → 2 or 3 out, ≤ 4 relays" },
    { key: "isolation", value: "> 90 dB (DC … 1 GHz)" },
    { key: "insertion", value: "< 0.05 dB (DC … 1 GHz)" },
    { key: "maxInput", value: "< 1.00 kW (DC … 1 GHz)" },
  ],

  // Emission measuring systems. The two receivers are the flagship of this
  // catalogue and get the same five figures a reader compares them on.
  "ERX-6": [
    { key: "band", value: "10 Hz – 6 GHz" },
    { key: "gain", value: "pre-amp typ. 20 dB" },
    { key: "noise", value: "typ. 3.5 dB" },
    { key: "interface", value: "LAN, USB, VGA, HDMI" },
    { key: "weight", value: "approx. 8 kg" },
  ],
  "ERC-6": [
    { key: "band", value: "9 kHz – 6 GHz" },
    { key: "gain", value: "pre-amp 20 dB / 15 dB" },
    { key: "dimensions", value: "2 RU, 482 × 95 × 485 mm" },
    { key: "interface", value: "USB, RS-232" },
    { key: "weight", value: "7 kg" },
  ],
  "C2-16": [
    { key: "band", value: "9 kHz – 30 MHz" },
    { key: "measuring", value: "16 A, 250 VAC / 350 VDC" },
    { key: "interface", value: "BNC female" },
    { key: "dimensions", value: "230 × 105 × 285 mm" },
    { key: "weight", value: "5.5 kg" },
  ],
  "C4-32": [
    { key: "band", value: "9 kHz – 30 MHz" },
    { key: "measuring", value: "32 A, 400 VAC / 565 VDC" },
    { key: "interface", value: "BNC female" },
    { key: "dimensions", value: "342 × 254 × 510 mm" },
    { key: "weight", value: "16.5 kg" },
  ],
  "LISN-KFZ": [
    { key: "band", value: "100 kHz – 150 MHz" },
    { key: "measuring", value: "70 A cont., > 100 A short" },
  ],
  "LISN-MIL": [
    { key: "band", value: "150 kHz – 100 MHz" },
    { key: "measuring", value: "70 A cont., > 100 A short" },
  ],
  "NFS-100": [
    { key: "band", value: "E 80 – 500 MHz, H 10 – 500 MHz" },
    { key: "connector", value: "BNC" },
    { key: "dimensions", value: "E 180 mm, H 183 mm" },
  ],
  LVVL: [
    { key: "band", value: "9 kHz – 30 MHz" },
    { key: "loopDia", value: "2.0 m, three axes" },
    { key: "connector", value: "50 Ω BNC" },
    { key: "dimensions", value: "2.6 × 2.1 × 2.1 m" },
  ],
  "ACF-01B": [
    { key: "band", value: "30 – 1000 MHz" },
    { key: "insertion", value: "17 dB ± 4 dB" },
    { key: "maxInput", value: "30 A peak, 5 W peak" },
    { key: "dimensions", value: "600 × 105 × 80 mm" },
    { key: "weight", value: "6.5 kg" },
  ],

  // Coupling and decoupling. Figures per type family, as the tables are.
  // The IEC/EN 61000-4-6 networks and the clamps are the 2026 datasheets; the
  // ABCL-20 is still the older catalogue, which is the only place the head
  // office publishes it.
  "CDN-AF2 … AF8": [
    { key: "band", value: "150 kHz – 230 MHz" },
    { key: "insertion", value: "10 dB ± 1 dB to 80 MHz" },
    { key: "connector", value: "N / 2 mm safety sockets" },
    { key: "dimensions", value: "160 × 82 × 240 mm" },
  ],
  "CDN-M1 … M5": [
    { key: "band", value: "150 kHz – 230 MHz" },
    { key: "port", value: "1000 V / 125 A max." },
    { key: "connector", value: "N / 4 mm MC safety sockets" },
    { key: "dimensions", value: "160 × 102 × 240 mm" },
  ],
  "CDN-T2 / T4 / T8": [
    { key: "band", value: "150 kHz – 230 MHz" },
    { key: "insertion", value: "10 dB ± 1 dB" },
    { key: "connector", value: "N / 2 mm safety socket" },
    { key: "dimensions", value: "160 × 82 × 240 mm" },
  ],
  "CDN-RJ45": [
    { key: "band", value: "150 kHz – 230 MHz" },
    { key: "connector", value: "RJ45 socket, 8-pin" },
    { key: "dimensions", value: "160 × 82 × 240 mm" },
  ],
  "CDN-CAN-L4 / L5": [
    { key: "band", value: "150 kHz – 230 MHz" },
    { key: "connector", value: "9-pin Sub-D socket" },
    { key: "dimensions", value: "160 × 82 × 240 mm" },
  ],
  "CDN-S1 … S25": [
    { key: "band", value: "10 kHz – 230 MHz" },
    { key: "connector", value: "BNC, XLR or Sub-D" },
    { key: "dimensions", value: "160 × 82 × 240 mm" },
  ],
  "CDN-USB / HDMI / Firewire / RJ45-S": [
    { key: "band", value: "10 kHz – 230 MHz" },
    { key: "connector", value: "USB-A / B / C, HDMI, FireWire, RJ45" },
    { key: "dimensions", value: "160 × 82 × 240 mm" },
  ],

  // Coupling networks for IEC/EN 61000-4-16, from `Frankonia_DS_CN16+IT`.
  "CN AF2 / AF4 / AF8": [
    { key: "band", value: "DC / 15 Hz – 150 kHz" },
    { key: "testLevel", value: "50 V cont., 300 V for 1 s" },
    { key: "port", value: "50 V / 0.5 A" },
    { key: "connector", value: "Clamp terminal" },
  ],
  "CN M2 / M3 / M4 / M5": [
    { key: "band", value: "15 Hz – 150 kHz (AC), DC" },
    { key: "testLevel", value: "50 V cont., 300 V for 1 s" },
    { key: "port", value: "250 VAC / 32 A" },
    { key: "connector", value: "4 mm safety banana jack" },
  ],
  "CN T2 / T4 / T8": [
    { key: "band", value: "DC / 15 Hz – 150 kHz" },
    { key: "conversion", value: "60 dB (15 Hz – 150 kHz)" },
    { key: "port", value: "50 V / 0.5 A" },
    { key: "connector", value: "Clamp terminal" },
  ],
  "CN RJ45": [
    { key: "band", value: "DC / 15 Hz – 150 kHz" },
    { key: "port", value: "50 V / 0.5 A" },
    { key: "connector", value: "Clamp terminal" },
  ],
  "IT-6 / IT-16 / IT-20": [
    { key: "powerOut", value: "1380 / 3680 / 4600 VA" },
    { key: "output", value: "230 V / 6 · 16 · 20 A" },
    { key: "conversion", value: "60 dB (15 Hz – 150 kHz)" },
    { key: "weight", value: "18 / 34 / 45 kg" },
  ],

  "EMCL-20": [
    { key: "band", value: "10 kHz – 1 GHz" },
    { key: "maxInput", value: "100 W, 15 min to 100 MHz" },
    { key: "connector", value: "N-type female" },
    { key: "dimensions", value: "640 × 120 × 135 mm" },
    { key: "weight", value: "approx. 10.5 kg" },
  ],
  "EMCL-35": [
    { key: "band", value: "10 kHz – 1 GHz" },
    { key: "maxInput", value: "100 W, 15 min to 100 MHz" },
    { key: "connector", value: "N-type female" },
    { key: "dimensions", value: "665 × 160 × 135 mm" },
    { key: "weight", value: "approx. 14 kg" },
  ],
  "ABCL-20": [
    { key: "band", value: "100 kHz – 1000 MHz" },
    { key: "dimensions", value: "632 × 120 × 80 mm" },
    { key: "weight", value: "7 kg" },
  ],
  "BCI probe": [
    { key: "band", value: "1 MHz – 400 MHz" },
    { key: "maxInput", value: "100 W, 45 min to a 90 °C core" },
    { key: "connector", value: "Type N female" },
  ],

  // Integrated systems. See the note on `testModels`: these are the 2026
  // datasheets' figures, not the older website pages'.
  "CIT-100": [
    { key: "band", value: "4 kHz – 1.2 GHz" },
    { key: "amplifier", value: "25 / 75 / 200 W modules" },
    { key: "voltmeter", value: "3 ch, −40 … +33 dBm" },
    { key: "eutMonitor", value: "0 – 10 V, 100 kΩ" },
    { key: "interface", value: "USB 2.0, LAN, GPIB opt." },
  ],
  "CIT-1000": [
    { key: "band", value: "4 kHz – 1.2 GHz" },
    { key: "amplifier", value: "25 / 75 / 200 W modules" },
    { key: "voltmeter", value: "3 ch, −40 … +33 dBm" },
    { key: "eutMonitor", value: "0 – 10 V, 100 kΩ" },
    { key: "interface", value: "USB 2.0, LAN, GPIB opt." },
  ],
  "ECU-6": [
    { key: "generator", value: "8 kHz – 6.2 GHz" },
    { key: "level", value: "−65 … +13 dBm" },
    { key: "outputs", value: "3 × SMA, relay switched" },
    { key: "channels", value: "power meter, max. 7" },
    { key: "weight", value: "18 kg" },
  ],
  "PSG-300": [
    { key: "powerBw", value: "DC – 300 kHz" },
    { key: "generator", value: "DC, 0.05 Hz – 300 kHz" },
    { key: "output", value: "50 Vrms / 5 Arms" },
    { key: "powerOut", value: "260 W" },
    { key: "weight", value: "approx. 24 kg" },
  ],
  "PSG-300A": [
    { key: "powerBw", value: "DC – 300 kHz" },
    { key: "generator", value: "DC, 0.05 Hz – 300 kHz" },
    { key: "output", value: "50 Vrms / 16 Arms" },
    { key: "powerOut", value: "800 W" },
    { key: "weight", value: "approx. 32 kg" },
  ],
  "MTS-800": [
    { key: "band", value: "DC – 250 kHz" },
    { key: "magField", value: "up to 1000 A/m" },
    { key: "amplifier", value: "800 W, 16 Arms, 50 Vrms" },
    { key: "adc", value: "16 bit, 1.0 MSPS" },
    { key: "weight", value: "approx. 34 kg" },
  ],
};

/** The sentence, where the head office writes one about this model by name.
 *  English is its wording; Korean is a translation of that, not new copy. */
const modelLead: Record<Lang, Record<string, string>> = {
  en: {
    "ALX-4000E":
      "The ALX-4000E is an especially optimized version for emission measurements. It offers lower antenna factors and improved VSWR. Additionally it can be used for immunity tests which require an input power of less than 100 W cw (200 W intermitt.).",
    "ALX-8000E":
      "The ALX-8000E has an extended frequency range up to 8 GHz. All antennas are supplied with antenna factors for 3.0 m and 10.0 m measuring distance (1.0 m on request).",
    "MAX-9":
      "The MAX-9 is especially suitable for immunity testing acc. to IEC 61000-4-3 because of its good field uniformity. Its further outstanding characteristics are the wide bandwidth, the nearly constant high gain, very good impedance matching as well as equal beamwidth in E- and H-plane.",
    "SAX-10":
      "The active monopole antenna SAX-10 consists of a vertical rod and an impedance matching amplifier. The rod has a standard length of 1.0 m and can be considered as short compared to the wave length in the frequency range 9 kHz – 30 MHz; the conversion factor is independent of the frequency because of the extremely high impedance of the matching amplifier. To avoid absolutely any influence by the mains, the SAX-10 has built-in NiMH rechargeable batteries.",
    "LAX-10":
      "Active, shielded loop antenna with a nearly constant antenna factor over the entire frequency range, battery driven to minimize disturbance influence from the power line. It can be used for the frequency selective measurement of magnetic fields in the long wave, mid wave and short wave frequency ranges, for testing according to CISPR, MIL, FCC, EN, ISO, ANSI, ETSI and many other standards.",
    "EFS-Laser":
      "The EFS-Laser is a smart, fast, extremely accurate electric field probe, which provides linearization, temperature compensation, control and communication functions. Noise reduction and temperature compensation allow accurate measurements down to 0.1 V/m. The probe is laser-powered to allow continuous, galvanically isolated operation without recharging or battery replacement.",
    "EFS-18":
      "EFS-18 is a new generation isotropic electric field sensor based on diode dipoles. The characteristics of bandwidth, sensitivity and speed make this sensor unique in their kind. It has been designed to be used in the characterization of the electric field in TEM and GTEM cells, in anechoic chambers, and for monitoring applications of areas and critical points for electromagnetic safety. The EMCViewer software supplied with the probe shows the isotropic value, the single axes components and the amplitude/time response, and can manage up to eight sensors simultaneously.",
    "FPA-2":
      "The FPA-2 and FPA-6A are ESD protected to prevent defects by unintentional electrostatic discharge. Pre-amplifiers are generally ESD-sensitive devices, so it remains important to discharge coaxial cables before they are connected.",
    "FPA-6A":
      "The FPA-2 and FPA-6A are ESD protected to prevent defects by unintentional electrostatic discharge. Pre-amplifiers are generally ESD-sensitive devices, so it remains important to discharge coaxial cables before they are connected.",
    "FPA-6B":
      "The FPA-6B offers a frequency range from 9 kHz to 6 GHz. For technical reasons it cannot be ESD-protected and special care is necessary: pre-amplifiers are ESD-sensitive devices, and coaxial cables must be discharged before being connected.",
    "PMS 1084":
      "In the standard version a 2-channel RF-Power Meter for the frequency range from 100 kHz up to 6 GHz, with a measuring range from −60 dBm to +20 dBm. It is possible to upgrade it up to max. 4 measuring channels at any time, which makes it very well suited to the automated measurement of forward and reverse power in immunity test systems acc. to IEC/EN 61000-4-3 / -6.",
    RSU: "The RSU RF-Relay Switching Unit is applicable for all fields of RF- and EMC measurements to switch, manually or remote controlled, from one input to 2 or 3 outputs. Typical applications in measuring systems are changeover switching between different amplifiers, antennas or power meters. This does also prevent circuit faults due to wrong cabling.",
    "CIT-100":
      "The CIT-100 is a complete test system for conducted RF-immunity testing and BCI-testing acc. to IEC/EN 61000-4-6, ISO 11452-4, MIL-STD 461, CS114 and similar standards. A signal generator, an RF-power amplifier, a 3-channel RF-power-meter, a directional coupler and the control software sit in one 19″ case, and every instrument in it can also be used separately over its own connector.",
    "CIT-1000":
      "The CIT-1000 is the CIT-100's larger sibling: the same complete system for conducted RF immunity and BCI testing, extended where the smaller unit stops. The generator, directional coupler and RF voltmeter reach 1.2 GHz, so the unit can drive a radiated immunity test to IEC/EN 61000-4-3 as well; an external power amplifier can be connected for that; and the frequency extension for MIL-STD 461 reaches down to 4 kHz through the external CIT-4K with its 250 W amplifier. It runs stand-alone from an integrated touch-screen PC, and a temperature input reads the BCI clamp.",
    "ECU-6":
      "The ECU-6 is a central EMC test and control unit, which combines in just one compact box many major test components like signal generator, power meter, directional couplers and relay switching unit, which are needed for EMC tests. That reduces the cabling work and possible cabling mistakes to a minimum. It allows to control and to switch automatically between up to three external amplifiers and up to three different outputs for antennas or coupling devices, and it includes EUT-monitoring and an interlock safety system. The integrated signal generator covers 8 kHz to 6.2 GHz, with amplitude, pulse and frequency modulation.",
    "PSG-300":
      "The PSG-300 is an ultra-wideband linear power amplifier developed for signal frequencies from DC to 300 kHz. It is particularly suitable for demanding applications involving dynamic high-power signal generation, and for immunity tests according to IEC/EN 61000-4-16, IEC/EN 61000-4-19, IEC/EN 61543 and IEC 60255. The integrated output stage provides up to 260 W — 800 W in the PSG-300A — with a fixed gain factor of 10, and a built-in waveform generator supplies sine, square and triangle signals which the power stage amplifies internally.",
    "MTS-800":
      "The MTS-800 is a space-saving test system for generating and analyzing magnetic fields in the frequency range from DC to 250 kHz. Thanks to the integrated power amplifier, the high field strengths required by many military and automotive standards can be reliably achieved without additional effort. It consists of a signal generator (DC – 250 kHz), a power amplifier with 800 W output power over DC – 1 MHz, and a 16-bit spectrum analyzer sampling at 1 MS/s; with the optional triaxial Helmholtz coil, testing is fully automated and the EUT never has to be turned.",
    "ERX-6":
      "The ERX-6 combines the advantages of a traditional EMI-receiver with the ultra-fast FFT-technology (time domain). It measures in 162 MHz frequency segments and outperforms comparable top-of-the-range devices many times over. The delivery already includes a control software that runs on the receiver's own touch screen, so no external PC is required.",
    "ERC-6":
      "The ERC-6 is the less expensive little brother of the ERX-6: only properties that are not required for full-compliance EMI measurements according to CISPR 16-1 have been reduced or omitted. The receiver can be operated from its integrated 10″ touch PC or from external software, which then also drives the antenna mast and the turntable.",
    "ACF-01B":
      "The absorbing clamp is used for measurements according to CISPR 13 / 14 / EN 55014-1. The power cord of the equipment under test is extended to 6.0 m, fed through the clamp's opening and laid on a non-metallic table; the clamp, which is moveable on wheels, is then driven along the cable and the maximum resonance detected is the measuring value. Because the clamp is constructed to have 17 dB coupling attenuation, the receiver voltage in dBµV equals the interference power in dBpW.",
    "ABCL-20":
      "The ABCL-20 is recommended as an additional decoupling network — a ferrite tube clamp — for immunity testing according to IEC/EN 61000-4-6 when the clamp injection method is used. It shall be used on all cables between EUT and AE except the cable under test. It prevents the test signal applied to the EUT from affecting other devices, equipment or systems which are under test, and improves the reproducibility of the test results.",
    "BCI probe":
      "The bulk current injection probe is used to inject RF current into cables of electrical equipment to test the susceptibility against radiated electromagnetic energy. It was designed to meet ISO 11452-4:2005 and IEC 61000-4-6 for automotive BCI testing with secondary currents of 300 mA and more, and can be clamped around test conductors supporting cable harness diameters up to 40 mm.",
    "CN M2 / M3 / M4 / M5":
      "For each wire the coupling network for powerline conductors is made of a series connection of a resistor and a capacitor; the networks of each wire are connected to establish the coupling network of the corresponding M-type. The capacitor is 1.0 µF and the resistor 100 × n Ω, where n is the number of wires, both matching within a limiting deviation of 1 %. For direct current tests the capacitors shall be short circuited, and for safety reasons M2 and M3 are separate units for DC tests and for AC tests: short circuiting the capacitor by mistake while an alternating current is applied inevitably destroys the coupling network.",
    "CN T2 / T4 / T8":
      "For balanced communication lines and similar lines a “T” network is used. It is made of capacitors of 4.7 µF, resistors of 200 Ω and inductances of 2 × 38 mH in a bifilar winding. All components shall match with a limiting deviation to ensure that there is no significant reduction of the differential to common mode conversion loss of the EUT.",
    "IT-6 / IT-16 / IT-20":
      "In a balanced three-phase power supply system, three conductors each carry an alternating current of the same frequency and voltage relative to a common reference but with a phase difference of one third of the period. Such a system may be galvanically isolated with three identical isolation transformers with high common mode rejection. A three-phase system constructed from three individual single-phase transformers requires a balanced load — the neutral wire does not carry any current — and for safety reasons the neutral wire should not be connected to the EUT.",
    LVVL:
      "The LVVL is a fully compliant, calibrated 2.0 m large loop antenna that complies with CISPR-15 / EN 55015 section 7.2 and annex B, over a calibrated frequency range of 9 kHz to 30 MHz. It is a complete 3-axis antenna with a switching unit to select each loop in turn; the loops are 2 metres in diameter with the lowest point 0.5 metres above ground, and are fitted with specially designed current transducers in fully screened housings.",
  },
  zh: {
    "ALX-4000E":
      "ALX-4000E 是针对发射测量进行优化的版本。更低的天线系数和改进的 VSWR。它还可用于连续输入小于 100 W（间歇输入 200 W）的抗扰度测试。",
    "ALX-8000E":
      "ALX-8000E是将频率范围扩展到8GHz的型号。所有天线均配备用于测量 3.0 m 和 10.0 m 距离（根据要求可提供 1.0 m）的天线系数。",
    "MAX-9":
      "MAX-9具有良好的电场均匀性，特别适合IEC 61000-4-3抗扰度测试。宽带宽、几乎恒定的高增益、出色的阻抗匹配以及E和H平面的波束宽度相等也是该天线的特点。",
    "SAX-10":
      "SAX-10有源单极天线由垂直杆和阻抗匹配放大器组成。标准棒长为1.0 m，与9 kHz至30 MHz频段的波长相比可以认为是短的。匹配放大器的阻抗非常高，以至于转换系数与频率无关。内置镍氢充电电池，完全排除市电影响。",
    "LAX-10":
      "一种有源屏蔽环形天线，其天线系数在所有频段上几乎恒定。它使用电池供电，以最大限度地减少电源线的干扰。用于长波、中波、短波频段磁场的选频测量，支持CISPR、MIL、FCC、EN、ISO、ANSI、ETSI等多种标准测试。",
    "EFS-Laser":
      "EFS-Laser是一种精密电场探头，具有线性化、温度补偿、控制和通信功能。精确测量低至 0.1 V/m，并具有降噪和温度补偿功能。该探头由激光器供电，因此它可以在电流隔离下连续运行，无需充电或更换电池。",
    "EFS-18":
      "EFS-18是采用二极管偶极子的新一代各向同性电场传感器。此类传感器的带宽、灵敏度和速度的结合是无与伦比的。它旨在测量TEM·GTEM室和电波暗室内的电场特性，并监测工作区域和关键点的电磁波安全。随附的 EMCViewer 软件可显示各向同性值、轴特定分量、幅度和时间响应，并可同时管理多达 8 个传感器。",
    "FPA-2":
      "FPA-2和FPA-6A具有ESD保护，以防止由于无意的静电放电而发生故障。前置放大器本质上对静电敏感，因此在连接前应对同轴电缆进行放电。",
    "FPA-6A":
      "FPA-2和FPA-6A具有ESD保护，以防止由于无意的静电放电而发生故障。前置放大器本质上对静电敏感，因此在连接前应对同轴电缆进行放电。",
    "FPA-6B":
      "FPA-6B覆盖9kHz至6GHz。由于技术原因，无法安装ESD保护，因此处理时必须小心——前置放大器是静电敏感器件，连接前必须对同轴电缆进行放电。",
    "PMS 1084":
      "标准规格为100kHz至6GHz 2通道射频功率计，测量范围为-60dBm至+20dBm。最多可随时扩展 4 个通道，非常适合在 IEC/EN 61000-4-3/-6 抗扰度测试系统中自动测量渐进功率和反射功率。",
    RSU: "RSU RF继电器开关单元在RF和EMC测量中将一个输入转换为两个或三个输出。有手动和遥控两种方式。在测量系统中，用于不同放大器、天线、功率计之间的切换，也可防止因接线错误而引起的电路事故。",
    "CIT-100":
      "CIT-100是一套完整的传导射频抗扰度测试和BCI测试系统，符合IEC/EN 61000-4-6、ISO 11452-4、MIL-STD 461 CS114等标准。信号发生器、射频功率放大器、3通道射频功率计、定向耦合器和控制软件包含在一个19英寸的机箱中，内置仪器可以通过各自的接口单独使用连接器。",
    "CIT-1000":
      "CIT-1000是CIT-100的更高型号。它与传导射频抗扰度和 BCI 测试的完整系统相同，并且在较小型号未完成的方面走得更远。发生器、定向耦合器和射频电压表的频率最高可达 1.2 GHz，并通过连接外部功率放大器进行 IEC/EN 61000-4-3 辐射抗扰度测试。 MIL-STD 461 的低通扩展由外部 CIT-4K 和低至 4 kHz 的 250 W 放大器提供。它通过内置触摸屏 PC 独立运行，并通过温度输入读取 BCI 钳位温度。",
    "ECU-6":
      "ECU-6 是一款中央测试和控制单元，它将 EMC 测试所需的主要组件（信号发生器、功率计、定向耦合器和继电器开关单元）集中在一个盒子中。将接线工作和接线错误减少到最低限度。它可在最多 3 个外部放大器和最多 3 个天线/耦合设备之间自动切换，并配备 EUT 监控和联锁安全系统。内置信号发生器覆盖 8 kHz 至 6.2 GHz，支持幅度、脉冲和频率调制。",
    "PSG-300":
      "PSG-300是一款针对DC至300kHz信号开发的超宽带线性功率放大器。它特别适合需要在高输出功率下处理快速变化信号的应用，以及根据 IEC/EN 61000-4-16、IEC/EN 61000-4-19、IEC/EN 61543 和 IEC 60255 进行抗扰度测试的应用。内置输出级可产生最大 260 W 的功率 — 较高型号的 PSG-300A 可产生 800 W — 增益固定为 10，并且输出级放大内置波形发生器产生的正弦波、方波和三角波。",
    "MTS-800":
      "MTS-800 是一款节省空间的测试系统，可生成和分析 DC 至 250 kHz 磁场。内置功率放大器，无需任何额外设备即可稳定获得各种军用和汽车标准所需的高磁场强度。它由信号发生器（DC~250 kHz）、DC~1 MHz频段800 W功率放大器和1 MS/s 16位频谱分析仪组成。当与可选的三轴亥姆霍兹线圈一起使用时，测试是完全自动化的，并且在测试过程中无需转动 EUT。",
    "ERX-6":
      "ERX-6是一款结合了传统EMI接收器和超快速FFT（时域）技术优点的仪器。在 162 MHz 频段进行测量，其性能比同类中最好的型号好几倍。无需外部 PC，因为它包含在接收器自己的触摸屏上运行的控制软件。",
    "ERC-6":
      "ERC-6是ERX-6的低成本版本。我们仅减少或删除了 CISPR 16-1 完全合规发射测量不需要的功能。它可以通过内置的10英寸触摸PC或外部软件进行操作，在后者的情况下，它甚至可以控制天线杆和转盘。",
    "ACF-01B":
      "吸收夹用于 CISPR 13/14、EN 55014-1 测量。将被测设备的电源线延长至6.0m，穿过钳口，置于非金属桌面上，将轮式钳沿电缆推向电源，将检测到的最大谐振值作为测量值。由于我们创建了 17 dB 的组合衰减，因此接收器电压 (dBμV) 变为骚扰功率 (dBpW)。",
    "ABCL-20":
      "ABCL-20是一种铁氧体管夹，在使用夹注入方法执行IEC/EN 61000-4-6抗扰度测试时用作附加隔离网络。它连接 EUT 和 AE 之间的所有电缆（待测电缆除外）。它可以防止施加到 EUT 的测试信号影响其他被测器件、设备和系统，从而提高测试结果的可重复性。",
    "BCI probe":
      "BCI探头将射频电流注入电气设备的电缆中，以测试其对辐射电磁能的抗扰度。根据 ISO 11452-4:2005 和 IEC 61000-4-6 设计，适用于次级电流为 300 mA 或以上的汽车 BCI 测试。它可以轻松夹在测试导体上，并支持直径达 40 毫米的线束。",
    "CN M2 / M3 / M4 / M5":
      "电源线的耦合网络是每条线路串联一个电阻和一个电容构成的，M串联耦合网络将每条线路的电路捆绑在一起。电容为1.0 µF，电阻为100 × n Ω（n为线数），两个值均调整至1%误差以内。对于直流测试，必须将电容器短路，但出于安全考虑，M2和M3是单独的单元进行直流测试和交流测试——因为在施加交流电时错误地短路电容器将不可避免地破坏耦合网络。",
    "CN T2 / T4 / T8":
      "“T”网络用于平衡通信线路和等效线路。它由一个 4.7 µF 电容器、一个 200 Ω 电阻器和一个电感为 2 × 38 mH 的双柱绕组组成。所有组件必须在指定偏差内对齐，以确保 EUT 的差模到共模转换损耗不会显着恶化。",
    "IT-6 / IT-16 / IT-20":
      "在平衡三相电源中，三个导体流过与通用标准相同频率和电压的交流电，相位变化1/3周期。这些系统可以通过三个具有高共模抑制比的相同隔离变压器进行电隔离。当用单相变压器架构建三相电网时，负载必须平衡——以便没有电流流过中性线——并且出于安全原因，中性线不连接到EUT。",
    LVVL:
      "LVVL 是经过校准的 2.0 m 大环形天线，完全符合 CISPR-15/EN 55015 第 7.2 节和附件 B。校准频段为 9 kHz 至 30 MHz。它是完全三轴配置，每个环路由切换单元轮流选择，环路直径为 2.0 m，最低点距地面 0.5 m。在全屏蔽外壳中配备专用电流传感器。",
  },
};

/** This model's panel. Both halves are optional and both are often absent —
 *  see the note above. A model with neither renders as the plain row it was. */
export const testModelBody = (lang: Lang, name: string): TestModelBody => ({
  lead: modelLead[lang][name],
  facts: modelFacts[name],
});

/** Column headings for the Test Systems mega dropdown. The captions under each
 *  link come from the test category's and the product family's own meta. */
export const testNavCopy = {
  zh: {
    byTest: "按检测项目",
    byProduct: "按产品组",
  },
  en: {
    byTest: "By Test",
    byProduct: "By Product",
  },
} as const;

/** Paths, relative to the locale root. */
export const testSystemsPath = "/test-systems";
export const testCategoryPath = (c: TestCategory) => `/test-systems/test/${c}`;
export const testProductPath = (p: TestProduct) => `/test-systems/product/${p}`;
export const testStandardsPath = "/test-systems/standards";
