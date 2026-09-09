import type { ReactNode } from "react";
import { industryLabel, industries } from "./industries";
import { Groups, Lead, Tables } from "./page-parts";
import PageShell, { type HeadShot } from "./page-shell";
import { closingLine } from "./page-closing";
import StructuredData, { type TrailStep } from "./structured-data";
import { asset, contactEmail, localeRoute, type Lang } from "./site-config";
import { chambersPath, industryPath as chamberIndustryPath,
  isChamberIndustry } from "./chamber-sections";
import ModelAccordion, { type AccordionRow } from "./model-accordion";
import { datasheetFor } from "./test-system-datasheets";
import { modelShots } from "./test-system-gallery";
import {
  categoryBody,
  factLabel,
  modelGroups,
  modelsByProduct,
  overviewBody,
  productBody,
  productsOfCategory,
  shownTestProducts,
  standardsByIndustry,
  testCategories,
  testCategoryMeta,
  testCategoryPath,
  testModelBody,
  testModels,
  testProductMeta,
  testProductPath,
  testProducts,
  testStandards,
  testStandardsMeta,
  testStandardsPath,
  testSystemsOverviewMeta,
  testSystemsPath,
  type TestCategory,
  type TestModel,
  type TestProduct,
} from "./test-system-sections";
import SiteLink from "./site-link";
import type { PageBody } from "./page-body";

/**
 * Every page in the EMC Test Systems branch.
 *
 * Same construction as chamber-content: the page is a list of bands in reading
 * order, and the alternating `.alt` fill is counted here rather than written
 * into each band — whether a band has a neighbour above it is not knowable
 * where the band is declared, and which bands exist varies by page.
 *
 * No band on this branch carries documents any more. The index used to end on
 * the head office's nine test-system catalogue PDFs, and every page under it
 * on a "documents on request" card; both are gone. What a reader needs is
 * already beside them — the enquiry the header, the footer and every model row
 * carry, and the per-model datasheets served from this origin off a pill
 * inside the model row (test-system-datasheets.ts).
 */

export type TestSystemView =
  | { kind: "overview" }
  | { kind: "test"; slug: TestCategory }
  | { kind: "product"; slug: TestProduct }
  | { kind: "standards" };

const copy = {
  zh: {
    eyebrow: "EMC TEST SYSTEMS",
    browse: "搜索",
    byTest: "按检测项目",
    byProduct: "按产品组",
    byStandard: "按标准",
    /* Counts are out of the index copy, here and in `modelsTitle` below.
       "해당 모델 10종" and "규격 24건" both have to be rewritten the moment a
       model or a standard is added, and neither answers the question the row
       is asked — which of these is mine. The rows carry the family's own
       `note` instead, the way the chamber branch carries `typeMeta.note`. */
    standardsNote: "行业团体主办",
    standardsKicker: "STANDARDS",
    equipmentKicker: "EQUIPMENT",
    equipmentTitle: "测试配置设备",
    modelsKicker: "MODELS",
    modelsTitle: "适用机型",
    /** In the panel a row opens. The mail is addressed to the model already, so
     *  a reader who has just picked one out of ten is not asked to name it
     *  again. Same wording as the chamber branch — it is the same button. */
    modelQuote: "获取报价",
    modelQuoteSubject: (name: string) => `[报价查询] ${name}`,
    /** 패널의 데이터시트 버튼. 본사 데이터시트 원본 PDF를 이 서버에서 바로 내려
     *  받습니다 — 어느 사양서인지는 모델명이 이미 말해 주므로 라벨에 다시 적지
     *  않고, 파일 크기만 뒤에 붙습니다. */
    modelDoc: "数据表",
    /** Printed in My Enquiry and in the enquiry it writes, so a shortlist says
     *  which part of the catalogue each line came out of. */
    cartFrom: "EMC测试系统",
    galleryPrev: "上一张照片",
    galleryNext: "下一张照片",
    galleryFrame: "照片 {at} / {of} — 按至下一张照片",
    /** Still needed for a family whose models are not listed yet: the row would
     *  otherwise open on nothing. The label points at the way to get the
     *  specification instead. Families that do have models carry their own
     *  `testProductMeta.note` in this slot rather than a count. */
    countPending: "型号查询",
    specsKicker: "SPECIFICATIONS",
    specsTitle: "规格",
    specsNote: "这是我们产品页面和目录表的直接副本。数字和标准符号未翻译 - 这是因为它们是与图纸和估计进行比较的值。",
    chamberCross: "查看同行业暗室",
  },
  en: {
    eyebrow: "EMC TEST SYSTEMS",
    browse: "Browse",
    byTest: "By Test",
    byProduct: "By Product",
    byStandard: "By Standard",
    standardsNote: "Grouped by the industry that tests to them",
    standardsKicker: "STANDARDS",
    equipmentKicker: "EQUIPMENT",
    equipmentTitle: "What the setup is built from",
    modelsKicker: "MODELS",
    modelsTitle: "Models in this family",
    modelQuote: "Request a quote",
    modelQuoteSubject: (name: string) => `[Quote request] ${name}`,
    modelDoc: "Datasheet",
    cartFrom: "EMC Test Systems",
    galleryPrev: "Previous picture",
    galleryNext: "Next picture",
    galleryFrame: "Picture {at} of {of} — press for the next",
    countPending: "models on request",
    specsKicker: "SPECIFICATIONS",
    specsTitle: "Specifications",
    specsNote:
      "Reproduced from the tables on the head office's own product pages and catalogues. Figures and standard designations are not translated — they are what a reader matches against a drawing and a quotation.",
    chamberCross: "Chambers for the same industry",
  },
} as const;

