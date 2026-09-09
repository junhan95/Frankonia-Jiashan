/**
 * The head office's datasheet for an instrument, served from this origin.
 *
 * This is the one place on the site that keeps a copy of a head-office PDF
 * rather than linking to it, and the reasoning is worth stating because the
 * `Documents` band a few files over argues the opposite for the nine catalogues.
 *
 * A catalogue is a forty-page brochure covering a whole branch; it is revised
 * as a whole, and the head office's download area is where a reader who wants
 * one goes. A datasheet is the two-to-nine-page sheet for a single instrument,
 * and it is what a reader who has just opened the CIT-100 row is looking for.
 * Sending them to a download area to find it again by name — on a page written
 * in German-flavoured English, listing every product in the branch — is the
 * step this table removes. These are the 2026 sheets the head office sent in
 * August 2026 (`D:\FRANKONIA\FRF\Datasheet`), and they carry no per-country
 * pricing or availability, which is what would otherwise make a copy go stale
 * in a way a reader could not detect.
 *
 * Thirteen sheets, ~18 MB in the export. Nothing is fetched until a reader
 * presses the pill: the panel carries a link, not an embed.
 *
 * See `docs/source/test-systems-assets.md` §Datasheets for the ledger — what
 * each file was called at the head office, which edition it is, and which
 * instruments the head office has not published a sheet for.
 */

type Datasheet = {
  /** Under `public/test-systems/datasheets/`. Renamed to the designation it
   *  covers: the head office's own names (`_ecu6g_2026_digital.pdf`,
   *  `_erx-6_webversion_neu_2026_digital.pdf`) carry its production history
   *  rather than the product, and a reader who saves one wants to find it
   *  again by the model on their quotation. */
  file: string;
  /** Size on disk. Written down rather than measured, because this is a static
   *  export: nothing at render time can stat a file. `npm test` compares the
   *  two, so a revised sheet copied in without this line being updated fails
   *  the suite instead of mis-stating the download to a reader on a phone. */
  bytes: number;
  /** What the file was called when it arrived. The one field here that is not
   *  used by the page — it is how the next revision is matched against the one
   *  in the export. */
  source: string;
};

const sheets = {
  "cit-100": { file: "cit-100.pdf", bytes: 950399, source: "cit-100_datasheet_2026_05_digital.pdf" },
  "cit-1000": { file: "cit-1000.pdf", bytes: 874418, source: "cit-1000_2026_digital.pdf" },
  "ecu-6": { file: "ecu-6.pdf", bytes: 1039657, source: "_ecu6g_2026_digital.pdf" },
  "psg-300": { file: "psg-300.pdf", bytes: 1281849, source: "psg300_2026_digital.pdf" },
  "mts-800": { file: "mts-800.pdf", bytes: 739070, source: "_mts800_2026_digital.pdf" },
  "erx-6": { file: "erx-6.pdf", bytes: 1289074, source: "_erx-6_webversion_neu_2026_digital.pdf" },
  lisn: { file: "lisn-c2-16-c4-32.pdf", bytes: 1347026, source: "lisn_2025_digital.pdf" },
  "efs-18": { file: "efs-18.pdf", bytes: 5402221, source: "EFS-18-datasheet_2026.pdf" },
  "emcl-20": { file: "emcl-20.pdf", bytes: 1302183, source: "emcl_20-2026_digital.pdf" },
  "emcl-35": { file: "emcl-35.pdf", bytes: 1092465, source: "emcl_35-2026_digital.pdf" },
  "bci-clamp": { file: "bci-clamp.pdf", bytes: 805995, source: "_bci_clamp_2026_digital.pdf" },
  cdn: { file: "cdn.pdf", bytes: 1947402, source: "_cdn_digital.pdf" },
  "cn-16": { file: "cn-16.pdf", bytes: 465497, source: "Frankonia_DS_CN16+IT(1_3).pdf" },
} as const satisfies Record<string, Datasheet>;

type SheetKey = keyof typeof sheets;

