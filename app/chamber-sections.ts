import { industries, type Industry } from "./industries";
import type { PageBody } from "./page-body";
import type { Lang } from "./site-config";

/**
 * The Anechoic Chambers branch of the navigation, and the model data both of
 * its index axes read from.
 *
 * The head office lists the same 27 chambers on one filtered portfolio page
 * (frankonia-solutions.com/chambers-2/), tagging each with an industry. A
 * chamber also has a form — semi-anechoic, fully anechoic, compact — which
 * that page carries only inside per-model tag strings and never surfaces as a
 * way in. Those are two independent axes over one set of products, which is
 * why the models live here as data with an `industry` and a `type` field
 * rather than in a folder per category: a folder tree can express one axis,
 * and we need both.
 */

/** Industry filter, in the head office's own order of prominence. The list
 *  itself lives in industries.ts because the test-system branch sorts by the
 *  same five. */
/**
 * The industries the chamber branch sorts by. Four of the shared five: the
 * chamber range has nothing left that does not belong to one of them, now
 * that the reverberation chambers are filed by what they are built to test
 * and the shielded room sits with the commercial range the catalogue puts it
 * in. `others` stays in `industries` because the test-system branch still
 * uses it — the slug set is shared so the two branches can point at each
 * other, not so they must carry the same categories.
 */
export const chamberIndustries = industries.filter(
  (i): i is Exclude<Industry, "others"> => i !== "others",
);

export type ChamberIndustry = (typeof chamberIndustries)[number];

/** Chamber form. Largest family first, single-model families last. */
export const chamberTypes = [
  "sac",
  "fac",
  "chc",
  "component",
  "rvc",
  "shielded-room",
] as const;

/** Standalone pages under Anechoic Chambers that are not model indexes.
 *
 *  All but one map to a page the head office already publishes. `stirrers` is
 *  the exception and the only page on this site with no counterpart over
 *  there: the head office spreads the stirrer across the Reverberation Chamber
 *  page's Features list, the 2026 catalogue's "Frankonia Stirrers" block and
 *  the Frankonia Stirrer Systems sheet, and the reader who is choosing a
 *  reverberation chamber is choosing a stirrer. The page collects the three.
 *  See docs/source/chambers-stirrers.md — including how the sheet's two
 *  project columns are carried: as the RVC XL variants, without the name of
 *  the customer they were built for. */
export const chamberTopics = [
  "frankosorb",
  "shielding-gates",
  "automation",
  "stirrers",
  "services",
  "references",
] as const;

export type ChamberType = (typeof chamberTypes)[number];
export type ChamberTopic = (typeof chamberTopics)[number];

/** Narrows to the chamber branch's four, not the shared five. Re-using
 *  `isIndustry` here let `others` through the route guard while the meta
 *  tables no longer had an entry for it — the type checker caught it, and
 *  this is the fix rather than a cast at each call site. */
export const isChamberIndustry = (value: string): value is ChamberIndustry =>
  (chamberIndustries as readonly string[]).includes(value);
export const isChamberType = (v: string): v is ChamberType =>
  (chamberTypes as readonly string[]).includes(v);
export const isChamberTopic = (v: string): v is ChamberTopic =>
  (chamberTopics as readonly string[]).includes(v);

export type ChamberModel = {
  /** Product name exactly as the head office writes it. Not translated: these
   *  are model designations, and a Korean rendering would not match the
   *  catalogue, the drawings or the quotation. */
  name: string;
  /** One-line descriptor from the head office portfolio card. */
  desc: string;
  /** `industry` is single-valued because the source data is: every model
   *  carries exactly one `us_portfolio_category-*`. Widen to an array only
   *  when we deliberately cross-list a model, not by default. */
  industry: ChamberIndustry;
  type: ChamberType;
  /** Head office portfolio slug — the source page for this model's content,
   *  under frankonia-solutions.com/portfolio/. Kept so the content pass can
   *  find each original without searching for it again. */
  source: string;
  /**
   * Our own slug, for `/chambers/model/<slug>`.
   *
   * Usually the same string as `source`, which keeps the ledger checkable by
   * eye — but it is deliberately a separate field, because the two answer
   * different questions. `source` is where the material came from; `slug` is
   * where a reader of this site lands. Three models differ:
   *
   * - EDTC-SA — the head office files it under `edtc` and titles the page just
   *   "EDTC". The catalogue calls it EDTC-SA, and so do we.
   * - SAC-10 Plus Triton — the head office slug is `triton` alone. Spelled out
   *   here so it sorts and reads beside its sibling `sac-10-plus`.
   * - The seven RVCs — one page at the head office, one spread in the
   *   catalogue, and one page here. They all carry `rvc`, so every row of the
   *   model list can link somewhere that actually says something about it.
   *
   * A slug shared by several models is therefore not a mistake: the route
   * generator takes the distinct set (`chamberModelSlugs`).
   */
  slug: string;
  /**
   * Figures from the Anechoic Chambers 2026 catalogue, which is the reference
   * the content pass follows (docs/source/catalogue-2026.md). Optional because
   * it arrives model by model — a page renders what it has and says nothing
   * about what it does not.
   *
   * Both fields are the catalogue's own words, not a summary of them. `size`
   * is the external dimension L × W × H — the catalogue prints the figure with
   * no qualifier at all, and the head office's own model pages are the only
   * source that names it, as `External dimension`
   * (docs/source/chambers-models.md §2). `range` is the frequency span and the
   * absorber lining it is achieved with, which the catalogue always states
   * together because one does not mean anything without the other.
   */
  spec?: {
    size: string;
    /** Optional: the E-Drive spread gives no frequency figure at all — those
     *  chambers are specified by the load machine they are built around, and
     *  their compliance is stated as standards rather than a span. A field
     *  invented to fill the gap would be a figure the catalogue does not give. */
    range?: string;
    /** The qualifier the catalogue prints under a size: the test distance the
     *  dimensions are compliant at, or the quiet zone they produce. Optional
     *  because it only appears where the catalogue tabulates sizes separately
     *  from the frequency row — the military table folds the equivalent into
     *  `range` instead, which is how it is written there. */
    note?: string;
  };
};

/**
 * All 27 chambers. `industry` is the head office's own tag, read off the
 * portfolio grid. `type` is ours — derived from the model name and the head
 * office's per-model tag text (`semi-anechoic-…`, `fully-anechoic-…`,
 * `pre-compliant-3.0 m-compact-…`).
 *
 * Three of them — AVTC and the two MIL-STD chambers — carry no form in their
 * tag, so they are placed by what they are (large vehicle-scale chambers) and
 * should be confirmed against the model page during the content pass.
 */
export const chamberModels: readonly ChamberModel[] = [
  { name: "ACTC", desc: "CISPR 25 Automotive Component Testing Chamber", industry: "automotive", type: "component", source: "actc", slug: "actc",
    spec: { size: "6,380 × 5,480 × 3,750 mm", note: "CISPR 25 component level at 1.0 m test distance", range: "150 kHz / 26 MHz – 18 GHz (40 GHz option)" } },
  { name: "UCC", desc: "Ultra-compact hybrid chamber for pre-compliance component testing, an alternative to the GTEM cell", industry: "automotive", type: "component", source: "ucc", slug: "ucc",
    spec: { size: "4,580 × 3,080 × 2,550 mm", note: "Pre-compliant component level at 1.0 m test distance", range: "150 kHz / 26 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-10V", desc: "10.0 m Semi Anechoic Chamber for ECE R10 vehicle testing with integrated dynamometer", industry: "automotive", type: "sac", source: "sac-10-v", slug: "sac-10-v",
    spec: { size: "22,580 × 15,680 × 8,700 mm", note: "Quiet zone ø6.0 m at 10.0 m test distance (H = 3.0 m)", range: "9 kHz / 150 kHz – 18 GHz (40 GHz option)" } },
  { name: "AVTC", desc: "3.0 m Automotive Vehicle Testing Chamber for component and full-vehicle tests", industry: "automotive", type: "sac", source: "avtc", slug: "avtc",
    spec: { size: "11,480 × 9,380 × 6,000 mm", note: "Quiet zone ø3.0 m at 3.0 m test distance (H = 2.5 m)", range: "9 kHz / 150 kHz – 18 GHz (40 GHz option)" } },

  { name: "MIL CHC", desc: "Compact Hybrid Chamber for military component testing", industry: "military", type: "chc", source: "mil-chc", slug: "mil-chc",
    spec: { size: "4,880 × 4,880 × 3,000 mm", range: "9 kHz / 30 MHz – 40 GHz, hybrid absorber lining" } },
  { name: "MIL-STD Chamber", desc: "Military Testing Chamber for Vehicles and large EUTs", industry: "military", type: "sac", source: "mil-std-chamber", slug: "mil-std-chamber",
    spec: { size: "Custom size", range: "9 kHz / 80 MHz – 40 GHz, short-pyramid absorbers" } },
  { name: "MIL-STD Chamber Advanced", desc: "Military Testing Chamber for Vehicles and large EUTs, also compliant with commercial and automotive test site requirements", industry: "military", type: "sac", source: "mil-std-chamber-advanced", slug: "mil-std-chamber-advanced",
    spec: { size: "Custom size", range: "9 kHz / 26 MHz – 40 GHz long-pyramid, or 30 MHz – 40 GHz hybrid" } },

  { name: "SAC-3 Plus", desc: "3.0 m Semi Anechoic Chamber in dome design — the most selected chamber in its class, for full compliant emission and immunity", industry: "commercial", type: "sac", source: "sac-3-plus", slug: "sac-3-plus",
    spec: { size: "9,680 × 6,530 × 6,000 mm", note: "Quiet zone ø2.0 m at 3.0 m test distance (H = 2.0 m); ø1.2–2.0 m across the S, M and L sizes", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-3 Square", desc: "3.0 m Semi Anechoic Chamber in the traditional square design", industry: "commercial", type: "sac", source: "sac-3-square", slug: "sac-3-square",
    spec: { size: "9,680 × 6,530 × 6,000 mm", note: "Quiet zone ø2.0 m at 3.0 m test distance (H = 2.5 m)", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-5 Plus", desc: "5.0 m Semi Anechoic Chamber in dome design, covering both 3.0 m and 5.0 m test distances", industry: "commercial", type: "sac", source: "sac-5-plus", slug: "sac-5-plus",
    spec: { size: "12,680 × 7,730 × 6,300 mm", note: "Quiet zone ø2.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-5 Square", desc: "5.0 m Semi Anechoic Chamber in the traditional square design, covering 3.0 m and 5.0 m test distances", industry: "commercial", type: "sac", source: "sac-5-square", slug: "sac-5-square",
    spec: { size: "12,680 × 7,730 × 6,000 mm", note: "Quiet zone ø2.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-10 Plus", desc: "10.0 m Semi Anechoic Chamber with a single test axis — the cost-saving configuration of the Triton shell", industry: "commercial", type: "sac", source: "sac-10-plus", slug: "sac-10-plus",
    spec: { size: "19,205 × 12,080 × 8,325 mm", note: "Quiet zone ø3.0 m at 10.0 m test distance (H = 3.0 m)", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-10 Plus Triton", desc: "10.0 m Semi Anechoic Chamber with three independent test axes in one polygonal shell — the most compact 10.0 m chamber Frankonia builds", industry: "commercial", type: "sac", source: "triton", slug: "sac-10-plus-triton",
    spec: { size: "19,205 × 12,080 × 8,325 mm", note: "Quiet zone ø3.0 m (H = 3.0 m) — one 10.0 m axis and two 3.0 m axes, antennas and floor absorbers staying in place", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-10/H Hybrid", desc: "10.0 m Semi Anechoic Chamber lined with Frankosorb hybrid absorbers, sized to the quiet zone required", industry: "commercial", type: "sac", source: "sac-10-h-hybrid", slug: "sac-10-h-hybrid",
    spec: { size: "18,380 × 12,830 × 8,550 mm (ø3.0 m) up to 21,680 × 15,680 × 8,700 mm (ø6.0 m)", note: "Quiet zone ø3.0 m to ø6.0 m at 10.0 m test distance (H = 3.0 m)", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-10/P Pyramid", desc: "10.0 m Semi Anechoic Chamber fully lined with Frankosorb long-pyramid absorbers, a cost-efficient alternative to the hybrid lining", industry: "commercial", type: "sac", source: "sac-10-p-pyramid", slug: "sac-10-p-pyramid",
    spec: { size: "21,680 × 13,730 × 8,550 mm (ø3.0 m) up to 24,980 × 17,180 × 9,000 mm (ø6.0 m)", note: "Quiet zone ø3.0 m to ø6.0 m at 10.0 m test distance (H = 3.0 m)", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "FAC-3", desc: "3.0 m Fully Anechoic Chamber for free-space EMC tests on table-top EUTs", industry: "commercial", type: "fac", source: "fac-3", slug: "fac-3",
    spec: { size: "8,705 × 4,655 × 3,750 mm", note: "Quiet zone ø1.5 m at 3.0 m test distance (H = 1.5 m), table-top products", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "FAC-3 L", desc: "Extended 3.0 m Fully Anechoic Chamber for floor-standing as well as table-top EUTs, with height scan", industry: "commercial", type: "fac", source: "fac-3-l", slug: "fac-3-l",
    spec: { size: "9,380 × 5,780 × 6,000 mm", note: "Quiet zone ø1.5 m at 3.0 m test distance (H = 2.0 m), floor-standing and table-top products", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "SAC-3 / FAC-3 Transformer", desc: "One chamber convertible between semi-anechoic with ground plane and fully anechoic with floor absorbers", industry: "commercial", type: "fac", source: "sac-3-fac-3-transformer", slug: "sac-3-fac-3-transformer",
    spec: { size: "9,680 × 6,530 × 6,000 mm", note: "SAC setup: quiet zone ø2.0 m (H = 2.5 m) · FAC setup: ø1.5 m (H = 1.5 m), both at 3.0 m", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "CHC", desc: "3.0 m Compact Hybrid Chamber — pre-compliant emission and full compliant immunity at 3.0 m", industry: "commercial", type: "chc", source: "chc", slug: "chc",
    spec: { size: "7,355 × 3,755 × 3,300 mm", note: "Quiet zone ø1.2 m at 3.0 m test distance", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "CHC Plus", desc: "Compact Hybrid Chamber in the advanced setup, adding compliant emission measurement from 1 GHz to 18 GHz", industry: "commercial", type: "chc", source: "chc-plus", slug: "chc-plus",
    spec: { size: "7,355 × 3,755 × 3,300 mm", note: "Quiet zone ø1.2 m at 3.0 m test distance, compliant emission above 1 GHz", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },
  { name: "CTC", desc: "Full compliant component test chamber focused on immunity testing for industrial, automotive and military components", industry: "commercial", type: "component", source: "ctc", slug: "ctc",
    spec: { size: "8,480 × 5,485 × 3,750 mm", note: "Full compliant immunity per IEC 61000-4-3; CISPR 25, ISO 11452, MIL-STD 461 and DO-160", range: "9 kHz / 30 MHz – 18 GHz (40 GHz option)" } },

  { name: "EDTC-SA", desc: "E-Drive test chamber prepared for a single external load machine with fixed shaft", industry: "powertrain", type: "component", source: "edtc", slug: "edtc-sa",
    spec: { size: "7,880 × 5,480 × 3,750 mm", note: "Fixed-shaft version, e.g. 1 × 250 kW at 3,000 RPM and 3,000 Nm" } },
  { name: "EDTC-AX", desc: "E-Drive test chamber for e-axle tests, prepared for two external load machines with fixed shaft", industry: "powertrain", type: "component", source: "edtc-ax", slug: "edtc-ax",
    spec: { size: "9,080 × 6,080 × 3,750 mm", note: "Fixed-shaft version, e.g. 2 × 250 kW at 3,000 RPM and 3,000 Nm" } },
  { name: "EDTC-BB", desc: "E-Drive test chamber including the EMC-BlueBox mobile load machine for dynamic powertrain tests", industry: "powertrain", type: "component", source: "edtc-bb", slug: "edtc-bb",
    spec: { size: "7,880 × 6,380 × 3,750 mm", note: "For the EMC-BlueBox mobile load machine up to 120 kW" } },

  { name: "RVC e1", desc: "Reverberation chamber for small and medium size ISM and multimedia products", industry: "commercial", type: "rvc", source: "reverberation-solutions", slug: "rvc",
    spec: { size: "7,580 × 5,630 × 4,200 mm", note: "Working volume 3.3 × 3.5 × 2.6 m · 1 × Z-fold stirrer (vertical)", range: "Lowest usable frequency 200 MHz" } },
  { name: "RVC e2", desc: "Reverberation chamber for large ISM and multimedia products", industry: "commercial", type: "rvc", source: "reverberation-solutions", slug: "rvc",
    spec: { size: "11,280 × 7,280 × 4,950 mm", note: "Working volume 5.5 × 4.0 × 2.6 m · 2 × Z-fold stirrer (vertical and horizontal)", range: "Lowest usable frequency 80 MHz" } },
  { name: "RVC S", desc: "Reverberation chamber for military and automotive components", industry: "automotive", type: "rvc", source: "reverberation-solutions", slug: "rvc",
    spec: { size: "5,330 × 3,380 × 3,300 mm", note: "Working volume 2.5 × 1.0 × 1.5 m · 1 × Z-fold stirrer (vertical)", range: "Lowest usable frequency 200 MHz" } },
  { name: "RVC M", desc: "Reverberation chamber for large military and automotive components", industry: "automotive", type: "rvc", source: "reverberation-solutions", slug: "rvc",
    spec: { size: "7,580 × 5,630 × 4,200 mm", note: "Working volume 3.3 × 3.5 × 2.6 m · 1 × Z-fold stirrer (vertical)", range: "Lowest usable frequency 200 MHz" } },
  { name: "RVC L", desc: "Reverberation chamber for vehicles", industry: "automotive", type: "rvc", source: "reverberation-solutions", slug: "rvc",
    spec: { size: "13,880 × 11,480 × 6,300 mm (custom)", note: "Working volume 8.0 × 5.0 × 3.0 m · 2 × Z-fold stirrer (vertical and horizontal)", range: "Lowest usable frequency 80 MHz" } },
  { name: "RVC XL", desc: "Reverberation chamber for vehicles, with large-disc stirrer", industry: "automotive", type: "rvc", source: "reverberation-solutions", slug: "rvc",
    spec: { size: "15,530 × 11,480 × 6,600 mm (custom)", note: "Working volume 8.0 × 5.0 × 3.0 m · 1 × large-disc stirrer ø9.0 m, 2 × disc stirrer ø4.0 m", range: "Lowest usable frequency 80 MHz" } },
  { name: "RVC XXL", desc: "Reverberation chamber for large vehicles", industry: "automotive", type: "rvc", source: "reverberation-solutions", slug: "rvc",
    spec: { size: "17,480 × 13,580 × 6,600 mm (custom)", note: "Working volume 8.0 × 5.0 × 3.0 m · 1 × large-disc stirrer ø12.0 m, 2 × disc stirrer ø4.0 m", range: "Lowest usable frequency 80 MHz" } },
  { name: "Shielded Room", desc: "Modular and pre-fabricated Standard", industry: "commercial", type: "shielded-room", source: "shielded-room", slug: "shielded-room",
    spec: { size: "Any size — modular PAN type panels", range: "10 kHz – 18 GHz, or 40 GHz as an option, acc. EN 50147-1 / IEEE-299" } },
];

export const modelsByIndustry = (industry: ChamberIndustry) =>
  chamberModels.filter((m) => m.industry === industry);

export const modelsByType = (type: ChamberType) =>
  chamberModels.filter((m) => m.type === type);

/**
 * The distinct slugs, in catalogue order — one per model page.
 *
 * Distinct rather than one per model because the seven reverberation chambers
 * share a slug (see `ChamberModel.slug`). Derived rather than written down, so
 * that adding a chamber to the list above is the only edit a new model page
 * needs.
 */
export const chamberModelSlugs: readonly string[] = [
  ...new Set(chamberModels.map((m) => m.slug)),
];

export const isChamberModelSlug = (v: string) => chamberModelSlugs.includes(v);

/** Every model filed under one slug. One entry for all but `rvc`, which has
 *  seven — the page tabulates them together, the way both sources do. */
export const modelsBySlug = (slug: string) =>
  chamberModels.filter((m) => m.slug === slug);

/** Nav label, dropdown caption and meta description per locale. Single source:
 *  the navigation, the page head and the search snippet all read from here. */
type Entry = { label: string; description: string; note?: string };

/** Industries carry no label of their own here — both branches read it from
 *  industries.ts so the two menus cannot drift apart. */
type IndustryEntry = { description: string; note: string };

export const chamberIndustryMeta = {
  zh: {
    automotive: {
      note: "ACTC · UCC · AVTC · RVC",
      description:
        "车辆及电子元件EMC测试室。通过在电波暗室中添加车辆和零部件混响室（RVC S至XXL），支持ECE R10、CISPR 25/EN 55025、ISO 11452-2和CISPR 12/EN 55012测试。",
    },
    military: {
      note: "MIL CHC · MIL-STD Chamber",
      description:
        "MIL-STD-461 RS-103 兼容军用/国防 EMC 测试室。从组件单元到车辆和大型被测设备。",
    },
    commercial: {
      note: "SAC · FAC · CHC · RVC",
      description:
        "用于一般工业和电子设备的EMC室。 3.0 m·5.0 m·10.0 m半电波暗室、全电波暗室、紧凑型暗室系列，包括屏蔽室和ISM/多媒体混响室（RVC e1·e2）。",
    },
    powertrain: {
      note: "EDTC-SA · AX · BB",
      description:
        "用于测试电动汽车传动系统的EMC室。单电机 (EDTC-SA)、轴配置 (EDTC-AX)、EMC-BlueBox (EDTC-BB)。",
    },
  },
  en: {
    automotive: {
      note: "ACTC · UCC · AVTC · RVC",
      description:
        "Chambers for vehicle and automotive EMC testing — anechoic chambers plus the RVC S to XXL reverberation chambers — covering ECE R10, CISPR 25 / EN 55025, ISO 11452-2 and CISPR 12 / EN 55012.",
    },
    military: {
      note: "MIL CHC · MIL-STD Chamber",
      description:
        "Defence-grade EMC chambers for MIL-STD-461 RS-103, from component level up to vehicles and large EUTs.",
    },
    commercial: {
      note: "SAC · FAC · CHC · RVC",
      description:
        "Chambers for industrial and consumer electronics — the full 3.0 m, 5.0 m and 10.0 m semi-anechoic, fully anechoic and compact range, plus the shielded room and the RVC e1 and e2 reverberation chambers.",
    },
    powertrain: {
      note: "EDTC-SA · AX · BB",
      description:
        "EMC chambers for electric drivetrain testing: single motor (EDTC-SA), axis setup (EDTC-AX) and EMC-BlueBox (EDTC-BB).",
    },
  },
} as const satisfies Record<Lang, Record<ChamberIndustry, IndustryEntry>>;

export const typeMeta = {
  zh: {
    sac: {
      label: "半电波暗室SAC",
      note: "地平面发射和抗扰度官方认证 — 3.0·5.0·10.0 m",
      description:
        "半电波电磁兼容暗室。比较整个 SAC 系列，测量距离为 3.0 m、5.0 m 和 10.0 m，以及在一处车辆的大型暗室。",
    },
    fac: {
      label: "全电波暗室FAC",
      note: "无地平面的自由空间条件",
      description:
        "完全电波暗室EMC暗室。台式FAC-3、落地式FAC-3 L、半电波暗室和全电波暗室转换型变压器。",
    },
    chc: {
      label: "紧凑型腔室CHC",
      note: "狭窄空间预认证",
      description:
        "3.0 m 紧凑型腔室，用于预一致性。 CHC、CHC Plus、军用 MIL CHC。",
    },
    component: {
      label: "零件/驱动室",
      note: "零件和传动系统，室外测量",
      description:
        "元件单元测试室。用于电气元件的ACTC·UCC·CTC和用于电动汽车传动系统的EDTC系列。",
    },
    rvc: {
      label: "混响室RVC",
      note: "无吸收体产生的统计电磁场",
      description:
        "混响室。 RVC e1·e2 用于商业/工业用途，RVC S~XXL 用于车辆/零件 — 符合 IEC/EN 61000-4-21、ISO 11452-11 标准，基于 Frankonia 搅拌器。",
    },
    "shielded-room": {
      label: "屏蔽室",
      note: "可拆卸迁移的屏蔽空间",
      description:
        "模块化预制标准屏蔽室。它的结构允许现场组装和拆卸，并在搬迁后重新使用。",
    },
  },
  en: {
    sac: {
      label: "Semi-Anechoic SAC",
      note: "Full compliant over a ground plane — 3, 5 and 10.0 m",
      description:
        "Semi-anechoic EMC chambers — the full SAC range at 3.0 m, 5.0 m and 10.0 m measurement distance, plus the vehicle-scale chambers.",
    },
    fac: {
      label: "Fully Anechoic FAC",
      note: "Free-space conditions, no ground plane",
      description:
        "Fully anechoic EMC chambers: table-top FAC-3, floor-standing FAC-3 L, and the transformable SAC-3 / FAC-3 combination.",
    },
    chc: {
      label: "Compact CHC",
      note: "Pre-compliance where the floor area is tight",
      description:
        "Compact 3.0 m chambers for pre-compliance testing: CHC, CHC Plus and the military MIL CHC.",
    },
    component: {
      label: "Component & E-Drive",
      note: "Components and drivetrains, instruments outside",
      description:
        "Component-level chambers — ACTC, UCC and CTC for automotive components, and the EDTC series for electric drivetrains.",
    },
    rvc: {
      label: "Reverberation RVC",
      note: "A statistical field, made without absorbers",
      description:
        "Reverberation chambers: RVC e1 and e2 for industry, RVC S to XXL for components and vehicles — to IEC/EN 61000-4-21 and ISO 11452-11, with Frankonia performance stirrers.",
    },
    "shielded-room": {
      label: "Shielded Room",
      note: "Shielding you can dismantle and move",
      description:
        "Modular, pre-fabricated standard shielded room — assembled and dismantled on site, and reusable after relocation.",
    },
  },
} as const satisfies Record<Lang, Record<ChamberType, Entry>>;

export const topicMeta = {
  zh: {
    frankosorb: {
      label: "Frankosorb®吸波材料",
      description:
        "Frankonia自主研发的Frankosorb®纳米薄膜吸收体—Pyramid/Hybrid系列，26MHz~40GHz，DIN EN 13501-1 A2不易燃等级，无缺陷运行超过35年。",
    },
    "shielding-gates": {
      label: "屏蔽/门",
      description:
        "PAN模块屏蔽板、自承式钢结构、射频门/大门、自动平台/坡道。 10 kHz 至 40 GHz，高达 120 dB (EN 50147-1)。",
    },
    automation: {
      label: "自动化设备",
      description:
        "FTM转台（ø1.2~11.0 m）、FAM·FBM天线杆、FC06.1控制器——符合CISPR 16-1-4的EMC测试自动化。",
    },
    stirrers: {
      label: "搅拌系统",
      description:
        "用于混响室的 Frankonia 高性能搅拌器 — Z 形折叠/盘/管/大盘设计，从 ø1.88 m 30 RPM 到 ø12.0 m。角度精度 0.1°，3 种操作模式。",
    },
    services: {
      label: "工程服务",
      description:
        "EMC实验室设计咨询和测试准备支持。从布局和基础设施设计、投资回报率分析到培训、验证和认证支持。",
    },
    references: {
      label: "施工实例",
      description:
        "世界各地建造的Frankonia暗室客户名单，以及安装现场360°全景。",
    },
  },
  en: {
    frankosorb: {
      label: "Frankosorb® Absorbers",
      description:
        "Frankonia's own Frankosorb® nano thin-film absorbers — pyramid and hybrid series, 26 MHz to 40 GHz, DIN EN 13501-1 class A2 non-combustible, and more than 35 years in service without a defect.",
    },
    "shielding-gates": {
      label: "Shielding & Gates",
      description:
        "PAN modular shielding panels on a self-supporting steel structure, RF doors and gates, automatic platforms and ramps. Up to 120 dB from 10 kHz to 40 GHz (EN 50147-1).",
    },
    automation: {
      label: "Automation",
      description:
        "FTM turntables (ø1.2 to 11.0 m), FAM and FBM antenna masts, and the FC06.1 controller — EMC test automation to CISPR 16-1-4.",
    },
    stirrers: {
      label: "Stirrer Systems",
      description:
        "Frankonia performance stirrers for reverberation chambers — Z-fold, disc, tube and large-disc designs from ø1.88 m at 30 RPM up to ø12.0 m, with 0.1° angle accuracy and three operating modes.",
    },
    services: {
      label: "Extended Services",
      description:
        "EMC laboratory planning and testing readiness — from layout, infrastructure design and ROI analysis through training, verification and accreditation support.",
    },
    references: {
      label: "References",
      description:
        "Frankonia installations worldwide, listed by country, with 360° panoramas from the sites.",
    },
  },
} as const satisfies Record<Lang, Record<ChamberTopic, Entry>>;

/**
 * Per-model page meta.
 *
 * `label` is the model name and is therefore not translated — the same reason
 * `ChamberModel.name` is not. What differs by locale is only the search
 * snippet. Two slugs carry a name that is not any one model's: `rvc` covers the
 * seven reverberation chambers, and both sources present them together.
 */
export const modelMeta: Record<Lang, Record<string, Entry>> = {
  zh: {
    "sac-3-plus": { label: "SAC-3 Plus", description: "3.0m圆顶设计半电波暗室。它是同类产品中最受欢迎的型号，提供从 Quiet Zone ø1.2 到 2.0 m 的四种尺寸，并获得 CISPR 16-1-4 · ANSI C63.4 的正式认证。" },
    "sac-3-square": { label: "SAC-3 Square", description: "3.0m见方的半电波暗室。静区 ø2.0 m 或 ø3.0 m，允许集成大型转盘和移动测功机。" },
    "sac-5-plus": { label: "SAC-5 Plus", description: "5.0m圆顶设计半电波暗室。 3.0 m 和 5.0 m 测量距离同时使用，静区可达 ø3.0 m。" },
    "sac-5-square": { label: "SAC-5 Square", description: "5.0m见方的半电波暗室。测量距离3.0 m·5.0 m，静区ø2.0~4.0 m，XL配置可容纳大型转盘。" },
    "sac-10-plus": { label: "SAC-10 Plus", description: "10.0 m单测试轴半电波暗室。 Frankonia 最紧凑的 10.0 m 腔室采用多边形外壳制成。" },
    "sac-10-plus-triton": { label: "SAC-10 Plus Triton", description: "10.0m半电波暗室，在一个多边形壳体中包含一根10.0m轴和两根3.0m轴。天线和地面吸波材料可以保持连接。" },
    "sac-10-h-hybrid": { label: "SAC-10/H Hybrid", description: "10.0 m 半电波暗室，配有 Frankosorb® 混合衬里。它有四种尺寸制造，以适应静区 ø3.0~6.0 m。" },
    "sac-10-p-pyramid": { label: "SAC-10/P Pyramid", description: "P2400 10.0 m 半电波暗室，全衬有长金字塔吸声体。混合衬里的经济高效替代品。" },
    "sac-10-v": { label: "SAC-10V", description: "10.0 m半电波暗室，用于测试带有内置测功机的ECE R10车辆。它可容纳混合吸波材料和长锥形吸波材料两种系列，以及长达 18.0 m 的车辆。" },
    avtc: { label: "AVTC", description: "3.0m·5.0m车辆试验室。零部件 (CISPR 25)、车辆 (CISPR 12) 和商业产品 (CISPR 16-1-4) 的测试在一个测试室中进行。" },
    actc: { label: "ACTC", description: "CISPR 25汽车零部件测试室，距离1.0m。支持ISO 11452正式认证，L配置甚至可用于车辆测试。" },
    ucc: { label: "UCC", description: "超小型混合室，距离1.0m。获得 CISPR 25 预认证，是 GTEM 单元的替代品。" },
    ctc: { label: "CTC", description: "专门用于工业、汽车、军工零部件抗扰度测试的零部件测试室。 IEC 61000-4-3 · CISPR 25 · ISO 11452 · MIL-STD 461 · DO-160 官方认证。" },
    chc: { label: "CHC", description: "紧凑型混合室，静区距离 3.0 m，直径 ø1.2 m。我们执行预认证发射和正式认证抗扰度测试。" },
    "chc-plus": { label: "CHC Plus", description: "紧凑型混合室，具有 1GHz 至 18GHz 范围内经官方认证的发射测量。" },
    "fac-3": { label: "FAC-3", description: "3.0 m 完全电波暗室，用于桌面被测设备。在没有接地层的自由空间条件下通过 CISPR 16-1-4 和 IEC/EN 61000-4-22 正式认证。" },
    "fac-3-l": { label: "FAC-3 L", description: "可扩展的 3.0 m 全电波暗室，可容纳固定和​​桌面被测设备。使用天线杆可以进行高度扫描。" },
    "sac-3-fac-3-transformer": { label: "SAC-3 / FAC-3 Transformer", description: "3.0 m 暗室在带地平面的半电波暗室和带底部吸波材料的全电波暗室之间切换。两种配置的性能都有保证。" },
    rvc: { label: "混响室RVC", description: "混响室配备 Frankonia 搅拌器套件。从用于小型零件的 RVC S 到用于大型车辆的 RVC XXL，IEC/EN 61000-4-21 · ISO 11452-11 · ISO 11451-5。" },
    "mil-chc": { label: "MIL CHC", description: "用于 MIL-STD 461 · DO-160 组件测试的紧凑型混合室。 1.0 m距离，9kHz/30MHz~40GHz。" },
    "mil-std-chamber": { label: "MIL-STD Chamber", description: "用于大型被测设备和车辆的军事舱室。 1.0 m 距离基于 MIL-STD 461，80MHz 至 40GHz，带短金字塔吸波器。" },
    "mil-std-chamber-advanced": { label: "MIL-STD Chamber Advanced", description: "军用试验室，既满足军用标准，又满足商业和汽车测试场地要求。长金字塔或混合衬里。" },
    "edtc-sa": { label: "EDTC-SA", description: "一种以一个定轴外载荷为前提制造的传动系统试验室。用于 CISPR 25 发射和 ISO 11452 抗扰度测试。" },
    "edtc-ax": { label: "EDTC-AX", description: "用于电驱桥测试的传动系统室。这是一项专利配置，可容纳两个固定轴外部负载。" },
    "edtc-bb": { label: "EDTC-BB", description: "带有移动负载EMC-BlueBox的传动系统测试室。任何负载情况都可以通过四象限操作来重现。" },
    "shielded-room": { label: "Shielded Room", description: "模块化预制PAN型屏蔽室。没有尺寸限制，并且在 10kHz 至 40GHz 范围内保证高达 120dB 的屏蔽性能。" },
  },
  en: {
    "sac-3-plus": { label: "SAC-3 Plus", description: "3.0 m semi-anechoic chamber in dome design — the most selected chamber in its class, in four sizes from a ø1.2 m to a ø2.0 m quiet zone, full compliant to CISPR 16-1-4 and ANSI C63.4." },
    "sac-3-square": { label: "SAC-3 Square", description: "3.0 m semi-anechoic chamber in the traditional square design, with a ø2.0 m or ø3.0 m quiet zone and room for a large turntable or a mobile dynamometer." },
    "sac-5-plus": { label: "SAC-5 Plus", description: "5.0 m semi-anechoic chamber in dome design, covering both the 3.0 m and 5.0 m measuring distance with a quiet zone up to ø3.0 m." },
    "sac-5-square": { label: "SAC-5 Square", description: "5.0 m semi-anechoic chamber in the traditional square design — 3.0 m and 5.0 m measuring distances, quiet zone ø2.0 m to ø4.0 m." },
    "sac-10-plus": { label: "SAC-10 Plus", description: "10.0 m semi-anechoic chamber with a single test axis — the most compact 10.0 m chamber Frankonia builds, in a polygonal shell." },
    "sac-10-plus-triton": { label: "SAC-10 Plus Triton", description: "10.0 m semi-anechoic chamber with one 10.0 m and two 3.0 m test axes in one polygonal shell, antennas and floor absorbers staying connected between them." },
    "sac-10-h-hybrid": { label: "SAC-10/H Hybrid", description: "10.0 m semi-anechoic chamber lined with Frankosorb® hybrid absorbers, built in four sizes for a ø3.0 m to ø6.0 m quiet zone." },
    "sac-10-p-pyramid": { label: "SAC-10/P Pyramid", description: "10.0 m semi-anechoic chamber fully lined with P2400 long-pyramid absorbers — the cost-efficient alternative to a hybrid lining." },
    "sac-10-v": { label: "SAC-10V", description: "10.0 m semi-anechoic chamber for ECE R10 vehicle testing with an integrated dynamometer, in hybrid and long-pyramid versions for vehicles up to 18.0 m." },
    avtc: { label: "AVTC", description: "3.0 m and 5.0 m automotive vehicle testing chamber — components to CISPR 25, vehicles to CISPR 12 and commercial products to CISPR 16-1-4 in one solution." },
    actc: { label: "ACTC", description: "CISPR 25 automotive component testing chamber at 1.0 m, full compliant to ISO 11452, with an L configuration large enough for vehicle tests." },
    ucc: { label: "UCC", description: "Ultra-compact hybrid chamber at 1.0 m for pre-compliance testing to the CISPR 25 method — an alternative to the GTEM cell." },
    ctc: { label: "CTC", description: "Component test chamber focused on immunity testing for industrial, automotive and military components — IEC 61000-4-3, CISPR 25, ISO 11452, MIL-STD 461 and DO-160." },
    chc: { label: "CHC", description: "Compact hybrid chamber with a ø1.2 m quiet zone at 3.0 m — pre-compliance emission and full compliant immunity in one room." },
    "chc-plus": { label: "CHC Plus", description: "The compact hybrid chamber in the advanced setup, adding compliant emission measurement from 1 GHz to 18 GHz." },
    "fac-3": { label: "FAC-3", description: "3.0 m fully anechoic chamber for table-top EUTs — free-space conditions without a ground plane, full compliant to CISPR 16-1-4 and IEC/EN 61000-4-22." },
    "fac-3-l": { label: "FAC-3 L", description: "Extended 3.0 m fully anechoic chamber for floor-standing as well as table-top EUTs, with a height scan on a FAM or FBM antenna mast." },
    "sac-3-fac-3-transformer": { label: "SAC-3 / FAC-3 Transformer", description: "One 3.0 m chamber converted between semi-anechoic with a ground plane and fully anechoic with floor absorbers, each configuration with its own guaranteed performance." },
    rvc: { label: "Reverberation Chambers", description: "Reverberation chambers with the Frankonia stirrer package, from the RVC S for components to the RVC XXL for large vehicles — IEC/EN 61000-4-21, ISO 11452-11 and ISO 11451-5." },
    "mil-chc": { label: "MIL CHC", description: "Compact hybrid chamber for MIL-STD 461 and DO-160 component testing at 1.0 m, 9 kHz / 30 MHz to 40 GHz." },
    "mil-std-chamber": { label: "MIL-STD Chamber", description: "Military testing chamber for vehicles and large EUTs — MIL-STD 461 at 1.0 m, short-pyramid absorbers from 80 MHz to 40 GHz." },
    "mil-std-chamber-advanced": { label: "MIL-STD Chamber Advanced", description: "Military chamber that also meets commercial and automotive test site requirements, lined with long-pyramid or hybrid absorbers." },
    "edtc-sa": { label: "EDTC-SA", description: "E-Drive test chamber prepared for a single external load machine with a fixed shaft, for CISPR 25 emission and ISO 11452 immunity testing." },
    "edtc-ax": { label: "EDTC-AX", description: "E-Drive test chamber for e-axle tests — a patented setup prepared for two external load machines with fixed shafts." },
    "edtc-bb": { label: "EDTC-BB", description: "E-Drive test chamber including the EMC-BlueBox mobile load machine, working in four-quadrant operation to simulate any EUT stress situation." },
    "shielded-room": { label: "Shielded Room", description: "Modular and prefabricated PAN type shielded room — any size, with guaranteed shielding attenuation up to 120 dB from 10 kHz to 40 GHz." },
  },
};

export const chambersOverviewMeta = {
  zh: {
    label: "电波暗室",
    title: "Anechoic Chambers",
    description:
      "基于Frankosorb®吸波材料的模块化EMC暗室。您可以按行业或暗室类型进行搜索。",
  },
  en: {
    label: "Anechoic Chambers",
    title: "Anechoic Chambers",
    description:
      "Modular EMC chambers built on Frankosorb® absorber technology — browse by industry or by chamber type.",
  },
} as const satisfies Record<Lang, { label: string; title: string; description: string }>;

/** Column headings for the Chambers mega dropdown. The captions under each
 *  link come from the industry's and the type's own meta. */
export const chamberNavCopy = {
  zh: {
    byIndustry: "按行业组别",
    byType: "按腔室类型",
    technology: "技术/服务",
  },
  en: {
    byIndustry: "By Industry",
    byType: "By Chamber Type",
    technology: "Technology & Services",
  },
} as const;

/** Paths, relative to the locale root. */
export const chambersPath = "/chambers";
export const industryPath = (i: ChamberIndustry) => `/chambers/industry/${i}`;
export const typePath = (t: ChamberType) => `/chambers/type/${t}`;
export const topicPath = (t: ChamberTopic) => `/chambers/${t}`;
/** A model page sits a segment deeper than the two index axes, which is what
 *  keeps it out of `/chambers/[topic]`'s way. */
export const modelPath = (slug: string) => `/chambers/model/${slug}`;

/**
 * The three installations the head office publishes a 360° panorama of, in its
 * own order (docs/source/chambers-references.md).
 *
 * Each is headed `MODEL – PLACE` there, and neither half is translated in
 * either locale: the designation has to match the catalogue, and the place is a
 * place. They are kept as two fields rather than one string so the heading can
 * set the model in bold and let the place stay light, the way `.sub-head`
 * splits every other group heading on this site.
 *
 * The head office says nothing about whose lab each one is, so neither do we —
 * Heideck is the head office's own address, which makes "customer installation"
 * a claim its own page does not make.
 *
 * Every panorama is cropped the same way, so the dimensions are one constant
 * rather than three copies of the same pair.
 */
export const chamberPanoramas = [
  { key: "fac-3", model: "FAC-3", place: "Marktheidenfeld", src: "/chambers/images/pano-fac-3.webp" },
  { key: "sac-5-plus", model: "SAC-5 Plus", place: "Heideck", src: "/chambers/images/pano-sac-5-plus.webp" },
  { key: "sac-10-hybrid", model: "SAC-10 Hybrid", place: "Kösching", src: "/chambers/images/pano-sac-10-hybrid.webp" },
] as const;

export type PanoramaKey = (typeof chamberPanoramas)[number]["key"];

/** The middle half of a 2:1 equirectangular source — ±45° of elevation, which
 *  is the band a cylindrical projection keeps readable. See `.pano`. */
export const panoramaSize = { w: 2000, h: 500 } as const;

/**
 * The head office's reference list, grouped by country.
 *
 * The source lists all 106 entries flat across two columns, roughly
 * alphabetical for the first forty and then in the order they were added. This
 * groups them instead, which is the one thing the flat list cannot show: how
 * far the range has travelled. Countries run by number of entries, then
 * alphabetically; `international` is last because it is not a country — it is
 * the word the head office itself put where a country goes.
 *
 * **Customer names are the head office's own spelling and are never
 * translated or corrected** — `Fuijan-Daimler`, `Harmann-Becker`, `RI.SE`,
 * `Uni Brüssel` included. They work like a citation: a reader has to be able
 * to match them against what the head office publishes. Near-duplicates
 * (`Daimler AG` and `Daimler`, `Linetest` and `IMC Linetest`) are left as two
 * entries for the same reason — only the head office knows whether they are
 * one organisation or two sites.
 *
 * Three country tokens were normalised so the grouping does not split on a
 * spelling: `Singapur` → Singapore (the list already carries `Singapore`),
 * `Brasil` → Brazil, and `Dortmund` → Germany (a city, not a country). All
 * three are recorded in docs/source/chambers-references.md.
 */
export const referenceGroups = [
  { country: "germany", customers: [
    "Adam Opel AG", "AKKA EMC", "Audi AG", "BDS Technik", "BMW AG", "Bosch", "Continental",
    "Daimler AG", "EMC Test NRW", "EMITEL", "Eurofins", "Harmann-Becker", "Heidelberger Druck",
    "IABG", "Siemens", "TÜV Süd", "MBtech EMC", "MECTRONIC", "Messtechnik Nord", "Miele",
    "PKM electronic GmbH", "Rheinmetall Kassel", "VDE Offenbach", "Uni Magdeburg",
    "ZDP-Duisburg", "Viessmann", "Daimler", "DEKRA",
  ] },
  { country: "india", customers: [
    "ARAI", "BEL", "Bosch", "CPRI", "EQDC", "HiPhysics", "Azista", "Eaton", "RCI", "Rishabh",
    "TÜV Rheinland India", "WIPRO",
  ] },
  { country: "china", customers: [
    "CATARC", "EETI", "Fuijan-Daimler", "HID Corp Ltd", "JAC Motors", "NMEI", "NRIST", "SDQI",
    "SQI", "Wuhan Long An 6907",
  ] },
  { country: "france", customers: [
    "Alcatel Lucent", "ATERMES", "EDF", "Airbus/Ariane Group", "Nokia Alcatel Lucent", "RSI",
    "SAGEM", "Thales",
  ] },
  { country: "usa", customers: [
    "Electrolux", "AT4 Wireless (DEKRA)", "Ubiquiti Networks", "Garmin", "TÜV Rheinland",
    "A123", "Gentherm",
  ] },
  { country: "israel", customers: ["Elbit", "Standard Institute", "Mellanox", "RADA"] },
  { country: "thailand", customers: ["Daikin", "NSTDA", "Suranaree", "TMUC"] },
  { country: "turkey", customers: ["Arcelik", "Aselsan", "BTK", "ETU"] },
  { country: "australia", customers: ["AUSTEST Labs", "ELSA", "Rheinmetall"] },
  { country: "russia", customers: ["IMC Linetest", "Linetest", "Willtest"] },
  { country: "italy", customers: ["CAME", "CMC"] },
  { country: "japan", customers: ["Atom Medical", "Stanley"] },
  { country: "malaysia", customers: ["Keysight", "TÜV Rheinland"] },
  { country: "singapore", customers: ["Ametek", "Speedy"] },
  { country: "argentina", customers: ["LENOR"] },
  { country: "austria", customers: ["TÜV Austria"] },
  { country: "belarus", customers: ["TKC"] },
  { country: "belgium", customers: ["Uni Brüssel"] },
  { country: "brazil", customers: ["IBEC"] },
  { country: "indonesia", customers: ["PT Qualis"] },
  { country: "morocco", customers: ["CETIEV"] },
  { country: "netherlands", customers: ["Prodrives"] },
  { country: "poland", customers: ["PCB"] },
  { country: "saudi-arabia", customers: ["NCMS"] },
  { country: "spain", customers: ["AT4 Wireless (DEKRA)"] },
  { country: "sweden", customers: ["RI.SE"] },
  { country: "switzerland", customers: ["Quinel"] },
  { country: "ukraine", customers: ["SELTEQ"] },
  { country: "international", customers: ["Continental (International)"] },
] as const;

export type ReferenceCountry = (typeof referenceGroups)[number]["country"];

/** Country names are the one part of an entry that is translated — the name
 *  beside them is not. `satisfies` makes a missing label a type error rather
 *  than a blank heading. */
export const referenceCountryLabel = {
  zh: {
    germany: "德国", india: "印度", china: "中国", france: "法国", usa: "美国",
    israel: "以色列", thailand: "泰国", turkey: "土耳其", australia: "澳大利亚",
    russia: "俄罗斯", italy: "意大利", japan: "日本", malaysia: "马来西亚",
    singapore: "新加坡", argentina: "阿根廷", austria: "奥地利",
    belarus: "白俄罗斯", belgium: "比利时", brazil: "巴西", indonesia: "印度尼西亚",
    morocco: "摩洛哥", netherlands: "荷兰", poland: "波兰",
    "saudi-arabia": "沙特阿拉伯", spain: "西班牙", sweden: "瑞典",
    switzerland: "瑞士", ukraine: "乌克兰", international: "国际",
  },
  en: {
    germany: "Germany", india: "India", china: "China", france: "France", usa: "USA",
    israel: "Israel", thailand: "Thailand", turkey: "Turkey", australia: "Australia",
    russia: "Russia", italy: "Italy", japan: "Japan", malaysia: "Malaysia",
    singapore: "Singapore", argentina: "Argentina", austria: "Austria",
    belarus: "Belarus", belgium: "Belgium", brazil: "Brazil", indonesia: "Indonesia",
    morocco: "Morocco", netherlands: "Netherlands", poland: "Poland",
    "saudi-arabia": "Saudi Arabia", spain: "Spain", sweden: "Sweden",
    switzerland: "Switzerland", ukraine: "Ukraine", international: "International",
  },
} as const satisfies Record<Lang, Record<ReferenceCountry, string>>;

/**
 * Page copy for a chamber page, carried over from the 2026 catalogue.
 *
 * Originally the technology topics only, where the prose is the whole page.
 * The industry and chamber-type indexes now read from the same shape: they
 * carry a model list as well, so their body arrives split around it — lead and
 * plates above the list, tables and feature groups below. A page with a body
 * drops the "documents on request" band; a page without one is unchanged.
 * That is the same rule `spec` follows — the data arrives a page at a time and
 * nothing pretends otherwise.
 *
 * The shape itself — lead, plates, tables, titled groups — is `PageBody`, which
 * the EMC Test Systems branch reads from as well; only the two blocks below
 * belong to this branch alone. See page-body.ts.
 *
 * Absorber designations (P600, H1300 Turbine), standard numbers and the
 * figures beside them are not translated: they are what a reader matches
 * against a drawing and a quotation.
 */
export type TopicBody = PageBody & {
  /**
   * References only. `shots` is keyed rather than ordered so a caption cannot
   * drift onto the wrong panorama; the label and the file live in
   * `chamberPanoramas`, because neither is translated.
   *
   * `hint` is interface copy, not head office copy: the strip is scrolled to
   * pan it, and a reader has to be told that before they will try.
   */
  panoramas?: {
    title: string;
    hint: string;
    shots: Record<PanoramaKey, { alt: string; caption: string }>;
  };
  /** References only. The entries themselves are in `referenceGroups` — this
   *  is the heading over them and the note that says what the list is. */
  references?: { title: string; note: string };
};

/**
 * One model page.
 *
 * `PageBody` already carries what the 2026 catalogue spread prints — the lead
 * paragraphs, the plates, the configuration table and the titled bullet groups
 * (Features, Absorbers, Performance & Compliance). The two fields added here
 * are what only the head office's own model pages carry, and what the
 * catalogue has no equivalent of (docs/source/chambers-models.md §5.3).
 *
 * Bolted on by intersection rather than pushed into `PageBody`, for the same
 * reason `TopicBody` keeps its panoramas here: the test-system branch shares
 * `PageBody` and has neither of these.
 */
export type ModelBody = PageBody & {
  /**
   * The head office's "Overview" strip — four to six label/value pairs a reader
   * checks before anything else: which emission and immunity standards, at what
   * distance, into what volume. Rendered as badges rather than a table, because
   * it is a summary of the page and not one of its measurements.
   *
   * `label` is translated, `value` is not: the values are standard numbers and
   * distances.
   *
   * `family` marks a pair that describes the page rather than any one chamber
   * on it — the reverberation page's count of models, and nothing else today.
   * The strip prints it; a model row's summary drops it, because "Models —\n   * Seven" under the heading "RVC e1" is a fact about the wrong subject. The
   * flag rather than a label match: the labels are per locale, and a reworded
   * one would silently start showing again.
   */
  overview?: readonly { label: string; value: string; family?: true }[];
  /**
   * Typical Product and Verification Standards, as the head office pairs them —
   * emission in one column, immunity in the other. `title` and the column heads
   * are translated; the entries never are, because a reader matches them
   * against the standards their own product is tested to.
   */
  standards?: readonly {
    title: string;
    columns: readonly { head: string; items: readonly string[] }[];
  }[];
};

export const topicBody: Record<Lang, Partial<Record<ChamberTopic, TopicBody>>> = {
  en: {
    frankosorb: {
      lead: [
        "Since Frankonia's Frankosorb® nano thin-film absorber technology started to conquer the world market, more and more customers have come to appreciate its stable performance characteristics. Frankosorb® convinces with more than 35 years of operation without malfunction, defect, quality or performance loss, and without the need to refurbish.",
        "The technology is available either as a hybrid solution in combination with ferrite absorbers, or as a stand-alone pyramid solution with a length of up to 2.4 m. The most important advantage of the long-pyramid absorbers is that they cover the whole frequency range from 26 MHz up to 40 GHz on their own, so additional ferrite absorbers become unnecessary — a pure cost saver.",
      ],
      figure: { src: "/chambers/images/topic-frankosorb.webp", w: 1280, h: 533 },
      groups: [
        { title: "Pyramid (P) series", items: [
          "Short-pyramid absorbers from 80 MHz to 18/40 GHz: P600 or P900",
          "Long-pyramid absorbers from 26 MHz to 18/40 GHz: P2000, P2200 or P2400",
        ] },
        { title: "Hybrid (H) series", items: [
          "Ferrite absorbers from 30 MHz to 1 GHz",
          "Hybrid absorbers from 30 MHz to 18/40 GHz: H450, H600 or H1000",
          "Performance hybrid absorber from 30 MHz to 18/40 GHz: H1300 Turbine",
        ] },
        { title: "Unique features", items: [
          "High absorption capability paired with a fast cooling feature (hollow absorber)",
          "A manufacturing process that guarantees identical performance",
          "No ageing or drooping, no loss of performance — proven stability for more than 35 years",
          "White colouring improves the illumination level, so no covers are necessary",
          "Equal performance for hybrid and long-pyramid absorbers",
          "Compliant with all existing verification standards, including magnetic field standards",
        ] },
        { title: "People safety and laboratory protection", items: [
          "Non-combustible absorbers to DIN EN 13501-1 class A2 - s1 d0, handling up to 1 kW/m² or 600 V/m continuous and 2.0 kW/m² or 850 V/m intermediate",
          "Hardly inflammable absorbers to DIN EN 13501-1 class B as the alternative, handling up to 0.9 kW/m² or 550 V/m continuous and 1.8 kW/m² or 800 V/m intermediate",
          "With the non-combustible absorbers no sprinkler or fire extinguishing system is necessary",
        ] },
        { title: "Eco and user-friendliness", items: [
          "No toxic gases emitted if an absorber heats up",
          "No dirt, no carbon dust, solvent-free, and free of glue or other harmful substances",
          "Recyclable at 99%",
          "Non-hygroscopic materials, so humidity- and temperature-proof",
          "Clean room classification to ISO 14644-1",
          "Easy to clean and washable, with a virus and bacteria resistant surface",
        ] },
      ],
      close: "The Frankosorb® absorber technology remains the number one choice when it comes to long-term performance paired with its unique non-combustibility.",
    },
    "shielding-gates": {
      lead: [
        "Since 1987 Frankonia has followed a prefabrication and modular standard at the highest quality and efficiency. Nothing is welded, nothing is glued: everything stays modular so that any future modification remains possible.",
        "Every chamber is designed as an independent room with its own fully integrated electrical setup and simple interfaces to the building around it. As a specialist in RF shielding and EMC test chambers, Frankonia supplies the complementary products — standard and customised — that keep it a turnkey provider.",
      ],
      figure: { src: "/chambers/images/topic-shielding-gates.webp", w: 1600, h: 1067 },
      groups: [
        { title: "Shielding and structure", items: [
          "Modular and prefabricated PAN type shielding system",
          "Highest shielding attenuation for every accessory — honeycombs, doors, feed-through elements, electrics and gates",
          "Acoustic panels (FAP) with absorption per ISO 354",
          "Static steel structure adapted to local seismic conditions",
        ] },
        { title: "Doors and gates", items: [
          "Single-leaf door (SLD)",
          "Double-leaf door (DLD)",
          "Sliding door (SSD)",
          "Sliding gate (SG)",
          "A broad range of sizes, modular and prefabricated throughout",
        ] },
        { title: "Ramps and platforms", items: [
          "Automatic ramps",
          "Automatic platforms with a flush entrance",
          "Customised entrance solutions",
        ] },
        { title: "Electrical integration and compliance", items: [
          "Electrical distribution unit accessible from outside, cabling and safety functions to local standards",
          "LED lighting, explosion protection option, emergency lighting",
          "AC and DC filters, signal and data filters, optic converters",
          "Safety matrix and higher-level laboratory control unit (PLC system)",
          "CE conformity per Machinery Directive 2006/42/EC as standard, or for the complete laboratory as an option",
        ] },
        { title: "Ventilation, smoke and gas", items: [
          "Honeycombs, cooling and exhaust systems",
          "Air sampling network for gas and smoke detection",
          "Smoke and gas detection analyser with alarm central, ATEX compliance",
          "Liquid detection system",
          "Extinguishing solutions such as sprinklers",
        ] },
        { title: "Video, audio and test tables", items: [
          "HD camera systems, fixed or mobile",
          "Audio and recording systems",
          "CISPR 25 and MIL wooden test tables (FGT) with ground plane",
          "CISPR 32 transparent test tables (FTT)",
        ] },
      ],
    },
    automation: {
      lead: [
        "Frankonia builds its own positioning equipment — turntables and antenna masts — in its R&D department, to the quality and technology standards the current EMC standards ask for.",
        "The FTM turntables are fully compliant with the chamber environment: integrated flush into the raised floor and surrounded by a conductivity grounding ring that keeps contact with the chamber's ground plane. The FC06.1 controller drives them over IEEE 488.2 (GPIB) commands.",
        "The FAM antenna mast is the standard solution to CISPR 16-1-4, on wheels for easy handling and built from fibreglass and plastics so that reflecting material is kept to a minimum. The FBM boresight mast adds a tilt function compliant with ANSI C63.4 and CISPR 16-1-4 — its software calculates the tilt angle from the antenna reference point, the distance and the size of the EUT, and monitors the test procedure. The tilt can be switched off, leaving the FBM working as a standard mast.",
      ],
      figure: { src: "/chambers/images/topic-automation.webp", w: 1600, h: 1067 },
      groups: [
        { title: "Turntables – FTM series", items: [
          "Integrated turntables from ø1.2 m to ø12.0 m, up to 80 tons",
          "Energy chains, rotary joints for data, electrics or fluids, exhaust and cooling systems, or customer-specific items",
          "Dynamometers integrated: fitted, free-roller or mobile on-top",
          "FC06.1 controller with independent software (SCPI commands)",
          "Controllable from common EMC software, with a wireless access option",
        ] },
        { title: "Antenna masts – FAM, FBM and FSM", items: [
          "FAM standard antenna mast (CISPR)",
          "FBM boresight antenna mast (FCC/ANSI and CISPR)",
          "FSM antenna stand, optionally with a polarisation unit",
          "FC06 controller with independent software (SCPI commands)",
          "Controllable from common EMC software",
          "Wireless interface for control from a handheld device",
        ] },
      ],
    },
    stirrers: {
      lead: [
        "A reverberation chamber has no absorbers. Its walls reflect, and what makes the field inside usable is the stirrer: it keeps changing the boundary conditions so that over one turn the field becomes statistically uniform. Frankonia designs and builds its stirrers in its own R&D department and delivers them as a turnkey stirrer package.",
        "Which design a chamber gets follows from its working volume and the lowest usable frequency it has to reach. Z-fold stirrers stand in the room and turn at up to 60 RPM; disc and rotor designs run fast — up to 260 RPM — for the fast stirring ISO 11451-5 asks for; and a large ceiling disc is what pulls the LUF down in a full-vehicle chamber. From the RVC e2 up a chamber carries more than one, each of them set independently.",
        "Frankonia also adapts a customer's own stirrer design and implements it, in a new RVC chamber or in the conversion of an existing one. The safety integration comes with it — risk evaluation and CE marking, and from the RVC L up the dynamic and stability calculation that turning a large rotor at speed asks for.",
      ],
      figure: {
        src: "/chambers/images/type-rvc-stirrer.webp", w: 1122, h: 591,
        alt: "Inside a reverberation chamber: bare metal panels, a large disc stirrer blurred in motion under the ceiling, and a blue car on the turntable",
        caption: "The large ceiling disc is what a full-vehicle chamber turns to reach 80 MHz — up to ø12.0 m at 10 RPM, and at ø10.0 m some 4,500 kg of that is rotating mass. The two white drums on the floor are the high-speed turbo stirrers, each inside the cylindrical housing that encloses a rotor running at speed.",
      },
      figureRow: [
        {
          src: "/chambers/images/stirrer-zfold-antenna.webp", w: 654, h: 872,
          alt: "A Z-fold stirrer on a vertical shaft in a room panelled entirely in bare metal, a log-periodic antenna hanging from the ceiling to its right",
          caption: "The regular Z-fold — ø1.88 m at 30 RPM, the standard fit for the RVC S, M and e1.",
        },
        {
          src: "/chambers/images/stirrer-zfold-marking.webp", w: 654, h: 872,
          alt: "A Z-fold stirrer running floor to ceiling, its floor bearing standing inside a yellow and black hazard marking",
          caption: "The floor bearing is marked off because the stirrer runs unattended. From the RVC L the safety system is a PLC rather than an interlock.",
        },
        {
          src: "/chambers/images/stirrer-zfold-highspeed.webp", w: 901, h: 1201,
          alt: "Close-up of a Z-fold stirrer, the folded steel vanes spiralling from floor to ceiling with a cable bundle to the right",
          caption: "The performance Z-fold — ø2.8 m at 60 RPM in 0.8° steps, which is 450 positions in one turn. The faster it turns, the lower the statistical uncertainty.",
        },
      ],
      tables: [
        {
          /* One row per stirrer in the Frankonia Stirrer Systems sheet — every
             distinct style, orientation, size and speed across its nine
             columns, the two RVC XL variants included. It used to be six rows
             with ranges (ø2.0 – 5.0 m, 80 – 260 RPM), which hid four of the
             sheet's stirrers; a reader matching a quotation needs the unit,
             not the span. The first cell has to be unique because `Tables`
             keys a row on it, so where a design comes in several sizes the
             size or the vane length is in that cell.

             The type designations are from Frankonia's performance stirrer
             package documents (docs/source/chambers-stirrers.md §9); the
             catalogue, the head office's web pages and the sheet name the
             designs but not the types. The number after a designation is the
             rotor diameter in metres. The small disc has no designation in
             any document this site has, so it carries a dash. */
          title: "Stirrer designs",
          note: "Every stirrer in Frankonia's standard configurations. Where a type designation carries a number it is the rotor diameter in metres — FSDMS-9 is the ø9.0 m ceiling disc, FSDMH-4 the ø4.0 m turbo disc. Every design is built EMS- and EMI-compliant, to ISO 11451-5 for vehicle-level testing.",
          head: ["Design", "Type", "Rotor", "Max. speed", "Chamber"],
          rows: [
            ["Z-fold, vertical\nregular", "FSDVZ", "ø1.88 m\nvanes 3.1 m", "30 RPM", "RVC S · M · e1"],
            ["Z-fold, vertical\nperformance · vanes 4.0 m", "FSDVZ", "ø2.8 m\nvanes 4.0 m", "60 RPM", "RVC e2"],
            ["Z-fold, vertical\nperformance · vanes 6.0 m", "FSDVZ", "ø2.8 m\nvanes 6.0 m", "60 RPM", "RVC L"],
            ["Z-fold, horizontal\nperformance · vanes 4.0 m", "FSDHZ", "ø2.8 m\nvanes 4.0 m", "60 RPM", "RVC e2"],
            ["Z-fold, horizontal\nperformance · vanes 7.0 m", "FSDHZ", "ø2.8 m\nvanes 7.0 m", "60 RPM", "RVC L"],
            ["Small disc, horizontal\nslow speed", "—", "ø4.0 m", "25 RPM", "RVC XL (mini)"],
            ["Large ceiling disc ø10.0 m\nhorizontal · slow speed", "FSDMS", "ø10.0 m", "10 RPM", "RVC XL · XL (special)"],
            ["Large ceiling disc ø12.0 m\nhorizontal · slow speed", "FSDMS", "ø12.0 m", "10 RPM", "RVC XXL"],
            ["Turbo disc ø2.0 m\nvertical · high speed", "FSDMH", "ø2.0 m", "260 RPM", "RVC XL (mini)"],
            ["Turbo disc ø4.0 m\nvertical · high speed", "FSDMH", "ø4.0 m", "120 RPM", "RVC XL · XL (special)"],
            ["Turbo disc ø5.0 m\nvertical · high speed", "FSDMH", "ø5.0 m", "80 RPM", "RVC XXL"],
            ["Turbo tube, T-shape\nhorizontal · high speed", "FSDRS", "ø2.0 m\nlength 4.0 m", "240 RPM", "RVC XL (special)"],
          ],
        },
        {
          /* The chamber block of the stirrer sheet — what each package is
             specified for. The outer dimensions stay on the RVC model page;
             what a reader of this page needs is the working volume, which
             the stirrer has to clear, and the standard, because ISO 11451-5
             is what asks for the high-speed designs. */
          title: "Chamber and application",
          note: "The chamber each package is specified for — the seven standard reverberation chambers and the two RVC XL variants: a compact one for components on a small disc, and a special one with a turbo tube as its third stirrer. Every configuration is EMS-compliant for immunity and EMI-compliant for emission; the outer dimensions of the chambers are on the RVC model page.",
          head: ["Chamber", "Application", "Standard", "Working volume", "ECE R10"],
          rows: [
            ["RVC S", "Automotive components", "IEC/EN 61000-4-21\nISO 11452-11", "2.5 × 1.0 × 1.5 m\ntable", "limited"],
            ["RVC M", "Automotive components", "IEC/EN 61000-4-21\nISO 11452-11", "3.3 × 3.5 × 2.6 m\ntable", "limited"],
            ["RVC e1", "ISM and multimedia", "IEC/EN 61000-4-21", "3.3 × 3.5 × 2.6 m", "n/a"],
            ["RVC e2", "ISM and multimedia", "IEC/EN 61000-4-21", "5.5 × 4.0 × 2.6 m", "n/a"],
            ["RVC L", "Full vehicle", "ISO 11451-5", "8.0 × 5.0 × 3.0 m\nvehicle on a dynamometer, ø9 m", "yes"],
            ["RVC XL (mini)", "Automotive components", "ISO 11452-11", "2.5 × 1.0 × 1.5 m\ntable", "limited"],
            ["RVC XL", "Full vehicle", "ISO 11451-5", "8.0 × 5.0 × 3.0 m\nvehicle on a dynamometer, ø9 m", "yes"],
            ["RVC XL (special)", "Full vehicle", "ISO 11451-5", "8.0 × 5.0 × 3.0 m\nvehicle on a dynamometer, ø8 m", "yes"],
            ["RVC XXL", "Full vehicle", "ISO 11451-5", "8.0 × 5.0 × 3.0 m\nvehicle on a dynamometer, ø9 m", "yes"],
          ],
        },
        {
          title: "Stirrer package by chamber",
          note: "Length is the vane length where the design has one, and the tube length for the turbo tube. The package for a project is defined with the chamber.",
          head: ["Chamber", "LUF", "Stirrer 1", "Stirrer 2", "Stirrer 3"],
          rows: [
            ["RVC S", "200 MHz", "Z-Fold ø1.88 m\nvertical · 3.1 m · 30 RPM", "—", "—"],
            ["RVC M", "200 MHz", "Z-Fold ø1.88 m\nvertical · 3.1 m · 30 RPM", "—", "—"],
            ["RVC e1", "200 MHz", "Z-Fold ø1.88 m\nvertical · 3.1 m · 30 RPM", "—", "—"],
            ["RVC e2", "80 MHz", "Z-Fold ø2.8 m\nvertical · 4.0 m · 60 RPM", "Z-Fold ø2.8 m\nhorizontal · 4.0 m · 60 RPM", "—"],
            ["RVC L", "80 MHz", "Z-Fold ø2.8 m\nvertical · 6.0 m · 60 RPM", "Z-Fold ø2.8 m\nhorizontal · 7.0 m · 60 RPM", "—"],
            ["RVC XL (mini)", "200 MHz", "Small Disc ø4.0 m\nhorizontal · 25 RPM", "Turbo Disc ø2.0 m\nvertical · 260 RPM", "Turbo Disc ø2.0 m\nvertical · 260 RPM"],
            ["RVC XL", "80 MHz", "Large Disc ø10.0 m\nhorizontal · 10 RPM", "Turbo Disc ø4.0 m\nvertical · 120 RPM", "Turbo Disc ø4.0 m\nvertical · 120 RPM"],
            ["RVC XL (special)", "80 MHz", "Large Disc ø10.0 m\nhorizontal · 10 RPM", "Turbo Disc ø4.0 m\nvertical · 120 RPM", "Turbo Tube ø2.0 m\nhorizontal · 4.0 m · 240 RPM"],
            ["RVC XXL", "80 MHz", "Large Disc ø12.0 m\nhorizontal · 10 RPM", "Turbo Disc ø5.0 m\nvertical · 80 RPM", "Turbo Disc ø5.0 m\nvertical · 80 RPM"],
          ],
        },
        {
          /* The chamber names are row labels rather than column heads because
             `.spec-table th` sets the head row in uppercase, and the head
             office writes the two industrial models e1 and e2 in lower case —
             a head row here would print them as E1 and E2 and misname a
             model. Cells are not transformed. */
          title: "Accuracy",
          head: ["", "Angle", "Positioning", "Acceleration", "Calibration step"],
          rows: [
            ["RVC S · M · e1", "0.1°", "± 0.5°", "± 0.5°", "—"],
            ["RVC e2 · L · XL · XL (mini) · XL (special) · XXL", "0.1°", "± 0.1°", "± 0.25°", "0.8°"],
          ],
        },
        {
          /* The sheet's Security & Control block, read across the seven
             standard chambers. The rows that are "Yes" in every column — the
             three operating modes, the independent software and stirrer
             setting, the Elektra interface, documentation, CE marking and
             risk evaluation — are the note rather than five identical
             columns. */
          title: "Safety and control by chamber",
          note: "Common to every package: the three operating modes, independent software with an independent setting for each stirrer, the interface to the EMC software, documentation, CE marking and risk evaluation. The dynamic and stability calculation and the RVC simulation are external engineering — the table says whether a chamber needs them and who carries them out.",
          head: ["Chamber", "Safety system", "Maintenance mode", "Dynamic and stability calculation", "RVC simulation"],
          rows: [
            ["RVC S", "Interlock", "no", "not needed", "no"],
            ["RVC M", "Interlock", "no", "not needed", "no"],
            ["RVC e1", "Interlock", "no", "not needed", "no"],
            ["RVC e2", "Interlock", "no", "not needed", "no"],
            ["RVC L", "PLC", "yes", "yes\nby Frankonia", "yes\nby Frankonia"],
            ["RVC XL (mini)", "PLC", "yes", "yes\nby Frankonia", "yes\nby the customer"],
            ["RVC XL", "PLC", "yes", "yes\nby Frankonia", "yes\nby the customer"],
            ["RVC XL (special)", "PLC", "yes", "yes\nby Frankonia", "yes\nby the customer"],
            ["RVC XXL", "PLC", "yes", "yes\nby Frankonia", "yes\nby the customer"],
          ],
        },
        {
          /* The first column carries the diameter because two rows would
             otherwise be the same design under two figures, and `Tables` keys
             a row on its first cell. */
          title: "Mass and space",
          note: "What the building has to carry and clear: the rotating mass hanging from a ceiling structure, and the floor a free-standing turbo stirrer needs around it. A dash is a figure the source does not give for that unit. These follow from the design calculation and are confirmed only with the final design.",
          head: ["Design", "Type", "Total weight", "Rotating mass", "Space (L × W × H)"],
          rows: [
            ["Large ceiling disc ø9.0 m", "FSDMS-9", "—", "—", "ca. 10.0 × 10.0 × 3.6 m"],
            ["Large ceiling disc ø10.0 m", "FSDMS", "ca. 5,500 kg", "ca. 4,500 kg", "—"],
            ["Turbo disc ø4.0 m", "FSDMH-4", "ca. 1,400 kg", "—", "ca. 5.0 × 3.0 × 5.0 m"],
            ["Turbo disc ø5.0 m", "FSDMH", "ca. 1,800 kg", "—", "—"],
            ["Turbo tube ø2.0 m", "FSDRS", "ca. 2,000 kg", "—", "—"],
          ],
        },
      ],
      specsNote: "Frankonia's standard configurations, with figures from executed stirrer packages where the standard tables do not carry them. The stirrer package is defined together with the chamber, so a project's own configuration and figures may differ from these. Ask us for the drawings and a quotation.",
      groups: [
        /* The designs themselves moved into the first table when the
           performance stirrer package documents arrived — a design, its type,
           its rotor and its speed read as a table, and repeating them here as
           bullets would have said the same thing twice. What stayed is what a
           table cannot hold: how each design is carried, driven and signed
           off. */
        { title: "How a stirrer is built", items: [
          "Z-fold — aluminium vanes on the Frankonia model, on a console bolted to the floor and the ceiling, or to the wall, from outside the chamber",
          "Large ceiling disc — an inclined aluminium disc in segments on a rotor frame, its console bolted to an independent internal steel structure that carries the mass and the moments down to the floor",
          "Turbo disc — an inclined aluminium disc embedded in a solid GRP body, the rotor carried on a shielded shaft in a glass-fibre and steel frame",
          "Turbo tube — a conductive aluminium plate in a T-shape, embedded in a rotating body built for the speed it runs at",
          "A cylindrical housing encloses every high-speed rotor, for safety at the workplace and to keep the turbulence down",
          "The turbo stirrers stand on a low-vibration mounting on the raised floor and can be moved to the position a test asks for",
          "A customer's own stirrer design adapted and implemented, in a new chamber or a conversion",
        ] },
        { title: "Drive and control", items: [
          "Servo drive with a low-backlash planetary gear and a shielded shaft bushing, with motor cooling",
          "Drive unit outside the chamber, through a centre-mounted shielded rotary feedthrough",
          "Inductive sensor for the home position, which is what the positioning accuracy is referred to",
          "Shielded control and motor unit, placed inside or outside the chamber",
          "Safety PLC on PROFINET with a motion controller for speed, positioning and angle synchronisation",
          "One controller for every stirrer in the chamber, each of them still set independently",
        ] },
        { title: "Operating modes", items: [
          "Tuned mode 1 — stepped to a position angle",
          "Tuned mode 2 — a single turn at a set °/s",
          "Stirred mode — continuous revolution at a set °/s",
          "Independent software, with an independent setting for each stirrer in the chamber",
          "An interface to the EMC measurement software — Elektra among them",
        ] },
        { title: "Emission-free design", items: [
          "Normative conformity to ISO 11451-5 for testing at vehicle level",
          "EMS-compliant for immunity and EMI-compliant for emission, on every design",
          "The drive is shielded and sits inside, and the running ring is decoupled — so emission measurements are unproblematic with the stirrer in the room",
        ] },
        /* What differs by chamber — interlock or PLC, the maintenance mode,
           the calculation — is the safety table above; what stays here is
           what every package gets. */
        { title: "Safety and documentation", items: [
          "Full safety integration under Machinery Directive 2006/42/EC",
          "CE marking and risk evaluation with every stirrer package",
          "Dynamics, statics, deformation and turbulence simulated for the large designs, together with the drive engineering",
        ] },
        { title: "What the package includes", items: [
          "Project engineering, in-house and external",
          "Project management, documentation, risk assessment and CE marking",
          "The PLC, and the integration support and interface for the control system",
          "The internal steel structure, where the design carries its load into the building",
          "Installation, commissioning and delivery",
          "Calibration measurement and optimisation of the performance on site, with the test plan and the test report",
          "Chamber validation to EN 61000-4-21 — mode tuning from 80 MHz to 18 GHz",
        ] },
      ],
      close: "The stirrer decides what a reverberation chamber can do, so it is specified with the chamber rather than after it: the working volume, the lowest usable frequency and the standard the product has to meet fix the design, the diameter and the speed together.",
    },
    services: {
      lead: [
        "Frankonia starts at the first moment, with the planning, technical drawings, coordination and definition a customer's own demands call for, and stays through every stage that follows.",
        "The consultancy runs from a first idea to a complete testing readiness level. For decades Frankonia has guided customers through the whole course of realising a laboratory — and then, together with them, defined the work packages and milestones that get to their EMC goals, drawing on a network of EMC experts and the standards and practice of the industrial, military and automotive world.",
      ],
      figure: { src: "/chambers/images/topic-services.webp", w: 1240, h: 591 },
      groups: [
        { title: "Through every stage of a project", items: [
          "Project planning — customised projects defined with the customer, with technical details, timelines and complete drawings",
          "Project management — one interface between Frankonia's scope of delivery and the building parties, from first moment to final handover",
          "Engineering — requirements implemented from a single product up to a complete solution",
          "Research and development — Frankosorb®, and continuous research on materials against future standards",
          "Manufacturing — a stand-alone production network, invested in continuously",
          "Implementation — Frankonia's own European installation team, working to its modular and prefabricated standard",
        ] },
        { title: "Planning and consultation", items: [
          "Layout of labs, practical usability, consultation on needs and requirements",
          "Building planning in 3D for new facilities, or the use of existing buildings",
          "Infrastructure definition including building services — ventilation, power, fire prevention and fire simulation",
          "Lab planning for and with architects, and efficient implementation of test equipment parameters",
          "Cost calculation, return on investment, and profitability analysis for running the lab in practice",
        ] },
        { title: "Testing readiness", items: [
          "Test system and software training for newcomers and professionals, with insight into the EMC standards",
          "Hardware and software setup, functionality check, and equipment set up for verification procedures and routines",
          "Test templates, test plans and measurement methods — or supervision of your accreditation",
        ] },
      ],
      close: "With more than 35 years of experience, the goal is to turn individual requirements into reliable, state-of-the-art solutions — because only a complete solution creates long-term satisfaction.",
    },
    references: {
      lead: [
        "Frankonia is recognized as a highly specialized technology corporation for EMC anechoic chambers and test system within the automotive and industrial sector for testing of electromagnetic compatibility.",
        "Our EMC anechoic chambers and test systems are proven and tested in the development departments of well-known manufacturers, in the areas of research by universities and colleges, as well as in labs of leading EMC service providers. Our customers benefit from our extensive experience and our multi-layered knowledge.",
      ],
      figure: { src: "/chambers/images/reference-3.webp", w: 1280, h: 533 },
      groups: [],
      panoramas: {
        title: "360° Panoramas",
        hint: "Each strip is one full turn of the room, flattened out. Drag it sideways — or use the arrow keys — to look around.",
        shots: {
          "fac-3": {
            alt: "Fully anechoic chamber lined with long pyramid absorbers on the walls, the ceiling and the floor. A grey single-leaf shielded door stands under an illuminated emergency exit sign, with a feed-through panel in the wall beside it, and a small antenna sits on a yellow and white mast at the right.",
            caption: "The absorbers carry on across the floor, which is what makes the chamber fully anechoic — the FAC-3 measures under free-space conditions, as a test site without a ground plane.",
          },
          "sac-5-plus": {
            alt: "Semi-anechoic chamber. Pyramid absorbers cover a dome-shaped ceiling and the walls; the floor is a hard reflecting surface with a flush turntable, marked out in red lines and yellow and black tape.",
            caption: "Absorbers above, a reflecting ground plane below — under the dome-shaped roof that is the SAC-5 Plus's own concept.",
          },
          "sac-10-hybrid": {
            alt: "Large vehicle chamber. A white two-seat sports car stands on the turntable circle with a corrugated duct running from its tailpipe to a box in the floor. Short pyramid absorbers on the ceiling, long pyramid absorbers on the right-hand wall, dark panelling above them, and an antenna mast behind the car.",
            caption: "The duct at the tailpipe takes the exhaust out through the floor, so the car can run inside a room that stays shielded.",
          },
        },
      },
      references: {
        title: "Some of our references",
        note: "Customer names appear as the customers themselves publish them. Where an organisation runs more than one Frankonia installation, each one is listed separately.",
      },
    },
  },
  zh: {
    frankosorb: {
      lead: [
        "自从Frankonia的Frankosorb®纳米薄膜吸波材料技术在全球市场上站稳脚跟以来，越来越多的客户正在评估其稳定的性能特点。在超过 35 年的运行过程中，Frankosorb® 没有出现任何故障、缺陷、性能恶化或丧失，并且从未需要更换或维护。",
        "该技术可作为与铁氧体吸波材料组合的混合体，或作为长度可达 2.4 m 的独立金字塔。长金字塔吸波器的最大优点是它可以单独覆盖整个 26 MHz 至 40 GHz 频段，这本身就节省了成本，因为不需要单独的铁氧体吸波器。",
      ],
      figure: { src: "/chambers/images/topic-frankosorb.webp", w: 1280, h: 533 },
      groups: [
        { title: "金字塔（P）系列", items: [
          "单金字塔吸波体80MHz~18/40GHz：P600、P900",
          "长金字塔吸波体26MHz~18/40GHz：P2000、P2200、P2400",
        ] },
        { title: "混合（H）系列", items: [
          "铁氧体吸收体30MHz~1GHz",
          "混合吸波器30MHz~18/40GHz：H450、H600、H1000",
          "高性能混合吸波器30MHz~18/40GHz：H1300涡轮机",
        ] },
        { title: "独特的特性", items: [
          "同时保证高吸收性能和快速散热（中空结构）",
          "制造工艺确保性能一致",
          "不老化、不下垂、不性能下降——超过35年的长期稳定性得到验证",
          "白色表面改善了照明，无需单独的盖子",
          "混合型和长金字塔型吸波器性能相当",
          "符合当前所有验证标准，包括磁场标准",
        ] },
        { title: "人体安全与实验室防护", items: [
          "DIN EN 13501-1 A2 - s1 d0 不燃吸波材料 — 支持高达 1kW/m²·600V/m 的连续输出，中间输出 2.0kW/m²·850V/m",
          "作为替代方案，DIN EN 13501-1 B 级阻燃吸波材料 — 支持高达 0.9kW/m²·550V/m 的连续输出和 1.8kW/m²·800V/m 的中间输出",
          "如果使用不燃吸波材料，则无需安装洒水装置或灭火设备。",
        ] },
        { title: "环境和可用性", items: [
          "即使吸波材料受热也不会产生有毒气体。",
          "无灰尘或碳尘、无溶剂、无粘合剂、无有害物质",
          "99%可回收",
          "非吸湿性材料，耐湿度和温度变化",
          "ISO 14644-1 洁净室等级",
          "易于清洁、可用水清洗、表面抗病毒和细菌",
        ] },
      ],
      close: "当同时需要长期性能和固有的不易燃特性时，Frankosorb® 吸波材料技术仍然是首选。",
    },
    "shielding-gates": {
      lead: [
        "Frankonia 自 1987 年以来一直保持预制、模块化标准，旨在实现最高水平的质量和效率。没有焊接或粘合——一切都保持模块化，为未来的任何变化做好准备。",
        "所有暗室均设计为独立暗室，配备有自己的电气设备，仅通过简单的接口与建筑物连接。作为一家专门从事射频屏蔽和 EMC 测试室的公司，我们提供必要的标准和定制辅助产品，以维持我们作为交钥匙供应商的地位。",
      ],
      figure: { src: "/chambers/images/topic-shielding-gates.webp", w: 1600, h: 1067 },
      groups: [
        { title: "屏蔽及结构", items: [
          "模块化预制PAN型屏蔽系统",
          "所有部件（包括蜂窝、门、穿透元件、电气设备、大门等）具有最高水平的屏蔽衰减。",
          "具有ISO 354吸声性能的吸音板（FAP）",
          "根据当地地震条件量身定制的静钢结构",
        ] },
        { title: "门和大门", items: [
          "单门（SLD）",
          "双门（DLD）",
          "推拉门（SSD）",
          "平移门（SG）",
          "全标准模块化预制，尺寸多样",
        ] },
        { title: "坡道及站台", items: [
          "汽车灯",
          "自动平台，无障碍进入",
          "自定义输入解决方案",
        ] },
        { title: "电气集成与合规", items: [
          "符合当地标准的外部可访问配电盘、接线和安全功能",
          "LED照明、防爆选件、应急照明",
          "AC/DC滤波器、信号/数据滤波器、光转换器",
          "安全矩阵和上实验室控制单元（PLC）",
          "CE 符合性符合机械指令 2006/42/EC — 产品单元标准，完整实验室可选",
        ] },
        { title: "通风、排烟、瓦斯", items: [
          "蜂窝、冷却/排气系统",
          "用于气体和烟雾检测的空气采样网络",
          "烟雾/气体分析仪连接到报警中央设备，符合 ATEX 标准",
          "泄漏检测系统",
          "喷头等消防解决方案",
        ] },
        { title: "视频/声音部测试台", items: [
          "固定/移动高清摄像系统",
          "声音及录音系统",
          "CISPR 25·MIL 带接地层的木材试验台（FGT）",
          "CISPR 32 透明测试台（FTT）",
        ] },
      ],
    },
    automation: {
      lead: [
        "Frankonia 在自己的研发部门设计和开发转盘和天线杆。以现行EMC标准所要求的质量和技术水平为标准。",
        "FTM转盘与腔室环境完全兼容。它嵌入在凸起的底部，并被导电接地环包围，以保持与腔室接地平面的接触。控制由 FC06.1 控制器处理，该控制器使用 IEEE 488.2 (GPIB) 命令。",
        "FAM 天线杆是符合 CISPR 16-1-4 的标准解决方案，具有易于搬运的轮子，并由玻璃纤维和塑料制成，可最大限度地减少反射。 FBM 视轴桅杆增加了符合 ANSI C63.4·CISPR 16-1-4 标准的倾斜功能 — 该软件根据天线参考点和距离以及测试物体尺寸计算倾斜角度，并监控整个测试过程。当倾斜关闭时，它作为标准桅杆运行。",
      ],
      figure: { src: "/chambers/images/topic-automation.webp", w: 1600, h: 1067 },
      groups: [
        { title: "转盘-FTM系列", items: [
          "ø1.2 m~ø12.0 m嵌入式转台，最大80吨",
          "拖链、数据、电力和流体旋转接头、排气和冷却系统以及客户指定项目的集成",
          "测功机集成——固定、自由滚轮、顶部移动",
          "FC06.1控制器具有独立软件（SCPI命令）",
          "可通过通用EMC软件控制，无线连接选项",
        ] },
        { title: "天线杆 – FAM · FBM · FSM", items: [
          "FAM标准天线杆（CISPR）",
          "FBM视轴天线杆（FCC/ANSI·CISPR）",
          "FSM天线支架，极化单元可选",
          "FC06控制器具有独立软件（SCPI命令）",
          "可由通用EMC软件控制",
          "移动设备控制的无线接口",
        ] },
      ],
    },
    stirrers: {
      lead: [
        "混响室内无吸波器。搅拌器使墙壁反射并利用其内部的电场。搅拌器不断改变边界条件，使电场在整个旋转过程中统计上均匀。 Frankonia 在自己的研发部门设计和制造搅拌器，并作为交钥匙搅拌器套件提供。",
        "使用哪种设计取决于工作量和必须达到的最低可用频率（LUF）。 Z 形折叠搅拌器立于暗室内，转速高达 60 RPM，而圆盘/转子设计转速高达 260 RPM，可满足 ISO 11451-5 要求的高速搅拌。天花板上的一个大圆盘将 LUF 从整个车辆进行测试的室中拉下来。从RVC e2开始，多个单元被放置在一个室中，并且每个单元都是独立设置的。",
        "Frankonia 接受并实施客户的搅拌器设计——既适用于新的 RVC，也适用于改造现有的室。安全集成随之而来。这包括风险评估、CE 认证，以及从 RVC L 开始，快速转动大型转子所需的动态和静态负载计算。",
      ],
      figure: {
        src: "/chambers/images/type-rvc-stirrer.webp", w: 1122, h: 591,
        alt: "混响室内。暗室周围都是裸露的金属板，天花板下有一个因旋转而变得模糊的大圆盘搅拌器，转盘上停着一辆蓝色的汽车。",
        caption: "整个车辆测试室正是通过这个巨大的天花板圆盘旋转至 80 MHz，在 10 RPM 时旋转可达 ø12.0 m，在 ø10.0 m 时旋转质量约为 4,500 kg。底部的两个白色圆筒是高速涡轮搅拌器，每个高速转子都包含在这个圆筒形外壳内。",
      },
      figureRow: [
        {
          src: "/chambers/images/stirrer-zfold-antenna.webp", w: 654, h: 872,
          alt: "一个带有垂直轴的Z形折叠搅拌器立在一个暗室里，前面是裸露的金属面板，对数周期天线悬挂在右侧的天花板上。",
          caption: "标准 Z 形折叠 — 30 RPM 时 ø1.88 m。这是RVC S·M·e1 的基本配置。",
        },
        {
          src: "/chambers/images/stirrer-zfold-marking.webp", w: 654, h: 872,
          alt: "Z形折叠搅拌器从地板延伸到天花板。底部轴承位于黄色和黑色安全标记线内。",
          caption: "由于搅拌器在无人看管的情况下旋转，请标记底部轴承圆周。从 RVC L 开始，安全装置不是联锁装置，而是 PLC。",
        },
        {
          src: "/chambers/images/stirrer-zfold-highspeed.webp", w: 901, h: 1201,
          alt: "Z形折叠搅拌器接近。一块螺旋折叠的银色金属板从地板延伸到天花板，右侧有一束电缆。",
          caption: "高速 Z 形折叠 — ø2.8 m，60 RPM，0.8° 步长。每次旋转您可以获得 450 个位置，速度越快，统计不确定性就越少。",
        },
      ],
      tables: [
        {
          /* Frankonia Stirrer Systems 시트의 스터러 한 대가 한 행이다 — 9개
             열에 걸친 형식·방향·크기·회전 속도의 모든 조합, RVC XL 변형
             2종까지. 전에는 범위(ø2.0 – 5.0 m, 80 – 260 RPM)로 접은 6행이라
             시트의 스터러 넷이 가려져 있었다. 견적과 맞춰 보는 독자에게
             필요한 것은 범위가 아니라 그 한 대다. `Tables`가 첫 셀로 행 key를
             만들기 때문에 첫 셀은 유일해야 하고, 같은 설계가 여러 크기로
             오는 곳은 크기나 블레이드 길이를 첫 셀에 넣었다.

             형식 기호는 Frankonia 고성능 스터러 패키지 문서에서 왔다
             (docs/source/chambers-stirrers.md §9). 카탈로그·본사 웹·시트는
             설계 이름만 쓰고 형식 기호는 쓰지 않는다. 기호 뒤의 숫자는 로터
             직경(m)이다. 소형 디스크는 이 사이트가 가진 어느 문서에도 기호가
             없어 대시로 둔다. */
          title: "搅拌器设计",
          note: "所有搅拌器均包含在 Frankonia 标准配置中。型号符号后跟的数字是转子直径，单位为 m — FSDMS-9 是 ø9.0 m 吊盘，FSDMH-4 是 ø4.0 m 涡轮盘。所有设计均符合 EMS/EMI 标准并遵循车辆级测试标准 ISO 11451-5。",
          head: ["设计", "格式", "转子", "最高转速", "电波暗室"],
          rows: [
            ["Z-fold, vertical\nregular", "FSDVZ", "ø1.88 m\nvanes 3.1 m", "30 RPM", "RVC S · M · e1"],
            ["Z-fold, vertical\nperformance · vanes 4.0 m", "FSDVZ", "ø2.8 m\nvanes 4.0 m", "60 RPM", "RVC e2"],
            ["Z-fold, vertical\nperformance · vanes 6.0 m", "FSDVZ", "ø2.8 m\nvanes 6.0 m", "60 RPM", "RVC L"],
            ["Z-fold, horizontal\nperformance · vanes 4.0 m", "FSDHZ", "ø2.8 m\nvanes 4.0 m", "60 RPM", "RVC e2"],
            ["Z-fold, horizontal\nperformance · vanes 7.0 m", "FSDHZ", "ø2.8 m\nvanes 7.0 m", "60 RPM", "RVC L"],
            ["Small disc, horizontal\nslow speed", "—", "ø4.0 m", "25 RPM", "RVC XL (mini)"],
            ["Large ceiling disc ø10.0 m\nhorizontal · slow speed", "FSDMS", "ø10.0 m", "10 RPM", "RVC XL · XL (special)"],
            ["Large ceiling disc ø12.0 m\nhorizontal · slow speed", "FSDMS", "ø12.0 m", "10 RPM", "RVC XXL"],
            ["Turbo disc ø2.0 m\nvertical · high speed", "FSDMH", "ø2.0 m", "260 RPM", "RVC XL (mini)"],
            ["Turbo disc ø4.0 m\nvertical · high speed", "FSDMH", "ø4.0 m", "120 RPM", "RVC XL · XL (special)"],
            ["Turbo disc ø5.0 m\nvertical · high speed", "FSDMH", "ø5.0 m", "80 RPM", "RVC XXL"],
            ["Turbo tube, T-shape\nhorizontal · high speed", "FSDRS", "ø2.0 m\nlength 4.0 m", "240 RPM", "RVC XL (special)"],
          ],
        },
        {
          /* 스터러 시트의 챔버 블록 — 각 패키지가 어느 챔버를 위해 정의되는가.
             외형 치수는 RVC 모델 페이지에 그대로 두고, 이 페이지의 독자에게
             필요한 것만 싣는다: 스터러가 비켜 가야 할 작업 체적과, 고속
             설계를 요구하는 규격(ISO 11451-5)이다. */
          title: "腔室及用途",
          note: "正是腔室定义了每个套件 - 七个标准混响室和两个 RVC XL 变体：使用小盘的组件的紧凑配置，以及第三个搅拌器是涡轮管的特殊配置。所有配置均适用于抗扰度 (EMS) 和辐射 (EMI)，并且腔室的外部尺寸列于 RVC 型号页面上。",
          head: ["Chamber", "使用", "标准", "工作量", "ECE R10"],
          rows: [
            ["RVC S", "汽车零部件", "IEC/EN 61000-4-21\nISO 11452-11", "2.5×1.0×1.5m\n表", "有限公司"],
            ["RVC M", "汽车零部件", "IEC/EN 61000-4-21\nISO 11452-11", "3.3×3.5×2.6m\n表", "有限公司"],
            ["RVC e1", "ISM·多媒体", "IEC/EN 61000-4-21", "3.3 × 3.5 × 2.6 m", "不适用"],
            ["RVC e2", "ISM·多媒体", "IEC/EN 61000-4-21", "5.5 × 4.0 × 2.6 m", "不适用"],
            ["RVC L", "整车", "ISO 11451-5", "8.0×5.0×3.0m\n测功机上的车辆，ø9 m", "适合"],
            ["RVC XL (mini)", "汽车零部件", "ISO 11452-11", "2.5×1.0×1.5m\n表", "有限公司"],
            ["RVC XL", "整车", "ISO 11451-5", "8.0×5.0×3.0m\n测功机上的车辆，ø9 m", "适合"],
            ["RVC XL (special)", "整车", "ISO 11451-5", "8.0×5.0×3.0m\n测功机上的车辆，ø8 m", "适合"],
            ["RVC XXL", "整车", "ISO 11451-5", "8.0×5.0×3.0m\n测功机上的车辆，ø9 m", "适合"],
          ],
        },
        {
          title: "每个室的搅拌器配置",
          note: "长度是该设计中的叶片长度，或者是涡轮管中的管长度。特定于项目的包与腔室一起定义。",
          head: ["Chamber", "LUF", "Stirrer 1", "Stirrer 2", "Stirrer 3"],
          rows: [
            ["RVC S", "200 MHz", "Z-Fold ø1.88 m\nvertical · 3.1 m · 30 RPM", "—", "—"],
            ["RVC M", "200 MHz", "Z-Fold ø1.88 m\nvertical · 3.1 m · 30 RPM", "—", "—"],
            ["RVC e1", "200 MHz", "Z-Fold ø1.88 m\nvertical · 3.1 m · 30 RPM", "—", "—"],
            ["RVC e2", "80 MHz", "Z-Fold ø2.8 m\nvertical · 4.0 m · 60 RPM", "Z-Fold ø2.8 m\nhorizontal · 4.0 m · 60 RPM", "—"],
            ["RVC L", "80 MHz", "Z-Fold ø2.8 m\nvertical · 6.0 m · 60 RPM", "Z-Fold ø2.8 m\nhorizontal · 7.0 m · 60 RPM", "—"],
            ["RVC XL (mini)", "200 MHz", "Small Disc ø4.0 m\nhorizontal · 25 RPM", "Turbo Disc ø2.0 m\nvertical · 260 RPM", "Turbo Disc ø2.0 m\nvertical · 260 RPM"],
            ["RVC XL", "80 MHz", "Large Disc ø10.0 m\nhorizontal · 10 RPM", "Turbo Disc ø4.0 m\nvertical · 120 RPM", "Turbo Disc ø4.0 m\nvertical · 120 RPM"],
            ["RVC XL (special)", "80 MHz", "Large Disc ø10.0 m\nhorizontal · 10 RPM", "Turbo Disc ø4.0 m\nvertical · 120 RPM", "Turbo Tube ø2.0 m\nhorizontal · 4.0 m · 240 RPM"],
            ["RVC XXL", "80 MHz", "Large Disc ø12.0 m\nhorizontal · 10 RPM", "Turbo Disc ø5.0 m\nvertical · 80 RPM", "Turbo Disc ø5.0 m\nvertical · 80 RPM"],
          ],
        },
        {
          /* 열 머리가 아니라 행 레이블에 모델명을 둔다 — `.spec-table th`가
             머리 행을 대문자로 세우는데, 본사는 산업용 두 모델을 e1·e2로 소문자
             표기한다. 머리 행에 두면 E1·E2로 찍혀 모델명이 틀린다. 셀은 변형되지
             않는다. */
          title: "准确度",
          head: ["", "角度", "位置", "加速度", "修正步骤"],
          rows: [
            ["RVC S · M · e1", "0.1°", "± 0.5°", "± 0.5°", "—"],
            ["RVC e2 · L · XL · XL (mini) · XL (special) · XXL", "0.1°", "± 0.1°", "± 0.25°", "0.8°"],
          ],
        },
        {
          /* 시트의 Security & Control 블록을 표준 챔버 7종으로 읽은 것이다.
             모든 열이 "Yes"인 행 — 운전 모드 3종, 독립 소프트웨어와 독립
             설정, Elektra 인터페이스, 문서화, CE 인증, 위험성 평가 — 는 같은
             열을 다섯 번 세우는 대신 note에 적는다. */
          title: "每个室的安全装置和控制装置",
          note: "所有套件共有：3种操作模式、每个搅拌器具有独立设置的独立软件、EMC软件界面、文档、CE认证、风险评估。动态和静态负载计算以及 RVC 模拟属于外部工程，该表指示了每个室的要求以及执行人员。",
          head: ["Chamber", "安全装置", "维护模式", "动/静载荷计算", "RVC模拟"],
          rows: [
            ["RVC S", "联锁", "无", "不需要", "无"],
            ["RVC M", "联锁", "无", "不需要", "无"],
            ["RVC e1", "联锁", "无", "不需要", "无"],
            ["RVC e2", "联锁", "无", "不需要", "无"],
            ["RVC L", "PLC", "是", "是\n由 Frankonia 执行", "是\n由 Frankonia 执行"],
            ["RVC XL (mini)", "PLC", "是", "是\n由 Frankonia 执行", "是\n由客户执行"],
            ["RVC XL", "PLC", "是", "是\n由 Frankonia 执行", "是\n由客户执行"],
            ["RVC XL (special)", "PLC", "是", "是\n由 Frankonia 执行", "是\n由客户执行"],
            ["RVC XXL", "PLC", "是", "是\n由 Frankonia 执行", "是\n由客户执行"],
          ],
        },
        {
          /* 첫 열에 직경을 넣는다. 같은 설계가 두 행에 오면 `Tables`가 첫
             셀로 행 key를 만들기 때문에 중복된다. */
          title: "所需质量和空间",
          note: "这些是建筑物必须承受的荷载和必须清理的空间——悬挂在天花板结构上的旋转质量，以及独立式涡轮搅拌器周围所需的地板。破折号（—）是原始数据未给出单位的值。这些值来自设计计算，只有在最终设计后才能确认。",
          head: ["设计", "格式", "总重量", "旋转质量", "所需空间（长×宽×高）"],
          rows: [
            ["Large ceiling disc ø9.0 m", "FSDMS-9", "—", "—", "ca. 10.0 × 10.0 × 3.6 m"],
            ["Large ceiling disc ø10.0 m", "FSDMS", "ca. 5,500 kg", "ca. 4,500 kg", "—"],
            ["Turbo disc ø4.0 m", "FSDMH-4", "ca. 1,400 kg", "—", "ca. 5.0 × 3.0 × 5.0 m"],
            ["Turbo disc ø5.0 m", "FSDMH", "ca. 1,800 kg", "—", "—"],
            ["Turbo tube ø2.0 m", "FSDRS", "ca. 2,000 kg", "—", "—"],
          ],
        },
      ],
      specsNote: "Frankonia标准配置。标准数据中未包含的项目为实际交付的搅拌器套件的值。搅拌器套件与腔室一起确定，因此配置和尺寸可能会根据项目而有所不同。请联系我们获取详细图纸和估算。",
      groups: [
        /* 고성능 스터러 패키지 문서가 들어오면서 설계 목록 자체는 첫 표로
           옮겼다 — 설계·형식·로터·회전 속도는 표로 읽는 것이고, 여기에
           불릿으로 다시 적으면 같은 말을 두 번 하는 것이 된다. 남은 것은
           표가 담지 못하는 쪽이다: 무엇이 그 로터를 받치고, 돌리고,
           승인하는가. */
        { title: "搅拌器结构", items: [
          "Z 形折叠 — 根据 Frankonia 型号的铝制刀片。将控制台固定到室外的地板、天花板或墙壁上",
          "吊顶大圆盘——分体式铝制斜盘，安装在转子框架上。控制台固定在天花板上的独立内部钢框架上，将质量和力矩传递到地板上。",
          "涡轮盘——嵌入体积体中的铝倾斜盘。转子由玻璃纤维/钢框架内的屏蔽轴支撑。",
          "涡轮管——T形导电铝板嵌入设计用于高速旋转的旋转体中。",
          "高速转子全部封闭在圆柱形外壳内——安全工作与抑制湍流同时实现",
          "涡轮搅拌器安装在高架地板上的低振动支架上，可以移动到测试所需的位置。",
          "客户拥有的搅拌器设计的应用——新室和改造",
        ] },
        { title: "驱动与控制", items: [
          "带有低齿隙行星减速机和屏蔽轴衬套的伺服驱动器，包括电机冷却",
          "驱动部分置于腔室外部，轴线穿过置于中心的屏蔽旋转馈通。",
          "用于原点检测的电感式传感器——位置精度的参考点",
          "屏蔽控制单元和电机单元。可以放置在室内或室外",
          "基于PROFINET的安全PLC和运动控制器——速度、位置和角度同步控制",
          "一个控制器负责腔室中的所有搅拌器，但每个控制器都是独立设置的",
        ] },
        { title: "驾驶模式", items: [
          "调谐模式1——步进移动到指定位置角度",
          "调谐模式 2 — 以指定°/s 旋转 1 圈",
          "搅拌模式—以指定°/s连续旋转",
          "独立软件。腔室中每个搅拌器的独立设置",
          "与 EMC 测量软件的接口 — 包括 Elektra",
        ] },
        { title: "无辐射设计", items: [
          "符合车辆单元测试标准ISO 11451-5",
          "所有设计均适用于抗扰度（EMS）和辐射（EMI）",
          "驱动部分屏蔽放置在内部，运转环绝缘，即使搅拌器留在室内，辐射测量也没有问题。",
        ] },
        /* 챔버마다 다른 것 — 인터록이냐 PLC냐, 유지보수 모드, 계산 — 은 위의
           안전 표로 갔다. 여기 남는 것은 모든 패키지가 받는 것이다. */
        { title: "安全和文件", items: [
          "符合机械指令 2006/42/EC 的安全集成",
          "所有搅拌器套件的CE认证和风险评估",
          "大规模设计模拟动态、静态、变形和湍流以及驱动设计",
        ] },
        { title: "包装内包含什么", items: [
          "项目工程——内部和外部",
          "项目管理、文件记录、风险评估、CE认证",
          "PLC、控制系统集成支持及接口",
          "设计荷载必须转移至建筑物时的内部钢结构",
          "安装、试运行、发货",
          "现场校准测量和性能优化——包括测试计划和测试报告",
          "根据 EN 61000-4-21 进行腔室验证 — 80 MHz 至 18 GHz 模式调谐",
        ] },
      ],
      close: "搅拌器决定混响室能做什么。因此，您不是在选择腔室之后再选择腔室，而是将其与腔室一起选择 - 产品必须满足的工作容积、最低可用频率和规格都决定了设计、直径和转速。",
    },
    services: {
      lead: [
        "Frankonia 从一开始就支持您的项目。从根据客户需求量身定制的规划、技术图纸、协调和规范定义开始，我们负责所有后续步骤。",
        "咨询从最初的构思到全面的测试准备。几十年来，我们一直在指导您完成构建测试实验室的整个过程，然后与您一起定义工作包和里程碑，以实现您的 EMC 目标。该基金会是一个由 EMC 专家组成的网络，他们共享工业、军事和汽车领域的标准和实践。",
      ],
      figure: { src: "/chambers/images/topic-services.webp", w: 1240, h: 591 },
      groups: [
        { title: "项目前期阶段", items: [
          "项目规划——与客户共同定义的定制项目，提供技术细节、进度表和完整图纸",
          "项目管理——Frankonia 供应范围和施工利益相关者之间的单点联系，从开始到最终移交",
          "工程——从单一产品到完整解决方案的需求实现",
          "研发 — Frankosorb®，以及考虑未来标准的持续材料研究",
          "制造——独立的生产网络和持续的设施投资",
          "施工 — Frankonia 自己的欧洲安装团队按照模块化和预制标准工作",
        ] },
        { title: "规划咨询", items: [
          "测试室布局、实用性、需求咨询",
          "新设施或现有建筑利用方式的 3D 建筑规划",
          "基础设施定义，包括通风、电力、防火、火灾模拟",
          "与建筑师一起设计测试室，高效体现测试设备参数",
          "基于实际运营的成本测算、投资回报率、盈利能力分析",
        ] },
        { title: "测试准备", items: [
          "针对初学者和从业者的测试系统和软件培训，EMC标准讲解",
          "硬件/软件设置、功能检查、验证程序和例程的设备配置",
          "支持建立测试模板、测试计划和测量方法，或获得认可",
        ] },
      ],
      close: "凭借超过 35 年的经验，我们的目标是将个性化需求转化为可靠、最新的解决方案 - 因为只有完成的解决方案才能带来长期的满意度。",
    },
    references: {
      lead: [
        "Frankonia 被认为是汽车和工业领域 EMC 电波暗室和电磁兼容性测试测试系统领域高度专业化的技术公司。",
        "Frankonia 的 EMC 电波暗室和测试系统已在知名制造商的开发部门、大学和高等教育机构的研究场所以及领先的 EMC 测试服务公司的测试实验室中得到验证。客户利用他们积累的丰富经验和多层次知识。",
      ],
      figure: { src: "/chambers/images/reference-3.webp", w: 1280, h: 533 },
      groups: [],
      panoramas: {
        title: "360°全景",
        hint: "每个带围绕腔室展开一次。您可以向左或向右拖动或使用箭头键环顾四周。",
        shots: {
          "fac-3": {
            alt: "完全电波暗室内。墙壁、天花板、甚至地板上都覆盖着长长的金字塔吸波器。左边，紧急出口指示灯下方有一个灰色的单门屏蔽门，旁边的墙上有一个穿透面板，右边的一根黄色和白色的桅杆上安装着一个小天线。",
            caption: "完全电波暗室的条件是吸波体延伸到地板——FAC-3是一个没有地平面的测试场地，在自由空间条件下进行测量。",
          },
          "sac-5-plus": {
            alt: "半电波暗室内。圆顶天花板和墙壁上覆盖着金字塔吸波器，地板是反射面。有一个内置转盘，测试区域由红线和黄黑标记划分。",
            caption: "顶部是吸波材料，底部是反射地平面——圆顶形天花板是 SAC-5 Plus 独有的概念。",
          },
          "sac-10-hybrid": {
            alt: "大型车厢内。一辆白色的两人座跑车停在转盘圈上，排气口的波纹管通向地板上的排气箱。天花板是一个短金字塔，右边的墙壁是一个长金字塔吸波材料，上面的墙壁是一个深色面板。车后部有一根天线杆。",
            caption: "连接到排气口的管道将废气排出到地板。这是一种在保持屏蔽的同时驱动车辆的结构。",
          },
        },
      },
      references: {
        title: "主要施工实例",
        note: "客户公司名称遵循客户公司披露的符号。如果一个机构拥有多个 Frankonia 设施，则每个设施都会单独列出。",
      },
    },
  },
};

/**
 * The chambers overview.
 *
 * The two index axes are the page's job, so the body sits around them: what the
 * range is and what holds it together above, and the catalogue's own closing
 * argument — Advantages & Benefits, printed on p.66 — below. Neither repeats
 * what the axes already say.
 */
export const overviewBody: Record<Lang, TopicBody> = {
  en: {
    lead: [
      "Frankonia has been building EMC and antenna test laboratories since 1987. What follows on these pages is one system rather than a catalogue of separate products: a shielded room, compact chambers for pre-compliance work, the semi-anechoic and fully anechoic families at 3, 5 and 10 metres, component and e-drive chambers, and reverberation chambers sized from a single part up to a large vehicle.",
      "Every one of them is modular and prefabricated. Nothing is welded and nothing is glued — the panels are bolted from the inside every 75 mm onto a conductive mesh gasket — so a chamber can be modified, extended, relocated or resold long after handover. The shielding performance is identical across the whole system, and so is the absorber technology behind it: Frankosorb®, in service for more than 35 years without a defect.",
    ],
    figure: {
      src: "/chambers/images/overview-lineup.webp", w: 1600, h: 989,
      alt: "Semi-anechoic chamber seen down its length. Pyramid absorbers cover the side walls and the ceiling, a ferrite-tile wall closes the far end, and the reflecting floor carries a flush turntable outlined in the ground plane.",
      caption: "Absorbers above, a conductive ground plane below, and a turntable set flush into it — the shape almost every chamber in this range starts from.",
    },
    figureRow: [
      { src: "/chambers/images/overview-absorber.webp", w: 900, h: 556,
        alt: "Close view of two Frankosorb® absorber walls meeting at a corner, long pyramids in the foreground and a shorter profile behind.",
        caption: "Frankosorb® — one absorber technology across the range." },
      { src: "/chambers/images/overview-shielding.webp", w: 900, h: 556,
        alt: "A shielded chamber inside a factory hall: an open RF door showing the absorber lining, a steel gantry above, and building services running overhead.",
        caption: "Each chamber is an independent room, with simple interfaces to the building." },
      { src: "/chambers/images/overview-vehicle.webp", w: 900, h: 556,
        alt: "A car turning on the turntable of a large chamber, blurred by the exposure, with long pyramid absorbers on the right-hand wall.",
        caption: "The same system scales to a vehicle on a dynamometer." },
    ],
    groups: [
      { title: "Product advantages", items: [
        "Modular and self-supporting system, which is what guarantees the shielding performance",
        "Prefabricated standard paired with in-house production",
        "An extremely broad range of standard and custom-specific products",
        "In-house developed products, kept current with the latest technologies",
        "Identical shielding performance throughout the whole system",
        "Comprehensive automation devices, from turntable to mast",
        "Frankosorb® absorber technology as a modular and interchangeable solution",
        "Nothing glued or welded — everything mounted by bolting and screwing",
        "No timber works at all, and no harmful materials: no carbon, no polyethylene, no glue",
        "Local adjustment to electricity, statics, technical parameters or building conditions is taken as self-evident",
      ] },
      { title: "Customer benefits", items: [
        "Proven technologies and solutions for more than 35 years",
        "Safety for people, laboratory and building with class A2 non-combustible absorbers",
        "Only recyclable materials, produced in Frankonia's own eco-friendly manufacturing",
        "Few building conditions and requirements to consider",
        "A made-to-order arrangement of chamber and accessories that fits the building it goes into",
        "Simple interfaces to the building — electricity, ventilation, exhaust, data, gas",
        "Improved handling of absorbers and antennas, for faster throughput",
        "A modular setup, so the complete chamber can be relocated, modified or resold",
        "Experienced project management, from the smallest detail to the whole picture",
        "Professional installation and after-sales service by Frankonia",
      ] },
    ],
    close: "No compromises; just satisfaction throughout every custom-built setup.",
  },
  zh: {
    lead: [
      "Frankonia 自 1987 年以来一直在建设 EMC 和天线测试室。本页上的产品系列不是单个产品的列表，而是一个系统 - 屏蔽室、用于预认证的紧凑型暗室、3.0 m、5.0 m 和 10.0 m 的半电波暗室和全电波暗室系列、组件和传动系统室以及用于容纳大型车辆的单个组件的混响室。",
      "全部都是模块化预生产。无需焊接或胶合，面板以 75 毫米的间隔从内部用螺栓固定在导电网状垫圈上。这就是为什么即使在收购后很长时间也可以进行翻新、扩建、搬迁和转售。整个系统的屏蔽性能相同，底层吸波技术也相同——Frankosorb®，该技术已完美运行超过 35 年。",
    ],
    figure: {
      src: "/chambers/images/overview-lineup.webp", w: 1600, h: 989,
      alt: "纵向观察半电波暗室内部。侧壁和天花板上覆盖有金字塔吸波体，内端是铁氧体瓦壁，在作为反射面的地板上，嵌入的转盘在地平面上呈圆形暴露。",
      caption: "顶部有一个吸波材料，底部有一个导电接地层，以及嵌入其中的转盘——该系列中的几乎每个腔室都从这里开始。",
    },
    figureRow: [
      { src: "/chambers/images/overview-absorber.webp", w: 900, h: 556,
        alt: "Frankosorb®吸波材料的两堵墙在拐角处相遇的特写照片。前面是一个长金字塔，后面较短。",
        caption: "Frankosorb® — 一种渗透到整个产品系列的吸收技术。" },
      { src: "/chambers/images/overview-shielding.webp", w: 900, h: 556,
        alt: "厂房内的屏蔽室。在打开的射频门之外可以看到吸波材料衬里，钢制龙门架和建筑设备管道从上面经过。",
        caption: "所有暗室都是独立的暗室，仅通过简单的接口与建筑物连接。" },
      { src: "/chambers/images/overview-vehicle.webp", w: 900, h: 556,
        alt: "一辆汽车在大暗室的转盘上旋转的模糊图片。右壁是一个长金字塔吸波材料。",
        caption: "同样的系统扩展到测功机以上的车辆秤。" },
    ],
    groups: [
      { title: "产品优势", items: [
        "模块化自支撑结构——正是这种结构保证了屏蔽性能",
        "预生产标准与内部生产相结合",
        "极其广泛的产品范围，涵盖标准产品和定制产品",
        "内部开发的产品不断更新以反映最新技术",
        "整个系统具有相同的屏蔽性能",
        "从转盘到桅杆的自动化设备",
        "Frankosorb® 吸波材料技术作为模块化、可互换的解决方案",
        "全部采用螺栓、螺钉紧固，无需胶合、焊接。",
        "无木工，无有害物质——无碳，无聚乙烯，无粘合剂",
        "假定对电气、结构、技术参数和建筑条件进行局部调整。",
      ] },
      { title: "客户利益", items: [
        "经过35年以上验证的技术和解决方案",
        "A2 使用不燃吸波材料保护的人员、测试室和建筑物的安全",
        "我们自己的环保生产设施仅使用和制造可回收材料。",
        "建筑方需要考虑的条件和要求较少",
        "暗室和部件是定制的，以适合要进入的建筑物。",
        "与建筑物的简单接口——电力、通风、排气、数据、燃气",
        "通过改进吸波材料和天线处理来提高吞吐量",
        "由于它具有模块化配置，整个室可以重新安置、改造或转售。",
        "经验丰富的项目管理，负责从细节到整体的一切",
        "Frankonia专业安装服务及售后服务",
      ] },
    ],
    close: "不妥协。对于任何定制设施，满意度应该是唯一剩下的事情。",
  },
};

/**
 * The four industry indexes.
 *
 * An industry page answers a different question from a chamber-type page:
 * not "what shape is this room" but "what does this sector have to prove, and\n * which chambers prove it". So the tables here follow the catalogue's own
 * industry spreads — Automotive p.40–45, Military p.54–55, E-Drive p.48–49 —
 * and the commercial page, whose seventeen models are spread across six
 * different spreads, gets the one table the catalogue never prints: the
 * measuring distance each family is built for.
 */
export const industryBody: Record<Lang, Partial<Record<ChamberIndustry, TopicBody>>> = {
  en: {
    automotive: {
      lead: [
        "The automotive range follows a part from the bench to the vehicle. The ACTC tests components at 1.0 m to CISPR 25 and ISO 11452, with the permanent plug-in contact strip and the bonded test table the standard asks for; the UCC does the same work pre-compliantly in an ultra-compact shell, as an alternative to the GTEM cell and for research.",
        "The AVTC brings components, whole vehicles and commercial products into one chamber at 3.0 m or 5.0 m, and the SAC-10V is the 10.0 m vehicle chamber with an integrated dynamometer for ECE R10 — up to a heavy-load test zone for vehicles 18.0 m long.",
        "Beside them stand five reverberation chambers, from a component in the RVC S to a large vehicle in the RVC XXL, listed with the rest of the range below.",
      ],
      figure: {
        src: "/chambers/images/ind-automotive-vehicle.webp", w: 1600, h: 1095,
        alt: "A dark saloon car on the turntable of a large chamber, with a broad boom of log-periodic antenna elements aimed at it from the left and long pyramid absorbers lining the walls and ceiling.",
        caption: "A full vehicle on the turntable, with the antenna boom at the test distance — the setup ECE R10 and CISPR 12 are written around.",
      },
      tables: [
        { title: "Component chambers – ACTC and UCC",
          note: "Frequency range 150 kHz / 26 MHz to 18 GHz, 40 GHz as an option.",
          head: ["Configuration", "External dimension (L × W × H)", "Test condition"],
          rows: [
            ["ACTC", "6,380 × 5,480 × 3,750 mm", "CISPR 25 component level at 1.0 m test distance"],
            ["ACTC L", "11,480 × 6,580 × 4,500 mm", "CISPR 25 component level and vehicle at 1.0 m test distance"],
            ["UCC", "4,580 × 3,080 × 2,550 mm", "Pre-compliant component level at 1.0 m test distance"],
          ] },
        { title: "Vehicle chamber – AVTC",
          note: "Frequency range 9 kHz / 150 kHz to 18 GHz, 40 GHz as an option.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["AVTC", "11,480 × 9,380 × 6,000 mm", "QZ ø3.0 m at 3.0 m test distance (H = 2.5 m)\ne.g., with a turntable up to ø5.0 m"],
            ["AVTC L", "14,780 × 11,480 × 6,300 mm", "QZ ø3.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)\ne.g., with a turntable up to ø6.0 m"],
            ["AVTC XL", "16,280 × 12,680 × 6,300 mm", "QZ ø4.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)\ne.g., with an integrated dynamometer ø7.0 m"],
          ] },
        { title: "ECE R10 vehicle chamber – SAC-10V",
          note: "/H is the Frankosorb® hybrid absorber solution, /P the full long-pyramid P2400 lining. Frequency range 9 kHz / 150 kHz to 18 GHz, 40 GHz as an option.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-10VC-6/H", "23,030 × 14,480 × 6,300 mm", "QZ ø6.0 m at 5.0 m test distance (H = 2.5 m)\nPrepared for a 10.0 m test distance for vehicle tests"],
            ["SAC-10V-6/H", "22,580 × 15,680 × 8,700 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10V-6/H (SL12)", "24,380 × 16,580 × 9,000 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 12.0 m long vehicles"],
            ["SAC-10V-6/H (SL18)", "26,780 × 18,080 × 9,000 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 18.0 m long vehicles"],
            ["SAC-10V-6/P", "26,480 × 20,180 × 9,000 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10V-6/P (SL12)", "26,480 × 20,180 × 10,500 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 12.0 m long vehicles"],
            ["SAC-10V-6/P (SL18)", "30,080 × 20,180 × 10,500 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 18.0 m long vehicles"],
          ] },
      ],
      groups: [
        { title: "Performance and compliance", items: [
          "Full compliant emission (EMI) according to CISPR 25 and CISPR 12",
          "Full compliant immunity (EMS) according to ISO 11452 and ISO 11451",
          "Full compliant emission (EMI) according to CISPR 16-1-4 and ANSI C63.4 — NSA ±3.5 dB (30 MHz to 1 GHz), SVSWR +5.5 dB (1 GHz to 18 GHz), NSIL ±4.0 dB (9 kHz to 30 MHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3 — FU 0/+6 dB at 75 % of 16 measuring points (26/80 MHz to 18 GHz)",
          "ECE R10 with a dynamometer, at 3.0 m in the AVTC and at 10.0 m in the SAC-10V",
          "CISPR 36 in the SAC-10V",
          "ACTC uniform field 0.5 × 0.5 m at 1.0 m, FU 0/+6 dB at 100 %; ACTC L uniform field 1.5 × 1.5 m at 3.0 m",
        ] },
        { title: "Setup and upgrades", items: [
          "A permanent plug-in contact strip between the absorbers keeps the test table electrically connected to the shielding, as CISPR 25 requires",
          "The UCC as an alternative to the GTEM cell, for pre-compliance and for research and scientific purposes",
          "Floor absorber board for an efficient and fast modification of the test setup (AVTC)",
          "Upgradeable for E-Drive throughout: load machine, EMC-BlueBox, battery test system",
          "Optimised Frankosorb® hybrid lining — Ferrite with H450 in the ACTC and UCC, Ferrite with H1000 and H600 in the AVTC",
          "Heavy load test zones for 12.0 m and 18.0 m vehicles in the SAC-10V SL12 and SL18",
        ] },
      ],
    },
    military: {
      lead: [
        "The MIL-STD Chamber is Frankonia's large military chamber at 1.0 m test distance to MIL-STD 461, for radiated emission and immunity on large EUTs and vehicles, lined with short-pyramid absorbers from 80 MHz to 40 GHz.",
        "The MIL-STD Advanced adds commercial and automotive test site compliance on the same MIL-STD 461 basis, with either a long-pyramid or a hybrid lining. Both are fully customised to the customer's requirements for large and heavyweight EUTs.",
        "For lightweight equipment at component level there are the compact chambers: the MIL CHC with a Frankosorb® hybrid absorber layout, and the MIL CPC with short-pyramid absorbers — both full compliant to MIL-STD 461 and DO-160 at 1.0 m test distance.",
      ],
      figure: {
        src: "/chambers/images/ind-military-milchc.webp", w: 744, h: 590,
        alt: "A compact military chamber: hybrid absorbers on the walls and ceiling, and a long wooden test table with a ground plane standing on the reflecting floor.",
        caption: "Component level to MIL-STD 461 — the bonded wooden test table at the centre of the chamber is what the standard specifies.",
      },
      tables: [
        { title: "Configurations",
          note: "The MIL-STD chambers are dimensioned to the customer's own requirement; the compact MIL CHC and MIL CPC are supplied in the sizes given here.",
          head: ["Configuration", "External dimension (L × W × H)", "Frequency range and lining"],
          rows: [
            ["MIL-STD Chamber", "Custom size", "9 kHz / 80 MHz to 40 GHz with short-pyramid absorbers\nMilitary compliance"],
            ["MIL-STD Advanced Pyramid", "Custom size", "9 kHz / 26 MHz to 40 GHz with long-pyramid absorbers\nMilitary, industrial and automotive compliance"],
            ["MIL-STD Advanced Hybrid", "Custom size", "9 kHz / 30 MHz to 40 GHz with hybrid absorber lining\nMilitary, industrial and automotive compliance"],
            ["MIL CHC", "4,880 × 4,880 × 3,000 mm", "9 kHz / 30 MHz to 40 GHz with hybrid absorber lining"],
            ["MIL CHC / DO-160", "5,330 × 4,880 × 3,000 mm", "9 kHz / 30 MHz to 40 GHz with hybrid absorber lining"],
            ["MIL CPC", "6,080 × 5,380 × 3,750 mm", "9 kHz / 80 MHz to 40 GHz with short-pyramid lining"],
          ] },
        { title: "Absorption at normal incidence",
          head: ["Frequency", "Absorption"],
          rows: [
            ["80 MHz to 250 MHz", "6 dB, as per standard requirements"],
            ["Above 250 MHz", "10 dB, as per standard requirements"],
          ] },
      ],
      groups: [
        { title: "Performance and compliance", items: [
          "Full compliant emission (EMI) and immunity (EMS) according to MIL-STD 461 and DO-160, 30 MHz / 80 MHz to 40 GHz",
          "Full compliant for components according to MIL-STD 461 and DO-160 — MIL CHC and MIL CPC",
          "Commercial compliance for the MIL-STD Advanced: full compliant emission according to CISPR 16-1-4 and ANSI C63.4 — NSA ±3.5 dB (30 MHz to 1 GHz), SVSWR +5.5 dB (1 GHz to 18 GHz), NSIL ±4.0 dB (9 kHz to 30 MHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3 — FU 0/+6 dB at 75 % of 16 measuring points (26/80 MHz to 18 GHz)",
        ] },
        { title: "Absorbers", items: [
          "Frankosorb® short-pyramid, long-pyramid or hybrid absorber lining, chosen with the frequency range",
          "High-performance nano thin-film technology with proven long-term stability",
          "Non-combustible according to EN 13501-1 class A2 - s1 d0",
          "Hardly inflammable according to EN 13501-1 class B as the alternative",
        ] },
      ],
    },
    commercial: {
      lead: [
        "The commercial range is the widest of the four: seventeen chambers, from a bare shielded room to a 10.0 m semi-anechoic chamber with a ø6.0 m quiet zone. Which one a laboratory needs follows from two figures — the measuring distance the standard asks for, and the quiet zone the EUT has to sit inside.",
        "From 3.0 m upwards the chambers are full compliant for emission to CISPR 16-1-4 and ANSI C63.4 and for immunity to IEC/EN 61000-4-3. Below that, the compact chambers trade compliant emission for a room that fits an existing building: the CHC is pre-compliant for emission and full compliant for immunity, and the CHC Plus adds compliant emission above 1 GHz.",
      ],
      figure: {
        src: "/chambers/images/ind-commercial-sac.webp", w: 1600, h: 988,
        alt: "An empty semi-anechoic chamber. Pyramid absorbers on the walls and ceiling, a ferrite-tile wall at the far end, and a bare ground plane with a flush turntable marked out in yellow and black tape.",
        caption: "The chamber before a test: ground plane, turntable and marked measuring points, with the antenna side left clear.",
      },
      tables: [
        { title: "By measuring distance",
          note: "The models themselves, with their own dimensions, are listed above. Frequency range 9 kHz / 30 MHz to 18 GHz across the range, 40 GHz as an option; the shielded room is specified from 10 kHz instead.",
          head: ["Measuring distance", "Chambers", "Quiet zone"],
          rows: [
            ["Shielding only", "Shielded Room", "10 kHz to 18/40 GHz, up to 120 dB"],
            ["Component level", "CTC", "Full compliant immunity per IEC 61000-4-3"],
            ["3.0 m, pre-compliance", "CHC · CHC Plus", "ø1.2 m"],
            ["3.0 m, free space", "FAC-3 · FAC-3 L", "ø1.5 m"],
            ["3.0 m", "SAC-3 Plus · SAC-3 Square", "ø1.2 m to ø3.0 m"],
            ["3.0 m, convertible", "SAC-3 / FAC-3 Transformer", "SAC ø2.0 m · FAC ø1.5 m"],
            ["3.0 m and 5.0 m", "SAC-5 Plus · SAC-5 Square", "ø2.0 m to ø4.0 m"],
            ["10.0 m", "SAC-10 Plus · Triton · SAC-10/H · SAC-10/P", "ø3.0 m to ø6.0 m"],
            ["Reverberation", "RVC e1 · RVC e2", "Working volume 3.3 × 3.5 × 2.6 m and 5.5 × 4.0 × 2.6 m"],
          ] },
      ],
      groups: [
        { title: "Shared compliance", items: [
          "Full compliant emission (EMI) according to CISPR 16-1-4 and ANSI C63.4, ETSI upgradeable — NSA ±3.5 dB (30 MHz to 1 GHz), SVSWR +5.5 dB (1 GHz to 18 GHz), NSIL ±4.0 dB (9 kHz to 30 MHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3 — FU 0/+6 dB at 75 % of 16 measuring points (30/80 MHz to 18 GHz)",
          "Free-space emission and immunity according to IEC/EN 61000-4-22 in the fully anechoic chambers — deviation SdB 1.8 dB",
          "Pre-compliant emission in the compact chambers — NSA ±4.0 dB (30 MHz to 1 GHz) with limited height scan, SVSWR +6.0 dB above 1 GHz",
        ] },
        { title: "Shared construction", items: [
          "Modular, prefabricated PAN type shielding — nothing welded, nothing glued",
          "Optimised Frankosorb® hybrid absorber lining, or a full long-pyramid lining at 10.0 m",
          "Non-combustible absorbers to EN 13501-1 class A2 - s1 d0, class B as the alternative",
          "Upgradeable for E-Drive across the SAC families: load machine, EMC-BlueBox, battery test system",
          "CE conformity per Machinery Directive 2006/42/EC for the product as standard, or for the complete laboratory as an option",
          "Usable for automotive and military standard tests",
        ] },
      ],
    },
    powertrain: {
      lead: [
        "The E-Drive test solutions are Frankonia's dedicated test sites for powertrain components and for the facilities around hybrid, electric, fuel cell and battery drive systems. They offer superior conditions for radiation testing according to CISPR 25 and ISO 11452.",
        "The EDTC-SA is prepared for a single external load machine with a fixed shaft; the EDTC-AX for e-axle tests on powertrain units, with two. The patented system is open to any dynamometer supplier — Frankonia takes care of the EMC setup inside the chamber, with adapted test tables, a grounding conception and 90° angle gear boxes.",
        "The EDTC-BB brings the load machine inside instead. The EMC-BlueBox is a mobile four-quadrant load machine, so braking, driving, direction of rotation, speed regulation and torque control can be simulated in any mix — and on a turntable it gives a 360° view of the EUT.",
      ],
      figure: {
        src: "/chambers/images/ind-powertrain-edtc.webp", w: 1600, h: 1095,
        alt: "A powertrain test rig on the turntable of an absorber-lined chamber: a blue load machine housing on a wheeled frame, a green electric motor on a bench beside it, and copper busbars running between them.",
        caption: "The load machine and the motor under test share the turntable, so the whole rig turns together for a 360° scan.",
      },
      tables: [
        { title: "Chamber configurations",
          head: ["Configuration", "External dimension (L × W × H)", "Load machine"],
          rows: [
            ["EDTC-SA", "7,880 × 5,480 × 3,750 mm", "For the fixed-shaft version with an external load machine\ne.g., 1 × 250 kW with 3,000 RPM and 3,000 Nm"],
            ["EDTC-AX", "9,080 × 6,080 × 3,750 mm", "For the fixed-shaft version with external load machines\ne.g., 2 × 250 kW with 3,000 RPM and 3,000 Nm"],
            ["EDTC-BB", "7,880 × 6,380 × 3,750 mm", "For the mobile load machine EMC-BlueBox up to 120 kW"],
            ["EDTC-BB with turntable", "10,880 × 6,980 × 3,900 mm", "For the mobile load machine EMC-BlueBox up to 120 kW\nWith a turntable for a 360° scan"],
            ["EDTC-HY", "6,380 × 5,480 × 3,750 mm", "For a hydraulic load machine, e.g., 2 × 250 kW"],
          ] },
        { title: "External load machines",
          head: ["", "EDTC-250", "EDTC-500"],
          rows: [
            ["Power", "1 × 250 kW", "2 × 250 kW"],
            ["Speed", "3,000 RPM", "3,000 RPM"],
            ["Torque", "3,000 Nm", "3,000 Nm"],
          ] },
        { title: "EMC-BlueBox mobile load machine",
          head: ["", "BlueBox-30", "BlueBox-40", "BlueBox-65", "BlueBox-120"],
          rows: [
            ["Power", "30 kW", "40 kW", "63 kW", "120 kW"],
            ["Speed", "11,000 RPM", "9,000 RPM", "6,500 RPM", "6,000 RPM"],
            ["Torque", "82 Nm", "140 Nm", "240 Nm", "470 Nm"],
          ] },
      ],
      groups: [
        { title: "Features", items: [
          "Fully compliant with CISPR 25 and ISO 11452",
          "Optimised Frankosorb® hybrid absorber lining",
          "Component or system test level",
          "Mobile, flexible and adjustable to any kind of EUT",
          "360° view when placed on a turntable, for an extended testing range",
          "Combination with battery tests",
          "Integration kit for existing chambers",
          "Optional EUT e-motor power source and water cooling system",
        ] },
        { title: "Installation", items: [
          "Motor adapter, grounding and connection per CISPR 25",
          "Vibration-free and non-interacting solid basement (floating slab)",
          "Extended services in consultancy and test readiness guidance",
        ] },
      ],
    },
  },
  zh: {
    automotive: {
      lead: [
        "汽车产品遵循零件在装载到车辆上之前所经过的确切路径。 ACTC 根据 CISPR 25 和 ISO 11452 在 1.0 m 的距离上测试组件，并按照标准要求配备接地测试台和永久插入式接触片。 UCC 在紧凑型腔室中以预认证级别执行相同的测试，这是 GTEM 单元的替代品和研究解决方案。",
        "AVTC将零部件、整车和商业产品测试集中在一个间隔3.0m或5.0m的测试室中。 SAC-10V是一个10.0 m的车辆试验室，内置测功机，符合ECE R10标准，可配置为长度不超过18.0 m的车辆的中等负载测试区域。",
        "这里增加了一个混响室。从 RVC S 的零件到 RVC XXL 的大型车辆，我们为您提供了以下产品阵容。",
      ],
      figure: {
        src: "/chambers/images/ind-automotive-vehicle.webp", w: 1600, h: 1095,
        alt: "在一个大暗室的转盘上有一辆黑色轿车，在左边，一根带有大量对数周期元素的吊杆瞄准了车辆。墙壁和天花板是长金字塔吸波材料。",
        caption: "天线吊杆放置在转盘上距离成品车测试距离处——这是 ECE R10 和 CISPR 12 假设的布置。",
      },
      tables: [
        { title: "元件试验室-ACTC·UCC",
          note: "频率范围 150 kHz / 26 MHz ~ 18 GHz、40 GHz 可选。",
          head: ["配置", "外形尺寸（长×宽×高）", "测试条件"],
          rows: [
            ["ACTC", "6,380 × 5,480 × 3,750 mm", "CISPR 25 component level at 1.0 m test distance"],
            ["ACTC L", "11,480 × 6,580 × 4,500 mm", "CISPR 25 component level and vehicle at 1.0 m test distance"],
            ["UCC", "4,580 × 3,080 × 2,550 mm", "Pre-compliant component level at 1.0 m test distance"],
          ] },
        { title: "车辆试验室 – AVTC",
          note: "频率范围9kHz/150kHz至18GHz，40GHz可选。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["AVTC", "11,480 × 9,380 × 6,000 mm", "QZ ø3.0 m at 3.0 m test distance (H = 2.5 m)\ne.g., with a turntable up to ø5.0 m"],
            ["AVTC L", "14,780 × 11,480 × 6,300 mm", "QZ ø3.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)\ne.g., with a turntable up to ø6.0 m"],
            ["AVTC XL", "16,280 × 12,680 × 6,300 mm", "QZ ø4.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)\ne.g., with an integrated dynamometer ø7.0 m"],
          ] },
        { title: "ECE R10 车辆室 – SAC-10V",
          note: "/H是Frankosorb®混合吸收组合物，/P是P2400长金字塔前衬。频率范围 9 kHz / 150 kHz 至 18 GHz，40 GHz 可选。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-10VC-6/H", "23,030 × 14,480 × 6,300 mm", "QZ ø6.0 m at 5.0 m test distance (H = 2.5 m)\nPrepared for a 10.0 m test distance for vehicle tests"],
            ["SAC-10V-6/H", "22,580 × 15,680 × 8,700 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10V-6/H (SL12)", "24,380 × 16,580 × 9,000 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 12.0 m long vehicles"],
            ["SAC-10V-6/H (SL18)", "26,780 × 18,080 × 9,000 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 18.0 m long vehicles"],
            ["SAC-10V-6/P", "26,480 × 20,180 × 9,000 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10V-6/P (SL12)", "26,480 × 20,180 × 10,500 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 12.0 m long vehicles"],
            ["SAC-10V-6/P (SL18)", "30,080 × 20,180 × 10,500 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 18.0 m long vehicles"],
          ] },
      ],
      groups: [
        { title: "性能与适用性", items: [
          "符合 CISPR 25 和 CISPR 12 的所有辐射发射 (EMI) 标准",
          "符合 ISO 11452 和 ISO 11451 的所有标准抗扰度 (EMS)",
          "符合 CISPR 16-1-4 和 ANSI C63.4 的所有发射标准 — NSA ±3.5 dB（30 MHz 至 1 GHz）、SVSWR +5.5 dB（1 至 18 GHz）、NSIL ±4.0 dB（9 kHz 至 30 MHz）",
          "完全符合 IEC/EN 61000-4-3 标准抗扰度 — FU 0/+6 dB，16 个测量点的 75%（26/80 MHz 至 18 GHz）",
          "ECE R10 带测功机 — AVTC 为 3.0 m，SAC-10V 为 10.0 m",
          "SAC-10V CISPR 36 兼容",
          "ACTC 均匀电场 0.5 × 0.5 m at 1.0 m，FU 0/+6 dB 100% · ACTC L 均匀电场 1.5 × 1.5 m at 3.0 m",
        ] },
        { title: "配置及扩展", items: [
          "永久安装在吸波材料之间的插入式接触条可维持测试台和屏蔽层之间的电气连接——这是 CISPR 25 的要求",
          "UCC 取代 GTEM 细胞用于预认证和研究/学术目的",
          "底部吸收板（AVTC），用于快速更换测试批次",
          "可扩展至全系列E-Drive——负载、EMC-BlueBox、电池测试系统",
          "优化的Frankosorb®混合衬里——ACTC·UCC含铁氧体和H450，AVTC含铁氧体和H1000·H600",
          "SAC-10V SL12·SL18 12.0 m·18.0 m车辆重载试验区",
        ] },
      ],
    },
    military: {
      lead: [
        "MIL-STD暗室是根据MIL-STD 461测量距离为1.0m的大型军用暗室，支持大型被测设备和车辆的辐射发射和抗扰度测试。内衬单锥体吸波材料，频率范围为 80 MHz 至 40 GHz。",
        "MIL-STD Advanced 基于相同的 MIL-STD 461，加上符合商业和汽车测试场地要求，并且您可以选择长金字塔或混合衬里。这两种解决方案都是完全定制的，以满足客户对大型和重型测试物体的需求。",
        "紧凑型腔室可用于轻型设备的组件测试。配备 Frankosorb® 混合吸波器的 MIL CHC 和配备单锥体吸波器的 MIL CPC，两者完全符合 1.0 m 距离的 MIL-STD 461 和 DO-160 标准。",
      ],
      figure: {
        src: "/chambers/images/ind-military-milchc.webp", w: 744, h: 590,
        alt: "一间小型军用室内。墙壁和天花板上覆盖着混合吸波材料，并在反光地板上放置了一个带地平面的长木制测试台。",
        caption: "MIL-STD 461 组件单元测试——测试室中央的接地木制测试台是标准规定的布置。",
      },
      tables: [
        { title: "结构及尺寸",
          note: "MIL-STD系列尺寸根据客户要求设计。紧凑型腔室 MIL CHC 和 MIL CPC 具有上述尺寸。",
          head: ["配置", "外形尺寸（长×宽×高）", "频率范围及衬里"],
          rows: [
            ["MIL-STD Chamber", "Custom size", "9 kHz / 80 MHz to 40 GHz with short-pyramid absorbers\nMilitary compliance"],
            ["MIL-STD Advanced Pyramid", "Custom size", "9 kHz / 26 MHz to 40 GHz with long-pyramid absorbers\nMilitary, industrial and automotive compliance"],
            ["MIL-STD Advanced Hybrid", "Custom size", "9 kHz / 30 MHz to 40 GHz with hybrid absorber lining\nMilitary, industrial and automotive compliance"],
            ["MIL CHC", "4,880 × 4,880 × 3,000 mm", "9 kHz / 30 MHz to 40 GHz with hybrid absorber lining"],
            ["MIL CHC / DO-160", "5,330 × 4,880 × 3,000 mm", "9 kHz / 30 MHz to 40 GHz with hybrid absorber lining"],
            ["MIL CPC", "6,080 × 5,380 × 3,750 mm", "9 kHz / 80 MHz to 40 GHz with short-pyramid lining"],
          ] },
        { title: "法向入射吸收量",
          head: ["频率", "吸收量"],
          rows: [
            ["80 MHz ~ 250 MHz", "6 dB（根据标准要求）"],
            ["超过250 MHz", "10dB（根据标准要求）"],
          ] },
      ],
      groups: [
        { title: "性能与适用性", items: [
          "符合 MIL-STD 461 和 DO-160 的所有辐射标准 (EMI) 和抗扰度 (EMS)，30 MHz / 80 MHz ~ 40 GHz",
          "每个组件均符合 MIL-STD 461·DO-160 — MIL CHC、MIL CPC 的所有标准",
          "商业上符合 MIL-STD Advanced：符合 CISPR 16-1-4 和 ANSI C63.4 的完整发射标准 — NSA ±3.5 dB（30 MHz 至 1 GHz）、SVSWR +5.5 dB（1 至 18 GHz）、NSIL ±4.0 dB（9 kHz 至 30 MHz）",
          "完全符合 IEC/EN 61000-4-3 标准抗扰度 — FU 0/+6 dB，16 个测量点的 75%（26/80 MHz 至 18 GHz）",
        ] },
        { title: "吸波材料", items: [
          "Frankosorb® 根据频率范围选择短金字塔、长金字塔和混合衬里",
          "高性能纳米薄膜技术，长期稳定性经过验证",
          "EN 13501-1 A2 级 - s1 d0 不燃",
          "或者 EN 13501-1 B 级阻燃剂",
        ] },
      ],
    },
    commercial: {
      lead: [
        "通用工业/电子设备领域是四个行业类别中最广泛的。从单个屏蔽室到带有ø6.0 m静区的10.0 m半电波暗室，需要哪一个取决于两个值——标准要求的测量距离和被测设备必须进入的静区大小。",
        "超过3.0 m的暗室完全符合CISPR 16-1-4·ANSI C63.4辐射和IEC/EN 61000-4-3抗扰度。下面的紧凑室的尺寸适合现有建筑物，而不是符合发射标准。 CHC 已进行发射预认证/抗扰度，完全符合要求，CHC Plus 增加了 1 GHz 以上的符合要求的发射。",
      ],
      figure: {
        src: "/chambers/images/ind-commercial-sac.webp", w: 1600, h: 988,
        alt: "空的半电波暗室内。墙壁和天花板是金字塔吸波体，内端是铁氧体瓦墙，地平面上有一个嵌入式转盘，用黄、黑胶带划分。",
        caption: "测试前的暗室 — 接地平面和转盘、标记的测量位置以及空的天线侧面空间。",
      },
      tables: [
        { title: "按测量距离选择",
          note: "每个型号的单独尺寸在上面的阵容中。所有系列的频率范围为 9 kHz / 30 MHz 至 18 GHz（40 GHz 选项），并且仅针对屏蔽室指定为 10 kHz。",
          head: ["测量距离", "电波暗室", "Quiet Zone"],
          rows: [
            ["仅屏蔽", "Shielded Room", "10 kHz 至 18/40 GHz，高达 120 dB"],
            ["零件单元", "CTC", "IEC 61000-4-3全标准抗扰度"],
            ["3.0m预认证", "CHC · CHC Plus", "ø1.2 m"],
            ["3.0m自由空间", "FAC-3 · FAC-3 L", "ø1.5 m"],
            ["3.0 m", "SAC-3 Plus · SAC-3 Square", "ø1.2 m ~ ø3.0 m"],
            ["3.0m转换型", "SAC-3 / FAC-3 Transformer", "SAC ø2.0 m · FAC ø1.5 m"],
            ["3.0 m · 5.0 m", "SAC-5 Plus · SAC-5 Square", "ø2.0 m ~ ø4.0 m"],
            ["10.0 m", "SAC-10 Plus · Triton · SAC-10/H · SAC-10/P", "ø3.0 m ~ ø6.0 m"],
            ["混响", "RVC e1 · RVC e2", "工作体积3.3×3.5×2.6m、5.5×4.0×2.6m"],
          ] },
      ],
      groups: [
        { title: "共同符合", items: [
          "符合 CISPR 16-1-4·ANSI C63.4 的完整发射标准 (EMI)，ETSI 可升级 — NSA ±3.5 dB（30 MHz 至 1 GHz）、SVSWR +5.5 dB（1 至 18 GHz）、NSIL ±4.0 dB（9 kHz 至 30 MHz）",
          "完全符合 IEC/EN 61000-4-3 标准抗扰度 (EMS) — FU 0/+6 dB，16 个测量点的 75%（30/80 MHz 至 18 GHz）",
          "IEC/EN 61000-4-22 全电波暗室的自由空间发射/抗扰度合规性 — 偏差 SdB 1.8 dB",
          "紧凑型暗室的预先认证发射 — NSA ±4.0 dB（30 MHz 至 1 GHz，高度扫描受限），SVSWR 在 1 GHz 以上 +6.0 dB",
        ] },
        { title: "通用结构", items: [
          "模块化预制PAN型屏蔽——无需焊接、无需胶合",
          "优化的 Frankosorb® 混合衬里，或 10.0 m 系列的长金字塔前衬里",
          "EN 13501-1 A2 级 - s1 d0 不燃吸波材料，或者 B 级",
          "E-Drive 扩展至 SAC 系列 — 负载、EMC-BlueBox、电池测试系统",
          "CE 符合性符合机械指令 2006/42/EC — 产品单元标准，完整实验室可选",
          "还可用于汽车和军工标准测试",
        ] },
      ],
    },
    powertrain: {
      lead: [
        "E-Drive Test Solution 是一个专门针对混合动力、电动、燃料电池和电池驱动系统相关传动系统部件和设备的测试中心。根据 CISPR 25 和 ISO 11452 提供优化的辐射测试条件。",
        "EDTC-SA基于一个固定轴外部负载，EDTC-AX基于两个单元，用于测试传动系统单元的电轴。该专利系统可以与任何测功机供应商结合使用——Frankonia 负责测试室内的 EMC 配置，提供专用测试台、接地概念和 90° 角变速箱。",
        "另一方面，EDTC-BB 将负载带入腔室。由于EMC-BlueBox是能够四象限运行的可移动负载，因此它可以再现制动、驱动、正向/反向旋转、速度控制和扭矩控制的任意组合。当放置在转盘上时，可以 360° 观察被测设备。",
      ],
      figure: {
        src: "/chambers/images/ind-powertrain-edtc.webp", w: 1600, h: 1095,
        alt: "将传动系统测试装置放置在被减震器包围的室中的转盘上。您可以看到轮式框架上的蓝色负载外壳、旁边测试台上的绿色电动机以及连接它们的铜母线。",
        caption: "由于负载和被测电机使用同一个转盘，因此整个装置在360°扫描时一起旋转。",
      },
      tables: [
        { title: "腔室组成",
          head: ["配置", "外形尺寸（长×宽×高）", "负载"],
          rows: [
            ["EDTC-SA", "7,880 × 5,480 × 3,750 mm", "For the fixed-shaft version with an external load machine\ne.g., 1 × 250 kW with 3,000 RPM and 3,000 Nm"],
            ["EDTC-AX", "9,080 × 6,080 × 3,750 mm", "For the fixed-shaft version with external load machines\ne.g., 2 × 250 kW with 3,000 RPM and 3,000 Nm"],
            ["EDTC-BB", "7,880 × 6,380 × 3,750 mm", "For the mobile load machine EMC-BlueBox up to 120 kW"],
            ["EDTC-BB with turntable", "10,880 × 6,980 × 3,900 mm", "For the mobile load machine EMC-BlueBox up to 120 kW\nWith a turntable for a 360° scan"],
            ["EDTC-HY", "6,380 × 5,480 × 3,750 mm", "For a hydraulic load machine, e.g., 2 × 250 kW"],
          ] },
        { title: "外部负载",
          head: ["", "EDTC-250", "EDTC-500"],
          rows: [
            ["输出", "1 × 250 kW", "2 × 250 kW"],
            ["旋转次数", "3,000 RPM", "3,000 RPM"],
            ["谈话", "3,000 Nm", "3,000 Nm"],
          ] },
        { title: "EMC-BlueBox便携式装载机",
          head: ["", "BlueBox-30", "BlueBox-40", "BlueBox-65", "BlueBox-120"],
          rows: [
            ["输出", "30 kW", "40 kW", "63 kW", "120 kW"],
            ["旋转次数", "11,000 RPM", "9,000 RPM", "6,500 RPM", "6,000 RPM"],
            ["谈话", "82 Nm", "140 Nm", "240 Nm", "470 Nm"],
          ] },
      ],
      groups: [
        { title: "特点", items: [
          "完全符合CISPR 25和ISO 11452",
          "优化的 Frankosorb® 混合吸收衬里",
          "部件级或系统级测试",
          "移动性和灵活性——适应任何类型的被测设备",
          "当安装在转盘上时，可以进行360°观察，扩大了测试范围。",
          "与电池测试结合",
          "现有室的集成套件",
          "被测电机的电源和水冷系统选项",
        ] },
        { title: "安装条件", items: [
          "电机适配器/接地/接线符合 CISPR 25",
          "基础坚实（浮板），无振动，互不干扰",
          "咨询、备考指导等延伸服务",
        ] },
      ],
    },
  },
};

/**
 * The six chamber-type indexes.
 *
 * Where an industry page asks what a sector has to prove, a type page asks what
 * a shape of room can do — and the catalogue answers that spread by spread, so
 * these bodies follow its spreads: the dome and square SACs and the two 10.0 m
 * linings (p.18–37), the fully anechoic pair and the Transformer (p.16, p.26),
 * the compact hybrids (p.12), the component and e-drive chambers (p.40, p.48),
 * the reverberation range (p.50) and the shielded room the whole system starts
 * from (p.10).
 */
export const typeBody: Record<Lang, Partial<Record<ChamberType, TopicBody>>> = {
  en: {
    sac: {
      lead: [
        "A semi-anechoic chamber is lined with absorbers above and reflective below: the floor is a conductive ground plane, which is the test site CISPR 16-1-4 and ANSI C63.4 describe. Frankonia's semi-anechoic chambers are built that way, at 3, 5 and 10 metres.",
        "Two shells exist for the same distances. The dome design — the SAC-3 Plus and the SAC-5 Plus — shapes the roof so that the Frankosorb® layout minimises reflections; since its introduction the SAC-3 Plus has been the most selected chamber in its class. The square design keeps the traditional shell, reaches a ø4.0 m quiet zone, and takes a larger turntable or a mobile dynamometer.",
        "At 10.0 m the question becomes the lining and the number of axes. The SAC-10 Plus is a single axis. The Triton folds one 10.0 m and two 3.0 m axes into one polygonal shell, with the antennas and floor absorbers staying connected between them — which is what cuts the setup time. The SAC-10/H is lined hybrid, the SAC-10/P entirely with P2400 long pyramids as the cost-efficient alternative.",
      ],
      figure: {
        src: "/chambers/images/type-sac-dome.webp", w: 1600, h: 1095,
        alt: "The inside of a dome-design semi-anechoic chamber. The ceiling arches over the room in a dark band framed by pyramid absorbers, the walls are fully lined, and trolleys of white floor absorbers stand at the sides of the reflecting floor.",
        caption: "The dome roof, seen from inside: the curve is what carries the absorber layout that minimises reflections. The floor absorbers wait on trolleys at the wall, for when the same room is used for immunity.",
      },
      tables: [
        { title: "Dome design – SAC-3 Plus and SAC-5 Plus",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Optimised Frankosorb® hybrid lining with Ferrite, H1000 and H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-3 Plus S", "8,480 × 6,530 × 6,000 mm", "QZ ø1.2 m at 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus M", "8,780 × 6,530 × 6,000 mm", "QZ ø1.5 m at 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus L", "9,230 × 6,530 × 6,000 mm", "QZ ø2.0 m at 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus", "9,680 × 6,530 × 6,000 mm", "QZ ø2.0 m at 3.0 m test distance (H = 2.0 m)"],
            ["SAC-5 Plus", "12,680 × 7,730 × 6,300 mm", "QZ ø2.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Plus L", "12,680 × 8,180 × 6,300 mm", "QZ ø3.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)"],
          ] },
        { title: "Square design – SAC-3 Square and SAC-5 Square",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Optimised Frankosorb® hybrid lining with Ferrite, H450 or H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-3 Square", "9,680 × 6,530 × 6,000 mm", "QZ ø2.0 m at 3.0 m test distance (H = 2.5 m)"],
            ["SAC-3 Square L", "10,880 × 6,980 × 6,000 mm", "QZ ø3.0 m at 3.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Square", "12,680 × 7,730 × 6,000 mm", "QZ ø2.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Square L", "12,680 × 8,180 × 6,000 mm", "QZ ø3.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Square XL", "13,280 × 9,380 × 6,300 mm", "QZ ø4.0 m at 5.0 m test distance (H = 2.5 m)\nQZ ø3.0 m at 3.0 m test distance (H = 2.5 m)\nReady for a larger turntable or mobile dynamometer"],
          ] },
        { title: "10.0 m – single and multiple test axes",
          head: ["Configuration", "External dimension (L × W × H)", "Test axes"],
          rows: [
            ["SAC-10 Plus", "19,205 × 12,080 × 8,325 mm", "QZ ø3.0 m at 10.0 m test distance (H = 3.0 m)\nSingle test axis — the cost-saving configuration of the same shell"],
            ["SAC-10 Plus Triton", "19,205 × 12,080 × 8,325 mm", "QZ ø3.0 m with multiple test axes (H = 3.0 m)\n1 × 10.0 m test distance (axis 1 = EMI and EMS)\n1 × 3.0 m test distance (axis 2 = EMI and EMS)\n1 × 3.0 m test distance (axis 3 = EMS)"],
          ] },
        { title: "10.0 m – sized to the quiet zone",
          note: "/H is lined with Frankosorb® hybrid absorbers — Ferrite with H1000, H600 and the H1300 Turbine; /P is fully lined with P2400 long pyramids. Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-10-3/H", "18,380 × 12,830 × 8,550 mm", "QZ ø3.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-4/H", "19,280 × 13,280 × 8,550 mm", "QZ ø4.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-5/H", "21,080 × 15,080 × 8,700 mm", "QZ ø5.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-6/H", "21,680 × 15,680 × 8,700 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-3/P", "21,680 × 13,730 × 8,550 mm", "QZ ø3.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-4/P", "21,680 × 13,730 × 8,550 mm", "QZ ø4.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-5/P", "23,480 × 16,580 × 9,000 mm", "QZ ø5.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-6/P", "24,980 × 17,180 × 9,000 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
          ] },
      ],
      groups: [
        { title: "Performance and compliance", items: [
          "Full compliant emission (EMI) according to CISPR 16-1-4 and ANSI C63.4, ETSI upgradeable — NSA ±3.5 dB (30 MHz to 1 GHz), SVSWR +5.5 dB (1 GHz to 18 GHz), NSIL ±4.0 dB (9 kHz to 30 MHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3 — FU 0/+6 dB at 75 % of 16 measuring points, from 30/80 MHz at 3.0 m and 5.0 m and from 26/80 MHz at 10.0 m, up to 18 GHz",
          "Full compliant according to CISPR 25 and MIL-STD 461 in the Triton",
          "Full compliant with military and automotive standards in the SAC-10/H and SAC-10/P",
        ] },
        { title: "What separates them", items: [
          "Dome design: an innovatively shaped roof with an optimised Frankosorb® layout, minimised reflections, and outstanding NSA, SVSWR and FU — the most selected chamber in its class since its introduction",
          "Square design: the traditional shell, a quiet zone from ø2.0 m up to ø4.0 m, a large turntable or mobile dynamometer, and immunity floor absorbers stored in the chamber on trolleys",
          "Triton: three independent axes in a polygonal shell, antennas and floor absorbers staying connected, and a guided floor absorber arrangement that cuts setup time while reproducibility stays stable — the most compact and lightweight 10.0 m chamber existing",
          "SAC-10/H: adjustable size, characteristics and configuration for different EUT requirements, single or double test axis, specialised for out-of-the-range test environments",
          "SAC-10/P: a full long-pyramid lining as a cost-efficient alternative to hybrid without limitations, with floor absorber storage below the pyramids",
          "All SAC families are upgradeable for E-Drive — load machine, BlueBox, battery test system — and usable for automotive and military standard tests",
        ] },
      ],
    },
    fac: {
      lead: [
        "A fully anechoic chamber has absorbers on the floor as well, so there is no ground plane and no reflection to account for: the measurement is made under free-space conditions, on a test site CISPR 16-1-4 describes without a ground plane.",
        "The FAC-3 is the compact version for table-top EUTs, with a ø1.5 m quiet zone at 1.5 m height. The FAC-3 L extends it to floor-standing products as well, and adds a height scan using a FAM or FBM antenna mast.",
        "The Transformer is one chamber that is both. It runs as a semi-anechoic chamber with a ground plane, and an optimised floor absorber modification kit turns it into a fully anechoic test site for table-top EUTs — the two setups keep their own quiet zones and their own compliance figures.",
      ],
      figure: {
        src: "/chambers/images/type-fac-freespace.webp", w: 1600, h: 1095,
        alt: "A fully anechoic chamber. White pyramid absorbers cover the floor as well as the walls and ceiling, a wooden test bench stands on a walkway across them, and a horn antenna on a red mount points in from the left.",
        caption: "Absorbers underfoot as well: with no ground plane there is no reflected ray to add, which is what free-space conditions mean in practice.",
      },
      tables: [
        { title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Optimised Frankosorb® hybrid lining with Ferrite, H1000 and H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone and products"],
          rows: [
            ["FAC-3", "8,705 × 4,655 × 3,750 mm", "QZ ø1.5 m at 3.0 m test distance (H = 1.5 m)\nTable-top products"],
            ["FAC-3 L", "9,380 × 5,780 × 6,000 mm", "QZ ø1.5 m at 3.0 m test distance (H = 2.0 m)\nFloor-standing and table-top products, with height scan"],
            ["SAC-3 / FAC-3 Transformer", "9,680 × 6,530 × 6,000 mm", "SAC setup: QZ ø2.0 m at 3.0 m test distance (H = 2.5 m)\nFAC setup: QZ ø1.5 m at 3.0 m test distance (H = 1.5 m)"],
          ] },
      ],
      groups: [
        { title: "Performance and compliance", items: [
          "Full compliant emission (EMI) according to CISPR 16-1-4 — FS NSA ±3.5 dB (30 MHz to 1 GHz), SVSWR +5.5 dB (1 GHz to 18 GHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3 — FU 0/+6 dB at 75 % of 16 measuring points (30/80 MHz to 18 GHz)",
          "Full compliant immunity and emission according to IEC/EN 61000-4-22 — deviation SdB 1.8 dB",
          "Full compliant emission according to CISPR 16-1-4, IEC/EN 61000-4-22 and ETSI",
          "Transformer in the semi configuration: NSA ±3.5 dB, SVSWR +5.5 dB, NSIL ±4.0 dB (9 kHz to 30 MHz); in the fully configuration: FS NSA ±3.5 dB, SVSWR +5.5 dB",
          "Transformer additionally full compliant according to CISPR 25 and MIL-STD 461",
        ] },
        { title: "Features", items: [
          "FAC-3: a test site for table-top EUTs",
          "FAC-3 L: a test site for table-top and floor-standing EUTs, with height scan",
          "A cost-effective solution for free-space measurements",
          "Compact chamber design with an advanced Frankosorb® absorber lining",
          "Double test axis option",
          "Transformer: an optimised floor absorber modification kit, and upgradeable for E-Drive (load machine, BlueBox, battery test system)",
        ] },
      ],
    },
    chc: {
      lead: [
        "A compact hybrid chamber is the smallest full test site in the range: a 3.0 m measuring distance and a ø1.2 m quiet zone inside a shell 7.4 m long. It is pre-compliant for emission and full compliant for immunity — the combination that carries most of a development department's work, in a fraction of the room a compliant emission site needs.",
        "The CHC Plus is the advanced setup, which adds compliant emission measurement from 1 GHz to 18 GHz. The L versions of both add an absorber-lined partition wall, so that RF power amplifiers, antennas or floor absorbers can be housed and stored inside the chamber itself.",
        "The MIL CHC is the same idea for defence work: a Frankosorb® hybrid absorber layout from 30 MHz to 40 GHz, full compliant for components to MIL-STD 461 and DO-160 at 1.0 m test distance.",
      ],
      figure: {
        src: "/chambers/images/type-chc-panel.webp", w: 1122, h: 591,
        alt: "Close view inside a chamber corner: hybrid absorbers meeting a dark panelled wall, with a bolted feed-through plate and a warning label between them, and the Frankonia mark stamped into the panel beside it.",
        caption: "The wall behind the absorbers is the chamber: bolted panels, a feed-through plate and the electrics, all reachable from outside.",
      },
      tables: [
        { title: "Configurations",
          note: "CHC family 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option; MIL CHC 9 kHz / 30 MHz to 40 GHz with a hybrid absorber lining.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone and feature"],
          rows: [
            ["CHC", "7,355 × 3,755 × 3,300 mm", "QZ ø1.2 m at 3.0 m test distance"],
            ["CHC L", "8,255 × 3,755 × 3,300 mm", "QZ ø1.2 m at 3.0 m test distance\nAn amplifier, for example, can be stored in the chamber"],
            ["CHC Plus", "7,355 × 3,755 × 3,300 mm", "QZ ø1.2 m at 3.0 m test distance\nCompliant emission above 1 GHz"],
            ["CHC Plus L", "7,580 × 4,655 × 4,350 mm", "QZ ø1.2 m at 3.0 m test distance\nTurntable ø2.0 m, compliant emission above 1 GHz"],
            ["MIL CHC", "4,880 × 4,880 × 3,000 mm", "Component testing to MIL-STD 461 and DO-160 at 1.0 m"],
            ["MIL CHC / DO-160", "5,330 × 4,880 × 3,000 mm", "Component testing to MIL-STD 461 and DO-160 at 1.0 m"],
          ] },
      ],
      groups: [
        { title: "Performance and compliance", items: [
          "Pre-compliant emission (EMI) according to CISPR 16-1-4 — NSA ±4.0 dB (30 MHz to 1 GHz) with limited height scan",
          "Compliant emission (EMI) according to CISPR 16-1-4 — SVSWR +6.0 dB (1 GHz to 18 GHz), in the CHC Plus",
          "Full compliant and cost saving solution for immunity (EMS) according to IEC/EN 61000-4-3 — FU 0/+6 dB at 75 % of 16 measuring points (30/80 MHz to 18 GHz)",
          "MIL CHC: full compliant emission and immunity for components according to MIL-STD 461 and DO-160",
        ] },
        { title: "Absorbers", items: [
          "Optimised Frankosorb® hybrid absorber lining with Ferrite, H450 or H600",
          "High-performance nano thin-film technology with proven long-term stability",
          "Non-combustible according to EN 13501-1 class A2 - s1 d0",
          "Hardly inflammable according to EN 13501-1 class B as the alternative",
        ] },
      ],
    },
    component: {
      lead: [
        "A component chamber tests a part rather than a product: the EUT sits on a table at a fixed distance, the harness is bonded to the shield, and the standard prescribes the geometry down to the millimetre. CISPR 25 and ISO 11452 for automotive parts, MIL-STD 461 and DO-160 for defence, IEC/EN 61000-4-3 for immunity across all of them.",
        "The ACTC is the full compliant CISPR 25 chamber at 1.0 m, with a permanent plug-in contact strip installed between the absorbers to keep the test table electrically connected to the shielding. The UCC does the same work pre-compliantly in an ultra-compact shell — an alternative to the GTEM cell, and to research and scientific setups in any sector. The CTC is the full compliant immunity chamber: industrial products, automotive components and military tests in one room.",
        "The three EDTC chambers extend the same discipline to a running powertrain, built either around an external load machine with a fixed shaft or around the mobile EMC-BlueBox.",
      ],
      figure: {
        src: "/chambers/images/type-component-cispr25.webp", w: 1600, h: 988,
        alt: "A component test setup: a wooden test table with a ground plane standing in an absorber-lined chamber, a red antenna trolley aimed at it from the left, and a hybrid ferrite-and-pyramid wall behind.",
        caption: "The CISPR 25 geometry: a bonded wooden table, a fixed 1.0 m distance, and the harness routed along the table edge.",
      },
      tables: [
        { title: "Configurations",
          note: "Frequency range — ACTC and UCC 150 kHz / 26 MHz to 18 GHz (40 GHz option), CTC 9 kHz / 30 MHz to 18 GHz (40 GHz option). The EDTC chambers are specified by the load machine they are built around.",
          head: ["Configuration", "External dimension (L × W × H)", "Test condition"],
          rows: [
            ["ACTC", "6,380 × 5,480 × 3,750 mm", "CISPR 25 component level at 1.0 m test distance"],
            ["ACTC L", "11,480 × 6,580 × 4,500 mm", "CISPR 25 component level and vehicle at 1.0 m test distance"],
            ["UCC", "4,580 × 3,080 × 2,550 mm", "Pre-compliant component level at 1.0 m test distance"],
            ["CTC", "8,480 × 5,485 × 3,750 mm", "Full compliant immunity testing per IEC 61000-4-3\nFull compliant to CISPR 25 and ISO 11452, MIL-STD 461 and DO-160"],
            ["EDTC-SA", "7,880 × 5,480 × 3,750 mm", "One external load machine with fixed shaft"],
            ["EDTC-AX", "9,080 × 6,080 × 3,750 mm", "Two external load machines with fixed shaft, for e-axle tests"],
            ["EDTC-BB", "7,880 × 6,380 × 3,750 mm", "The mobile load machine EMC-BlueBox, up to 120 kW"],
          ] },
      ],
      groups: [
        { title: "Performance and compliance", items: [
          "ACTC: full compliant emission according to CISPR 25, full compliant immunity according to ISO 11452, compliant immunity according to IEC/EN 61000-4-3 — uniform field 0.5 × 0.5 m at 1.0 m, FU 0/+6 dB at 100 % (26/80 MHz to 18 GHz)",
          "ACTC L: full compliant emission according to CISPR 25 and immunity according to ISO 11452 and IEC/EN 61000-4-3 — uniform field 1.5 × 1.5 m at 3.0 m, FU 0/+6 dB at 75 % of 16 measuring points",
          "UCC: pre-compliant emission according to CISPR 25 and pre-compliant immunity according to ISO 11452",
          "CTC: full compliant immunity per IEC 61000-4-3, full compliant with CISPR 25 and ISO 11452, MIL-STD 461 and DO-160",
          "EDTC: fully compliant with CISPR 25 and ISO 11452",
        ] },
        { title: "Setup", items: [
          "A permanent plug-in contact strip between the absorbers, and the test table CISPR 25 requires",
          "Optimised Frankosorb® hybrid absorber lining with Ferrite and H450",
          "Upgradeable for E-Drive: load machine, EMC-BlueBox, battery test system",
          "EDTC: motor adapter, grounding and connection per CISPR 25, on a vibration-free floating slab",
          "EDTC-BB: four-quadrant operation, on a turntable for a 360° view of the EUT",
        ] },
      ],
    },
    rvc: {
      lead: [
        "A reverberation chamber does not absorb. Its walls reflect, and a stirrer keeps changing the boundary conditions so that the field inside becomes statistically uniform over one turn. For immunity work that means a high field strength from modest amplifier power, and no antenna alignment to argue about.",
        "Frankonia builds them on the same modular construction system as the anechoic chambers. Prefabricated high-quality shielding panels above 8 MS/m guarantee the performance, and they can be installed reverse for a flat inside surface or as regular PAN shielding mounted from within — which leaves a later absorber lining possible. An existing EMC chamber can be converted into an RVC, and an RVC retrofitted with Frankosorb® hybrid absorbers.",
        "The stirrer is the instrument. Frankonia designs its own — Z-fold, disc, tube and large-disc — and also implements a customer's own stirrer design, in a new chamber or a converted one.",
      ],
      figure: {
        src: "/chambers/images/type-rvc-stirrer.webp", w: 1122, h: 591,
        alt: "Inside a reverberation chamber: bare metal shielding panels on every surface, a large disc stirrer turning under the ceiling and blurred by the exposure, a blue car on the turntable, and white reflectors standing beside it.",
        caption: "No absorbers anywhere — the stirrer overhead, caught mid-turn, is what makes the field uniform.",
      },
      tables: [
        { title: "Commercial and industrial RVC",
          head: ["Model", "External dimension (L × W × H)", "Working volume, LUF and stirrer"],
          rows: [
            ["RVC e1", "7,580 × 5,630 × 4,200 mm", "Working volume 3.3 × 3.5 × 2.6 m · LUF 200 MHz\n1 × Z-Fold stirrer (vertical oriented)\nSmall or medium size ISM and multimedia products"],
            ["RVC e2", "11,280 × 7,280 × 4,950 mm", "Working volume 5.5 × 4.0 × 2.6 m · LUF 80 MHz\n2 × Z-Fold stirrer (vertical and horizontal oriented)\nLarge ISM and multimedia products"],
          ] },
        { title: "Automotive and military RVC",
          head: ["Model", "External dimension (L × W × H)", "Working volume, LUF and stirrer"],
          rows: [
            ["RVC S", "5,330 × 3,380 × 3,300 mm", "Working volume 2.5 × 1.0 × 1.5 m · LUF 200 MHz\n1 × Z-Fold stirrer (vertical oriented)\nComponents for military or automotive"],
            ["RVC M", "7,580 × 5,630 × 4,200 mm", "Working volume 3.3 × 3.5 × 2.6 m · LUF 200 MHz\n1 × Z-Fold stirrer (vertical oriented)\nLarge components for military or automotive"],
            ["RVC L", "13,880 × 11,480 × 6,300 mm (custom)", "Working volume 8.0 × 5.0 × 3.0 m · LUF 80 MHz\n2 × Z-Fold stirrer (vertical and horizontal oriented)\nVehicles"],
            ["RVC XL", "15,530 × 11,480 × 6,600 mm (custom)", "Working volume 8.0 × 5.0 × 3.0 m · LUF 80 MHz\n1 × Large-disc stirrer ø9.0 m, 2 × disc stirrer ø4.0 m\nVehicles"],
            ["RVC XXL", "17,480 × 13,580 × 6,600 mm (custom)", "Working volume 8.0 × 5.0 × 3.0 m · LUF 80 MHz\n1 × Large-disc stirrer ø12.0 m, 2 × disc stirrer ø4.0 m\nLarge vehicles"],
          ] },
        /* The catalogue's own block, with two columns the catalogue does not
           print: the turbo disc, which the head office's web page carries
           ("up to 260 RPM") and the stirrer sheet sizes, and a column saying
           which chamber each design actually runs in — the question a reader
           on this page is holding while they read the two tables above.
           Everything past that (the package per chamber, the accuracies, the
           three operating modes, the safety system) is the stirrers page,
           which the link under the table opens. */
        { title: "Frankonia stirrers",
          note: "Frankonia offers various stirrer designs and concepts, and also adapts a customer's own design for a new RVC or a converted chamber. Every stirrer holds 0.1° angle accuracy and runs in three modes — two tuned, one stirred.",
          head: ["Type", "Rotation", "Example size", "Where it runs"],
          rows: [
            ["Regular Z-Fold", "up to 30 RPM", "ø1.88 m", "RVC S · M · e1\nvertical"],
            ["Performance Z-Fold", "up to 60 RPM", "ø2.8 m", "RVC e2 · L\nvertical and horizontal, two per chamber"],
            /* A range rather than a single figure, and it starts at 9.0 so
               that this row agrees with the model table directly above it —
               the catalogue prints ø9.0 m for the RVC XL and the head office's
               stirrer sheet ø10.0 m for the same chamber. The per-chamber
               table on the stirrers page follows the sheet, so the two pages
               still differ by a metre on that one model. It is on the list to
               put to the head office (docs/source/chambers-stirrers.md §7). */
            ["Large-disc", "up to 10 RPM", "ø9.0 – 12.0 m", "RVC XL · XXL\nunder the ceiling, and what sets the LUF"],
            ["Disc-style, turbo", "up to 120 RPM", "ø4.0 – 5.0 m", "RVC XL · XXL\ntwo of them, beneath the large disc"],
            ["Turbo disc, small", "up to 260 RPM", "ø2.0 m", "Fast stirring to ISO 11451-5"],
            ["Tube-style, T-shape", "up to 240 RPM", "ø2.0 m", "Fast stirring to ISO 11451-5"],
          ],
          link: { label: "Stirrer systems in detail", path: topicPath("stirrers") } },
      ],
      groups: [
        { title: "Features and compliance", items: [
          "Immunity compliance according to IEC/EN 61000-4-21 and ISO 11452-11",
          "Immunity and emission compliance according to ISO 11451-5 (fast stirring)",
          "Full safety integration per Machinery Directive 2006/42/EC",
          "Prefabricated high-quality shielding panels above 8 MS/m",
          "Panels installed reverse for a flat surface inside, or as regular PAN shielding mounted from within, which allows future upgrades such as an absorber lining",
          "Retrofit of an RVC with Frankosorb® hybrid absorbers, or conversion of an old EMC chamber into an RVC",
          "A cost-effective and high-performance solution from small products up to vehicles",
        ] },
      ],
    },
    "shielded-room": {
      lead: [
        "The shielded room is where the whole range starts. Prefabricated PAN type modules of 2.0 mm galvanised steel are bolted from the inside every 75 mm onto a high-conductivity mesh gasket that seals the joints; the short screwing distance and a precise, predefined tightening torque are what make the shielding attenuation last.",
        "The modules pass through a standard building door, so any size of shielding is possible and the installation can run close to the walls of the parent building. Nothing is glued and nothing is welded, which means the room can be dismantled without damage, modified, maintained, or transferred somewhere else entirely.",
        "The same panels are the substrate for Frankosorb® absorbers. That is how a shielded room becomes an anechoic chamber later — and why every chamber on the rest of these pages is built on this one.",
      ],
      figure: {
        src: "/chambers/images/type-shielded-room-pan.webp", w: 1122, h: 591,
        alt: "A row of shielded rooms inside a factory hall, seen from outside: grey panel walls held by red steel columns, white electrical distribution units and RF doors along the front, and a plain concrete floor in front of them.",
        caption: "Seen from the hall: bolted panels, a steel structure sized to the local seismic condition, and the electrical distribution reachable from outside the room.",
      },
      tables: [
        { title: "Guaranteed performance",
          note: "Frequency range according to EN 50147-1, or IEEE-299 as an option, from 10 kHz up to 18 GHz or 40 GHz. The same performance applies to every feed-through component, honeycomb, door, gate and filter.",
          head: ["Frequency", "Attenuation", "Field"],
          rows: [
            ["10 kHz", "90 dB", "Magnetic Field"],
            ["100 kHz", "100 dB", "Magnetic Field"],
            ["1 MHz", "110 dB", "Magnetic Field"],
            ["100 MHz", "120 dB", "Plane Wave"],
            ["400 MHz", "120 dB", "Plane Wave"],
            ["1 GHz", "110 dB", "Plane Wave"],
            ["18 GHz", "100 dB", "Microwave"],
            ["40 GHz", "100 dB", "Microwave"],
          ] },
      ],
      groups: [
        { title: "Construction", items: [
          "PAN type shielding modules made of 2.0 mm thick galvanized steel",
          "Modular and prefabricated standard",
          "Self-supporting stability, or a static steel structure for any seismic condition",
          "Mounted from the inside; reverse installation possible for a flat surface inside",
          "Interior finishing of walls and ceiling possible",
          "Raised floor systems, or welded floor systems",
          "Acoustic panels with absorption per ISO 354, w = 0.65 (MH)",
        ] },
        { title: "In service", items: [
          "Long life shielding attenuation characteristics",
          "Equal performance for any kind of feed-through component, honeycomb, door, gate or filter",
          "Perfectly adapted for Frankosorb® absorbers",
          "Any size of shielding is possible",
          "No glue, no welding — dismountable without any damage, with easy modification and maintenance",
          "A complete transfer or a future modification stays possible",
          "Turnkey solution",
        ] },
      ],
    },
  },
  zh: {
    sac: {
      lead: [
        "半电波暗室的顶部有吸波材料，底部有反射器。地板是导电接地平面，是 CISPR 16-1-4 和 ANSI C63.4 规定的测试场地类型。 Frankonia 的半电波暗室就是这种结构，测量距离跨度为 3.0 m、5.0 m 和 10.0 m。",
        "两次外观实现相同距离。圆顶 SAC-3 Plus 和 SAC-5 Plus 具有屋顶形状，旨在通过 Frankosorb® 放置最大限度地减少反射，使 SAC-3 Plus 自推出以来成为同类产品中最受欢迎的暗室选择。方形形状保持了传统的外观，同时确保了高达 ø4.0 m 的静区域并可容纳更大的转盘或移动测功机。",
        "在10.0 m处，问题变为衬砌数量和测试轴。 SAC-10 Plus 是单轴的。 Triton 将 10.0 m 单轴和 3.0 m 双轴折叠成一个多边形外壳，使天线和地面吸波材料在轴之间连接 - 这就是测试准备时间显着缩短的原因。 SAC-10/H 是混合吸波材料配置，SAC-10/P 是具有 P2400 长金字塔前衬的经济高效替代品。",
      ],
      figure: {
        src: "/chambers/images/type-sac-dome.webp", w: 1600, h: 1095,
        alt: "圆顶半电波暗室内部。天花板形成一条延伸至拱门的暗带，周围环绕着金字塔吸波器。墙壁布满衬里，运载白色地板吸波材料的推车停在反光地板的两侧。",
        caption: "从内部看的圆顶屋顶——正是这个弯曲的表面允许放置吸波材料以最大限度地减少反射。地板吸波材料存放在壁推车上，以防同一暗室用于抗扰度测试。",
      },
      tables: [
        { title: "圆顶型 – SAC-3 Plus·SAC-5 Plus",
          note: "频率范围 9 kHz / 30 MHz ~ 18 GHz、40 GHz 可选。优化的 Frankosorb® 铁氧体和 H1000·H600 混合衬里。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-3 Plus S", "8,480 × 6,530 × 6,000 mm", "QZ ø1.2 m at 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus M", "8,780 × 6,530 × 6,000 mm", "QZ ø1.5 m at 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus L", "9,230 × 6,530 × 6,000 mm", "QZ ø2.0 m at 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus", "9,680 × 6,530 × 6,000 mm", "QZ ø2.0 m at 3.0 m test distance (H = 2.0 m)"],
            ["SAC-5 Plus", "12,680 × 7,730 × 6,300 mm", "QZ ø2.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Plus L", "12,680 × 8,180 × 6,300 mm", "QZ ø3.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)"],
          ] },
        { title: "方形 – SAC-3方形·SAC-5方形",
          note: "频率范围 9 kHz / 30 MHz ~ 18 GHz、40 GHz 可选。优化的 Frankosorb® 铁氧体和 H450 或 H600 混合衬里。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-3 Square", "9,680 × 6,530 × 6,000 mm", "QZ ø2.0 m at 3.0 m test distance (H = 2.5 m)"],
            ["SAC-3 Square L", "10,880 × 6,980 × 6,000 mm", "QZ ø3.0 m at 3.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Square", "12,680 × 7,730 × 6,000 mm", "QZ ø2.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Square L", "12,680 × 8,180 × 6,000 mm", "QZ ø3.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Square XL", "13,280 × 9,380 × 6,300 mm", "QZ ø4.0 m at 5.0 m test distance (H = 2.5 m)\nQZ ø3.0 m at 3.0 m test distance (H = 2.5 m)\nReady for a larger turntable or mobile dynamometer"],
          ] },
        { title: "10.0 m – 单轴和多轴",
          head: ["配置", "外形尺寸（长×宽×高）", "测试轴"],
          rows: [
            ["SAC-10 Plus", "19,205 × 12,080 × 8,325 mm", "QZ ø3.0 m，测试距离 10.0 m（H = 3.0 m）\n单轴——同一外壳内的节省成本配置"],
            ["SAC-10 Plus Triton", "19,205 × 12,080 × 8,325 mm", "QZ ø3.0 m with multiple test axes (H = 3.0 m)\n1 × 10.0 m test distance (axis 1 = EMI and EMS)\n1 × 3.0 m test distance (axis 2 = EMI and EMS)\n1 × 3.0 m test distance (axis 3 = EMS)"],
          ] },
        { title: "10.0 m – 适合静区的尺寸",
          note: "/H为Frankosorb®铁氧体与H1000·H600·H1300汽轮机混合衬里，/P为P2400长金字塔前衬。频率范围 9 kHz / 30 MHz 至 18 GHz，40 GHz 可选。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-10-3/H", "18,380 × 12,830 × 8,550 mm", "QZ ø3.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-4/H", "19,280 × 13,280 × 8,550 mm", "QZ ø4.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-5/H", "21,080 × 15,080 × 8,700 mm", "QZ ø5.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-6/H", "21,680 × 15,680 × 8,700 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-3/P", "21,680 × 13,730 × 8,550 mm", "QZ ø3.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-4/P", "21,680 × 13,730 × 8,550 mm", "QZ ø4.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-5/P", "23,480 × 16,580 × 9,000 mm", "QZ ø5.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-6/P", "24,980 × 17,180 × 9,000 mm", "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
          ] },
      ],
      groups: [
        { title: "性能与适用性", items: [
          "符合 CISPR 16-1-4·ANSI C63.4 的完整发射标准 (EMI)，ETSI 可升级 — NSA ±3.5 dB（30 MHz 至 1 GHz）、SVSWR +5.5 dB（1 至 18 GHz）、NSIL ±4.0 dB（9 kHz 至 30 MHz）",
          "符合 IEC/EN 61000-4-3 标准的完全标准抗扰度 (EMS) — FU 0/+6 dB，16 个测量点的 75%（3.0 m·5.0 m 系列为 30/80 MHz，10.0 m 系列为 26/80 MHz 至 18 GHz）",
          "符合所有 Triton CISPR 25 和 MIL-STD 461 标准",
          "符合SAC-10/H和SAC-10/P所有军用和汽车标准",
        ] },
        { title: "有什么不同？", items: [
          "圆顶型 — 全新设计的屋顶形状和优化的 Frankosorb® 放置可最大程度地减少反射，并在 NSA·SVSWR·FU 中提供出色的性能。自推出以来，它一直是同类产品中被选中最多的暗室",
          "方形 — 传统形状，静区从 ø2.0 m 到 ø4.0 m，大型转盘或移动测功机，以及存放在室内手推车上的用于抗扰度的地板吸波材料",
          "Triton — 多边形壳内的三个独立轴。天线和底部吸波器保持连接，引导底部吸波器放置可显着减少设置时间，同时保持可重复性。它是现有最小、最轻的 10.0 m 暗室。",
          "SAC-10/H — 可根据被测设备要求调整尺寸、特性和配置，并选择单或双测试轴。专门从事正常范围之外的测试环境",
          "SAC-10/P — 长金字塔前衬可无限制地取代混合吸波材料。将地板吸波材料存放在金字塔下方的空间中。",
          "所有SAC系列均可扩展到E-Drive（装载机、BlueBox、电池测试系统），也可用于汽车和军用标准测试",
        ] },
      ],
    },
    fac: {
      lead: [
        "完全电波暗室的底部还设有吸波器。由于没有接地平面，也没有要添加的反射波，因此测量是在自由空间条件下进行的 - CISPR 16-1-4 定义为无地面测试场地的条件。",
        "FAC-3 是一种紧凑的配置，适用于桌面被测设备，并在 1.5 m 的高度确保 ø1.5 m 的静区。 FAC-3 L 对此进行了扩展，包括落地式产品，并使用 FAM 或 FBM 天线杆添加高度扫描。",
        "变压器是一个兼具两者功能的室。优化的地板吸声改装套件作为带有接地层的半电波暗室运行，可将其转变为桌面被测设备的完全电波暗室测试场地 - 两种配置都有自己的静区域和适用性值。",
      ],
      figure: {
        src: "/chambers/images/type-fac-freespace.webp", w: 1600, h: 1095,
        alt: "完全电波暗室内。墙壁、天花板，甚至地板上都覆盖着白色的金字塔吸波体，上方的通道中放置着一个木制的测试台，一根红色的喇叭天线从左侧朝内。",
        caption: "它一直吸收到脚部。由于没有地平面，因此没有附加的反射波——这就是自由空间条件的实际含义。",
      },
      tables: [
        { title: "配置",
          note: "频率范围 9 kHz / 30 MHz ~ 18 GHz、40 GHz 可选。优化的 Frankosorb® 铁氧体和 H1000·H600 混合衬里。",
          head: ["配置", "外形尺寸（长×宽×高）", "静区及合格产品"],
          rows: [
            ["FAC-3", "8,705 × 4,655 × 3,750 mm", "QZ ø1.5 m at 3.0 m test distance (H = 1.5 m)\nTable-top products"],
            ["FAC-3 L", "9,380 × 5,780 × 6,000 mm", "QZ ø1.5 m at 3.0 m test distance (H = 2.0 m)\nFloor-standing and table-top products, with height scan"],
            ["SAC-3 / FAC-3 Transformer", "9,680 × 6,530 × 6,000 mm", "SAC setup: QZ ø2.0 m at 3.0 m test distance (H = 2.5 m)\nFAC setup: QZ ø1.5 m at 3.0 m test distance (H = 1.5 m)"],
          ] },
      ],
      groups: [
        { title: "性能与适用性", items: [
          "符合 CISPR 16-1-4 — FS NSA ±3.5 dB（30 MHz 至 1 GHz）的全频谱发射 (EMI)，SVSWR +5.5 dB（1 至 18 GHz）",
          "完全符合 IEC/EN 61000-4-3 标准抗扰度 (EMS) — FU 0/+6 dB，16 个测量点的 75%（30/80 MHz 至 18 GHz）",
          "符合 IEC/EN 61000-4-22 的所有抗扰度和发射标准 — 偏差 SdB 1.8 dB",
          "符合 CISPR 16-1-4、IEC/EN 61000-4-22 和 ETSI 的所有发射标准",
          "变压器 半电波暗室配置：NSA ±3.5 dB、SVSWR +5.5 dB、NSIL ±4.0 dB (9 kHz~30 MHz) · 全电波暗室配置：FS NSA ±3.5 dB、SVSWR +5.5 dB",
          "变压器符合包括CISPR 25和MIL-STD 461在内的所有标准",
        ] },
        { title: "特点", items: [
          "FAC-3 — 桌面被测设备的测试场地",
          "FAC-3 L — 桌面和落地式被测设备的测试场地，具有高度扫描",
          "经济高效的自由空间测量解决方案",
          "紧凑的设计，配有先进的 Frankosorb® 吸水衬里",
          "双测试轴选项",
          "变压器 — 优化的地板减震器改装套件，E-Drive 可扩展（装载机、BlueBox、电池测试系统）",
        ] },
      ],
    },
    chc: {
      lead: [
        "紧凑型混合室是该系列中最小的完整测试场地。长度为 7.4 m 的外壳内固定有 3.0 m 的测量距离和 ø1.2 m 的静区。发射预认证、符​​合所有抗扰度标准——这一组合可以处理开发部门的大部分工作，并且只需满足发射合规测试场地所需的一小部分空间即可实施。",
        "CHC Plus 是一种更高的配置，增加了适用于 1 GHz 至 18 GHz 的发射测量。两种型号的 L 版本均增加了内衬吸波器的隔墙，允许将射频功率放大器、天线和地面吸波材料存放在室内。",
        "MIL CHC 将同样的理念转移到国防工作中。 Frankosorb® 混合吸波器配置（30 MHz 至 40 GHz）在 1.0 m 距离内提供完全符合 MIL-STD 461 和 DO-160 的组件要求。",
      ],
      figure: {
        src: "/chambers/images/type-chc-panel.webp", w: 1122, h: 591,
        alt: "腔室边缘的特写照片。混合吸波材料与深色面板墙相接，中间有一个螺栓固定的面板和一个警告标签，侧面板上刻有 FRANKONIA 标记。",
        caption: "吸波材料后面的墙是室——螺栓板、穿孔板和从外部访问的电气设备。",
      },
      tables: [
        { title: "配置",
          note: "CHC系列9 kHz/30 MHz至18 GHz（40 GHz可选），MIL CHC 9 kHz/30 MHz至40 GHz混合线路。",
          head: ["配置", "外形尺寸（长×宽×高）", "静区及特点"],
          rows: [
            ["CHC", "7,355 × 3,755 × 3,300 mm", "QZ ø1.2 m at 3.0 m test distance"],
            ["CHC L", "8,255 × 3,755 × 3,300 mm", "QZ ø1.2 m 在 3.0 m 测试距离\n腔室内可存放放大器等"],
            ["CHC Plus", "7,355 × 3,755 × 3,300 mm", "QZ ø1.2 m 在 3.0 m 测试距离\n适合 1 GHz 以上的发射"],
            ["CHC Plus L", "7,580 × 4,655 × 4,350 mm", "QZ ø1.2 m 在 3.0 m 测试距离\nø2.0 m 转盘，适合 1 GHz 以上发射"],
            ["MIL CHC", "4,880 × 4,880 × 3,000 mm", "1.0m距离MIL-STD 461·DO-160组件测试"],
            ["MIL CHC / DO-160", "5,330 × 4,880 × 3,000 mm", "1.0m距离MIL-STD 461·DO-160组件测试"],
          ] },
      ],
      groups: [
        { title: "性能与适用性", items: [
          "根据 CISPR 16-1-4 — NSA ±4.0 dB 预先认证的辐射 (EMI)（30 MHz 至 1 GHz，高度扫描受限）",
          "符合 CISPR 16-1-4 标准的辐射 (EMI) — SVSWR +6.0 dB（1 至 18 GHz），CHC Plus 配置",
          "完全符合 IEC/EN 61000-4-3 标准抗扰度 (EMS) — FU 0/+6 dB，16 个测量点的 75%（30/80 MHz 至 18 GHz）",
          "MIL CHC — 符合 MIL-STD 461 和 DO-160 的所有组件发射和抗扰度标准",
        ] },
        { title: "吸波材料", items: [
          "优化的 Frankosorb® 铁氧体和 H450 或 H600 混合衬里",
          "高性能纳米薄膜技术，长期稳定性经过验证",
          "EN 13501-1 A2 级 - s1 d0 不燃",
          "或者 EN 13501-1 B 级阻燃剂",
        ] },
      ],
    },
    component: {
      lead: [
        "零件室测试零件，而不是产品。将被测设备以规定的距离放置在测试台上，将线束接地到屏蔽层，放置尺寸以毫米为单位。电气元件符合 CISPR 25 和 ISO 11452，国防工业符合 MIL-STD 461 和 DO-160，抗扰度符合 IEC/EN 61000-4-3。",
        "ACTC 是一个 1.0 m 距离、完全符合 CISPR 25 标准的暗室，在吸波材料之间永久安装了插入式接触条，以维持测试台和屏蔽之间的电气连接。 UCC 在紧凑型腔室中以预认证级别执行相同的测试，这是 GTEM 单元的替代品，适用于广泛的研究和学术应用。 CTC是一款全标准抗扰度室，可在一个暗室内测试工业产品、电子元件和军用品。",
        "EDTC 系列将相同的原理扩展到运行动力系统，并围绕固定轴外部负载或移动 EMC-BlueBox 构建。",
      ],
      figure: {
        src: "/chambers/images/type-component-cispr25.webp", w: 1600, h: 988,
        alt: "部分测试安排。将带有接地平面的木制测试台放置在由吸波器包围的室内，左侧的红色天线转向架面向测试台。后壁是铁氧体和金字塔的混合衬里。",
        caption: "CISPR 25 规定的布置 — 接地木制测试台，固定 1.0 m 距离，沿测试台边缘布设线束。",
      },
      tables: [
        { title: "配置",
          note: "频率范围 — ACTC·UCC 150 kHz / 26 MHz 至 18 GHz（40 GHz 选项），CTC 9 kHz / 30 MHz 至 18 GHz（40 GHz 选项）。 EDTC 系列由中心负载规范定义。",
          head: ["配置", "外形尺寸（长×宽×高）", "测试条件"],
          rows: [
            ["ACTC", "6,380 × 5,480 × 3,750 mm", "CISPR 25 component level at 1.0 m test distance"],
            ["ACTC L", "11,480 × 6,580 × 4,500 mm", "CISPR 25 component level and vehicle at 1.0 m test distance"],
            ["UCC", "4,580 × 3,080 × 2,550 mm", "Pre-compliant component level at 1.0 m test distance"],
            ["CTC", "8,480 × 5,485 × 3,750 mm", "Full compliant immunity testing per IEC 61000-4-3\nFull compliant to CISPR 25 and ISO 11452, MIL-STD 461 and DO-160"],
            ["EDTC-SA", "7,880 × 5,480 × 3,750 mm", "1固定轴外部负载"],
            ["EDTC-AX", "9,080 × 6,080 × 3,750 mm", "2个固定轴外部负载，用于电驱桥测试"],
            ["EDTC-BB", "7,880 × 6,380 × 3,750 mm", "移动负载 EMC-BlueBox，高达 120 kW"],
          ] },
      ],
      groups: [
        { title: "性能与适用性", items: [
          "ACTC — 完全符合 CISPR 25 发射、完全符合 ISO 11452 抗扰度、IEC/EN 61000-4-3 合规抗扰度。均匀电场 1.0 m 处 0.5 × 0.5 m，FU 0/+6 dB 100 % (26/80 MHz~18 GHz)",
          "ACTC L — 符合所有 CISPR 25 标准，并且不受所有 ISO 11452·IEC/EN 61000-4-3 标准的影响。均匀电场 3.0 m 处 1.5 × 1.5 m，FU 0/+6 dB 16 个测量点的 75%",
          "UCC — CISPR 25 预认证发布、ISO 11452 预认证豁免",
          "CTC — 不受所有 IEC 61000-4-3 标准的影响，符合所有标准 CISPR 25·ISO 11452·MIL-STD 461·DO-160",
          "EDTC — 完全符合 CISPR 25 和 ISO 11452",
        ] },
        { title: "组件", items: [
          "CISPR 25 要求的永久安装在吸波材料和测试台之间的插入式接触片",
          "优化的 Frankosorb® 铁氧体和 H450 混合吸波材料衬里",
          "E-Drive可扩展——负载、EMC-BlueBox、电池测试系统",
          "EDTC — 电机适配器、接地和接线符合 CISPR 25、无振动浮动板基础",
          "EDTC-BB — 4象限操作，转盘上360°观察测试物",
        ] },
      ],
    },
    rvc: {
      lead: [
        "混响室不吸收电磁波。墙壁反射，搅拌器不断改变边界条件，使内部电场在整个旋转过程中统计上均匀。在抗扰度测试中，这意味着高场强和适度的放大器输出，并且不会因天线对准而发生冲突。",
        "Frankonia 在与电波暗室相同的模块化结构系统之上建造混响室。预制的高质量屏蔽板的额定强度超过 8 MS/m，保证了性能，并且可以通过平坦内表面反向安装，也可以作为从内部配合的常规 PAN 屏蔽安装，后者为以后添加吸波材料衬里留出空间。现有的 EMC 暗室可改造成混响室，而 Frankosorb® 混合吸波器可改装成混响室。",
        "关键装置是搅拌器。 Frankonia 设计了自己的 Z 形折叠、圆盘、管和大圆盘方法，并将客户的搅拌器设计应用到新的或改进的室中。",
      ],
      figure: {
        src: "/chambers/images/type-rvc-stirrer.webp", w: 1122, h: 591,
        alt: "混响室内。四面都有金属屏蔽板，天花板下方旋转的大圆盘搅拌器因曝光时间而变得模糊。转盘上停着一辆蓝色的汽车，旁边立着一个白色的反光镜。",
        caption: "任何地方都没有吸波材料——旋转过程中捕获的天花板搅拌器是一个均衡电场的装置。",
      },
      tables: [
        { title: "商业/工业RVC",
          head: ["型号", "外形尺寸（长×宽×高）", "工作体积、LUF、搅拌器"],
          rows: [
            ["RVC e1", "7,580 × 5,630 × 4,200 mm", "工作体积 3.3 × 3.5 × 2.6 m · LUF 200 MHz\n1 × Z 型折叠搅拌器（垂直方向）\n中小型ISM/多媒体产品"],
            ["RVC e2", "11,280 × 7,280 × 4,950 mm", "工作体积 5.5 × 4.0 × 2.6 m · LUF 80 MHz\n2 × Z 型折叠搅拌器（垂直和水平方向）\n大型 ISM/多媒体产品"],
          ] },
        { title: "车辆及军用RVC",
          head: ["型号", "外形尺寸（长×宽×高）", "工作体积、LUF、搅拌器"],
          rows: [
            ["RVC S", "5,330 × 3,380 × 3,300 mm", "工作体积 2.5 × 1.0 × 1.5 m · LUF 200 MHz\n1 × Z 型折叠搅拌器（垂直方向）\n军工及汽车零部件"],
            ["RVC M", "7,580 × 5,630 × 4,200 mm", "工作体积 3.3 × 3.5 × 2.6 m · LUF 200 MHz\n1 × Z 型折叠搅拌器（垂直方向）\n大型军工、汽车零部件"],
            ["RVC L", "13,880 × 11,480 × 6,300 mm (custom)", "工作体积 8.0 × 5.0 × 3.0 m · LUF 80 MHz\n2 × Z 型折叠搅拌器（垂直和水平方向）\n车辆"],
            ["RVC XL", "15,530 × 11,480 × 6,600 mm (custom)", "工作体积 8.0 × 5.0 × 3.0 m · LUF 80 MHz\n1 × 大圆盘搅拌器 ø9.0 m，2 × 圆盘搅拌器 ø4.0 m\n车辆"],
            ["RVC XXL", "17,480 × 13,580 × 6,600 mm (custom)", "工作体积 8.0 × 5.0 × 3.0 m · LUF 80 MHz\n1 × 大圆盘搅拌器 ø12.0 m，2 × 圆盘搅拌器 ø4.0 m\n大型车辆"],
          ] },
        { title: "Frankonia搅拌器",
          note: "Frankonia 提供多种搅拌器设计和概念，还可以实施客户自己的新 RVC 或改造室设计。所有搅拌器均保持 0.1° 的角度精度，并以 2 种调谐和 1 种搅拌操作模式运行。",
          head: ["格式", "转速", "尺寸示例", "从哪里进入？"],
          rows: [
            ["Regular Z-Fold", "高达 30 转/分", "ø1.88 m", "RVC S·M·e1\n垂直"],
            ["Performance Z-Fold", "高达 60 转/分钟", "ø2.8 m", "RVC e2·L\n2 个垂直/水平单元"],
            ["Large-disc", "最大 10 转/分", "ø9.0 – 12.0 m", "RVC XL·XXL\n在天花板上旋转以确定 LUF"],
            ["Disc-style, turbo", "高达 120 转/分", "ø4.0 – 5.0 m", "RVC XL·XXL\n大磁盘下2个"],
            ["Turbo disc, small", "高达 260 转/分钟", "ø2.0 m", "高速搅拌ISO 11451-5"],
            ["Tube-style, T-shape", "高达 240 转/分", "ø2.0 m", "高速搅拌ISO 11451-5"],
          ],
          link: { label: "了解更多搅拌系统", path: topicPath("stirrers") } },
      ],
      groups: [
        { title: "特性及适用性", items: [
          "抗扰度合规性符合 IEC/EN 61000-4-21·ISO 11452-11",
          "抗扰度和辐射符合 ISO 11451-5（高速标准）",
          "符合机械指令 2006/42/EC 的安全集成",
          "大于8MS/m的预制高质量屏蔽板",
          "反向安装，使内表面平坦，或者使用从内部拧紧的常规 PAN 屏蔽进行安装 - 后者留下吸波材料衬里等以供以后升级",
          "在混响室中安装 Frankosorb® 混合吸波器，或对现有 EMC 室的混响室进行改造",
          "从小产品到车辆的高性价比、高性能解决方案",
        ] },
      ],
    },
    "shielded-room": {
      lead: [
        "盾室是整个阵容的起点。预制 PAN 型 2.0 毫米镀锌钢模块从内部以 75 毫米的间隔固定在密封接头的高电导率网垫片上。较短的紧固间隔和根据指定扭矩的精确紧固——这就是护罩阻尼性能能够长期保持的原因。",
        "模块穿过常规建筑物门，因此可以实现任何尺寸的屏蔽，并且可以靠近现有建筑物的墙壁安装。由于它既不是胶合的，也不是焊接的，所以可以在不损坏的情况下拆卸、改造、维护和移动到另一个地方。",
        "相同的面板作为 Frankosorb® 吸波材料的基础。这就是屏​​蔽室后来成为电波暗室的原因，也是为什么这些页面上的所有暗室都建立在它们之上的原因。",
      ],
      figure: {
        src: "/chambers/images/type-shielded-room-pan.webp", w: 1122, h: 591,
        alt: "厂房内从外面看到的几个屏蔽室。灰色的板墙由红色钢柱支撑，白色的交换机和射频门排列在前面，前面是混凝土地板。",
        caption: "从大厅看去——螺栓连接板、根据当地地震条件定制的钢结构，以及从暗室外部接入的配电设备。",
      },
      tables: [
        { title: "保证屏蔽性能",
          note: "10 kHz 至 18 GHz 或 40 GHz，基于 EN 50147-1 或可选的 IEEE-299。相同的性能适用于所有部件，包括穿透元件、蜂窝、门、大门和过滤器。",
          head: ["频率", "衰减量", "电子系统"],
          rows: [
            ["10 kHz", "90 dB", "Magnetic Field"],
            ["100 kHz", "100 dB", "Magnetic Field"],
            ["1 MHz", "110 dB", "Magnetic Field"],
            ["100 MHz", "120 dB", "Plane Wave"],
            ["400 MHz", "120 dB", "Plane Wave"],
            ["1 GHz", "110 dB", "Plane Wave"],
            ["18 GHz", "100 dB", "Microwave"],
            ["40 GHz", "100 dB", "Microwave"],
          ] },
      ],
      groups: [
        { title: "结构", items: [
          "2.0mm厚镀锌钢板PAN型屏蔽模块",
          "模块化预制标准",
          "自承式结构，即能应对任何地震条件的静力钢结构",
          "从内侧紧固，也可反向安装，使内表面平整。",
          "可用于墙壁和天花板的室内装饰",
          "凸底系统或焊接底部系统",
          "吸音性能符合ISO 354，w = 0.65 (MH)",
        ] },
        { title: "操作", items: [
          "持久的屏蔽衰减特性",
          "所有部件性能相同，包括穿透元件、蜂窝、门、大门、过滤器等。",
          "Frankosorb®吸波器结构优化",
          "可实现任意尺寸的屏蔽",
          "无需打胶、无需焊接——拆装无损，易于改装和维护",
          "可以随时进行完整的先前或后续修改",
          "交钥匙解决方案",
        ] },
      ],
    },
  },
};

/**
 * The model pages, keyed by `ChamberModel.slug`.
 *
 * Source of record is the 2026 catalogue spread for the model, supplemented by
 * the head office's own model page for what the catalogue does not print —
 * the Overview strip, the standards lists and the load capacity. Where the two
 * disagree the catalogue wins; every such case is listed in
 * docs/source/chambers-models.md §3.
 *
 * `Partial`, and read the same way every other body table on this site is: a
 * page with an entry drops the "documents on request" band, a page without one
 * keeps it. The catalogue arrives a spread at a time and nothing pretends
 * otherwise.
 *
 * Model names, dimensions, frequencies, standard numbers, absorber
 * designations (F006, H450, H600, H1000, H1300 Turbine, P2400) and the
 * guaranteed deviations are never translated — they are what a reader matches
 * against a drawing and a quotation.
 */
/** The four bullet lines every hybrid-lined chamber repeats, with only the
 *  ferrite combination changing. Written once and taken by that combination —
 *  twenty-six pages should not carry twenty-six copies of the same sentence. */
const absorbersEn = (lining: string) => [
  `Optimized Frankosorb® hybrid absorber lining with ${lining}`,
  "High-performance nano thin-film technology with proven long-term stability",
  "Non-combustible acc. to EN 13501-1 class A2 - s1 d0",
  "Hardly inflammable acc. to EN 13501-1 class B (alternative)",
];
const absorbersKo = (lining: string) => [
  `${lining} 优化的 Frankosorb® 混合吸收衬里的组合`,
  "高性能纳米薄膜技术，长期稳定性经过验证",
  "EN 13501-1 A2 级 - s1 d0 不易燃等级",
  "EN 13501-1 B级阻燃等级（替代规格）",
];

/** The full-compliance SAC performance block. `fu` is the only figure that
 *  moves between models — 30/80 MHz on most, 26/80 MHz on the 10.0 m chambers and
 *  the vehicle and military ranges. */
const sacPerformanceEn = (fu: "26" | "30" = "30") => [
  "Full compliant emission (EMI) according to CISPR 16-1-4 and ANSI C63.4",
  "Deviation NSA ±3.5 dB (30 MHz to 1 GHz)",
  "Deviation SVSWR +5.5 dB (1 GHz to 18 GHz)",
  "Deviation NSIL ±4.0 dB (9 kHz to 30 MHz)",
  "Full compliant immunity (EMS) according to IEC/EN 61000-4-3",
  `Deviation FU 0/+6 dB at 75 % of 16 measuring points (${fu}/80 MHz to 18 GHz)`,
];
const sacPerformanceKo = (fu: "26" | "30" = "30") => [
  "CISPR 16-1-4·ANSI C63.4标准发射（EMI）官方认证",
  "NSA 偏差 ±3.5 dB (30 MHz ~ 1 GHz)",
  "SVSWR 偏差 +5.5 dB（1 GHz 至 18 GHz）",
  "NSIL 偏差 ±4.0 dB (9 kHz ~ 30 MHz)",
  "IEC/EN 61000-4-3标准抗扰度（EMS）官方认证",
  `FU 偏差 0/+6 dB，16 个测量点的 75%（${fu}/80 MHz ~ 18 GHz)`,
];

/** Titles the group bands take, in the source's own words. */
const G = {
  en: { features: "Features", absorbers: "Absorbers", performance: "Performance & Compliance" },
  zh: { features: "特点", absorbers: "吸波材料", performance: "性能与认证" },
} as const;

/** The two standards blocks the head office prints, and their column heads. */
const S = {
  en: { product: "Typical Product Standards", verification: "Typical Verification Standards", emission: "Emission", immunity: "Immunity" },
  zh: { product: "代表性适用标准", verification: "验证标准", emission: "发射（EMI）", immunity: "电阻（EMS）" },
} as const;

/**
 * The two standards blocks a model page carries.
 *
 * The verification pair defaults to the one the whole semi-anechoic range
 * shares — a chamber validated as a CISPR 16-1-4 / ANSI C63.4 test site, with
 * immunity to IEC/EN 61000-4-3. The fully anechoic and compact chambers verify
 * differently and pass their own.
 */
const standardsPair = (
  lang: Lang,
  emission: readonly string[],
  immunity: readonly string[],
  verification: { e: readonly string[]; i: readonly string[] } = {
    e: ["CISPR 16-1-4", "and/or ANSI C63.4"],
    i: ["IEC/EN 61000-4-3"],
  },
) => [
  {
    title: S[lang].product,
    columns: [
      { head: S[lang].emission, items: emission },
      { head: S[lang].immunity, items: immunity },
    ],
  },
  {
    title: S[lang].verification,
    columns: [
      { head: S[lang].emission, items: verification.e },
      { head: S[lang].immunity, items: verification.i },
    ],
  },
];

const sacProductEmission = ["CISPR 11", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461"];
const sacProductImmunity = ["IEC/EN 61000-4-3", "ISO 11452", "MIL-STD 461"];

export const modelBody: Record<Lang, Partial<Record<string, ModelBody>>> = {
  zh: {
    "sac-3-plus": {
      lead: [
        "SAC-3 Plus 是 Frankonia 最通用且经过全面认证的 EMC 测试解决方案，可在 3.0 m 的测量距离下提供最大 ø2.0 m 的静区。发射和抗扰度均按正式认证级别进行。",
        "这种独特的屋顶形状（称为圆顶设计）与优化的 Frankosorb® 吸波材料放置相结合，可最大限度地减少反射并在 NSA·SVSWR·FU 中实现卓越的性能。",
      ],
      close:
        "自推出以来，SAC-3 Plus 一直是同类产品中最受欢迎的暗室。独特的结构、定制和卓越的性能带来高效、经济的解决方案。",
      figure: {
        src: "/chambers/models/sac-3-plus-1.webp", w: 1600, h: 1067,
        alt: "穹顶内部设计了半电波暗室。左右墙壁上覆盖着白色金字塔吸波体，天花板上覆盖着拱形图案的黑色铁氧体表面，并打开了两盏灯。地板为灰色漆面，测试区域周围有黄色标记。",
        caption: "圆顶屋顶不是外观的选择。弧形天花板支持吸波材料布置，可减少进入静区的反射。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m" },
        { label: "Quiet Zone", value: "最大ø2.0 m" },
        { label: "频率范围", value: "30 MHz – 18 GHz" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围 9 kHz / 30 MHz 至 18 GHz，40 GHz 可选。 Frankosorb® 混合衬里由铁氧体、H1000 和 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-3 Plus S", "8,480 × 6,530 × 6,000 mm", "ø1.2 m\n3.0 m 测量距离（H = 2.0 m）"],
            ["SAC-3 Plus M", "8,780 × 6,530 × 6,000 mm", "ø1.5 m\n3.0 m 测量距离（H = 2.0 m）"],
            ["SAC-3 Plus L", "9,230 × 6,530 × 6,000 mm", "ø2.0米\n3.0 m 测量距离（H = 2.0 m）"],
            ["SAC-3 Plus", "9,680 × 6,530 × 6,000 mm", "ø2.0米\n3.0 m 测量距离（H = 2.0 m）"],
          ],
        },
      ],
      standards: standardsPair("zh", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.zh.features, items: [
          "经济高效的高性能解决方案，用于测量 3.0 m 的距离和 ø1.2 m 至 ø2.0 m 的静区域。",
          "CISPR 16-1-4·ANSI C63.4标准发射认证（ETSI可扩展）",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "轻质钢结构和优化的射频屏蔽",
          "独特的圆顶形屋顶设计",
          "E-Drive可扩展（装载机、BlueBox、电池测试系统）",
          "长寿命 Frankosorb® 混合吸波材料实现卓越性能",
          "还可用于汽车和军工标准测试",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H1000 · H600") },
        { title: G.zh.performance, items: sacPerformanceKo() },
      ],
    },

    "sac-5-plus": {
      lead: [
        "SAC-5 Plus 是 Frankonia 完全认证的 EMC 测试解决方案，可在 3.0 m 和 5.0 m 的测量距离下提供高达 ø3.0 m 的静区。",
        "圆顶形屋顶、定制制造和性能相结合，创造出高效且经济的解决方案。",
      ],
      close:
        "继SAC-3 Plus的成功之后，测试距离为5.0 m的SAC-5 Plus也采用了相同的球顶设计理念。",
      figure: {
        src: "/chambers/models/sac-5-plus-1.webp", w: 1600, h: 1067,
        alt: "圆顶设计半电波暗室内立面。前墙和天花板覆盖着白色金字塔吸波体，黑色铁氧体拱形贯穿天花板中央。左右楼层各有一辆装载着白色地板吸震器的手推车，地板中央可见转盘圆圈和红色激光线。",
        caption: "地板吸音器正在墙壁推车上等待——在同一个暗室进行抗扰度测试时铺设。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m · 5.0 m" },
        { label: "Quiet Zone", value: "ø2.0 m 或 ø3.0 m" },
        { label: "频率范围", value: "30 MHz – 18 GHz" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围 9 kHz / 30 MHz 至 18 GHz，40 GHz 可选。 Frankosorb® 混合衬里由铁氧体、H1000 和 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-5 Plus", "12,680 × 7,730 × 6,300 mm", "ø2.0米\n3.0 m · 5.0 m 测量距离（H = 2.5 m）"],
            ["SAC-5 Plus L", "12,680 × 8,180 × 6,300 mm", "ø3.0 m\n3.0 m · 5.0 m 测量距离（H = 2.5 m）"],
          ],
        },
      ],
      standards: standardsPair("zh", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.zh.features, items: [
          "高效、高性能的解决方案，用于测量 3.0 m·5.0 m 距离和 ø2.0 m 至 ø3.0 m 静区",
          "CISPR 16-1-4·ANSI C63.4标准发射认证（ETSI可扩展）",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "轻质钢结构和优化的射频屏蔽",
          "独特的圆顶形屋顶设计",
          "E-Drive可扩展（装载机、BlueBox、电池测试系统）",
          "长寿命 Frankosorb® 吸波器实现卓越性能",
          "还可用于汽车和军工标准测试",
          "交钥匙解决方案",
          "双测试轴选项",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H1000 · H600") },
        { title: G.zh.performance, items: sacPerformanceKo() },
      ],
    },

    "sac-3-square": {
      lead: [
        "SAC-3 Square 是 Frankonia 的通用且经过全面认证的 EMC 测试解决方案，可测量 3.0 m 的距离。",
        "方形设计的SAC-3和SAC-5提供了一种高效且经济的解决方案，其结构涵盖可用性、定制性和性能。",
      ],
      figure: {
        src: "/chambers/models/sac-3-square-1.webp", w: 1600, h: 1067,
        alt: "方形半电波暗室内。墙壁和天花板上覆盖着白色的金字塔吸音器，一排地板吸音器遍布地板的正面。左墙前矗立着一座白色的建筑，地面上有一个黄色的安全标志。",
        caption: "传统方壳。平屋顶为大型转盘或便携式测功机提供了空间。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m" },
        { label: "Quiet Zone", value: "最大ø3.0 m" },
        { label: "频率范围", value: "30 MHz – 18 GHz" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/30MHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体·H450 或 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-3 Square", "9,680 × 6,530 × 6,000 mm", "ø2.0米\n3.0 m 测量距离（H = 2.5 m）"],
            ["SAC-3 Square L", "10,880 × 6,980 × 6,000 mm", "ø3.0m\n3.0 m 测量距离（H = 2.5 m）"],
          ],
        },
      ],
      standards: standardsPair("zh", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.zh.features, items: [
          "传统方形设计",
          "用于测量 3.0 m 或 5.0 m 距离的高性能解决方案",
          "ø2.0 m ~ ø4.0 m Quiet Zone",
          "集成大型转盘或移动测功机",
          "CISPR 16-1-4·ANSI C63.4标准发射认证（ETSI可扩展）",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "将用于抗扰度测试的底部吸波材料存放在室内的手推车上。",
          "E-Drive可扩展（装载机、BlueBox、电池测试系统）",
          "长寿命 Frankosorb® 吸波器实现卓越性能",
          "还可用于汽车和军工标准测试",
          "交钥匙解决方案",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: sacPerformanceKo() },
      ],
    },

    "sac-5-square": {
      lead: [
        "SAC-5 Square 是经过全面认证的 EMC 测试解决方案，可提供 3.0 m 和 5.0 m 测量距离。共有三个静区：ø2.0 m、ø3.0 m 和 ø4.0 m。",
        "方形设计的SAC-3和SAC-5提供了一种高效且经济的解决方案，其结构涵盖可用性、定制性和性能。",
      ],
      figure: {
        src: "/chambers/models/sac-5-square-1.webp", w: 1600, h: 1067,
        alt: "方形半电波暗室内。墙壁和天花板上覆盖着白色金字塔吸波器，右侧从地板到天花板竖立着一根白色天线杆。接地平面上有一个黄色标记和一条蓝色电缆。",
        caption: "天线杆，测量距离5.0m。同一个暗室也可以在3.0m的距离内使用。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m · 5.0 m" },
        { label: "Quiet Zone", value: "最大ø4.0 m" },
        { label: "频率范围", value: "30 MHz – 18 GHz" },
        { label: "负载", value: "10,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/30MHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体·H450 或 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-5 Square", "12,680 × 7,730 × 6,000 mm", "ø2.0米\n3.0 m · 5.0 m 测量距离（H = 2.5 m）"],
            ["SAC-5 Square L", "12,680 × 8,180 × 6,000 mm", "ø3.0 m\n3.0 m · 5.0 m 测量距离（H = 2.5 m）"],
            ["SAC-5 Square XL", "13,280 × 9,380 × 6,300 mm", "ø4.0 m（5.0 m测量距离）·ø3.0 m（3.0 m测量距离）\n两种情况下 H = 2.5 m 可容纳大型转盘或移动测功机"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461"],
      ),
      groups: [
        { title: G.zh.features, items: [
          "传统方形设计",
          "用于测量 3.0 m 或 5.0 m 距离的高性能解决方案",
          "ø2.0 m ~ ø4.0 m Quiet Zone",
          "集成大型转盘或移动测功机",
          "CISPR 16-1-4·ANSI C63.4标准发射认证（ETSI可扩展）",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "将用于抗扰度测试的底部吸波材料存放在室内的手推车上。",
          "E-Drive可扩展（装载机、BlueBox、电池测试系统）",
          "长寿命 Frankosorb® 吸波器实现卓越性能",
          "还可用于汽车和军工标准测试",
          "交钥匙解决方案",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: sacPerformanceKo() },
      ],
    },

    "sac-10-plus": {
      lead: [
        "SAC-10 Plus 是单轴测试室，可在 10.0 m 的测量距离处提供 ø3.0 m 的静区。独特的多边形形状和优化的 Frankosorb® 吸波材料布置节省了空间和成本。",
        "在满足CISPR 16-1-4和ANSI C63.4测试场地要求的暗室中，这是Frankonia制造的最紧凑的10.0 m暗室。",
      ],
      figure: {
        src: "/chambers/models/sac-10-plus-1.webp", w: 1600, h: 1067,
        alt: "10.0m半电波暗室内。墙壁和天花板上覆盖着白色的金字塔吸波器，中央矗立着一根带有红色外壳的白色天线杆。底部是灰色胎面。",
        caption: "测试轴只有一根。外壳没有变得更多，而是变得更小——这就是它与 Triton 的不同之处。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 · 5.0 · 10.0 m" },
        { label: "Quiet Zone", value: "ø3.0 m" },
        { label: "频率范围", value: "30 MHz – 18 GHz" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/30MHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体 H450 或 H600 组合而成。转盘 ø3.0 m 或 ø4.0 m。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-10 Plus", "19,205 × 12,080 × 8,325 mm", "ø3.0 m\n10.0 m 测量距离（H = 3.0 m）单测试轴"],
          ],
        },
      ],
      standards: standardsPair("zh", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.zh.features, items: [
          "10.0 m·5.0 m·3.0 m测试距离，静区ø3.0 m",
          "CISPR 16-1-4·ANSI C63.4标准发射官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "节省空间的多边形紧凑设计",
          "重现性好、性能稳定",
          "长寿命不燃Frankosorb®吸收衬里",
          "持久投资，省钱",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: sacPerformanceKo() },
      ],
    },

    "sac-10-plus-triton": {
      lead: [
        "SAC-10 Plus Triton 是一款多轴 EMC 测试解决方案，在一个外壳中包含一个 10.0 m 轴和两个 3.0 m 轴。静区为 ø3.0 m。",
        "独特的多边形几何形状和优化的 Frankosorb® 吸波材料布置建立了多个测试轴，同时节省了空间和成本。",
      ],
      close:
        "SAC-10 Plus Triton 是目前最紧凑、最轻的 10.0 m 暗室。根据 CISPR 16-1-4 · ANSI C63.4 的发射测试和根据 IEC/EN 61000-4-3 · CISPR 25 · MIL-STD 461 的抗扰度测试均在正式认证级别进行。",
      figure: {
        src: "/chambers/models/triton-2.webp", w: 1600, h: 1067,
        alt: "具有多边形外壳的 10.0 m 半电波暗室内部。墙壁是倾斜的，前面覆盖着金字塔形吸波材料。前面的地板上放置了几个白色的地板吸震器，地板中央有一个大转盘圆圈和黄色的安全标志。",
        caption: "地板吸波材料保持在指定的等待位置。该室在改变轴时无需重新安装天线和吸波器，从而节省了时间。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 · 5.0 · 10.0 m" },
        { label: "Quiet Zone", value: "ø3.0 m" },
        { label: "测试轴", value: "3" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/30MHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体 H450 或 H600 组合而成。转盘 ø3.0 m 或 ø4.0 m。",
          head: ["配置", "外形尺寸（长×宽×高）", "测试轴"],
          rows: [
            ["SAC-10 Plus Triton", "19,205 × 12,080 × 8,325 mm", "静区 ø3.0 m (H = 3.0 m)\n轴 1 — 10.0 m（EMI·EMS）\n轴 2 — 3.0 m (EMI/EMS)\n轴 3 — 3.0 m (EMS)"],
            ["SAC-10 Plus", "19,205 × 12,080 × 8,325 mm", "静区 ø3.0 m (H = 3.0 m)\n10.0 m 测量距离，单轴"],
          ],
        },
      ],
      standards: standardsPair("zh", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.zh.features, items: [
          "带静区的多轴室 ø3.0 m",
          "一个解决方案中的一根 10.0 m 轴和两根 3.0 m 轴",
          "CISPR 16-1-4·ANSI C63.4标准发射官方认证",
          "CISPR 25·MIL-STD 461官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "节省空间的多边形紧凑设计",
          "保持底部吸波器和天线在室内保持连接",
          "重现性好、性能稳定",
          "减少测试准备时间的工作流程",
          "长寿命不燃Frankosorb®吸收衬里",
          "持久投资，省钱",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: sacPerformanceKo() },
      ],
    },

    "sac-10-h-hybrid": {
      lead: [
        "SAC-10/H 是一款经过官方认证的定制暗室，可通过混合吸波材料布置在 10.0 m 的测量距离处实现 ø3.0 m 至 ø6.0 m 的静区。",
        "可以制造各种产品以满足客户需求，并允许调整尺寸和配置。 Frankosorb® 混合批次在发射测量和抗扰度测试中均表现良好。",
      ],
      figure: {
        src: "/chambers/models/sac-10-h-hybrid-1.webp", w: 1600, h: 1067,
        alt: "10.0 m 半电波暗室内。下墙是网格图案的铁氧体瓷砖，上面和天花板上是白色金字塔吸波器。地板为灰色胎面，测试区域周围有黄色标记。",
        caption: "混合衬里是指这两层——下面是铁氧体，上面是吸收体。随着层的分开，壳变得更小。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "长达 10.0 m" },
        { label: "Quiet Zone", value: "ø3.0 – ø6.0 m" },
        { label: "衬垫", value: "杂交种" },
        { label: "负载", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围 9 kHz / 30 MHz ~ 18 GHz，40 GHz 可选。 Frankosorb® 混合衬里与铁氧体·H1000·H600·H1300 涡轮机的组合。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-10-3/H", "18,380 × 12,830 × 8,550 mm", "ø3.0 m\n10.0 m 测量距离（H = 3.0 m）"],
            ["SAC-10-4/H", "19,280 × 13,280 × 8,550 mm", "ø4.0m\n10.0 m 测量距离（H = 3.0 m）"],
            ["SAC-10-5/H", "21,080 × 15,080 × 8,700 mm", "ø5.0m\n10.0 m 测量距离（H = 3.0 m）"],
            ["SAC-10-6/H", "21,680 × 15,680 × 8,700 mm", "ø6.0 m\n10.0 m 测量距离（H = 3.0 m）"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461 RS101 · RS102 · RS103"],
      ),
      groups: [
        { title: G.zh.features, items: [
          "长寿命、不易燃的 Frankosorb® 混合吸波材料的最佳衬里（Frankonia 技术）",
          "CISPR 16-1-4·ANSI C63.4标准发射官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "军用、汽车标准官方认证",
          "单或双测试轴选项——定制以适应任何 EMC 测试",
          "根据被测设备的要求广泛调整测试室的尺寸、特性和配置",
          "专门用于超出范围的 EMC 测试环境",
          "交钥匙解决方案",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H1000 · H600 · H1300 Turbine") },
        { title: G.zh.performance, items: sacPerformanceKo("26") },
      ],
    },

    "sac-10-p-pyramid": {
      lead: [
        "SAC-10/P 是一款定制的官方认证暗室，通过 Frankonia 独特的长金字塔吸波材料布置，在 10.0 m 的测量距离上实现了从 ø3.0 m 到 ø6.0 m 的静区。",
        "尺寸和配置可根据客户需求进行多种生产调整。",
      ],
      close:
        "长金字塔吸收体技术在发射和抗扰度测试中提供了出色的性能，在整个频率范围内提供了最高的均匀性和阻抗精度。",
      figure: {
        src: "/chambers/models/sac-10-p-pyramid-2.webp", w: 1024, h: 500,
        alt: "半电波暗室内10.0m广角。整个墙壁和天花板都覆盖着长金字塔吸波材料，并且没有铁氧体瓦部分。底部踏板上可以看到转盘弧线。",
        caption: "不含铁氧体。此配置的要点是使用单个 P2400 长金字塔覆盖 26 MHz 至 40 GHz。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "长达 10.0 m" },
        { label: "Quiet Zone", value: "ø3.0 – ø6.0 m" },
        { label: "衬垫", value: "P2400 长金字塔" },
        { label: "负载", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/30MHz至18GHz，40GHz可选。 3/P和4/P的尺寸与目录中的相同，唯一的区别是静区。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-10-3/P", "21,680 × 13,730 × 8,550 mm", "ø3.0 m\n10.0 m 测量距离（H = 3.0 m）"],
            ["SAC-10-4/P", "21,680 × 13,730 × 8,550 mm", "ø4.0m\n10.0 m 测量距离（H = 3.0 m）"],
            ["SAC-10-5/P", "23,480 × 16,580 × 9,000 mm", "ø5.0m\n10.0 m 测量距离（H = 3.0 m）"],
            ["SAC-10-6/P", "24,980 × 17,180 × 9,000 mm", "ø6.0 m\n10.0 m 测量距离（H = 3.0 m）"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461 RS101 · RS102 · RS103"],
      ),
      groups: [
        { title: G.zh.features, items: [
          "长寿命、不易燃的 Frankosorb® 长金字塔吸水前衬（Frankonia 技术）",
          "混合衬里的经济高效替代方案——无性能限制",
          "CISPR 16-1-4·ANSI C63.4标准发射官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "军用、汽车标准官方认证",
          "单或双测试轴选项——定制以适应任何 EMC 测试",
          "根据被测设备的要求广泛调整测试室的尺寸、特性和配置",
          "专门用于超出范围的 EMC 测试环境",
          "在金字塔下方的空间存放地板吸波材料",
          "交钥匙解决方案",
        ] },
        { title: G.zh.absorbers, items: [
          "P2400 Frankosorb® 长金字塔吸收衬里",
          "高性能纳米薄膜技术，长期稳定性经过验证",
          "EN 13501-1 A2 级 - s1 d0 不易燃等级",
          "EN 13501-1 B级阻燃等级（替代规格）",
        ] },
        { title: G.zh.performance, items: sacPerformanceKo("26") },
      ],
    },

    "fac-3": {
      lead: [
        "FAC-3 是 Frankonia 的紧凑型全电波暗室，用于在 3.0 m 的测量距离上测试桌面被测设备。静区为 ø1.5 m (H = 1.5 m)。",
        "作为一个没有接地层的测试场地，它被设计用于基于CISPR 16-1-4测量自由空间条件。没有地板反射，因此不需要高度扫描。",
      ],
      figure: {
        src: "/chambers/models/fac-3-2.webp", w: 1600, h: 1067,
        alt: "完全电波暗室的暗室内。不仅墙壁和天花板，甚至地板上都覆盖着白色的金字塔吸波体，前壁是黑色的铁氧体表面。前方的三脚架上放置着一根红色的喇叭天线，前方是一张带有网格图案的白色检查台。",
        caption: "地板上还铺有吸波材料。缺乏反射表面是它与半电波暗室不同的地方，也是高度扫描消失的原因。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m" },
        { label: "Quiet Zone", value: "ø1.5 m (H = 1.5 m)" },
        { label: "转盘", value: "ø1.5 m" },
        { label: "负载", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围 9 kHz / 30 MHz 至 18 GHz，40 GHz 可选。 Frankosorb® 混合衬里由铁氧体、H1000 和 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["FAC-3", "8,705 × 4,655 × 3,750 mm", "ø1.5 m\n3.0 m 测量距离 (H = 1.5 m) · 桌面产品"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["CISPR 14等", "ETSI"],
        ["IEC/EN 61000-4-3"],
        { e: ["CISPR 16-1-4", "IEC/EN 61000-4-22"], i: ["IEC/EN 61000-4-3", "IEC/EN 61000-4-22"] },
      ),
      groups: [
        { title: G.zh.features, items: [
          "桌面被测设备测试场地",
          "CISPR 16-1-4·IEC/EN 61000-4-22·ETSI标准发射官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "经济高效的自由空间测量解决方案",
          "紧凑的腔室设计，配有先进的 Frankosorb® 吸波材料衬里",
          "双测试轴选项",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H1000 · H600") },
        { title: G.zh.performance, items: [
          "基于CISPR 16-1-4标准的发射（EMI）官方认证",
          "FS NSA 偏差 ±3.5 dB (30 MHz ~ 1 GHz)",
          "SVSWR 偏差 +5.5 dB（1 GHz 至 18 GHz）",
          "IEC/EN 61000-4-3标准抗扰度（EMS）官方认证",
          "FU 偏差 0/+6 dB，16 个测量点的 75% (30/80 MHz ~ 18 GHz)",
          "基于 IEC/EN 61000-4-22 的抗扰度和辐射官方认证 — SdB c ≤ 1.8 dB",
        ] },
      ],
    },

    "fac-3-l": {
      lead: [
        "FAC-3 L是一个扩展的全电波暗室，测量距离为3.0 m，不仅可以容纳桌面，还可以容纳静止的被测设备。静区为 ø1.5 m (H = 2.0 m)。",
        "作为没有接地层的测试场地，其设计用于基于CISPR 16-1-4测量自由空间条件，并且可以使用FAM或FBM天线杆进行高度扫描。",
      ],
      figure: {
        src: "/chambers/models/fac-3-l-2.webp", w: 1600, h: 1067,
        alt: "完全电波暗室的暗室内。墙壁、天花板和地板都覆盖着白色的金字塔吸波器，中央矗立着一根带有红色部件的白色天线杆。前面的地板上有一个灰色的格子结构。",
        caption: "带桅杆的完全电波暗室。 L 配置的优点是可以进行高度扫描而无需地面反射。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m" },
        { label: "Quiet Zone", value: "ø1.5 m (H = 2.0 m)" },
        { label: "转盘", value: "ø1.5 m" },
        { label: "负载", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围 9 kHz / 30 MHz 至 18 GHz，40 GHz 可选。 Frankosorb® 混合衬里由铁氧体、H1000 和 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["FAC-3 L", "9,380 × 5,780 × 6,000 mm", "ø1.5米\n3.0 m 测量距离 (H = 2.0 m) · 安装式和桌面式产品，高度扫描"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["CISPR 14", "CISPR 15", "CISPR 32", "ETSI"],
        ["IEC/EN 61000-4-3"],
        { e: ["CISPR 16-1-4", "IEC/EN 61000-4-22"], i: ["IEC/EN 61000-4-3", "IEC/EN 61000-4-22"] },
      ),
      groups: [
        { title: G.zh.features, items: [
          "桌面和固定被测设备的测试场地（包括高度扫描）",
          "CISPR 16-1-4·IEC/EN 61000-4-22·ETSI标准发射官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "经济高效的自由空间测量解决方案",
          "紧凑的腔室设计，配有先进的 Frankosorb® 吸波材料衬里",
          "双测试轴选项",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H1000 · H600") },
        { title: G.zh.performance, items: [
          "基于CISPR 16-1-4标准的发射（EMI）官方认证",
          "FS NSA 偏差 ±3.5 dB (30 MHz ~ 1 GHz)",
          "SVSWR 偏差 +5.5 dB（1 GHz 至 18 GHz）",
          "IEC/EN 61000-4-3标准抗扰度（EMS）官方认证",
          "FU 偏差 0/+6 dB，16 个测量点的 75% (30/80 MHz ~ 18 GHz)",
          "基于 IEC/EN 61000-4-22 的抗扰度和辐射官方认证 — SdB c ≤ 1.8 dB",
        ] },
      ],
    },

    "sac-3-fac-3-transformer": {
      lead: [
        "SAC-3/FAC-3 变压器是经过全面认证的 EMC 解决方案，可在 3.0 m 的测量距离内提供半电波暗室和全电波暗室条件。",
        "通过优化的地板吸波材料修改套件，支持桌面被测设备的接地条件和 FAR 条件。凭借其传统的方形设计，发射和抗扰度均达到官方认证的水平。",
      ],
      figure: {
        src: "/chambers/models/sac-3-fac-3-transformer-1.webp", w: 1600, h: 1067,
        alt: "暗室前面的内部。整个前墙是方形铁氧体瓷砖的网格，左右墙壁和天花板是白色的金字塔吸波体。地板是反射地平面。",
        caption: "现在它是一个带有裸露接地层的半电波暗室配置。如果将吸波材料放置在地板上，同一暗室就会成为完全电波暗室的测试场所。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m" },
        { label: "Quiet Zone", value: "ø2.0 m / ø1.5 m" },
        { label: "频率范围", value: "30 MHz – 18 GHz" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围 9 kHz / 30 MHz 至 18 GHz，40 GHz 可选。 Frankosorb® 混合衬里由铁氧体、H1000 和 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "Quiet Zone"],
          rows: [
            ["SAC-3 / FAC-3 Transformer", "9,680 × 6,530 × 6,000 mm", "SAC 配置 — ø2.0 m，3.0 m 测量距离（H = 2.5 m）\nFAC 配置 — ø1.5 m，3.0 m 测量距离（H = 1.5 m）"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        sacProductEmission,
        sacProductImmunity,
        { e: ["CISPR 16-1-4", "和/或 ANSI C63.4", "IEC/EN 61000-4-22"], i: ["IEC/EN 61000-4-3", "IEC/EN 61000-4-22"] },
      ),
      groups: [
        { title: G.zh.features, items: [
          "适用于 3.0 m 测试距离的经济高效、高性能解决方案",
          "SAC 配置 — ø2.0 m 用于固定产品的静区",
          "FAC 配置 — ø1.5 m 桌面产品静区",
          "CISPR 16-1-4 · ANSI C63.4 · IEC/EN 61000-4-22 · ETSI标准发射官方认证",
          "CISPR 25·MIL-STD 461官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "E-Drive可扩展（装载机、BlueBox、电池测试系统）",
          "紧凑的腔室设计，具有先进的吸波材料衬里",
          "长寿命 Frankosorb® 吸波器实现卓越性能",
          "还可用于汽车和军工标准测试",
          "交钥匙解决方案",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H1000 · H600") },
        { title: "性能和认证 – 半电波暗室 (SAC) 配置", items: sacPerformanceKo() },
        { title: "性能和认证 – 全无源 (FAC) 配置", items: [
          "基于CISPR 16-1-4标准的发射（EMI）官方认证",
          "FS NSA 偏差 ±3.5 dB (30 MHz ~ 1 GHz)",
          "SVSWR 偏差 +5.5 dB（1 GHz 至 18 GHz）",
          "IEC/EN 61000-4-3标准抗扰度（EMS）官方认证",
          "FU 偏差 0/+6 dB，16 个测量点的 75% (30/80 MHz ~ 18 GHz)",
        ] },
      ],
    },

    chc: {
      lead: [
        "CHC 是一款紧凑型混合室，可在 3.0 m 的测量距离处提供 ø1.2 m 的静区。非常适合在一个暗室内执行认证前发射测试和正式认证抗扰度测试。",
        "膨胀的CHC L 包括具有吸收材料的分隔壁。 RF功率放大器、天线和地面吸波材料可以放置在室内。",
      ],
      figure: {
        src: "/chambers/models/chc-2.webp", w: 1600, h: 1067,
        alt: "紧凑型混合室内部。左右墙壁和天花板上的金字塔吸波器在远处汇合在一起，黄色杆子上的红色喇叭天线矗立在黑色铁氧体前墙的前面。地板吸波材料放置在前地板上。",
        caption: "这是这个尺寸内距离为 3.0 m 的暗室。发射预认证、抗扰度正式认证——这两者的组合决定了规模。",
      },
      overview: [
        { label: "发射（EMI）", value: "预认证" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m" },
        { label: "Quiet Zone", value: "ø1.2 m" },
        { label: "频率范围", value: "30 MHz – 18 GHz" },
        { label: "负载", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/30MHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体·H450 或 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "静区及特点"],
          rows: [
            ["CHC", "7,355 × 3,755 × 3,300 mm", "ø1.2 m\n3.0 m 测量距离"],
            ["CHC L", "8,255 × 3,755 × 3,300 mm", "ø1.2 m\n3.0 m测量距离，放大器等存放在腔室中"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["30 MHz 至 1 GHz 预认证"],
        ["IEC/EN 61000-4-3"],
        { e: ["CISPR 16-1-4"], i: ["IEC/EN 61000-4-3"] },
      ),
      groups: [
        { title: G.zh.features, items: [
          "根据 CISPR 16-1-4 进行 30 MHz 至 1 GHz 预认证发射",
          "正式认证不受 IEC/EN 61000-4-3 影响 — 节省成本的配置",
          "带吸波器选项的隔墙（CHC L）将放大器、天线和地面吸波材料存储在腔室中。",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: [
          "CISPR 16-1-4辐射（EMI）预认证",
          "NSA 偏差 ±4.0 dB（30 MHz 至 1 GHz），高度扫描受限",
          "IEC/EN 61000-4-3标准抗扰度（EMS）官方认证",
          "FU 偏差 0/+6 dB，16 个测量点的 75% (30/80 MHz ~ 18 GHz)",
        ] },
      ],
    },

    "chc-plus": {
      lead: [
        "CHC Plus 是紧凑型混合室的扩展配置，可在完全认证的水平上执行 1 GHz 至 18 GHz 的发射测量。",
        "3.0 m 测量距离和 ø1.2 m 静区与 CHC 相同。变化的是 1 GHz 以上的发射测量。",
      ],
      figure: {
        src: "/chambers/models/chc-plus-2.webp", w: 1600, h: 1067,
        alt: "紧凑室内。嵌入地板的银色转盘的盖子打开，露出电缆连接器面板，周围有黄色和黑色的安全标记。墙是一个金字塔形吸波体。",
        caption: "布线从地板下穿过。腔室越小，布线的设计问题就越大。",
      },
      overview: [
        { label: "发射（EMI）", value: "1GHz以上官方认证" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m" },
        { label: "Quiet Zone", value: "ø1.2 m" },
        { label: "转盘", value: "ø1.2 m / ø2.0 m" },
        { label: "负载", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/30MHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体·H450 或 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "静区及特点"],
          rows: [
            ["CHC Plus", "7,355 × 3,755 × 3,300 mm", "ø1.2 m\n3.0 m 测量距离，官方认证发射频率高于 1 GHz"],
            ["CHC Plus L", "7,580 × 4,655 × 4,350 mm", "ø1.2 m\n3.0 m 测量距离，转盘 ø2.0 m，官方认证发射频率高于 1 GHz"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["30 MHz 至 1 GHz 预认证", "1GHz~18GHz官方认证"],
        ["IEC/EN 61000-4-3"],
        { e: ["CISPR 16-1-4"], i: ["IEC/EN 61000-4-3"] },
      ),
      groups: [
        { title: G.zh.features, items: [
          "根据 CISPR 16-1-4 进行 30 MHz 至 1 GHz 预认证发射",
          "1 GHz ~ 18/40 GHz 官方认证发射",
          "正式认证不受 IEC/EN 61000-4-3 影响 — 节省成本的配置",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: [
          "CISPR 16-1-4辐射（EMI）预认证",
          "NSA 偏差 ±4.0 dB（30 MHz 至 1 GHz），高度扫描受限",
          "CISPR 16-1-4发射（EMI）认证",
          "SVSWR 偏差 +6.0 dB（1 GHz 至 18 GHz）",
          "IEC/EN 61000-4-3标准抗扰度（EMS）官方认证",
          "FU 偏差 0/+6 dB，16 个测量点的 75% (30/80 MHz ~ 18 GHz)",
        ] },
      ],
    },

    ctc: {
      lead: [
        "CTC是一家经过全面认证的组件测试室，专注于工业产品的抗扰度测试。这里包括汽车零部件的发射和抗扰度测试以及军事测试。",
        "在 1.0 m 测试距离上执行 CISPR 25 · ISO 11452 · MIL-STD 461 · DO-160，在 3.0 m 测量距离上执行 IEC/EN 61000-4-3，完全认证级别。",
      ],
      figure: {
        src: "/chambers/models/ctc-1.webp", w: 1600, h: 1200,
        alt: "元件测试室内。前墙为方形网格吸波面，左右两侧及顶棚为金字塔吸波体。中央有一个木制测试台，地板上画有黄色放置标记线。",
        caption: "木制试验台及地板布置线。 CISPR 25 所需要的正是这种布置，而不仅仅是腔室。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 25" },
        { label: "电阻（EMS）", value: "ISO 11452" },
        { label: "测量距离", value: "1.0 m · 3.0 m" },
        { label: "军用标准", value: "MIL-STD 461 · DO-160" },
        { label: "频率范围", value: "9 kHz – 18 GHz" },
        { label: "负载", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9 kHz至18 GHz，40 GHz可选。 Frankosorb® 混合衬里由铁氧体 H450 或 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "测试条件"],
          rows: [
            ["CTC", "8,480 × 5,485 × 3,750 mm", "基于IEC 61000-4-3的抗扰度官方认证\nCISPR 25 · ISO 11452 · MIL-STD 461 · DO-160 官方认证\n桌子布置和站立布置"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["CISPR 25", "MIL-STD 461 / DO-160"],
        ["ISO 11452", "MIL-STD 461 / DO-160", "IEC/EN 61000-4-3"],
        { e: ["CISPR 25", "MIL-STD 461 / DO-160"], i: ["IEC/EN 61000-4-3"] },
      ),
      groups: [
        { title: G.zh.features, items: [
          "正式认证不受 IEC/EN 61000-4-3 影响 — 节省成本的配置",
          "CISPR 25·ISO 11452官方认证",
          "MIL-STD 461·DO-160官方认证",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: [
          "IEC 61000-4-3标准抗扰度（EMS）官方认证",
          "基于CISPR 25和ISO 11452的汽车零部件测试官方认证",
          "基于MIL-STD 461和DO-160的军事和航空测试官方认证",
        ] },
      ],
    },

    actc: {
      lead: [
        "ACTC是汽车零部件试验室，测量距离为1.0m。我们根据 CISPR 25 和 ISO 11452 进行正式认证级别的汽车零部件测试。",
        "吸收体之间安装有用于永久连接的插入式接触片，以确保测试台和屏蔽之间的电连接，并包括CISPR 25要求的测试台。",
      ],
      figure: {
        src: "/chambers/models/actc-1.webp", w: 1600, h: 1068,
        alt: "汽车零部件试验室内。墙壁和天花板上覆盖着金字塔吸波器，中央放置着木制测试台和金属接地板。左边有一个红色的仪器外壳和三脚架。",
        caption: "对于元件测试，布局比腔室更标准。测试台和接地连接符合 CISPR 25 标准。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 25" },
        { label: "电阻（EMS）", value: "ISO 11452" },
        { label: "测量距离", value: "1.0 m" },
        { label: "批次", value: "桌上测试" },
        { label: "频率范围", value: "26 MHz – 18 GHz" },
        { label: "负载", value: "10,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围150kHz/26MHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体和 H450 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "测试条件"],
          rows: [
            ["ACTC", "6,380 × 5,480 × 3,750 mm", "CISPR 25 组件测试\n1.0m测量距离"],
            ["ACTC L", "11,480 × 6,580 × 4,500 mm", "CISPR 25 组件测试和整车测试\n1.0m测量距离"],
          ],
        },
      ],
      standards: [
        {
          title: S.zh.verification,
          columns: [
            { head: S.zh.emission, items: ["CISPR 25"] },
            { head: S.zh.immunity, items: ["ISO 11452"] },
          ],
        },
      ],
      groups: [
        { title: G.zh.features, items: [
          "ACTC — CISPR 25 和 ISO 11452 组件正式认证",
          "ACTC L — 尺寸适合组件和车辆测试，经过 CISPR 25 和 ISO 11452 正式认证",
          "用于汽车零部件测试的紧凑型腔室解决方案",
          "E-Drive可扩展（装载机、BlueBox、电池测试系统）",
          "改进长寿命 Frankosorb® 混合吸波材料的最佳衬里",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H450") },
        { title: "性能和认证 – ACTC", items: [
          "获得 CISPR 25 辐射 (EMI) 标准的正式认证",
          "ISO 11452标准抗扰度（EMS）正式认证",
          "经 IEC/EN 61000-4-3 认证的抗扰度 (EMS)",
          "均匀电场 0.5 × 0.5 m（测量距离 1.0 m）",
          "FU 偏差 0/+6 dB，100%（26/80 MHz 至 18 GHz）",
        ] },
        { title: "性能和认证 – ACTC L", items: [
          "获得 CISPR 25 辐射 (EMI) 标准的正式认证",
          "ISO 11452标准抗扰度（EMS）正式认证",
          "IEC/EN 61000-4-3标准抗扰度（EMS）官方认证",
          "均匀电场 1.5 × 1.5 m，测量距离 3.0 m",
          "FU 偏差 0/+6 dB，16 个测量点的 75%（26/80 MHz 至 18 GHz）",
        ] },
      ],
    },

    ucc: {
      lead: [
        "UCC 是一款超紧凑型混合解决方案，测量距离为 1.0 m。专为汽车零部件的预认证辐射发射和抗扰度测试、传导测试以及 CISPR 25 预认证测试而设计。",
        "它可以在预认证测试中替代 GTEM 细胞，也可用于所有领域的研究和学术目的。",
      ],
      figure: {
        src: "/chambers/models/ucc-2.webp", w: 1600, h: 1200,
        alt: "超小型混合室内部。白色支撑架上放置着一张带有铜色接地板的测试台，近距离可以看到墙上有一个金字塔形吸波器。地板有齐平镶板。",
        caption: "铜接地层及其上的放置。更换 GTEM 单元意味着这种布置可以按原样使用。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 25 预认证" },
        { label: "电阻（EMS）", value: "ISO 11452 预认证" },
        { label: "测量距离", value: "1.0 m" },
        { label: "批次", value: "桌上测试" },
        { label: "频率范围", value: "26 MHz – 18 GHz" },
        { label: "替代目标", value: "GTEM 细胞" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围150kHz/26MHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体和 H450 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "测试条件"],
          rows: [
            ["UCC", "4,580 × 3,080 × 2,550 mm", "预认证组件测试\n1.0m测量距离"],
          ],
        },
      ],
      groups: [
        { title: G.zh.features, items: [
          "基于 CISPR 25 和 ISO 11452 的组件预认证（GTEM 单元的替代方案）",
          "用于汽车零部件测试的紧凑型腔室解决方案",
          "E-Drive可扩展（装载机、BlueBox、电池测试系统）",
          "改进长寿命 Frankosorb® 混合吸波材料的最佳衬里",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H450") },
        { title: G.zh.performance, items: [
          "CISPR 25 辐射（EMI）预认证",
          "基于ISO 11452的抗扰度预认证（EMS）",
        ] },
      ],
    },

    avtc: {
      lead: [
        "AVTC 是一款专注于汽车零部件和车辆测试的电波暗室，为测量距离为 3.0 m 或 5.0 m 的商业产品测试提供 ø4.0 m 的静区。",
        "支持根据 CISPR 12 的车辆辐射发射、根据 CISPR 25 的组件发射、根据 CISPR 16-1-4 · ANSI C63.4 的商业产品测试，并且还符合 IEC/EN 61000-4-3 · ISO 11451 · ISO 11452 辐射抗扰度。",
      ],
      figure: {
        src: "/chambers/models/avtc-4.webp", w: 1600, h: 1067,
        alt: "车辆测试室内。墙壁和天花板上布满了金字塔吸音器，地板踏面呈现出一圈大转盘和嵌入的格栅。暗室内部是空的。",
        caption: "底部左边的圆圈是转盘。车辆升高的直径决定了该室的大小。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "3.0 m · 5.0 m" },
        { label: "Quiet Zone", value: "最大ø4.0 m" },
        { label: "ECE R10", value: "测功机3.0m" },
        { label: "负载", value: "30,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/150kHz～18GHz，40GHz可选。 Frankosorb® 混合衬里由铁氧体、H1000 和 H600 组合而成。",
          head: ["配置", "外形尺寸（长×宽×高）", "静区和转盘"],
          rows: [
            ["AVTC", "11,480 × 9,380 × 6,000 mm", "ø3.0 m，测量距离3.0 m（H = 2.5 m）\n转盘最大直径 ø5.0 m"],
            ["AVTC L", "14,780 × 11,480 × 6,300 mm", "ø3.0 m、3.0 m·5.0 m测量距离（H = 2.5 m）\n转盘最大 ø6.0 m"],
            ["AVTC XL", "16,280 × 12,680 × 6,300 mm", "ø4.0 m、3.0 m·5.0 m 测量距离（H = 2.5 m）\n内置测功机 ø7.0 m"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461", "ECE R10.5"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461 RS101 · RS102 · RS103", "ECE R10.5"],
      ),
      groups: [
        { title: G.zh.features, items: [
          "进化的 Frankosorb® 混合吸收衬里",
          "经过汽车零部件和车辆测试以及商业测试的解决方案",
          "CISPR 16-1-4·ANSI C63.4标准发射官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "CISPR 25·CISPR 12·ISO 11452·ISO 11451官方认证",
          "ECE R10 兼容内置或便携式测功机，测试距离可达 3.0 m",
          "适用于 3.0 m 或 5.0 m 测试距离的经济高效、高性能解决方案",
          "地板吸音板快速更换测试批次",
          "可通过EDTC组件进行扩展（loader、BlueBox等）",
          "定制以满足任何 EMC 测试",
          "也可用于商业和军用标准测试",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("Ferrite · H1000 · H600") },
        { title: G.zh.performance, items: [
          ...sacPerformanceKo("26"),
          "CISPR 25·CISPR 12标准发射（EMI）官方认证",
          "基于 ISO 11452 和 ISO 11451 的抗扰度（EMS）官方认证",
          "兼容ECE R10，测功机测试距离3.0m",
        ] },
      ],
    },

    "sac-10-v": {
      lead: [
        "SAC-10V提供各种尺寸的静区，测量距离为10.0m，是专门为整车测试定制的官方认证室，内置测功机。",
        "尺寸和配置均可调整，生产范围广泛，可根据客户需求量身定制。有混合衬砌和长金字塔衬砌两种类型，两种方法具有相同的性能。",
      ],
      figure: {
        src: "/chambers/models/sac-10-v-5.webp", w: 1600, h: 1067,
        alt: "大型车辆试验室内。一辆黑色轿车停在地板转盘上，连接着排气软管。大型天线吊杆结构靠近天花板，墙壁和天花板是金字塔吸波体。",
        caption: "转盘上有车辆。包括排气软管和测功机是ECE R10测试的条件。",
      },
      overview: [
        { label: "发射（EMI）", value: "CISPR 16-1-4" },
        { label: "电阻（EMS）", value: "IEC/EN 61000-4-3" },
        { label: "测量距离", value: "长达 10.0 m" },
        { label: "Quiet Zone", value: "ø6.0 m" },
        { label: "ECE R10.5", value: "10.0m官方认证" },
        { label: "负载", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "混合吸波材料组合物",
          note: "频率范围9kHz/150kHz～18GHz，40GHz可选。优化的 Frankosorb® 混合衬里。",
          head: ["配置", "外形尺寸（长×宽×高）", "静区和测试区"],
          rows: [
            ["SAC-10VC-6/H", "23,030 × 14,480 × 6,300 mm", "ø6.0 m，5.0 m 测量距离（H = 2.5 m）\n适合 10.0 m 测量距离进行车辆测试"],
            ["SAC-10V-6/H", "22,580 × 15,680 × 8,700 mm", "ø6.0 m，10.0 m 测量距离（H = 3.0 m）"],
            ["SAC-10V-6/H (SL12)", "24,380 × 16,580 × 9,000 mm", "ø6.0 m，10.0 m 测量距离（H = 3.0 m）\n长达 12.0 m 的车辆重载测试区"],
            ["SAC-10V-6/H (SL18)", "26,780 × 18,080 × 9,000 mm", "ø6.0 m，10.0 m 测量距离（H = 3.0 m）\n长达 18.0 m 的车辆重载测试区"],
          ],
        },
        {
          title: "长金字塔吸波体组成",
          note: "频率范围 9 kHz / 150 kHz ~ 18 GHz，40 GHz 可选。 P2400 Frankosorb® 长金字塔前衬。",
          head: ["配置", "外形尺寸（长×宽×高）", "静区和测试区"],
          rows: [
            ["SAC-10V-6/P", "26,480 × 20,180 × 9,000 mm", "ø6.0 m，10.0 m 测量距离（H = 3.0 m）"],
            ["SAC-10V-6/P (SL12)", "26,480 × 20,180 × 10,500 mm", "ø6.0 m，10.0 m 测量距离（H = 3.0 m）\n长达 12.0 m 的车辆重载测试区"],
            ["SAC-10V-6/P (SL18)", "30,080 × 20,180 × 10,500 mm", "ø6.0 m，10.0 m 测量距离（H = 3.0 m）\n长达 18.0 m 的车辆重载测试区"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461", "ECE R10.5"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461 RS101 · RS102 · RS103", "ECE R10.5"],
      ),
      groups: [
        { title: G.zh.features, items: [
          "SAC-10V-6/H — 优化进化的 Frankosorb® 混合吸收衬里",
          "SAC-10V-6/P — P2400 Frankosorb® 长金字塔前衬",
          "CISPR 16-1-4·ANSI C63.4标准发射官方认证",
          "基于IEC/EN 61000-4-3的官方抗扰度认证",
          "CISPR 25 · CISPR 12 · CISPR 36 · ISO 11452 · ISO 11451 官方认证",
          "兼容ECE R10，内置测功机，测试距离10.0m",
          "定制，适合车辆尺寸和重量，任何测试",
          "专门用于超出范围的 EMC 测试环境",
          "也可用于商业和军用标准测试",
        ] },
        { title: G.zh.absorbers, items: [
          "高性能纳米薄膜技术，长期稳定性经过验证",
          "EN 13501-1 A2 级 - s1 d0 不易燃等级",
          "EN 13501-1 B级阻燃等级（替代规格）",
        ] },
        { title: G.zh.performance, items: [
          "CISPR 16-1-4·ANSI C63.4标准发射（EMI）官方认证",
          "CISPR 25·CISPR 12标准发射（EMI）官方认证",
          "IEC/EN 61000-4-3标准抗扰度（EMS）官方认证",
          "基于 ISO 11452 和 ISO 11451 的抗扰度（EMS）官方认证",
          "兼容ECE R10，测功机测试距离10.0m",
        ] },
      ],
    },

    "edtc-sa": {
      lead: [
        "E-Drive Test Solutions 是 Frankonia 专门针对混合动力、电动、燃料电池和电池传动系统的零部件和设备的测试中心。它为根据 CISPR 25 和 ISO 11452 进行辐射测试提供了良好的条件。",
        "EDTC-SA是一种基于一个固定轴外部负载的前提下制造的室配置。它用于动态测试，包括制动、驱动、旋转方向、速度控制、扭矩控制及其组合。",
      ],
      figure: {
        src: "/chambers/models/edtc-3.webp", w: 1600, h: 1067,
        alt: "驱动系统测试室内。中央的白色底座上安装有一台电动机，上面连接着两根粗电缆。左壁是铁氧体瓦，右壁是金字塔吸波器。",
        caption: "被测设备为电机本身。负载留在腔室外部，只有轴穿过防护罩。",
      },
      overview: [
        { label: "适用标准", value: "CISPR 25 · ISO 11452" },
        { label: "负载", value: "外轴/定轴" },
        { label: "测量距离", value: "1.0 m" },
        { label: "批次", value: "墙前的桌子" },
        { label: "频率范围", value: "150 kHz – 18 GHz" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/150kHz～18GHz，40GHz可选。优化的 Frankosorb® 混合吸收衬里。",
          head: ["配置", "外形尺寸（长×宽×高）", "负载"],
          rows: [
            ["EDTC-SA", "7,880 × 5,480 × 3,750 mm", "1固定轴外部负载\n例）1×250kW、3,000RPM、3,000Nm"],
          ],
        },
        {
          title: "外部负载",
          note: "这不是暗室，而是进入暗室的设备。负载可以直接使用客户首选的供应商提供的负载。",
          head: ["", "EDTC-250", "EDTC-500"],
          rows: [
            ["输出", "1 × 250 kW", "2 × 250 kW"],
            ["转速", "3,000 RPM", "3,000 RPM"],
            ["谈话", "3,000 Nm", "3,000 Nm"],
          ],
        },
      ],
      groups: [
        { title: G.zh.features, items: [
          "CISPR 25·ISO 11452官方认证",
          "优化的 Frankosorb® 混合吸收衬里",
          "部件级或系统级测试",
          "与电池测试结合",
          "现有室的集成套件",
          "被测设备的电源和水冷系统选项",
          "电机适配器/接地/接线符合CISPR 25",
          "不传递振动的独立基础（浮板）",
          "备考咨询及延伸服务",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: [
          "CISPR 25标准辐射发射测试",
          "ISO 11452标准辐射抗扰度测试",
        ] },
      ],
    },

    "edtc-ax": {
      lead: [
        "EDTC-AX是为测试传动系统单元的电轴而定义的室配置，并且是在两个固定轴外部负载的前提下制造的。",
        "该专利配置用于电动传动系统的动态驾驶测试，并与我们客户首选的测功机供应商保持一致。 Frankonia 专注于腔室中正确的 EMC 放置，提供测试台、接地元件和 90° 角齿轮箱。",
      ],
      figure: {
        src: "/chambers/models/edtc-ax-0.webp", w: 1600, h: 1067,
        alt: "驱动系统测试室内。前面有一个铜色的地台，中央的白色框架上安装着绿色的电动机和黑色的联轴器。左墙上有一个银色的外壳，有一条轴线穿过其中。",
        caption: "左壁外壳为屏蔽轴穿透部分。即使负载放置在外部，该室也能在这一点上保持屏蔽。",
      },
      overview: [
        { label: "适用标准", value: "CISPR 25 · ISO 11452" },
        { label: "负载", value: "2个外部单元，固定轴" },
        { label: "输出范围", value: "例）2×250kW" },
        { label: "测量距离", value: "1.0 m" },
        { label: "频率范围", value: "150 kHz – 18 GHz" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围9kHz/150kHz～18GHz，40GHz可选。优化的 Frankosorb® 混合吸收衬里。",
          head: ["配置", "外形尺寸（长×宽×高）", "负载"],
          rows: [
            ["EDTC-AX", "9,080 × 6,080 × 3,750 mm", "2个固定轴外部负载\n示例）2 × 250 kW、3,000 RPM、3,000 Nm"],
          ],
        },
      ],
      groups: [
        { title: G.zh.features, items: [
          "电轴放置专利配置",
          "CISPR 25·ISO 11452官方认证",
          "优化的 Frankosorb® 混合吸收衬里",
          "屏蔽轴、测试物定位、接地、提供测试台",
          "90°角齿轮箱——兼容任何测功机",
          "电机适配器/接地/接线符合CISPR 25",
          "不传递振动的独立基础（浮板）",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: [
          "CISPR 25标准辐射发射测试",
          "ISO 11452标准辐射抗扰度测试",
        ] },
      ],
    },

    "edtc-bb": {
      lead: [
        "EDTC-BB 是一种室配置，包括移动负载 EMC-BlueBox，用于在屏蔽空间内对电动传动系统执行动态 EMC 测试。",
        "BlueBox在四个象限中运行，因此它可以再现被测设备经历的任何负载情况。与固定轴外部负载一样，它包括制动、驱动、旋转方向、速度控制、扭矩控制及其组合。",
      ],
      figure: {
        src: "/chambers/models/edtc-bb-0.webp", w: 1600, h: 1067,
        alt: "驱动系统测试室内。连接到轴的绿色电动机放置在长长的白色测试台上，蓝色设备安装在右端。地板上有黄色的安全标志。",
        caption: "负载进入腔室。没有任何轴突破屏蔽是 BlueBox 配置发生变化的一个条件。",
      },
      overview: [
        { label: "适用标准", value: "CISPR 25 · ISO 11452" },
        { label: "负载", value: "移动/电动" },
        { label: "最大输出", value: "120 kW" },
        { label: "测量距离", value: "1.0 m" },
        { label: "频率范围", value: "30 MHz – 18 GHz" },
        { label: "负载", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "频率范围 9 kHz / 30 MHz ~ 18 GHz，40 GHz 可选。优化的 Frankosorb® 混合吸收衬里。",
          head: ["配置", "外形尺寸（长×宽×高）", "负载"],
          rows: [
            ["EDTC-BB", "7,880 × 6,380 × 3,750 mm", "移动负载 EMC-BlueBox，高达 120 kW"],
            ["EDTC-BB（带转盘）", "10,880 × 6,980 × 3,900 mm", "移动负载 EMC-BlueBox，高达 120 kW\n360°扫描转盘"],
          ],
        },
        {
          title: "EMC-BlueBox便携式装载机",
          note: "这不是暗室，而是进入暗室的设备。重量、负载和外观基于我们的产品页面。",
          head: ["", "BlueBox-30", "BlueBox-40", "BlueBox-65", "BlueBox-120"],
          rows: [
            ["输出", "30 kW", "40 kW", "63 kW", "120 kW"],
            ["最高转速", "11,000 RPM", "9,000 RPM", "6,500 RPM", "6,000 RPM"],
            ["谈话", "82 Nm", "140 Nm", "240 Nm", "470 Nm"],
            ["重量", "1,100 kg", "1,200 kg", "1,700 kg", "2,500 kg"],
            ["加载中", "800 kg", "800 kg", "1,000 kg", "1,400 kg"],
            ["外观", "2.0 × 1.3 × 1.3 m", "2.2 × 1.3 × 1.3 m", "2.5 × 1.4 × 1.3 m", "2.8 × 1.6 × 1.3 m"],
          ],
        },
      ],
      groups: [
        { title: G.zh.features, items: [
          "4象限运行——可再现任何负载情况",
          "CISPR 25·ISO 11452官方认证",
          "优化的 Frankosorb® 混合吸收衬里",
          "可移动，因此可以放置以适应任何被测设备",
          "置于转盘上360°测试范围",
          "与电池测试结合",
          "现有室的集成套件",
          "任何EMC工程师都可以使用的操作",
        ] },
        { title: G.zh.absorbers, items: absorbersKo("铁氧体·H450或H600") },
        { title: G.zh.performance, items: [
          "CISPR 25标准辐射发射测试",
          "ISO 11452标准辐射抗扰度测试",
        ] },
      ],
    },

    "mil-chc": {
      lead: [
        "MIL CHC 是一款紧凑型混合室，用于根据 MIL-STD 461 和 DO-160 进行组件测试。内衬 Frankosorb® 混合吸波材料批次。",
        "我们在官方认证级别的测量距离1.0m处对轻量级被测设备进行辐射发射和抗扰度测试。为了满足 DO-160，由于吸波材料衬里的缘故，腔室需要稍长一些。",
      ],
      figure: {
        src: "/chambers/models/mil-chc-2.webp", w: 1600, h: 1067,
        alt: "军用紧凑型混合室内。墙壁和天花板上覆盖着金字塔形吸波器，一个人正在三脚架上操作红色天线。右侧有一张测试桌，左墙顶部有aselsan标志。",
        caption: "1.0m测量距离是人能够到达天线的距离。军事部件测试以这种规模进行。",
      },
      overview: [
        { label: "发射（EMI）", value: "MIL-STD 461 · DO-160" },
        { label: "电阻（EMS）", value: "MIL-STD 461 · DO-160" },
        { label: "测量距离", value: "1.0 m" },
        { label: "批次", value: "桌上测试" },
        { label: "频率范围", value: "30 MHz – 40 GHz" },
        { label: "衬垫", value: "杂交种" },
      ],
      tables: [
        {
          title: "配置",
          note: "Frankosorb® 混合吸收衬里。 DO-160 配置由于吸波材料衬里而增加了长度。",
          head: ["配置", "外形尺寸（长×宽×高）", "频率范围及衬里"],
          rows: [
            ["MIL CHC", "4,880 × 4,880 × 3,000 mm", "9kHz/30MHz~40GHz\n混合吸水衬里"],
            ["MIL CHC / DO-160", "5,330 × 4,880 × 3,000 mm", "9kHz/30MHz~40GHz\n混合吸水衬里"],
          ],
        },
      ],
      groups: [
        { title: G.zh.features, items: [
          "基于MIL-STD 461和DO-160的组件测试官方认证",
          "军事用途的紧凑室设计",
          "长寿命 Frankosorb® 吸波材料的改进衬里",
        ] },
        { title: G.zh.absorbers, items: [
          "Frankosorb® 短金字塔、长金字塔或混合吸波材料衬里",
          "高性能纳米薄膜技术，长期稳定性经过验证",
          "EN 13501-1 A2 级 - s1 d0 不易燃等级",
          "EN 13501-1 B级阻燃等级（替代规格）",
        ] },
        { title: G.zh.performance, items: [
          "MIL-STD 461·DO-160标准发射（EMI）和抗扰度（EMS）官方认证，30 MHz / 80 MHz ~ 40 GHz",
          "法向入射吸收率 — 80 MHz 至 250 MHz 6 dB（标准要求水平）",
          "法向入射吸收率 — 250 MHz 以上 10 dB（标准要求水平）",
        ] },
      ],
    },

    "mil-std-chamber": {
      lead: [
        "MIL-STD暗室是一个大型暗室，根据MIL-STD 461在1.0m的测量距离上对大型测试物体和车辆进行辐射发射和抗扰度测试。",
        "对于大型、重型测试物体的军事测试，我们完全根据客户要求定制。",
      ],
      figure: {
        src: "/chambers/models/mil-std-chamber-0.webp", w: 1250, h: 875,
        alt: "大型军事室的剖面图。红色的钢结构围绕着外壳，内壁覆盖着白色的吸收材料，中央地板上有一个水箱。左侧有一个入口坡道。",
        caption: "没有设置尺寸的原因就在这张图中。进来的东西决定了暗室的大小。",
      },
      overview: [
        { label: "发射（EMI）", value: "MIL-STD 461 · DO-160" },
        { label: "电阻（EMS）", value: "MIL-STD 461 · DO-160" },
        { label: "测量距离", value: "1.0 m" },
        { label: "被测设备", value: "车辆/大型被测设备" },
        { label: "频率范围", value: "80 MHz – 40 GHz" },
        { label: "负载", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "尺寸根据被测设备的类型和尺寸确定。特殊转盘和设备集成是可能的。",
          head: ["配置", "外形尺寸（长×宽×高）", "频率范围及衬里"],
          rows: [
            ["MIL-STD Chamber", "定制", "9kHz/80MHz~40GHz\n短金字塔吸波器，符合军用标准"],
          ],
        },
      ],
      groups: [
        { title: G.zh.features, items: [
          "MIL-STD 461·DO-160官方认证",
          "吸收频段 80 MHz ~ 40 GHz",
          "适用于大型和重型被测设备的高性能解决方案",
          "根据客户需求量身定制",
        ] },
        { title: G.zh.absorbers, items: [
          "Frankosorb® 短金字塔吸收衬里",
          "高性能纳米薄膜技术，长期稳定性经过验证",
          "EN 13501-1 A2 级 - s1 d0 不易燃等级",
          "EN 13501-1 B级阻燃等级（替代规格）",
        ] },
        { title: G.zh.performance, items: [
          "MIL-STD 461·DO-160标准发射（EMI）和抗扰度（EMS）官方认证，30 MHz / 80 MHz ~ 40 GHz",
          "法向入射吸收率 — 80 MHz 至 250 MHz 6 dB（标准要求水平）",
          "法向入射吸收率 — 250 MHz 以上 10 dB（标准要求水平）",
        ] },
      ],
    },

    "mil-std-chamber-advanced": {
      lead: [
        "MIL-STD高级测试室是一种军用测试室，可根据MIL-STD 461进行大型被测设备测试，并满足商业或汽车测试场所的要求。",
        "Frankonia独特的Frankosorb®长金字塔或混合吸波材料技术满足MIL-STD 461要求、CISPR 16-1-4·ANSI C63.4商业要求以及在一个室中进行车辆和汽车部件测试。",
      ],
      figure: {
        src: "/chambers/models/mil-std-chamber-advanced-3.webp", w: 1478, h: 1108,
        alt: "一辆两层的旅游巴士停在一个大电波暗室内。墙壁和天花板上布满了金字塔形吸波体，右侧竖立着大型对数周期天线，地板上画着黄色标记线。",
        caption: "一辆旅游巴士停在按照军事标准建造的暗室内。这就是共同满足商业测试场地要求的意义。",
      },
      overview: [
        { label: "军标", value: "MIL-STD 461 · DO-160" },
        { label: "商业标准", value: "CISPR 16-1-4" },
        { label: "测量距离", value: "1.0m·最大10.0m" },
        { label: "Quiet Zone", value: "例) ø6.0 m" },
        { label: "频率范围", value: "26 MHz – 40 GHz" },
        { label: "负载", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "配置",
          note: "尺寸根据被测设备的类型和尺寸确定。 MIL-STD 461 的测量距离为 1.0 m，商业应用可达 10.0 m。",
          head: ["配置", "外形尺寸（长×宽×高）", "频率范围及衬里"],
          rows: [
            ["MIL-STD Advanced Pyramid", "定制", "9kHz/26MHz~40GHz\n长金字塔吸振器、军事、工业和汽车支撑"],
            ["MIL-STD Advanced Hybrid", "定制", "9kHz/30MHz~40GHz\n混合减震器衬里、军事、工业和汽车支撑"],
          ],
        },
      ],
      standards: standardsPair(
        "zh",
        ["MIL-STD 461", "DO-160", "CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32"],
        ["MIL-STD 461 RS101 · RS102 · RS103", "DO-160", "IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "ECE R10"],
      ),
      groups: [
        { title: G.zh.features, items: [
          "MIL-STD 461·DO-160官方认证",
          "商业和汽车标准发射和抗扰度官方认证",
          "吸收频段 30 MHz 至 40 GHz",
          "针对大型和重型被测设备的高性能解决方案",
          "根据客户需求量身定制",
        ] },
        { title: G.zh.absorbers, items: [
          "Frankosorb® 长金字塔或混合吸收衬里",
          "高性能纳米薄膜技术，长期稳定性经过验证",
          "EN 13501-1 A2 级 - s1 d0 不易燃等级",
          "EN 13501-1 B级阻燃等级（替代规格）",
        ] },
        { title: "性能与认证-军用", items: [
          "MIL-STD 461·DO-160标准发射（EMI）和抗扰度（EMS）官方认证，30 MHz / 80 MHz ~ 40 GHz",
          "法向入射吸收率 — 80 MHz 至 250 MHz 6 dB（标准要求水平）",
          "法向入射吸收率 — 250 MHz 以上 10 dB（标准要求水平）",
        ] },
        { title: "性能和认证-商业", items: sacPerformanceKo("26") },
      ],
    },

    rvc: {
      lead: [
        "RVC混响室是基于Frankonia的模块化结构体系设计的。预制的高质量屏蔽板 (>8 MS/m) 确保灵活性和性能。",
        "屏蔽板可以倒置安装，使平坦表面向内，或者可以使用从内部紧固的常规PAN方法来安装。后者留下了未来的修改空间，例如吸波材料衬里。",
      ],
      close:
        "Frankonia 提供多种搅拌器设计和概念，甚至可以反映客户的搅拌器设计并将其实施到新的 RVC 或改造现有的室中。",
      figure: {
        src: "/chambers/models/reverberation-solutions-0.webp", w: 1600, h: 1067,
        alt: "混响室内。墙壁和天花板是金属屏蔽板，没有吸波材料。天花板上的大搅拌器在旋转，所以画面很模糊，地板上的转盘上停着一辆蓝色的汽车。",
        caption: "这个暗室的原理是没有吸波器。搅拌器不是消除反射，而是搅动场以使其均匀。",
      },
      overview: [
        { label: "适用标准", value: "IEC/EN 61000-4-21" },
        { label: "汽车规格", value: "ISO 11452-11 · 11451-5" },
        { label: "最低使用频率", value: "80 – 200 MHz" },
        { label: "最大工作量", value: "8.0 × 5.0 × 3.0 m" },
        { label: "频率范围", value: "10 kHz – 18 GHz" },
        { label: "型号", value: "RVC S – XXL · e1 · e2", family: true },
      ],
      tables: [
        {
          title: "Commercial & Industrial RVC",
          note: "频率范围 10 kHz 至 18 GHz，40 GHz 可选。工作容积至墙壁的距离不小于400毫米（λ/4）。",
          head: ["型号", "外形尺寸（长×宽×高）", "工作体积、LUF、搅拌器、目标"],
          rows: [
            ["RVC e1", "7,580 × 5,630 × 4,200 mm", "3.3×3.5×2.6m·LUF 200MHz\n1 个 Z 形折叠搅拌器（垂直）\n中小型ISM及多媒体产品"],
            ["RVC e2", "11,280 × 7,280 × 4,950 mm", "5.5×4.0×2.6m·LUF 80MHz\n2 个 Z 形折叠搅拌器（垂直、水平）\n大型 ISM 和多媒体产品"],
          ],
        },
        {
          title: "Automotive RVC",
          note: "频率范围10kHz至18GHz，40GHz可选。 L·XL·XXL 为定制尺寸。",
          head: ["型号", "外形尺寸（长×宽×高）", "工作体积、LUF、搅拌器、目标"],
          rows: [
            ["RVC S", "5,330 × 3,380 × 3,300 mm", "2.5×1.0×1.5m·LUF 200MHz\n1 个 Z 形折叠搅拌器（垂直）\n军工及汽车零部件"],
            ["RVC M", "7,580 × 5,630 × 4,200 mm", "3.3×3.5×2.6m·LUF 200MHz\n1 个 Z 形折叠搅拌器（垂直）\n大型军工、汽车零部件"],
            ["RVC L", "13,880 × 11,480 × 6,300 毫米（定制）", "8.0×5.0×3.0m·LUF 80MHz\n2 个 Z 形折叠搅拌器（垂直、水平）\n车辆"],
            ["RVC XL", "15,530 × 11,480 × 6,600 毫米（定制）", "8.0×5.0×3.0m·LUF 80MHz\n1 个大型圆盘搅拌器 ø9.0 m，2 个圆盘搅拌器 ø4.0 m\n车辆"],
            ["RVC XXL", "17,480 × 13,580 × 6,600 毫米（定制）", "8.0×5.0×3.0m·LUF 80MHz\n1 个大型圆盘搅拌器 ø12.0 m，2 个圆盘搅拌器 ø4.0 m\n大型车辆"],
          ],
        },
      ],
      groups: [
        { title: "特点和认证", items: [
          "使用 Frankosorb® 混合吸波材料和传统 PAN 屏蔽改造 RVC，或将现有 EMC 室转换为 RVC",
          "从小产品到车辆的高性价比、高性能解决方案",
          "IEC/EN 61000-4-21·ISO 11452-11标准抗扰度认证",
          "基于 ISO 11451-5（高速标准）的抗扰/发射认证",
          "符合机械指令 (2006/42/EC) 的安全集成",
        ] },
        { title: "Frankonia搅拌器", items: [
          "通用Z型折叠搅拌器——例如ø1.88 m 时高达 30 RPM",
          "高性能 Z 形折叠搅拌器 — 例如ø2.8 m 时高达 60 RPM",
          "盘式搅拌器——例如ø4.0 m 时高达 120 RPM",
          "管式搅拌器——例如ø2.0 m 时高达 240 RPM",
          "大型圆盘搅拌器 — 例如ø12.0 m 时最高 10 RPM",
        ] },
      ],
    },

    "shielded-room": {
      lead: [
        "Frankonia的屏蔽室和电波暗室是基于模块化结构系统设计的。预制的高品质屏蔽板提供多种尺寸选择，所有 PAN 型模块均可通过标准建筑门引入。",
        "标准模块安装有导电网垫片，然后从内部以75毫米的间隔用螺栓固定。因此，它可以靠近母楼墙壁安装，并且以较短的紧固间隔和规定的扭矩拧紧螺栓，可以长时间保持屏蔽性能。",
      ],
      figure: {
        src: "/chambers/models/shielded-room-7.webp", w: 1600, h: 1067,
        alt: "从工厂大厅看屏蔽室正面。两扇巨大的红框屏蔽门并排挂在灰色屏蔽面板墙上，上面贴着警告标签。管道和电缆桥架穿过顶部。",
        caption: "屏蔽不仅仅是墙壁的问题。仅当门、通风口和过滤器的性能与墙壁相同时，该数字才有效。",
      },
      overview: [
        { label: "尺寸", value: "无限制" },
        { label: "屏蔽标准", value: "EN 50147-1 · IEEE-299" },
        { label: "最大屏蔽量", value: "120 dB" },
        { label: "频率范围", value: "10 kHz – 40 GHz" },
        { label: "面板", value: "2.0mm镀锌钢板" },
        { label: "负载", value: "无限制" },
      ],
      tables: [
        {
          title: "保证屏蔽性能",
          note: "基于 EN 50147-1 或 IEEE-299（可选）。穿透件、蜂窝、门、闸门、过滤器都具有相同的性能。",
          head: ["频率", "屏蔽量", "电磁场"],
          rows: [
            ["10 kHz", "90 dB", "磁场"],
            ["100 kHz", "100 dB", "磁场"],
            ["1 MHz", "110 dB", "磁场"],
            ["100 MHz", "120 dB", "平面波"],
            ["400 MHz", "120 dB", "平面波"],
            ["1 GHz", "110 dB", "平面波"],
            ["18 GHz", "100 dB", "微波炉"],
            ["40 GHz", "100 dB", "微波炉"],
          ],
        },
      ],
      groups: [
        { title: G.zh.features, items: [
          "2.0mm厚镀锌钢板PAN型屏蔽模块",
          "模块化预制标准",
          "针对抗震条件量身定制的自承式结构或钢结构",
          "从内部拧紧方法",
          "可反向安装（平面内）",
          "可用于墙壁和天花板的室内装饰",
          "凸底系统或焊接底部系统",
          "持久的屏蔽衰减特性",
          "不粘连、不焊接",
          "可无损拆卸——易于改造和维护",
          "可以随时进行完整的先前或后续修改",
          "可实现任意尺寸的屏蔽",
          "符合ISO 354标准的吸音板吸音系数w=0.65（MH）",
          "Frankosorb®吸波器结构优化",
          "交钥匙解决方案",
        ] },
      ],
    },
  },

  en: {
    "sac-3-plus": {
      lead: [
        "The SAC-3 Plus is Frankonia's most versatile full compliant EMC testing solution at 3.0 m measuring distance with a Quiet Zone (QZ) up to ø2.0 m. It is adapted for full compliant emission and immunity testing.",
        "The innovatively shaped roof, called dome design, with its optimized Frankosorb® absorber layout leads to minimized reflections and offers outstanding performance for NSA, SVSWR and FU.",
      ],
      close:
        "Since its introduction, the SAC-3 Plus has been the undisputed most selected chamber in its class. Through the innovative concept, customization and the excellent performance, it represents an efficient and economical solution that fully satisfies our customers.",
      figure: {
        src: "/chambers/models/sac-3-plus-1.webp", w: 1600, h: 1067,
        alt: "Inside a dome-design semi-anechoic chamber. Pyramid absorbers cover both side walls, the dark ferrite ceiling arches over the room between two lights, and the grey reflecting floor carries yellow markings around the test area.",
        caption: "The dome is not a styling choice: the curved roof is what carries the absorber layout that keeps reflections out of the quiet zone.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m" },
        { label: "Quiet zone", value: "up to ø2.0 m" },
        { label: "Frequency range", value: "30 MHz – 18 GHz" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H1000 and H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-3 Plus S", "8,480 × 6,530 × 6,000 mm", "ø1.2 m\nat 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus M", "8,780 × 6,530 × 6,000 mm", "ø1.5 m\nat 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus L", "9,230 × 6,530 × 6,000 mm", "ø2.0 m\nat 3.0 m test distance (H = 2.0 m)"],
            ["SAC-3 Plus", "9,680 × 6,530 × 6,000 mm", "ø2.0 m\nat 3.0 m test distance (H = 2.0 m)"],
          ],
        },
      ],
      standards: standardsPair("en", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.en.features, items: [
          "Cost-effective high-performance solution for a 3.0 m measuring distance and QZ from ø1.2 m of up to ø2.0 m",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4 (ETSI upgradeable)",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Adapted lightweight steel structure and optimized RF-shielding",
          "Innovative dome-shaped roof design",
          "Upgradeable for E-Drive (load machine, BlueBox, battery test system)",
          "Outstanding performance with long-lasting Frankosorb® hybrid absorbers",
          "Usable for automotive and military standard tests",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H1000 and H600") },
        { title: G.en.performance, items: sacPerformanceEn() },
      ],
    },

    "sac-5-plus": {
      lead: [
        "The SAC-5 Plus is Frankonia's full compliant EMC testing solution at 3.0 m and 5.0 m measuring distance with a Quiet Zone (QZ) up to ø3.0 m.",
        "It offers an innovative concept with its dome shaped roof, customization and performance, and therefore represents an efficient and economical solution that fully satisfies our customers.",
      ],
      close:
        "Following the success of the SAC-3 Plus, the SAC-5 Plus with its 5.0 m test distance is based on the same innovative dome-shape concept.",
      figure: {
        src: "/chambers/models/sac-5-plus-1.webp", w: 1600, h: 1067,
        alt: "A dome-design semi-anechoic chamber seen head on. The end wall and ceiling are fully lined with pyramid absorbers and a dark ferrite arch crosses the roof. A trolley of white floor absorbers stands at each side wall, and a turntable circle and a red laser line mark the floor.",
        caption: "The floor absorbers wait on trolleys at the wall — for when the same room is used for immunity.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m · 5.0 m" },
        { label: "Quiet zone", value: "ø2.0 m or ø3.0 m" },
        { label: "Frequency range", value: "30 MHz – 18 GHz" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H1000 and H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-5 Plus", "12,680 × 7,730 × 6,300 mm", "ø2.0 m\nat 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Plus L", "12,680 × 8,180 × 6,300 mm", "ø3.0 m\nat 3.0 m and 5.0 m test distance (H = 2.5 m)"],
          ],
        },
      ],
      standards: standardsPair("en", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.en.features, items: [
          "Efficient high-performance solution for a 3.0 m and 5.0 m measuring distance and QZ from ø2.0 m of up to ø3.0 m",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4 (ETSI upgradeable)",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Adapted lightweight steel structure and optimized RF-shielding",
          "Innovative dome-shaped roof design",
          "Upgradeable for E-Drive (load machine, BlueBox, battery test system)",
          "Outstanding performance with long-lasting Frankosorb® absorbers",
          "Usable for automotive and military standard tests",
          "Turnkey solution",
          "Double test axis option",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H1000 and H600") },
        { title: G.en.performance, items: sacPerformanceEn() },
      ],
    },

    "sac-3-square": {
      lead: [
        "The SAC-3 Square is Frankonia's versatile full compliant EMC testing solution at 3.0 m measuring distance.",
        "The SAC-3 and the SAC-5 in square design offer an innovative concept with its usability, customization and performance, and therefore represent efficient and economical solutions.",
      ],
      figure: {
        src: "/chambers/models/sac-3-square-1.webp", w: 1600, h: 1067,
        alt: "Inside a square-design semi-anechoic chamber. Walls and ceiling are lined with pyramid absorbers, a row of floor absorbers stands across the near part of the floor, and a white structure stands against the left wall. Yellow markings run along the reflecting floor.",
        caption: "The traditional square shell. A flat roof is what leaves room for a large turntable or a mobile dynamometer.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m" },
        { label: "Quiet zone", value: "up to ø3.0 m" },
        { label: "Frequency range", value: "30 MHz – 18 GHz" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H450 or H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-3 Square", "9,680 × 6,530 × 6,000 mm", "ø2.0 m\nat 3.0 m test distance (H = 2.5 m)"],
            ["SAC-3 Square L", "10,880 × 6,980 × 6,000 mm", "ø3.0 m\nat 3.0 m test distance (H = 2.5 m)"],
          ],
        },
      ],
      standards: standardsPair("en", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.en.features, items: [
          "Traditional square design",
          "High-performance solution for 3.0 m or 5.0 m measuring distance",
          "QZ from ø2.0 m up to ø4.0 m",
          "Large turntable or mobile dynamometer integration",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4 (ETSI upgradeable)",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Immunity floor absorber storage in the chamber on trolley's",
          "Upgradeable for E-Drive (load machine, BlueBox, battery test system)",
          "Outstanding performance with long-lasting Frankosorb® absorbers",
          "Usable for automotive and military standard tests",
          "Turnkey solution",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: sacPerformanceEn() },
      ],
    },

    "sac-5-square": {
      lead: [
        "The SAC-5 Square offers a 3.0 m and a 5.0 m measuring distance, with a Quiet Zone (QZ) of ø2.0 m, ø3.0 m or ø4.0 m.",
        "The SAC-3 and the SAC-5 in square design offer an innovative concept with its usability, customization and performance, and therefore represent efficient and economical solutions.",
      ],
      figure: {
        src: "/chambers/models/sac-5-square-1.webp", w: 1600, h: 1067,
        alt: "Inside a square-design semi-anechoic chamber. Walls and ceiling are lined with pyramid absorbers and a white antenna mast stands floor to ceiling at the right. Yellow markings and a blue cable lie on the reflecting floor.",
        caption: "The antenna mast at the 5.0 m position. The same room is also used at 3.0 m.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m · 5.0 m" },
        { label: "Quiet zone", value: "up to ø4.0 m" },
        { label: "Frequency range", value: "30 MHz – 18 GHz" },
        { label: "Load capacity", value: "10,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H450 or H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-5 Square", "12,680 × 7,730 × 6,000 mm", "ø2.0 m\nat 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Square L", "12,680 × 8,180 × 6,000 mm", "ø3.0 m\nat 3.0 m and 5.0 m test distance (H = 2.5 m)"],
            ["SAC-5 Square XL", "13,280 × 9,380 × 6,300 mm", "ø4.0 m at 5.0 m · ø3.0 m at 3.0 m\nboth H = 2.5 m · ready for a larger turntable or mobile dynamometer"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461"],
      ),
      groups: [
        { title: G.en.features, items: [
          "Traditional square design",
          "High-performance solution for 3.0 m or 5.0 m measuring distance",
          "QZ from ø2.0 m up to ø4.0 m",
          "Large turntable or mobile dynamometer integration",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4 (ETSI upgradeable)",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Immunity floor absorber storage in the chamber on trolley's",
          "Upgradeable for E-Drive (load machine, BlueBox, battery test system)",
          "Outstanding performance with long-lasting Frankosorb® absorbers",
          "Usable for automotive and military standard tests",
          "Turnkey solution",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: sacPerformanceEn() },
      ],
    },

    "sac-10-plus": {
      lead: [
        "The SAC-10 Plus is a single test axis chamber with a Quiet Zone (QZ) of ø3.0 m at 10.0 m measuring distance. The innovative polygonal shape along with its optimized Frankosorb® absorber layout is a space-saving, cost-saving and efficient solution.",
        "It is Frankonia's most compact 10.0 m chamber available to meet the CISPR 16-1-4 and ANSI C63.4 test site requirements.",
      ],
      figure: {
        src: "/chambers/models/sac-10-plus-1.webp", w: 1600, h: 1067,
        alt: "Inside a 10.0 m semi-anechoic chamber. Walls and ceiling are lined with pyramid absorbers and a white antenna mast with a red head unit stands in the middle of the grey reflecting floor.",
        caption: "One test axis. Not adding the others is what makes the shell smaller — this is where the Triton parts company.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 · 5.0 · 10.0 m" },
        { label: "Quiet zone", value: "ø3.0 m" },
        { label: "Frequency range", value: "30 MHz – 18 GHz" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H450 or H600. Turntable ø3.0 m or ø4.0 m.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-10 Plus", "19,205 × 12,080 × 8,325 mm", "ø3.0 m\nat 10.0 m test distance (H = 3.0 m) · single test axis"],
          ],
        },
      ],
      standards: standardsPair("en", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.en.features, items: [
          "10.0 m, 5.0 m and 3.0 m test distance with a Quiet Zone of ø3.0 m",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Space-saving and compact chamber design with polygonal shape",
          "Reproducibility and stable performance",
          "Ingenious lining with long-lasting Frankosorb® non-combustible absorbers",
          "Cost-saving and future-proof investment",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: sacPerformanceEn() },
      ],
    },

    "sac-10-plus-triton": {
      lead: [
        "The SAC-10 Plus Triton is Frankonia's full compliant state-of-the-art EMC testing solution with multiple test axes — 1× 10.0 m and 2× 3.0 m measuring distances with a Quiet Zone (QZ) of ø3.0 m.",
        "The innovative polygonal shape along with its optimized Frankosorb® absorber layout is a space-saving, cost-saving and efficient solution with multiple test axes.",
      ],
      close:
        "The SAC-10 Plus Triton is the most compact and lightweight 10.0 m chamber existing. It is full compliant for emission tests validated according to CISPR 16-1-4 and ANSI C63.4, as well as full compliant for immunity tests according to IEC/EN 61000-4-3, CISPR 25 and MIL-STD 461.",
      figure: {
        src: "/chambers/models/triton-2.webp", w: 1600, h: 1067,
        alt: "Inside a polygonal 10.0 m semi-anechoic chamber. The walls turn at angles and are lined with pyramid absorbers. Several panels of white floor absorbers stand upright at the near side, and a large turntable circle with yellow markings is set into the floor.",
        caption: "The floor absorbers stand in defined parking positions. Not re-rigging the antennas and absorbers between axes is the time this chamber saves.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 · 5.0 · 10.0 m" },
        { label: "Quiet zone", value: "ø3.0 m" },
        { label: "Test axes", value: "Three" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H450 or H600. Turntable ø3.0 m or ø4.0 m.",
          head: ["Configuration", "External dimension (L × W × H)", "Test axes"],
          rows: [
            ["SAC-10 Plus Triton", "19,205 × 12,080 × 8,325 mm", "Quiet zone ø3.0 m (H = 3.0 m)\nAxis 1 — 10.0 m (EMI and EMS)\nAxis 2 — 3.0 m (EMI and EMS)\nAxis 3 — 3.0 m (EMS)"],
            ["SAC-10 Plus", "19,205 × 12,080 × 8,325 mm", "Quiet zone ø3.0 m (H = 3.0 m)\n10.0 m test distance, single axis"],
          ],
        },
      ],
      standards: standardsPair("en", sacProductEmission, sacProductImmunity),
      groups: [
        { title: G.en.features, items: [
          "Multiple test axes chamber with a Quiet Zone of ø3.0 m",
          "1× 10.0 m test distance and 2× 3.0 m test distance in one solution",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4",
          "Full compliant acc. to CISPR 25 and MIL-STD 461",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Space-saving and compact chamber design with polygonal shape",
          "Floor absorbers and antennas remain connected in the chamber",
          "Reproducibility and stable performance",
          "Time-saving test setup with improved workflow and efficiency",
          "Ingenious lining with long-lasting Frankosorb® non-combustible absorbers",
          "Cost-saving and future-proof investment",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: sacPerformanceEn() },
      ],
    },

    "sac-10-h-hybrid": {
      lead: [
        "The SAC-10/H is Frankonia's full compliant and customizable EMC testing solution at 10.0 m measuring distance with a Quiet Zone (QZ) of ø3.0 m up to ø6.0 m and hybrid absorber layout.",
        "Due to the high grade of customization reflecting the demands of our customers, this semi anechoic chamber is adaptable in size and offers several configuration possibilities. The Frankosorb® hybrid absorber layout achieves exceptional performance for emission measurements and immunity testing.",
      ],
      figure: {
        src: "/chambers/models/sac-10-h-hybrid-1.webp", w: 1600, h: 1067,
        alt: "Inside a 10.0 m semi-anechoic chamber. The lower walls are a grid of ferrite tiles; above them and across the ceiling the lining is white pyramid absorber. Yellow markings run around the test area on the grey reflecting floor.",
        caption: "The hybrid lining is these two layers — ferrite below, absorber above. Splitting them is what keeps the shell small.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "up to 10.0 m" },
        { label: "Quiet zone", value: "ø3.0 – ø6.0 m" },
        { label: "Lining", value: "Hybrid" },
        { label: "Load capacity", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H1000, H600 and H1300 Turbine absorbers.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-10-3/H", "18,380 × 12,830 × 8,550 mm", "ø3.0 m\nat 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-4/H", "19,280 × 13,280 × 8,550 mm", "ø4.0 m\nat 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-5/H", "21,080 × 15,080 × 8,700 mm", "ø5.0 m\nat 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-6/H", "21,680 × 15,680 × 8,700 mm", "ø6.0 m\nat 10.0 m test distance (H = 3.0 m)"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461 RS101, RS102, RS103"],
      ),
      groups: [
        { title: G.en.features, items: [
          "Optimized lining with long-lasting and non-combustible Frankosorb® hybrid absorbers (Frankonia technology)",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Full compliant with military and automotive standards",
          "Highly customizable solution for any kind of EMC testing and limitless integration of individual applications; as single or double test axis option",
          "Notably adjustable anechoic chamber size, characteristics and configuration due to different EUT requirements",
          "Specialized for 'out-of-the-range' EMC test environments",
          "Turnkey solutions",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H1000, H600 and H1300 Turbine absorbers") },
        { title: G.en.performance, items: sacPerformanceEn("26") },
      ],
    },

    "sac-10-p-pyramid": {
      lead: [
        "The SAC-10/P is Frankonia's full compliant and customizable EMC testing solution at 10.0 m measuring distance with a Quiet Zone (QZ) of ø3.0 m up to ø6.0 m and the unique Frankonia long-pyramid absorber layout.",
        "Due to the high grade of customization reflecting the demands of our customers, this semi-anechoic chamber is adaptable in size and offers several configuration possibilities.",
      ],
      close:
        "The innovative long-pyramid absorber technology achieves exceptional performance for emissions and immunity testing and offers the highest homogeneity and impedance accuracy for the complete frequency range.",
      figure: {
        src: "/chambers/models/sac-10-p-pyramid-2.webp", w: 1024, h: 500,
        alt: "A wide view inside a 10.0 m semi-anechoic chamber. Walls and ceiling are lined entirely with long pyramid absorbers, with no ferrite tile section. The arc of a turntable is visible in the reflecting floor.",
        caption: "No ferrite. That one P2400 long pyramid covers 26 MHz to 40 GHz on its own is the whole argument for this lining.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "up to 10.0 m" },
        { label: "Quiet zone", value: "ø3.0 – ø6.0 m" },
        { label: "Lining", value: "P2400 long pyramid" },
        { label: "Load capacity", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. The 3/P and the 4/P carry the same dimensions in the catalogue and differ only in quiet zone; the figures are printed as found.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-10-3/P", "21,680 × 13,730 × 8,550 mm", "ø3.0 m\nat 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-4/P", "21,680 × 13,730 × 8,550 mm", "ø4.0 m\nat 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-5/P", "23,480 × 16,580 × 9,000 mm", "ø5.0 m\nat 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10-6/P", "24,980 × 17,180 × 9,000 mm", "ø6.0 m\nat 10.0 m test distance (H = 3.0 m)"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461 RS101, RS102, RS103"],
      ),
      groups: [
        { title: G.en.features, items: [
          "Full lining with long-lasting and non-combustible Frankosorb® long-pyramid absorbers (Frankonia technology)",
          "Cost-efficient alternative to hybrid absorber lining without any limitations",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Full compliant with military and automotive standards",
          "Highly customizable solution for any kind of EMC testing and limitless integration of individual applications; as single or double test axis option",
          "Notably adjustable anechoic chamber size, characteristics and configuration due to different EUT requirements",
          "Specialized for 'out-of-the-range' EMC test environments",
          "Floor absorbers storage below the pyramids",
          "Turnkey solutions",
        ] },
        { title: G.en.absorbers, items: [
          "Frankosorb® long-pyramid absorber lining with P2400",
          "High-performance nano thin-film technology with proven long-term stability",
          "Non-combustible acc. to EN 13501-1 class A2 - s1 d0",
          "Hardly inflammable acc. to EN 13501-1 class B (alternative)",
        ] },
        { title: G.en.performance, items: sacPerformanceEn("26") },
      ],
    },

    "fac-3": {
      lead: [
        "The FAC-3 is Frankonia's compact fully anechoic chamber at 3.0 m measuring distance for EMC tests on table-top positioned EUT's with a Quiet Zone (QZ) of ø1.5 m (H = 1.5 m).",
        "It is designed for measurements under free-space conditions based on CISPR 16-1-4 as a test site without ground plane. Without the reflections from the floor, a height scan is no longer necessary.",
      ],
      figure: {
        src: "/chambers/models/fac-3-2.webp", w: 1600, h: 1067,
        alt: "Inside a fully anechoic chamber. Pyramid absorbers cover the walls, the ceiling and the floor; the end wall is dark ferrite. A red horn antenna stands on a tripod in front of it, with a white gridded test table in the foreground.",
        caption: "The floor is lined too. Having no reflecting surface is what separates this from a semi-anechoic chamber — and why the height scan disappears.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m" },
        { label: "Quiet zone", value: "ø1.5 m (H = 1.5 m)" },
        { label: "Turntable", value: "ø1.5 m" },
        { label: "Load capacity", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H1000 and H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["FAC-3", "8,705 × 4,655 × 3,750 mm", "ø1.5 m\nat 3.0 m test distance (H = 1.5 m) · table-top products"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["e.g., CISPR 14", "ETSI"],
        ["IEC/EN 61000-4-3"],
        { e: ["CISPR 16-1-4", "IEC/EN 61000-4-22"], i: ["IEC/EN 61000-4-3", "IEC/EN 61000-4-22"] },
      ),
      groups: [
        { title: G.en.features, items: [
          "Test site for table-top EUT's",
          "Full compliant EMI acc. to CISPR 16-1-4, IEC/EN 61000-4-22, and ETSI",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Cost-effective solution for free-space measurements",
          "Compact chamber design with advanced Frankosorb® absorber lining",
          "Double test axis option",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H1000 and H600") },
        { title: G.en.performance, items: [
          "Full compliant emission (EMI) according to CISPR 16-1-4",
          "Deviation FS NSA ±3.5 dB (30 MHz to 1 GHz)",
          "Deviation SVSWR +5.5 dB (1 GHz to 18 GHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3",
          "Deviation FU 0/+6 dB at 75 % of 16 measuring points (30/80 MHz to 18 GHz)",
          "Full compliant immunity (EMS) and emission (EMI) according to IEC/EN 61000-4-22 — Deviation SdB c ≤ 1.8 dB",
        ] },
      ],
    },

    "fac-3-l": {
      lead: [
        "The FAC-3 L is the extended version of Frankonia's fully anechoic chamber at 3.0 m measuring distance with a Quiet Zone (QZ) of ø1.5 m (H = 2.0 m), for EMC tests on table-top positioned as well as on floor-standing EUT's.",
        "It is designed for measurements under free-space conditions based on CISPR 16-1-4 as a test site without ground plane, and offers in addition a height scan possibility using a FAM or FBM antenna mast.",
      ],
      figure: {
        src: "/chambers/models/fac-3-l-2.webp", w: 1600, h: 1067,
        alt: "Inside a fully anechoic chamber. Walls, ceiling and floor are all lined with white pyramid absorbers, and a white antenna mast with red fittings stands in the middle. A grey grid structure lies on the floor in the foreground.",
        caption: "A fully anechoic chamber with a mast. Being able to scan in height without a reflecting floor is what the L configuration adds.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m" },
        { label: "Quiet zone", value: "ø1.5 m (H = 2.0 m)" },
        { label: "Turntable", value: "ø1.5 m" },
        { label: "Load capacity", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H1000 and H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["FAC-3 L", "9,380 × 5,780 × 6,000 mm", "ø1.5 m\nat 3.0 m test distance (H = 2.0 m) · floor-standing and table-top products, with height scan"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["CISPR 14", "CISPR 15", "CISPR 32", "ETSI"],
        ["IEC/EN 61000-4-3"],
        { e: ["CISPR 16-1-4", "IEC/EN 61000-4-22"], i: ["IEC/EN 61000-4-3", "IEC/EN 61000-4-22"] },
      ),
      groups: [
        { title: G.en.features, items: [
          "Test site for table-top and floor-standing EUT's (with height scan)",
          "Full compliant EMI acc. to CISPR 16-1-4, IEC/EN 61000-4-22, and ETSI",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Cost-effective solution for free-space measurements",
          "Compact chamber design with advanced Frankosorb® absorber lining",
          "Double test axis option",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H1000 and H600") },
        { title: G.en.performance, items: [
          "Full compliant emission (EMI) according to CISPR 16-1-4",
          "Deviation FS NSA ±3.5 dB (30 MHz to 1 GHz)",
          "Deviation SVSWR +5.5 dB (1 GHz to 18 GHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3",
          "Deviation FU 0/+6 dB at 75 % of 16 measuring points (30/80 MHz to 18 GHz)",
          "Full compliant immunity (EMS) and emission (EMI) according to IEC/EN 61000-4-22 — Deviation SdB c ≤ 1.8 dB",
        ] },
      ],
    },

    "sac-3-fac-3-transformer": {
      lead: [
        "Frankonia's SAC-3/FAC-3 Transformer is a full compliant EMC solution at 3.0 m measuring distance offering semi as well as fully conditions.",
        "This special solution focuses on conditions with ground plane, as well as FAR conditions for table-top EUT tests with an optimized floor absorber modification kit. The SAC-3/FAC-3 Transformer is adapted to full compliant emission and immunity testing with a traditional square design.",
      ],
      figure: {
        src: "/chambers/models/sac-3-fac-3-transformer-1.webp", w: 1600, h: 1067,
        alt: "A chamber seen head on. The end wall is a grid of square ferrite tiles; the side walls and ceiling are white pyramid absorber. The floor is a bare reflecting ground plane.",
        caption: "Here the ground plane is exposed — the semi-anechoic setup. Lay the floor absorbers and the same room becomes a free-space test site.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m" },
        { label: "Quiet zone", value: "ø2.0 m / ø1.5 m" },
        { label: "Frequency range", value: "30 MHz – 18 GHz" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H1000 and H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone"],
          rows: [
            ["SAC-3 / FAC-3 Transformer", "9,680 × 6,530 × 6,000 mm", "SAC setup — ø2.0 m at 3.0 m test distance (H = 2.5 m)\nFAC setup — ø1.5 m at 3.0 m test distance (H = 1.5 m)"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        sacProductEmission,
        sacProductImmunity,
        { e: ["CISPR 16-1-4", "and/or ANSI C63.4", "IEC/EN 61000-4-22"], i: ["IEC/EN 61000-4-3", "IEC/EN 61000-4-22"] },
      ),
      groups: [
        { title: G.en.features, items: [
          "Cost-effective and high-performance solution for a 3.0 m test distance",
          "SAC setup: QZ of ø2.0 m for floor standing products",
          "FAC setup: QZ of ø1.5 m for table-top products",
          "Full compliant EMI acc. to CISPR 16-1-4, ANSI C63.4, IEC/EN 61000-4-22, ETSI",
          "Full compliant acc. to CISPR 25 and MIL-STD 461",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Upgradeable for E-Drive (load machine, BlueBox, battery test system)",
          "Compact chamber design with advanced absorber lining",
          "Outstanding performance with long-lasting Frankosorb® absorbers",
          "Usable for automotive and military standard tests",
          "Turnkey solution",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H1000 and H600") },
        { title: "Performance & Compliance – SAC (semi) configuration", items: sacPerformanceEn() },
        { title: "Performance & Compliance – FAC (fully) configuration", items: [
          "Full compliant emission (EMI) according to CISPR 16-1-4",
          "Deviation FS NSA ±3.5 dB (30 MHz to 1 GHz)",
          "Deviation SVSWR +5.5 dB (1 GHz to 18 GHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3",
          "Deviation FU 0/+6 dB at 75 % of 16 measuring points (30/80 MHz to 18 GHz)",
        ] },
      ],
    },

    chc: {
      lead: [
        "The CHC is Frankonia's compact hybrid chamber solution at 3.0 m measuring distance with a Quiet Zone (QZ) of ø1.2 m. It is an optimal solution for both pre-compliance emission tests and full compliant immunity tests at 3.0 m measuring distance.",
        "The extended version CHC L includes an absorber-lined partition wall that offers the feature to house and store RF power amplifiers, antennas, or floor absorbers inside the chamber.",
      ],
      figure: {
        src: "/chambers/models/chc-2.webp", w: 1600, h: 1067,
        alt: "Inside a compact hybrid chamber. The pyramid absorbers of the side walls and ceiling converge towards a dark ferrite end wall, where a red horn antenna sits on a yellow post. Floor absorbers lie in the foreground.",
        caption: "A 3.0 m distance fitted into this footprint. Pre-compliance for emission and full compliance for immunity is the trade that sets the size.",
      },
      overview: [
        { label: "Emission (EMI)", value: "Pre-compliant" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m" },
        { label: "Quiet zone", value: "ø1.2 m" },
        { label: "Frequency range", value: "30 MHz – 18 GHz" },
        { label: "Load capacity", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H450 or H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone and feature"],
          rows: [
            ["CHC", "7,355 × 3,755 × 3,300 mm", "ø1.2 m\nat 3.0 m test distance"],
            ["CHC L", "8,255 × 3,755 × 3,300 mm", "ø1.2 m\nat 3.0 m test distance · e.g., amplifier can be stored in the chamber"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["Pre-compliance from 30 MHz to 1 GHz"],
        ["IEC/EN 61000-4-3"],
        { e: ["CISPR 16-1-4"], i: ["IEC/EN 61000-4-3"] },
      ),
      groups: [
        { title: G.en.features, items: [
          "Pre-compliant EMI from 30 MHz to 1 GHz acc. to CISPR 16-1-4",
          "Full compliant and cost saving solution for EMS acc. to IEC/EN 61000-4-3",
          "Absorber-lined partition wall (CHC L) to house RF power amplifiers, antennas and floor absorbers inside the chamber",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: [
          "Pre-compliant emission (EMI) according to CISPR 16-1-4",
          "Deviation NSA ±4.0 dB (30 MHz to 1 GHz) with limited height scan",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3",
          "Deviation FU 0/+6 dB at 75 % of 16 measuring points (30/80 MHz to 18 GHz)",
        ] },
      ],
    },

    "chc-plus": {
      lead: [
        "The CHC Plus version is the advanced setup of the compact hybrid chamber, and allows compliant emission measurements from 1 GHz to 18 GHz.",
        "The 3.0 m measuring distance and the ø1.2 m Quiet Zone are those of the CHC. What changes is the emission measurement above 1 GHz.",
      ],
      figure: {
        src: "/chambers/models/chc-plus-2.webp", w: 1600, h: 1067,
        alt: "Inside a compact chamber. The cover of a turntable set into the floor stands open, showing the cable connector panel underneath, with yellow and black safety markings around it. The walls are lined with pyramid absorbers.",
        caption: "The cabling runs under the floor. The smaller the chamber, the more where the cables leave becomes a design question.",
      },
      overview: [
        { label: "Emission (EMI)", value: "Compliant above 1 GHz" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m" },
        { label: "Quiet zone", value: "ø1.2 m" },
        { label: "Turntable", value: "ø1.2 m / ø2.0 m" },
        { label: "Load capacity", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H450 or H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone and feature"],
          rows: [
            ["CHC Plus", "7,355 × 3,755 × 3,300 mm", "ø1.2 m\nat 3.0 m test distance · compliant emission >1 GHz"],
            ["CHC Plus L", "7,580 × 4,655 × 4,350 mm", "ø1.2 m\nat 3.0 m test distance · turntable ø2.0 m, compliant emission >1 GHz"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["Pre-compliant from 30 MHz to 1 GHz", "Full compliant from 1 GHz to 18 GHz"],
        ["IEC/EN 61000-4-3"],
        { e: ["CISPR 16-1-4"], i: ["IEC/EN 61000-4-3"] },
      ),
      groups: [
        { title: G.en.features, items: [
          "Pre-compliant EMI from 30 MHz to 1 GHz acc. to CISPR 16-1-4",
          "Compliant EMI from 1 GHz to 18/40 GHz",
          "Full compliant and cost saving solution for EMS acc. to IEC/EN 61000-4-3",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: [
          "Pre-compliant emission (EMI) according to CISPR 16-1-4",
          "Deviation NSA ±4.0 dB (30 MHz to 1 GHz) with limited height scan",
          "Compliant emission (EMI) according to CISPR 16-1-4",
          "Deviation SVSWR +6.0 dB (1 GHz to 18 GHz)",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3",
          "Deviation FU 0/+6 dB at 75 % of 16 measuring points (30/80 MHz to 18 GHz)",
        ] },
      ],
    },

    ctc: {
      lead: [
        "The CTC is Frankonia's full compliant component test chamber that entirely focuses on immunity testing for industrial products, paired with automotive component EMI and EMS, as well as military tests.",
        "It is full compliant to CISPR 25, ISO 11452, MIL-STD 461 and DO-160 at 1.0 m test distance, and to IEC/EN 61000-4-3 at a 3.0 m measuring distance.",
      ],
      figure: {
        src: "/chambers/models/ctc-1.webp", w: 1600, h: 1200,
        alt: "Inside a component test chamber. The end wall is a square grid of absorber, the side walls and ceiling are pyramid absorber, and a wooden test bench stands in the middle. Yellow setup lines are marked on the floor.",
        caption: "The wooden bench and the lines on the floor. What CISPR 25 prescribes is not only the chamber but this layout.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 25" },
        { label: "Immunity (EMS)", value: "ISO 11452" },
        { label: "Test distance", value: "1.0 m · 3.0 m" },
        { label: "Military", value: "MIL-STD 461 · DO-160" },
        { label: "Frequency range", value: "9 kHz – 18 GHz" },
        { label: "Load capacity", value: "2,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H450 or H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Test condition"],
          rows: [
            ["CTC", "8,480 × 5,485 × 3,750 mm", "Full compliant immunity testing per IEC 61000-4-3\nFull compliant to CISPR 25, ISO 11452, MIL-STD 461 and DO-160\nTable setup and floor standing"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["CISPR 25", "MIL-STD 461 / DO-160"],
        ["ISO 11452", "MIL-STD 461 / DO-160", "IEC/EN 61000-4-3"],
        { e: ["CISPR 25", "MIL-STD 461 / DO-160"], i: ["IEC/EN 61000-4-3"] },
      ),
      groups: [
        { title: G.en.features, items: [
          "Full compliant and cost saving solution for EMS acc. to IEC/EN 61000-4-3",
          "Full compliant with CISPR 25 and ISO 11452",
          "Full compliant with MIL-STD 461 and DO-160",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: [
          "Full compliant immunity (EMS) according to IEC 61000-4-3",
          "Full compliant automotive component testing according to CISPR 25 and ISO 11452",
          "Full compliant military and airborne testing according to MIL-STD 461 and DO-160",
        ] },
      ],
    },

    actc: {
      lead: [
        "The ACTC is Frankonia's automotive component testing chamber solution at 1.0 m measuring distance. This chamber solution is adapted to full compliant tests of automotive components according to CISPR 25 and ISO 11452.",
        "A permanent plug-in contact strip is installed between the absorbers to ensure the electrical connection of the test table to the shielding, and includes the test table as required by CISPR 25.",
      ],
      figure: {
        src: "/chambers/models/actc-1.webp", w: 1600, h: 1068,
        alt: "Inside an automotive component testing chamber. Walls and ceiling are lined with pyramid absorbers, a wooden test bench with a metal ground plane stands in the middle, and a red instrument case and a tripod stand at the left.",
        caption: "In component testing the layout is the standard, not just the chamber. The test table and its bond to the shielding are what CISPR 25 prescribes.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 25" },
        { label: "Immunity (EMS)", value: "ISO 11452" },
        { label: "Test distance", value: "1.0 m" },
        { label: "Setup", value: "Table setup" },
        { label: "Frequency range", value: "26 MHz – 18 GHz" },
        { label: "Load capacity", value: "10,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 150 kHz / 26 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite and H450.",
          head: ["Configuration", "External dimension (L × W × H)", "Test condition"],
          rows: [
            ["ACTC", "6,380 × 5,480 × 3,750 mm", "CISPR 25 component level\nat 1.0 m test distance"],
            ["ACTC L", "11,480 × 6,580 × 4,500 mm", "CISPR 25 component level and vehicle\nat 1.0 m test distance"],
          ],
        },
      ],
      standards: [
        {
          title: S.en.verification,
          columns: [
            { head: S.en.emission, items: ["CISPR 25"] },
            { head: S.en.immunity, items: ["ISO 11452"] },
          ],
        },
      ],
      groups: [
        { title: G.en.features, items: [
          "ACTC: Full compliant per CISPR 25 and ISO 11452 for components",
          "ACTC L: Full compliant per CISPR 25 and ISO 11452 for components and large enough for tests on vehicles",
          "Compact chamber solution for automotive component testing",
          "Upgradeable for E-Drive (load machine, BlueBox, battery test system)",
          "Advanced and optimized lining with long-lasting Frankosorb® hybrid absorbers",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite and H450") },
        { title: "Performance & Compliance – ACTC", items: [
          "Full compliant emission (EMI) according to CISPR 25",
          "Full compliant immunity (EMS) according to ISO 11452",
          "Compliant immunity (EMS) according to IEC/EN 61000-4-3",
          "Uniform field 0.5 × 0.5 m at 1.0 m measuring distance",
          "Deviation FU 0/+6 dB at 100 % (26/80 MHz to 18 GHz)",
        ] },
        { title: "Performance & Compliance – ACTC L", items: [
          "Full compliant emission (EMI) according to CISPR 25",
          "Full compliant immunity (EMS) according to ISO 11452",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3",
          "Uniform field 1.5 × 1.5 m at 3.0 m measuring distance",
          "Deviation FU 0/+6 dB at 75 % of 16 measuring points (26/80 MHz to 18 GHz)",
        ] },
      ],
    },

    ucc: {
      lead: [
        "The UCC is Frankonia's ultra-compact hybrid solution at 1.0 m measuring distance. The chamber is designed for pre-compliance radiated emission and immunity tests, conducted tests, and pre-compliance tests for automotive components as per the CISPR 25 method.",
        "It is an alternative solution for the GTEM cell for pre-compliance testing as well as for research and scientific purposes in all sectors.",
      ],
      figure: {
        src: "/chambers/models/ucc-2.webp", w: 1600, h: 1200,
        alt: "Inside an ultra-compact hybrid chamber. A test table with a copper ground plane rests on a white frame, the pyramid absorbers of the wall are close behind it, and a service panel is set into the floor.",
        caption: "The copper ground plane and the layout on it. Replacing a GTEM cell means keeping exactly this setup.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 25 pre-compliance" },
        { label: "Immunity (EMS)", value: "ISO 11452 pre-compliance" },
        { label: "Test distance", value: "1.0 m" },
        { label: "Setup", value: "Table setup" },
        { label: "Frequency range", value: "26 MHz – 18 GHz" },
        { label: "Replaces", value: "GTEM cell" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 150 kHz / 26 MHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite and H450.",
          head: ["Configuration", "External dimension (L × W × H)", "Test condition"],
          rows: [
            ["UCC", "4,580 × 3,080 × 2,550 mm", "Pre-compliant component level\nat 1.0 m test distance"],
          ],
        },
      ],
      groups: [
        { title: G.en.features, items: [
          "UCC: Pre-compliant per CISPR 25 and ISO 11452 (alternative to GTEM cell)",
          "Compact chamber solution for automotive component testing",
          "Upgradeable for E-Drive (load machine, BlueBox, battery test system)",
          "Advanced and optimized lining with long-lasting Frankosorb® hybrid absorbers",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite and H450") },
        { title: G.en.performance, items: [
          "Pre-compliant emission (EMI) according to CISPR 25",
          "Pre-compliant immunity (EMS) according to ISO 11452",
        ] },
      ],
    },

    avtc: {
      lead: [
        "The AVTC is Frankonia's automotive anechoic chamber solution at 3.0 m or 5.0 m measuring distance offering a Quiet Zone (QZ) of ø4.0 m for commercial testing combined with a focus on automotive component and vehicle tests.",
        "It is adapted for radiated emissions on vehicles acc. to CISPR 12 and components acc. to CISPR 25 as well as for commercial product tests acc. to CISPR 16-1-4 and ANSI C63.4. Furthermore, it is adapted to radiated immunity acc. to IEC/EN 61000-4-3, ISO 11451 and ISO 11452.",
      ],
      figure: {
        src: "/chambers/models/avtc-4.webp", w: 1600, h: 1067,
        alt: "Inside a vehicle testing chamber. Walls and ceiling are lined with pyramid absorbers, and the circle of a large turntable with a recessed grating is set into the reflecting floor. The chamber is empty.",
        caption: "The circle left in the floor is the turntable. The diameter a vehicle has to stand on is what sets the size of this chamber.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "3.0 m · 5.0 m" },
        { label: "Quiet zone", value: "up to ø4.0 m" },
        { label: "ECE R10", value: "dynamometer at 3.0 m" },
        { label: "Load capacity", value: "30,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 150 kHz to 18 GHz, 40 GHz as an option. Frankosorb® hybrid lining with Ferrite, H1000 and H600.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone and turntable"],
          rows: [
            ["AVTC", "11,480 × 9,380 × 6,000 mm", "ø3.0 m at 3.0 m test distance (H = 2.5 m)\ne.g., with turntable up to ø5.0 m"],
            ["AVTC L", "14,780 × 11,480 × 6,300 mm", "ø3.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)\ne.g., with turntable up to ø6.0 m"],
            ["AVTC XL", "16,280 × 12,680 × 6,300 mm", "ø4.0 m at 3.0 m and 5.0 m test distance (H = 2.5 m)\ne.g., with integrated dynamometer ø7.0 m"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461", "ECE R10.5"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461 RS101, RS102, RS103", "ECE R10.5"],
      ),
      groups: [
        { title: G.en.features, items: [
          "Advanced Frankosorb® hybrid absorber lining",
          "Automotive component & vehicle and commercial tests in a single solution",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Full compliant with CISPR 25, CISPR 12, ISO 11452 and ISO 11451",
          "ECE R10 with integrated or mobile dynamometer up to 3.0 m test distance",
          "Cost-effective and high-performance solution for 3.0 m or 5.0 m test distance",
          "Floor absorber board for an efficient and fast modification of the test setup",
          "Upgradeable with EDTC components (load machine, BlueBox, etc.)",
          "Highly customizable solution for any kind of EMC testing",
          "Usable for commercial and military standard tests",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H1000 and H600") },
        { title: G.en.performance, items: [
          ...sacPerformanceEn("26"),
          "Full compliant emission (EMI) according to CISPR 25 and CISPR 12",
          "Full compliant immunity (EMS) according to ISO 11452 and ISO 11451",
          "ECE R10 at 3.0 m test distance with dynamometer",
        ] },
      ],
    },

    "sac-10-v": {
      lead: [
        "The SAC-10V is Frankonia's full compliant and customizable EMC testing solution at 10.0 m measuring distance, offering various sizes of Quiet Zone and dedicated to automotive full vehicle testing with an integrated dynamometer.",
        "Due to the high grade of customization reflecting the demands of our customers, this semi-anechoic chamber is adaptable in size and offers several configuration possibilities. Identical performance can be offered using hybrid or long-pyramid absorbers.",
      ],
      figure: {
        src: "/chambers/models/sac-10-v-5.webp", w: 1600, h: 1067,
        alt: "Inside a large vehicle testing chamber. A black saloon car stands on the floor turntable with an exhaust hose connected to it, a large antenna boom structure runs below the ceiling, and walls and ceiling are lined with pyramid absorbers.",
        caption: "One vehicle on the turntable. That the exhaust extraction and the dynamometer come in with it is what an ECE R10 test requires.",
      },
      overview: [
        { label: "Emission (EMI)", value: "CISPR 16-1-4" },
        { label: "Immunity (EMS)", value: "IEC/EN 61000-4-3" },
        { label: "Test distance", value: "up to 10.0 m" },
        { label: "Quiet zone", value: "ø6.0 m" },
        { label: "ECE R10.5", value: "full compliant at 10.0 m" },
        { label: "Load capacity", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "Hybrid absorber solution",
          note: "Frequency range 9 kHz / 150 kHz to 18 GHz, 40 GHz as an option. Optimized Frankosorb® hybrid absorber lining.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone and test zone"],
          rows: [
            ["SAC-10VC-6/H", "23,030 × 14,480 × 6,300 mm", "ø6.0 m at 5.0 m test distance (H = 2.5 m)\nPrepared for a 10.0 m test distance for vehicle tests"],
            ["SAC-10V-6/H", "22,580 × 15,680 × 8,700 mm", "ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10V-6/H (SL12)", "24,380 × 16,580 × 9,000 mm", "ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 12.0 m long vehicles"],
            ["SAC-10V-6/H (SL18)", "26,780 × 18,080 × 9,000 mm", "ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 18.0 m long vehicles"],
          ],
        },
        {
          title: "Pyramid absorber solution",
          note: "Frequency range 9 kHz / 150 kHz to 18 GHz, 40 GHz as an option. Full lining with Frankosorb® long-pyramid P2400 absorbers.",
          head: ["Configuration", "External dimension (L × W × H)", "Quiet zone and test zone"],
          rows: [
            ["SAC-10V-6/P", "26,480 × 20,180 × 9,000 mm", "ø6.0 m at 10.0 m test distance (H = 3.0 m)"],
            ["SAC-10V-6/P (SL12)", "26,480 × 20,180 × 10,500 mm", "ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 12.0 m long vehicles"],
            ["SAC-10V-6/P (SL18)", "30,080 × 20,180 × 10,500 mm", "ø6.0 m at 10.0 m test distance (H = 3.0 m)\nHeavy load test zone up to 18.0 m long vehicles"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32", "MIL-STD 461", "ECE R10.5"],
        ["IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "MIL-STD 461 RS101, RS102, RS103", "ECE R10.5"],
      ),
      groups: [
        { title: G.en.features, items: [
          "SAC-10V-6/H: Optimized and advanced Frankosorb® hybrid absorber lining",
          "SAC-10V-6/P: Full lining with Frankosorb® long-pyramid P2400 absorbers",
          "Full compliant EMI acc. to CISPR 16-1-4 and ANSI C63.4",
          "Full compliant EMS acc. to IEC/EN 61000-4-3",
          "Full compliant with CISPR 25, CISPR 12, CISPR 36, ISO 11452 and ISO 11451",
          "ECE R10 with integrated dynamometer at 10.0 m test distance",
          "Highly customizable for any kind of testing, vehicle sizes and weights",
          "Specialized for 'out-of-the-range' EMC test environments",
          "Usable for commercial and military standard tests",
        ] },
        { title: G.en.absorbers, items: [
          "High-performance nano thin-film technology with proven long-term stability",
          "Non-combustible acc. to EN 13501-1 class A2 - s1 d0",
          "Hardly inflammable acc. to EN 13501-1 class B (alternative)",
        ] },
        { title: G.en.performance, items: [
          "Full compliant emission (EMI) according to CISPR 16-1-4 and ANSI C63.4",
          "Full compliant emission (EMI) according to CISPR 25 and CISPR 12",
          "Full compliant immunity (EMS) according to IEC/EN 61000-4-3",
          "Full compliant immunity (EMS) according to ISO 11452 and ISO 11451",
          "ECE R10 at 10.0 m test distance with dynamometer",
        ] },
      ],
    },

    "edtc-sa": {
      lead: [
        "E-Drive Test Solutions are Frankonia's dedicated test sites for powertrain components and facilities related to hybrid, electric, fuel cell and battery drive systems. They offer superior conditions for radiation testing according to CISPR 25 and ISO 11452.",
        "The EDTC-SA is the chamber solution that is specifically prepared for a single external load machine with fixed shaft. It includes braking, driving, direction of rotation, speed regulation, torque control and a mix out of this range.",
      ],
      figure: {
        src: "/chambers/models/edtc-3.webp", w: 1600, h: 1067,
        alt: "Inside an e-drive test chamber. An electric motor is mounted on a white plinth in the middle with two heavy cables running to it. The left wall is ferrite tile, the right is pyramid absorber.",
        caption: "The motor itself is the EUT. The load machine stays outside and only the shaft crosses the shielding.",
      },
      overview: [
        { label: "Compliance", value: "CISPR 25 · ISO 11452" },
        { label: "Load machine", value: "External, fixed shaft" },
        { label: "Test distance", value: "1.0 m" },
        { label: "Setup", value: "Table in front of wall" },
        { label: "Frequency range", value: "150 kHz – 18 GHz" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 150 kHz to 18 GHz, 40 GHz as an option. Optimized Frankosorb® hybrid absorber lining.",
          head: ["Configuration", "External dimension (L × W × H)", "Load machine"],
          rows: [
            ["EDTC-SA", "7,880 × 5,480 × 3,750 mm", "For the fixed-shaft version with one external load machine\ne.g., 1 × 250 kW with 3,000 RPM and 3,000 Nm"],
          ],
        },
        {
          title: "External load machines",
          note: "Equipment that goes into the chamber rather than the chamber itself. The load machine can be the one your preferred dynamometer supplier builds.",
          head: ["", "EDTC-250", "EDTC-500"],
          rows: [
            ["Power", "1 × 250 kW", "2 × 250 kW"],
            ["Speed", "3,000 RPM", "3,000 RPM"],
            ["Torque", "3,000 Nm", "3,000 Nm"],
          ],
        },
      ],
      groups: [
        { title: G.en.features, items: [
          "Fully compliant with CISPR 25 and ISO 11452",
          "Optimized Frankosorb® hybrid absorber lining",
          "Component or system test level",
          "Combination with battery tests",
          "Integration kit for existing chambers",
          "Optional EUT e-motor power source and water cooling system",
          "Motor adapter, grounding and connection per CISPR 25",
          "Vibration-free and non-interacting solid basement (floating slab)",
          "Extended services in consultancy and test readiness guidance",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: [
          "Radiated emission testing according to CISPR 25",
          "Radiated immunity testing according to ISO 11452",
        ] },
      ],
    },

    "edtc-ax": {
      lead: [
        "The EDTC-AX is the chamber setup that is defined for e-axle tests on powertrain units and is prepared for two external load machines with fixed shaft.",
        "The patented system can be used for dynamic drive tests of electrical powertrain units and matches with your preferred dynamometer supplier. Frankonia focuses on the proper EMC setup inside an EMC chamber and provides adapted test tables, grounding conception and 90° angle gear boxes.",
      ],
      figure: {
        src: "/chambers/models/edtc-ax-0.webp", w: 1600, h: 1067,
        alt: "Inside an e-drive test chamber. A copper ground plane table stands in the foreground and a green electric motor with a black coupling is mounted on a white frame behind it. A metal housing where the shaft passes through sits in the left wall.",
        caption: "The housing in the left wall is the shielded shaft feed-through. It is the point at which the chamber stays shielded with the load machine outside it.",
      },
      overview: [
        { label: "Compliance", value: "CISPR 25 · ISO 11452" },
        { label: "Load machines", value: "Two, fixed shaft" },
        { label: "Power range", value: "e.g., 2 × 250 kW" },
        { label: "Test distance", value: "1.0 m" },
        { label: "Frequency range", value: "150 kHz – 18 GHz" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 150 kHz to 18 GHz, 40 GHz as an option. Optimized Frankosorb® hybrid absorber lining.",
          head: ["Configuration", "External dimension (L × W × H)", "Load machines"],
          rows: [
            ["EDTC-AX", "9,080 × 6,080 × 3,750 mm", "For the fixed-shaft version with two external load machines\ne.g., 2 × 250 kW with 3,000 RPM and 3,000 Nm"],
          ],
        },
      ],
      groups: [
        { title: G.en.features, items: [
          "Patented setup for the e-axle configuration",
          "Fully compliant with CISPR 25 and ISO 11452",
          "Optimized Frankosorb® hybrid absorber lining",
          "Shielded shaft, proper DUT positioning, grounding and test tables provided",
          "90° angle gear boxes — open to any dynamometer",
          "Motor adapter, grounding and connection per CISPR 25",
          "Vibration-free and non-interacting solid basement (floating slab)",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: [
          "Radiated emission testing according to CISPR 25",
          "Radiated immunity testing according to ISO 11452",
        ] },
      ],
    },

    "edtc-bb": {
      lead: [
        "The EDTC-BB is the adapted chamber solution that includes the EMC-BlueBox mobile load machine for dynamic EMC tests of electrical powertrain units in a shielded enclosure.",
        "The BlueBox works in a four-quadrant operation; any EUT stress situation can be simulated. Similar to the external load machine with a fixed shaft, it includes braking, driving, direction of rotation, speed regulation, torque control and a mix out of this range.",
      ],
      figure: {
        src: "/chambers/models/edtc-bb-0.webp", w: 1600, h: 1067,
        alt: "Inside an e-drive test chamber. A green electric motor sits on a long white bench, connected along a shaft to a blue unit at the far end. Yellow markings run along the floor.",
        caption: "Here the load machine comes into the chamber. Having no shaft through the shielding is what the BlueBox setup changes.",
      },
      overview: [
        { label: "Compliance", value: "CISPR 25 · ISO 11452" },
        { label: "Load machine", value: "Mobile, electrical" },
        { label: "Maximum power", value: "120 kW" },
        { label: "Test distance", value: "1.0 m" },
        { label: "Frequency range", value: "30 MHz – 18 GHz" },
        { label: "Load capacity", value: "5,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frequency range 9 kHz / 30 MHz to 18 GHz, 40 GHz as an option. Optimized Frankosorb® hybrid absorber lining.",
          head: ["Configuration", "External dimension (L × W × H)", "Load machine"],
          rows: [
            ["EDTC-BB", "7,880 × 6,380 × 3,750 mm", "For the mobile load machine EMC-BlueBox up to 120 kW"],
            ["EDTC-BB with turntable", "10,880 × 6,980 × 3,900 mm", "For the mobile load machine EMC-BlueBox up to 120 kW\nwith turntable for 360° scan"],
          ],
        },
        {
          title: "EMC-BlueBox mobile load machine",
          note: "Equipment that goes into the chamber rather than the chamber itself. Weight, payload and dimensions are as the head office publishes them.",
          head: ["", "BlueBox-30", "BlueBox-40", "BlueBox-65", "BlueBox-120"],
          rows: [
            ["Power", "30 kW", "40 kW", "63 kW", "120 kW"],
            ["Speed max.", "11,000 RPM", "9,000 RPM", "6,500 RPM", "6,000 RPM"],
            ["Torque", "82 Nm", "140 Nm", "240 Nm", "470 Nm"],
            ["Weight", "1,100 kg", "1,200 kg", "1,700 kg", "2,500 kg"],
            ["Payload", "800 kg", "800 kg", "1,000 kg", "1,400 kg"],
            ["Dimensions", "2.0 × 1.3 × 1.3 m", "2.2 × 1.3 × 1.3 m", "2.5 × 1.4 × 1.3 m", "2.8 × 1.6 × 1.3 m"],
          ],
        },
      ],
      groups: [
        { title: G.en.features, items: [
          "Four-quadrant operation — any EUT stress situation can be simulated",
          "Fully compliant with CISPR 25 and ISO 11452",
          "Optimized Frankosorb® hybrid absorber lining",
          "Mobile, flexible and adjustable to any kind of EUT",
          "360° view when placed on a turntable (extended testing range)",
          "Combination with battery tests",
          "Integration kit for existing chambers",
          "Easy to use for every EMC expert",
        ] },
        { title: G.en.absorbers, items: absorbersEn("Ferrite, H450 or H600") },
        { title: G.en.performance, items: [
          "Radiated emission testing according to CISPR 25",
          "Radiated immunity testing according to ISO 11452",
        ] },
      ],
    },

    "mil-chc": {
      lead: [
        "The MIL CHC is Frankonia's Compact Hybrid Chamber, lined with a Frankosorb® hybrid absorber layout, for MIL-STD 461 and DO-160 component testing.",
        "It is adapted for full compliant radiated emission and immunity tests of lightweight EUT's at 1.0 m test distance. To meet DO-160 the chamber is slightly longer, because of the absorber lining.",
      ],
      figure: {
        src: "/chambers/models/mil-chc-2.webp", w: 1600, h: 1067,
        alt: "Inside a compact hybrid chamber for military component testing. Walls and ceiling are lined with pyramid absorbers, one person is adjusting a red antenna on a tripod, a test bench stands to the right, and an aselsan logo is fixed high on the left wall.",
        caption: "A 1.0 m measuring distance is a distance you can reach across. Military component testing happens at this size.",
      },
      overview: [
        { label: "Emission (EMI)", value: "MIL-STD 461 · DO-160" },
        { label: "Immunity (EMS)", value: "MIL-STD 461 · DO-160" },
        { label: "Test distance", value: "1.0 m" },
        { label: "Setup", value: "Table setup" },
        { label: "Frequency range", value: "30 MHz – 40 GHz" },
        { label: "Lining", value: "Hybrid" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "Frankosorb® hybrid absorber lining. The DO-160 configuration is longer because of the absorber lining.",
          head: ["Configuration", "External dimension (L × W × H)", "Frequency range and lining"],
          rows: [
            ["MIL CHC", "4,880 × 4,880 × 3,000 mm", "9 kHz / 30 MHz to 40 GHz\nwith hybrid absorber lining"],
            ["MIL CHC / DO-160", "5,330 × 4,880 × 3,000 mm", "9 kHz / 30 MHz to 40 GHz\nwith hybrid absorber lining"],
          ],
        },
      ],
      groups: [
        { title: G.en.features, items: [
          "Full compliant for components acc. to MIL-STD 461 and DO-160",
          "Compact chamber design for military applications",
          "Advanced lining with long-lasting Frankosorb® absorbers",
        ] },
        { title: G.en.absorbers, items: [
          "Frankosorb® short-pyramid, long-pyramid or hybrid absorber lining",
          "High-performance nano thin-film technology with proven long-term stability",
          "Non-combustible acc. to EN 13501-1 class A2 - s1 d0",
          "Hardly inflammable acc. to EN 13501-1 class B (alternative)",
        ] },
        { title: G.en.performance, items: [
          "Full compliant emission (EMI) and immunity (EMS) acc. to MIL-STD 461 and DO-160, 30 MHz / 80 MHz to 40 GHz",
          "Absorption at normal incidence: 80 MHz to 250 MHz 6 dB, as per standard requirements",
          "Absorption at normal incidence: above 250 MHz 10 dB, as per standard requirements",
        ] },
      ],
    },

    "mil-std-chamber": {
      lead: [
        "The MIL-STD Chamber is Frankonia's large chamber solution at 1.0 m measuring distance according to MIL-STD 461, adapted for radiated emission and immunity tests for large EUT's or vehicles.",
        "It can be fully customized according to customers' requirements for military testing of large and heavyweight EUT's.",
      ],
      figure: {
        src: "/chambers/models/mil-std-chamber-0.webp", w: 1250, h: 875,
        alt: "A cutaway render of a large military chamber. A red steel structure frames the shell, the inner walls are lined with white absorbers, and a tank stands on the floor in the middle. An access ramp leads in from the left.",
        caption: "This picture is why no dimensions are given. What has to come in is what sets the size of the chamber.",
      },
      overview: [
        { label: "Emission (EMI)", value: "MIL-STD 461 · DO-160" },
        { label: "Immunity (EMS)", value: "MIL-STD 461 · DO-160" },
        { label: "Test distance", value: "1.0 m" },
        { label: "EUT", value: "Vehicles, large EUT's" },
        { label: "Frequency range", value: "80 MHz – 40 GHz" },
        { label: "Load capacity", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "The size is defined according to the EUT type and size. Special turntable systems and integrations are possible.",
          head: ["Configuration", "External dimension (L × W × H)", "Frequency range and lining"],
          rows: [
            ["MIL-STD Chamber", "Custom size", "9 kHz / 80 MHz to 40 GHz\nwith short-pyramid absorbers · military compliance"],
          ],
        },
      ],
      groups: [
        { title: G.en.features, items: [
          "Full compliant acc. to MIL-STD 461 and DO-160",
          "Frequency of absorbers: 80 MHz to 40 GHz",
          "High performance solution for large and heavyweight EUT's",
          "Fully customized according to customers' requirements",
        ] },
        { title: G.en.absorbers, items: [
          "Frankosorb® short-pyramid absorber lining",
          "High-performance nano thin-film technology with proven long-term stability",
          "Non-combustible acc. to EN 13501-1 class A2 - s1 d0",
          "Hardly inflammable acc. to EN 13501-1 class B (alternative)",
        ] },
        { title: G.en.performance, items: [
          "Full compliant emission (EMI) and immunity (EMS) acc. to MIL-STD 461 and DO-160, 30 MHz / 80 MHz to 40 GHz",
          "Absorption at normal incidence: 80 MHz to 250 MHz 6 dB, as per standard requirements",
          "Absorption at normal incidence: above 250 MHz 10 dB, as per standard requirements",
        ] },
      ],
    },

    "mil-std-chamber-advanced": {
      lead: [
        "The MIL-STD Advanced Chamber is Frankonia's military chamber solution acc. to MIL-STD 461 for large EUT's, and is compliant with commercial or automotive test site requirements.",
        "Frankonia's unique Frankosorb® long-pyramid or hybrid absorber technology offers the possibility to combine MIL-STD 461 test requirements with commercial test requirements as per CISPR 16-1-4 and ANSI C63.4, as well as vehicle and automotive component tests.",
      ],
      figure: {
        src: "/chambers/models/mil-std-chamber-advanced-3.webp", w: 1478, h: 1108,
        alt: "A double-deck coach stands inside a large anechoic chamber. Walls and ceiling are lined with pyramid absorbers, a large log-periodic antenna stands at the right, and yellow lines are marked on the floor.",
        caption: "A coach, inside a chamber built to a military standard. That is what also meeting the commercial test site requirement looks like.",
      },
      overview: [
        { label: "Military", value: "MIL-STD 461 · DO-160" },
        { label: "Commercial", value: "CISPR 16-1-4" },
        { label: "Test distance", value: "1.0 m · up to 10.0 m" },
        { label: "Quiet zone", value: "e.g. ø6.0 m" },
        { label: "Frequency range", value: "26 MHz – 40 GHz" },
        { label: "Load capacity", value: "80,000 kg" },
      ],
      tables: [
        {
          title: "Configurations",
          note: "The size is defined according to the EUT type and size. 1.0 m for MIL-STD 461; up to 10.0 m for commercial applications.",
          head: ["Configuration", "External dimension (L × W × H)", "Frequency range and lining"],
          rows: [
            ["MIL-STD Advanced Pyramid", "Custom size", "9 kHz / 26 MHz to 40 GHz\nwith long-pyramid absorbers · military, industrial and automotive compliance"],
            ["MIL-STD Advanced Hybrid", "Custom size", "9 kHz / 30 MHz to 40 GHz\nwith hybrid absorber lining · military, industrial and automotive compliance"],
          ],
        },
      ],
      standards: standardsPair(
        "en",
        ["MIL-STD 461", "DO-160", "CISPR 11", "CISPR 12", "CISPR 14", "CISPR 15", "CISPR 25", "CISPR 32"],
        ["MIL-STD 461 RS101, RS102, RS103", "DO-160", "IEC/EN 61000-4-3", "ISO 11451", "ISO 11452", "ECE R10"],
      ),
      groups: [
        { title: G.en.features, items: [
          "Full compliant acc. to MIL-STD 461 and DO-160",
          "Full compliant EMI/EMS for commercial and automotive standards",
          "Frequency of absorbers: 30 MHz to 40 GHz",
          "Advanced high-performance solution for large and heavyweight EUT's",
          "Fully customized according to customers' requirements",
        ] },
        { title: G.en.absorbers, items: [
          "Frankosorb® long-pyramid or hybrid absorber lining",
          "High-performance nano thin-film technology with proven long-term stability",
          "Non-combustible acc. to EN 13501-1 class A2 - s1 d0",
          "Hardly inflammable acc. to EN 13501-1 class B (alternative)",
        ] },
        { title: "Performance & Compliance – military", items: [
          "Full compliant emission (EMI) and immunity (EMS) acc. to MIL-STD 461 and DO-160, 30 MHz / 80 MHz to 40 GHz",
          "Absorption at normal incidence: 80 MHz to 250 MHz 6 dB, as per standard requirements",
          "Absorption at normal incidence: above 250 MHz 10 dB, as per standard requirements",
        ] },
        { title: "Performance & Compliance – commercial", items: sacPerformanceEn("26") },
      ],
    },

    rvc: {
      lead: [
        "The RVC Chambers are designed based on Frankonia's modular construction system. Prefabricated high-quality shielding panels (>8 MS/m) guarantee a maximum of flexibility and performance.",
        "The shielding panels can be installed reverse (flat surface inside) or as regular PAN shielding with mounting from the inside, which allows future upgrades, e.g., absorber lining.",
      ],
      close:
        "Frankonia offers various stirrer designs and concepts, and maintains its role as a solution provider by adapting our customers' stirrer designs, which we then implement in new RVC chambers or in converting old ones.",
      figure: {
        src: "/chambers/models/reverberation-solutions-0.webp", w: 1600, h: 1067,
        alt: "Inside a reverberation chamber. Walls and ceiling are bare metal shielding panels with no absorber at all. The large ceiling stirrer is blurred mid-rotation, and a blue car stands on the floor turntable.",
        caption: "That there is no absorber is the principle of this room. Instead of removing the reflections, a stirrer keeps stirring the field until it is uniform.",
      },
      overview: [
        { label: "Compliance", value: "IEC/EN 61000-4-21" },
        { label: "Automotive", value: "ISO 11452-11 · 11451-5" },
        { label: "Lowest usable freq.", value: "80 – 200 MHz" },
        { label: "Max. working volume", value: "8.0 × 5.0 × 3.0 m" },
        { label: "Frequency range", value: "10 kHz – 18 GHz" },
        { label: "Models", value: "RVC S – XXL · e1 · e2", family: true },
      ],
      tables: [
        {
          title: "Commercial & Industrial RVC",
          note: "Frequency range 10 kHz to 18 GHz, 40 GHz as an option. Working volume to wall and similar >400 mm (λ/4).",
          head: ["Model", "External dimension (L × W × H)", "Working volume, LUF, stirrer and products"],
          rows: [
            ["RVC e1", "7,580 × 5,630 × 4,200 mm", "3.3 × 3.5 × 2.6 m · LUF 200 MHz\n1× Z-Fold stirrer (vertical)\nSmall or medium size ISM & multimedia"],
            ["RVC e2", "11,280 × 7,280 × 4,950 mm", "5.5 × 4.0 × 2.6 m · LUF 80 MHz\n2× Z-Fold stirrer (vertical and horizontal)\nLarge ISM & multimedia"],
          ],
        },
        {
          title: "Automotive RVC",
          note: "Frequency range 10 kHz to 18 GHz, 40 GHz as an option. The L, XL and XXL are custom sizes.",
          head: ["Model", "External dimension (L × W × H)", "Working volume, LUF, stirrer and products"],
          rows: [
            ["RVC S", "5,330 × 3,380 × 3,300 mm", "2.5 × 1.0 × 1.5 m · LUF 200 MHz\n1× Z-Fold stirrer (vertical)\nComponents for military or automotive"],
            ["RVC M", "7,580 × 5,630 × 4,200 mm", "3.3 × 3.5 × 2.6 m · LUF 200 MHz\n1× Z-Fold stirrer (vertical)\nLarge components for military or automotive"],
            ["RVC L", "13,880 × 11,480 × 6,300 mm (custom)", "8.0 × 5.0 × 3.0 m · LUF 80 MHz\n2× Z-Fold stirrer (vertical and horizontal)\nVehicles"],
            ["RVC XL", "15,530 × 11,480 × 6,600 mm (custom)", "8.0 × 5.0 × 3.0 m · LUF 80 MHz\n1× large-disc stirrer ø9.0 m, 2× disc stirrer ø4.0 m\nVehicles"],
            ["RVC XXL", "17,480 × 13,580 × 6,600 mm (custom)", "8.0 × 5.0 × 3.0 m · LUF 80 MHz\n1× large-disc stirrer ø12.0 m, 2× disc stirrer ø4.0 m\nLarge vehicles"],
          ],
        },
      ],
      groups: [
        { title: "Features & Compliance", items: [
          "Retrofit of a RVC with Frankosorb® hybrid absorbers and regular PAN shielding, or converting old EMC chambers to RVC chambers",
          "Cost-effective and performance solution for small products up to vehicles",
          "Immunity compliance according to IEC/EN 61000-4-21 and ISO 11452-11",
          "Immunity and emission compliance according to ISO 11451-5 (fast stirring)",
          "Full safety integration per Machinery Directive (2006/42/EC)",
        ] },
        { title: "Frankonia stirrers", items: [
          /* ø1.88 rather than the catalogue's rounded "e.g. ø1,8 m": the
             stirrer sheet gives the figure for the RVC S, M and e1 Z-folds,
             and this list and the reverberation type page's table describe the
             same stirrer. One number, so the two pages do not disagree. */
          "Regular Z-Fold stirrers with up to 30 RPM at e.g. ø1.88 m",
          "Performance Z-Fold stirrers with up to 60 RPM at e.g. ø2.8 m",
          "Disc-style stirrers with up to 120 RPM at e.g. ø4.0 m",
          "Tube-style stirrers with up to 240 RPM at e.g. ø2.0 m",
          "Large-disc stirrers with up to 10 RPM at e.g. ø12.0 m",
        ] },
      ],
    },

    "shielded-room": {
      lead: [
        "Frankonia shielded rooms and anechoic chambers are designed based on a modular construction system. Prefabricated high quality shielding panels guarantee a maximum of flexibility regarding possible dimensions, and all PAN type modules allow an easy handling and entry via standard building doors.",
        "The standard modules are bolted from inside every 75 mm with high conductivity mesh gasket inserted for sealing the joints of the panels. This facilitates an installation close to the walls of the parent building, and the short screwing distance with a predefined torque guarantees long life shielding attenuation characteristics.",
      ],
      figure: {
        src: "/chambers/models/shielded-room-7.webp", w: 1600, h: 1067,
        alt: "A shielded room seen from the factory hall. Two large RF doors in red frames sit side by side in a grey shielding panel wall, carrying warning labels, with ducting and cable trays running overhead.",
        caption: "Shielding is not only a question of the wall. The doors, the vents and the filters have to reach the same figure before the number below means anything.",
      },
      overview: [
        { label: "Size", value: "Any size" },
        { label: "Shielding standard", value: "EN 50147-1 · IEEE-299" },
        { label: "Max. attenuation", value: "120 dB" },
        { label: "Frequency range", value: "10 kHz – 40 GHz" },
        { label: "Panel", value: "2.0 mm galvanized steel" },
        { label: "Load capacity", value: "Any loading" },
      ],
      tables: [
        {
          title: "Guaranteed performance",
          note: "Acc. to EN 50147-1 or IEEE-299 (option). Equal performance for any kind of feed-through component, honeycomb, door, gate or filter.",
          head: ["Frequency", "Attenuation", "Field"],
          rows: [
            ["10 kHz", "90 dB", "Magnetic field"],
            ["100 kHz", "100 dB", "Magnetic field"],
            ["1 MHz", "110 dB", "Magnetic field"],
            ["100 MHz", "120 dB", "Plane wave"],
            ["400 MHz", "120 dB", "Plane wave"],
            ["1 GHz", "110 dB", "Plane wave"],
            ["18 GHz", "100 dB", "Microwave"],
            ["40 GHz", "100 dB", "Microwave"],
          ],
        },
      ],
      groups: [
        { title: G.en.features, items: [
          "PAN Type shielding modules made of 2.0 mm thick galvanized steel",
          "Modular and prefabricated standard",
          "Self-supporting stability or with static steel structure for any seismic condition",
          "Mounted from the inside",
          "Reverse installation possible (flat surface inside)",
          "Interior finishing (walls and ceiling) possible",
          "Raised floor systems, or welded floor systems",
          "Long life shielding attenuation characteristics",
          "No glue, no welding",
          "Dismountable without any damage, easy modifications and maintenance",
          "A complete transfer or future modification is possible",
          "Any size of shielding is possible",
          "Acoustic panels with absorption per ISO 354 w = 0.65 (MH)",
          "Perfectly adapted for Frankosorb® absorbers",
          "Turnkey solution",
        ] },
      ],
    },
  },
};