/* The head band of the test-systems index, which is where the EMC Test Systems
   menu opens.

   It is a chamber photograph, on a branch that has thirteen images of its own,
   and that is a deliberate choice rather than an oversight. Every asset under
   `public/test-systems/` is a product cutout on white — the head office
   photographs instruments against a studio backdrop, which is right for a
   `.figure` on canvas and unusable full-bleed behind white type. `automation-
   mast` is the one photograph in the repository that shows this branch's
   equipment doing its job: the mast, the log-periodic antenna and the DUT on
   the turntable are the radiated setup the amplifiers and receivers below drive.
   Its mast also stands at about 80% of the frame, which is the part of the band
   the scrim clears — see the note on `.hero::after` in globals.css. */
const overviewShot: HeadShot = {
  src: "/chambers/images/automation-mast.webp", w: 1600, h: 860, at: "50% 45%",
};

export default function TestSystemPage({ lang, view }: { lang: Lang; view: TestSystemView }) {
  const t = copy[lang];
  const { title, description, path, trail, body } = resolve(lang, view);

  const bands: { key: string; node: ReactNode }[] = [];

  if (body) bands.push({ key: "lead", node: <Lead body={body} /> });
  if (view.kind === "overview") bands.push({ key: "axes", node: <Axes lang={lang} /> });
  if (view.kind === "test") bands.push({ key: "equipment", node: <Equipment lang={lang} slug={view.slug} /> });
  if (view.kind === "product") bands.push({ key: "models", node: <Models lang={lang} slug={view.slug} /> });
  if (view.kind === "standards") bands.push({ key: "standards", node: <Standards lang={lang} /> });
  if (body?.tables?.length) {
    bands.push({
      key: "tables",
      node: <Tables lang={lang} tables={body.tables} kicker={t.specsKicker} title={t.specsTitle} note={t.specsNote} />,
    });
  }
  if (body && body.groups.length > 0) bands.push({ key: "groups", node: <Groups body={body} /> });
  return (
    <>
      <StructuredData lang={lang} page="path" path={path} trail={trail} description={description} />
      <PageShell
        lang={lang}
        eyebrow={t.eyebrow}
        title={title}
        intro={description}
        /* The index only, as on the chamber branch. */
        shot={view.kind === "overview" ? overviewShot : undefined}
        closing={closingLine(lang, path)}
      >
        {bands.map((band, i) => (
          <section key={band.key} className={i % 2 === 1 ? "alt" : undefined}>
            <div className="wrap">{band.node}</div>
          </section>
        ))}
      </PageShell>
    </>
  );
}

/** What a family's row says beside its name. Its own note while it has models
 *  to open onto, and `countPending` while it has none — the row is a door, and
 *  a door to an empty room has to say so. It used to be a model count in both
 *  cases; see the note over `standardsNote`. */
const productNote = (t: (typeof copy)[Lang], lang: Lang, product: TestProduct) =>
  modelsByProduct(product).length > 0 ? testProductMeta[lang][product].note : t.countPending;