/**
 * Which sheet covers which model, keyed by `TestModel.name`.
 *
 * Not one-to-one in either direction, and neither half of that is an error:
 *
 * - **One sheet, several models.** The head office writes one sheet per
 *   *product*, and a product is sometimes a family. `PSG-300` and `PSG-300A`
 *   are the 5 A and the 16 A build of one generator and share a sheet that
 *   prints both columns; the `LISN C2-16 / C4-32` sheet is titled after both;
 *   the CDN sheet is twelve pages covering every coupling network the branch
 *   sells. Pointing all of them at the one file is what the source supports —
 *   splitting a shared sheet per model would mean editing the head office's
 *   PDF, which this site does not do.
 * - **Models with no sheet.** `LISN-KFZ`, `LISN-MIL`, `ERC-6`, the PMS meters,
 *   the RSU, the four EFS probes below the EFS-18, the near-field probes and
 *   all seventy amplifiers are not in this table, because the head office has
 *   not published a sheet for them. A row with no entry simply does not draw
 *   the pill — the enquiry beside it is how a reader asks for that one, and it
 *   is already addressed to the model. Do not point such a row at a
 *   neighbouring family's sheet: a reader who downloads "the datasheet" from
 *   the LISN-MIL row and gets the C2-16's has been told something false.
 */
const byModel: Record<string, SheetKey> = {
  "CIT-100": "cit-100",
  "CIT-1000": "cit-1000",
  "ECU-6": "ecu-6",
  "PSG-300": "psg-300",
  "PSG-300A": "psg-300",
  "MTS-800": "mts-800",
  "ERX-6": "erx-6",
  "C2-16": "lisn",
  "C4-32": "lisn",
  "EFS-18": "efs-18",
  "EMCL-20": "emcl-20",
  "EMCL-35": "emcl-35",
  "BCI probe": "bci-clamp",
  "CDN-AF2 … AF8": "cdn",
  "CDN-M1 … M5": "cdn",
  "CDN-T2 / T4 / T8": "cdn",
  "CDN-RJ45": "cdn",
  "CDN-CAN-L4 / L5": "cdn",
  "CDN-S1 … S25": "cdn",
  "CDN-USB / HDMI / Firewire / RJ45-S": "cdn",
  // One sheet for the whole IEC/EN 61000-4-16 family, transformers included:
  // the head office publishes the coupling networks and the IT transformers in
  // a single eight-page document, which is why the five rows point at one file.
  "CN AF2 / AF4 / AF8": "cn-16",
  "CN M2 / M3 / M4 / M5": "cn-16",
  "CN T2 / T4 / T8": "cn-16",
  "CN RJ45": "cn-16",
  "IT-6 / IT-16 / IT-20": "cn-16",
};

/** Site-relative path to a sheet. The caller prefixes the base path — raw
 *  `<a href>` does not get Next's rewriting, so the GitHub Pages build needs
 *  `asset()` around this the same way an `<img src>` does. */
const datasheetPath = (key: SheetKey) => `/test-systems/datasheets/${sheets[key].file}`;

/**
 * How the size is printed on the pill.
 *
 * Binary megabytes and one decimal, which is what both Windows and macOS show
 * for the same file — a reader who saves `efs-18.pdf` and sees 5.15 MB in their
 * downloads folder should not have to wonder whether they got the whole thing.
 * The unit is not translated: `MB` is `MB` in both locales.
 *
 * It is printed at all because one of these is 5 MB and the rest are around
 * one, and a reader on a phone deciding whether to pull that down deserves to
 * be told before they press rather than after.
 */
const megabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** The sheet for a model, or nothing — see the note on `byModel`. */
export const datasheetFor = (name: string) => {
  const key = byModel[name];
  if (!key) return undefined;
  return { href: datasheetPath(key), size: megabytes(sheets[key].bytes) };
};

/** Every sheet, for the test that checks the table against the export. */
export const datasheetFiles = (Object.keys(sheets) as SheetKey[]).map((key) => ({
  path: datasheetPath(key),
  bytes: sheets[key].bytes,
}));