/**
 * What the index band puts on show — a hold, not a deletion.
 *
 * The branch has three ways in and eight product families behind them. The
 * index prints the four families that hold the instruments the head office's
 * August 2026 mail asks to have promoted, and nothing else:
 *
 * - Integrated Systems — CIT-100 / CIT-1000, ECU-6, PSG-300, MTS-800
 * - Emission Measuring Systems — the ERX receivers
 * - Field Strength Meters — the EFS probes
 * - Meters & Switching — PMS and RSU
 *
 * The amplifiers, antennas, pre-amplifiers and coupling devices are the parts
 * a laboratory adds around those, and the mail does not ask for them. The two
 * other ways in stay down with them: `test/*` names equipment families by
 * discipline, and the standards index is a second door into the same rooms.
 * Nothing under any of it has been taken away — every category, every family
 * and `/test-systems/standards` still builds, still carries its models, and is
 * still in the sitemap. The rows that led to them are simply not drawn here.
 *
 * `showTestAxis` and `showStandardsAxis` to `true` restore those two lists
 * whole; the family list is `shownTestProducts` in test-system-sections, which
 * the header dropdown reads too, so a family goes back on show in one place
 * rather than two. `Axes` reads these and hangs the band's kicker on whichever
 * list survives first, so any subset reads as a finished band rather than as
 * one with its head cut off.
 */
const showTestAxis = false;
const showStandardsAxis = false;

/** The overview's ways in, in the order the dropdown lists them. */
function Axes({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const products = testProducts.filter((product) => shownTestProducts.includes(product));

  /* Built as a list rather than written out in sequence because which lists
     exist is now a decision made above rather than a fact of the page: the
     kicker belongs to the band, not to "By Test", and the 72px that separates
     one list from the next is only owed by a list that has one above it. */
  const lists: { key: string; title: string; rows: ReactNode }[] = [];

  if (showTestAxis) {
    lists.push({
      key: "test",
      title: t.byTest,
      rows: testCategories.map((category, i) => (
        <SiteLink className="hl-row" key={category} href={localeRoute(lang, testCategoryPath(category))}>
          <span className="hl-idx">{String(i + 1).padStart(2, "0")}</span>
          <b>{testCategoryMeta[lang][category].label}</b>
          <span className="hl-desc">{testCategoryMeta[lang][category].note}</span>
        </SiteLink>
      )),
    });
  }

  if (products.length > 0) {
    lists.push({
      key: "product",
      title: t.byProduct,
      rows: products.map((product, i) => (
        <SiteLink className="hl-row" key={product} href={localeRoute(lang, testProductPath(product))}>
          <span className="hl-idx">{String(i + 1).padStart(2, "0")}</span>
          <b>{testProductMeta[lang][product].label}</b>
          <span className="hl-desc">{productNote(t, lang, product)}</span>
        </SiteLink>
      )),
    });
  }

  /* A third way in, and the only one the dropdown no longer offers: the
     standards index used to hang in the menu's utility row and came out of it
     with the rest of that row. It is one row rather than a column because it is
     one page — a reader who arrives holding a standard designation rather than
     a product name needs the door to exist, not to be wide. */
  if (showStandardsAxis) {
    lists.push({
      key: "standard",
      title: t.byStandard,
      rows: (
        <SiteLink className="hl-row" href={localeRoute(lang, testStandardsPath)}>
          <span className="hl-idx">01</span>
          <b>{testStandardsMeta[lang].label}</b>
          <span className="hl-desc">{t.standardsNote}</span>
        </SiteLink>
      ),
    });
  }

  return (
    <>
      {lists.map((list, i) => (
        <div key={list.key}>
          <div className="sec-head" style={i > 0 ? { marginTop: "72px" } : undefined}>
            {i === 0 && <span className="kicker">{t.browse}</span>}
            <h2>{list.title}</h2>
          </div>
          <div className="hairline-list">{list.rows}</div>
        </div>
      ))}
    </>
  );
}

/** A test page is a setup, not a category: it names the product families the
 *  setup is built from. */
function Equipment({ lang, slug }: { lang: Lang; slug: TestCategory }) {
  const t = copy[lang];
  const products = productsOfCategory(slug);

  return (
    <>
      <div className="sec-head">
        <span className="kicker">{t.equipmentKicker}</span>
        <h2>{t.equipmentTitle}</h2>
      </div>
      <div className="hairline-list">
        {products.map((product, i) => (
          <SiteLink className="hl-row" key={product} href={localeRoute(lang, testProductPath(product))}>
            <span className="hl-idx">{String(i + 1).padStart(2, "0")}</span>
            <b>{testProductMeta[lang][product].label}</b>
            <span className="hl-desc">{productNote(t, lang, product)}</span>
          </SiteLink>
        ))}
      </div>
    </>
  );
}

/**
 * A product family's models, under the source's own headings.
 *
 * The amplifier page is why this is grouped. Seventy rows each repeating their
 * band — "10 kHz – 300 MHz" seventeen times over — is a list that has to be
 * read to be scanned. The head office prints the band once as a heading and the
 * model names under it, and so does this.
 *
 * The numbering restarts inside each group for the same reason: a reader
 * counting the models in a band wants that band's count, not a running total
 * across eleven bands.
 */
function Models({ lang, slug }: { lang: Lang; slug: TestProduct }) {
  const t = copy[lang];
  const groups = modelGroups(slug);
  const total = modelsByProduct(slug).length;
  if (total === 0) return null;

  return (
    <>
      <div className="sec-head">
        <span className="kicker">{t.modelsKicker}</span>
        <h2>{t.modelsTitle}</h2>
      </div>
      {groups.map((group, i) => (
        <div key={group.title ?? "ungrouped"}>
          {group.title && (
            <h3 className="sub-head" style={i > 0 ? { marginTop: "40px" } : undefined}>
              {group.title}
            </h3>
          )}
          <ModelList lang={lang} models={group.models} slug={slug} />
        </div>
      ))}
    </>
  );
}

/**
 * The head office's 24 "Select standard" entries, re-sorted by industry.
 *
 * This is the only page in the branch that reads the industry axis, and since
 * the industry pages went it is also the only place that axis is stated. The
 * rows are not links: a standard has no page of its own here, and a row that
 * led back to a heading a reader can already see was the whole reason the
 * industry pages read as a second door into one room.
 *
 * Powertrain is filtered out rather than headed "0 standards" — electric
 * drivetrains are tested to the automotive standards, so it has none of its own
 * and an empty heading would read as missing data instead of as the fact.
 */
function Standards({ lang }: { lang: Lang }) {
  const t = copy[lang];

  return (
    <>
      {industries
        .filter((industry) => standardsByIndustry(industry).length > 0)
        .map((industry, group) => (
          <div key={industry} style={group > 0 ? { marginTop: "72px" } : undefined}>
            <div className="sec-head">
              {group === 0 && <span className="kicker">{t.standardsKicker}</span>}
              <h2>{industryLabel[lang][industry]}</h2>
            </div>
            <div className="hairline-list">
              {standardsByIndustry(industry).map((standard, i) => (
                <div className="hl-row" key={standard.name}>
                  <span className="hl-idx">{String(i + 1).padStart(2, "0")}</span>
                  <b>{standard.name}</b>
                  <span className="hl-desc">{standard[lang]}</span>
                </div>
              ))}
            </div>

            {/* The bridge to the chamber branch, which used to hang off the
                industry page. The two branches share one industry list, but
                the sharing is of slugs, not of categories: the chamber branch
                has no `others` page — its reverberation chambers are filed by
                what they test and its shielded room sits with the commercial
                range — while test standards under `others` exist. Hence the
                guard rather than a link to a 404. */}
            {isChamberIndustry(industry) && (
              <p style={{ marginTop: "40px" }}>
                <SiteLink
                  className="hl-action"
                  style={{ marginLeft: 0 }}
                  href={localeRoute(lang, chamberIndustryPath(industry))}
                >
                  {t.chamberCross} →
                </SiteLink>
              </p>
            )}
          </div>
        ))}
    </>
  );
}

/**
 * Model names stay in the head office's spelling.
 *
 * A row opens rather than navigates, as it does on the chamber branch: the
 * head office's photograph of that instrument and the figures out of its own
 * column in the specification table slide out underneath, and the enquiry
 * inside the panel is already addressed to the model the reader picked.
 *
 * Unlike the chamber branch there is no link to a model page beside it. These
 * instruments have no page of their own — the family page is the page — so no
 * row carries an `href` and `ModelAccordion` is given no label for one.
 *
 * What it has instead, and the chamber branch does not, is the datasheet: the
 * head office publishes a sheet per instrument and none per chamber, so this
 * is the one branch where a row can hand a reader the source document rather
 * than a paraphrase of it. Eighteen of the models have one; the rest draw the
 * two controls they always did (test-system-datasheets.ts).
 *
 * A row with nothing to open stays the plain row it was, which is not an
 * omission but the shape of the source: the head office's amplifier matrix
 * publishes a band and a model name and nothing else, so all seventy
 * amplifiers are rows rather than panels. See the note on `TestModel.desc` and
 * on `testModelBody`.
 */
function ModelList({
  lang,
  models,
  slug,
}: {
  lang: Lang;
  models: readonly TestModel[];
  /** The family this list is on. No row links to it — the family page *is* the
   *  model's page, and a page does not link to itself — but the basket needs
   *  somewhere to point a reader back to, and this is where the instrument is
   *  described. */
  slug: TestProduct;
}) {
  const t = copy[lang];
  const family = localeRoute(lang, testProductPath(slug));
  const rows: AccordionRow[] = models.map((model) => {
    const body = testModelBody(lang, model.name);
    // Absent for most models, and deliberately so — see the note on `byModel`
    // in test-system-datasheets. `asset()` because this becomes a raw
    // `<a href>`, which Next does not rewrite for the base path.
    const doc = datasheetFor(model.name);
    return {
      // The name alone. Every designation in `testModels` is distinct — they
      // are part numbers — so unlike the chamber branch, where seven models
      // share a slug, there is nothing here for an index to disambiguate. It
      // has to hold across the whole page and not just one list: the amplifier
      // page draws eleven of these lists, one per band.
      id: model.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: model.name,
      desc: model.desc,
      shots: modelShots(lang, model.name),
      lead: body.lead,
      facts: body.facts?.map((fact) => ({ label: factLabel[lang][fact.key], value: fact.value })),
      quoteHref: `mailto:${contactEmail}?subject=${encodeURIComponent(
        t.modelQuoteSubject(model.name),
      )}`,
      doc: doc && { href: asset(doc.href), size: doc.size },
      cart: {
        id: `system:${model.name}`,
        name: model.name,
        desc: model.desc,
        from: t.cartFrom,
        href: family,
        lang,
      },
    };
  });

  return (
    <ModelAccordion
      lang={lang}
      rows={rows}
      quote={t.modelQuote}
      docLabel={t.modelDoc}
      /* Never read today — every instrument the head office photographs, it
         photographs once, so no row here has a second frame to step to. Given
         anyway, so that the day a model gets a second picture the stepper it
         grows is already labelled. */
      gallery={{ prev: t.galleryPrev, next: t.galleryNext, frame: t.galleryFrame }}
    />
  );
}

function resolve(lang: Lang, view: TestSystemView): {
  label: string;
  title: string;
  description: string;
  path: string;
  trail: TrailStep[];
  body?: PageBody;
} {
  const overview = testSystemsOverviewMeta[lang];
  const root: TrailStep = { name: overview.label, path: testSystemsPath };

  switch (view.kind) {
    case "overview":
      return {
        label: overview.label,
        title: overview.title,
        description: overview.description,
        path: testSystemsPath,
        trail: [root],
        body: overviewBody[lang],
      };
    case "test": {
      const { label, description } = testCategoryMeta[lang][view.slug];
      const path = testCategoryPath(view.slug);
      return {
        label,
        title: label,
        description,
        path,
        trail: [root, { name: label, path }],
        body: categoryBody[lang][view.slug],
      };
    }
    case "product": {
      const { label, description } = testProductMeta[lang][view.slug];
      const path = testProductPath(view.slug);
      return {
        label,
        title: label,
        description,
        path,
        trail: [root, { name: label, path }],
        body: productBody[lang][view.slug],
      };
    }
    case "standards": {
      const { label, description } = testStandardsMeta[lang];
      return {
        label,
        title: label,
        description,
        path: testStandardsPath,
        trail: [root, { name: label, path: testStandardsPath }],
      };
    }
  }
}

export { testModels, testStandards, chambersPath };
