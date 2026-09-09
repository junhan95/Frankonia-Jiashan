import type { ReactNode } from "react";
import {
  chamberIndustries,
  chamberModels,
  chamberPanoramas,
  chamberTypes,
  chamberIndustryMeta,
  chambersOverviewMeta,
  chambersPath,
  industryBody,
  industryPath,
  modelBody,
  modelMeta,
  modelPath,
  modelsByIndustry,
  modelsBySlug,
  modelsByType,
  overviewBody,
  panoramaSize,
  referenceCountryLabel,
  referenceGroups,
  topicBody,
  topicMeta,
  topicPath,
  typeBody,
  typeMeta,
  typePath,
  type ChamberIndustry,
  type ChamberModel,
  type ChamberTopic,
  type ChamberType,
  type ModelBody,
  type TopicBody,
} from "./chamber-sections";
import { modelShots } from "./chamber-gallery";
import { industryLabel } from "./industries";
import ModelAccordion, { type AccordionRow } from "./model-accordion";
import { CheckColumn, Groups, Lead, Tables } from "./page-parts";
import PageShell, { type HeadShot } from "./page-shell";
import { closingLine } from "./page-closing";
import StructuredData, { type TrailStep } from "./structured-data";
import SiteLink from "./site-link";
import { asset, contactEmail, localeRoute, type Lang } from "./site-config";

/**
 * Every page in the Anechoic Chambers branch.
 *
 * The overview, the four industry indexes, the six chamber-type indexes and the
 * five technology topics all carry their copy from the 2026 catalogue.
 *
 * The downloads hub used to render through here too, as a seventh view with no
 * body — which meant it fell through to `Stub` and offered its files by email.
 * It has its own files and its own component now (app/downloads-content.tsx);
 * it was never part of this branch except in where its route was written.
 */

export type ChamberView =
  | { kind: "overview" }
  | { kind: "industry"; slug: ChamberIndustry }
  | { kind: "type"; slug: ChamberType }
  | { kind: "topic"; slug: ChamberTopic }
  /** One model, by `ChamberModel.slug` — a string rather than a union because
   *  the slugs are derived from the model list, not declared beside it. */
  | { kind: "model"; slug: string };

const copy = {
  zh: {
    eyebrow: "ANECHOIC CHAMBERS",
    byIndustry: "按行业组别",
    byType: "按腔室类型",
    browse: "搜索",
    models: "型号",
    specs: "规格",
    specsTitle: "结构及尺寸",
    /* No count in either of these, and none in the reference kicker below.
       A line that says how many models a category holds has to be rewritten
       every time the catalogue grows, and HQ's August 2026 review asked for
       chamber figures to come off the site besides: with custom builds there
       are always more than the number printed, and the number reads as the
       whole portfolio. The industry rows carry `chamberIndustryMeta.note`
       instead, the same way the chamber-type rows carry `typeMeta.note`. */
    modelsTitle: "适用机型",
    referenceKicker: "世界各地安装地点",
    /**
     * Over the tables. Three things a reader needs at this point, in the order
     * they need them: these are standard sizes and yours will probably differ,
     * the figures are the outside of the chamber and not the room they get,
     * and here is what to do next.
     *
     * The second line is the one that was missing. `External dimension` is the
     * column head, and a reader planning a hall has to know whether to subtract
     * the lining before it means anything — so the note says it in words rather
     * than leaving the header to carry it.
     *
     * Where the figures came from is not on the page: that belongs in
     * docs/source/chambers-models.md, not in front of someone sizing a room.
     */
    specsNote: "Frankonia标准配置。尺寸是外部尺寸，指的是腔体本身的尺寸，而不是有效的内部空间。尺寸和配置可以调整以适应安装空间和应用标准。请联系我们获取详细图纸和报价。",
    overview: "一览",
    /** Not rendered at the moment: the panel no longer offers the model page,
     *  and `ModelAccordion` draws that button only when it is given a label.
     *  Kept, with its counterpart below, so restoring the control is a matter
     *  of passing the prop again. */
    modelMore: "查看型号详情",
    /** Beside it. The mail opens with the model already in the subject, so the
     *  reader is not asked to name again what they just picked out of twelve. */
    modelQuote: "获取报价",
    modelQuoteSubject: (name: string) => `[报价查询] ${name}`,
    /** Printed in My Enquiry and in the enquiry it writes, so a shortlist says
     *  which part of the catalogue each line came out of. */
    cartFrom: "电波暗室",
    galleryPrev: "上一张照片",
    galleryNext: "下一张照片",
    galleryFrame: "照片 {at} / {of} — 按至下一张照片",
    standardsKicker: "适用标准",
    stubTitle: "我们会将材料寄给您",
    stubBody:
      "有关此项目的详细信息将根据要求发送。请告知所需规格、图纸、适用标准，由负责工程师审核并回复。",
    stubCta: "索取材料和技术咨询",
    subject: (label: string) => `[索取数据] ${label}`,
  },
  en: {
    eyebrow: "ANECHOIC CHAMBERS",
    byIndustry: "By Industry",
    byType: "By Chamber Type",
    browse: "Browse",
    models: "Models",
    specs: "Specifications",
    specsTitle: "Configurations and dimensions",
    modelsTitle: "Models in this category",
    referenceKicker: "Installations worldwide",
    specsNote:
      "Frankonia standard configurations. The dimensions are external — the size of the chamber itself, not the usable volume inside it. Both size and layout can be adapted to your site and to the standards you test against; contact us for a drawing and a quotation.",
    overview: "At a glance",
    /** Unused for now — see the note on the Korean one. */
    modelMore: "View the model page",
    modelQuote: "Request a quote",
    modelQuoteSubject: (name: string) => `[Quote request] ${name}`,
    cartFrom: "Anechoic Chambers",
    galleryPrev: "Previous picture",
    galleryNext: "Next picture",
    galleryFrame: "Picture {at} of {of} — press for the next",
    standardsKicker: "Standards",
    stubTitle: "Documents on request",
    stubBody:
      "Tell us which specification, drawing or standard you need for this, and an engineer will go through it and come back to you.",
    stubCta: "Request documents",
    subject: (label: string) => `[Document request] ${label}`,
  },
} as const;

/* The head band of the chambers index, which is where the Anechoic Chambers
   menu opens.
   The SAC-10 Hybrid panorama from Kösching: a 4:1 frame of one room from wall
   to wall, which is the shape a band this shallow wants — a photograph framed
   for a page loses most of its height here. It also answers the question the
   index asks, which is what all twenty-seven of these are. Framed above centre:
   the absorber ceiling and the far corner, not the floor. */
const overviewShot: HeadShot = {
  src: "/chambers/images/pano-sac-10-hybrid.webp", w: 2000, h: 500, at: "50% 38%",
};

export default function ChamberPage({ lang, view }: { lang: Lang; view: ChamberView }) {
  const t = copy[lang];
  const { label, title, description, path, trail, models, body } = resolve(lang, view);

  /**
   * The bands of the page, in reading order.
   *
   * Which ones exist varies by page — an index has a model list and no
   * panoramas, References has panoramas and no tables, a topic page neither —
   * so the alternating `.alt` fill is counted here rather than written into
   * each band. That is the one thing a hand-written class cannot get right:
   * whether a band has a neighbour above it is not knowable where the band is
   * declared.
   */
  const bands: { key: string; node: ReactNode }[] = [];

  if (body) bands.push({ key: "lead", node: <Lead body={body} /> });
  if (view.kind === "overview") bands.push({ key: "axes", node: <Axes lang={lang} /> });
  // The summary strip sits directly under the lead: it is what a reader checks
  // before deciding whether the rest of the page is about their problem.
  if (body && "overview" in body && body.overview) {
    bands.push({ key: "overview", node: <Overview lang={lang} items={body.overview} /> });
  }
  // A model page does not list itself. The RVC page is the exception the
  // condition is written for — seven models under one slug, and the reader
  // arriving from "RVC XL" needs to see which row is theirs.
  if (models.length > 1 || view.kind !== "model") {
    if (models.length > 0) {
      bands.push({
        key: "models",
        node: <Models lang={lang} models={models} here={view.kind === "model" ? view.slug : undefined} />,
      });
    }
  }
  if (body?.tables?.length) {
    bands.push({
      key: "tables",
      node: <Tables lang={lang} tables={body.tables} kicker={t.specs} title={t.specsTitle} note={body.specsNote ?? t.specsNote} />,
    });
  }
  if (body && "standards" in body && body.standards) {
    bands.push({ key: "standards", node: <Standards lang={lang} groups={body.standards} /> });
  }
  if (body && body.groups.length > 0) bands.push({ key: "groups", node: <Groups body={body} /> });
  // `in` rather than `?.`: the two body shapes add different optional bands to
  // `PageBody`, so the union has neither property in common — narrowing is what
  // says "this one is a topic body" without a cast.
  if (body && "panoramas" in body && body.panoramas) {
    bands.push({ key: "panoramas", node: <Panoramas panoramas={body.panoramas} /> });
  }
  if (body && "references" in body && body.references) {
    bands.push({ key: "references", node: <References lang={lang} references={body.references} /> });
  }
  if (!body) bands.push({ key: "stub", node: <Stub lang={lang} label={label} /> });

  return (
    <>
      <StructuredData lang={lang} page="path" path={path} trail={trail} description={description} />
      <PageShell
        lang={lang}
        eyebrow={t.eyebrow}
        title={title}
        intro={description}
        /* The index only. Every page below it — a type, an industry, a model —
           opens its own subject with a plate a few hundred pixels down, and a
           photograph in the head as well would be two chambers before a
           sentence. */
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

/** The overview's two ways in, side by side — the same pairing the dropdown
 *  makes, so a reader who arrived without using the menu still sees both. */
function Axes({ lang }: { lang: Lang }) {
  const t = copy[lang];

  return (
    <>
      <div className="sec-head">
        <span className="kicker">{t.browse}</span>
        <h2>{t.byIndustry}</h2>
      </div>
      <div className="hairline-list">
        {chamberIndustries.map((industry, i) => (
          <SiteLink className="hl-row" key={industry} href={localeRoute(lang, industryPath(industry))}>
            <span className="hl-idx">{String(i + 1).padStart(2, "0")}</span>
            <b>{industryLabel[lang][industry]}</b>
            <span className="hl-desc">{chamberIndustryMeta[lang][industry].note}</span>
          </SiteLink>
        ))}
      </div>

      <div className="sec-head" style={{ marginTop: "72px" }}>
        <h2>{t.byType}</h2>
      </div>
      <div className="hairline-list">
        {/* What the form is for, the same line the dropdown carries. Both axes
            read a `note` now — six rows reading "12 models · 3 models · 3
            models" told a reader nothing about which of the six was theirs,
            and the industry rows have since given up their counts for the
            same reason. */}
        {chamberTypes.map((type, i) => (
          <SiteLink className="hl-row" key={type} href={localeRoute(lang, typePath(type))}>
            <span className="hl-idx">{String(i + 1).padStart(2, "0")}</span>
            <b>{typeMeta[lang][type].label}</b>
            <span className="hl-desc">{typeMeta[lang][type].note}</span>
          </SiteLink>
        ))}
      </div>
    </>
  );
}

function Models({
  lang,
  models,
  here,
}: {
  lang: Lang;
  models: readonly ChamberModel[];
  here?: string;
}) {
  const t = copy[lang];
  return (
    <>
      <div className="sec-head">
        <span className="kicker">{t.models}</span>
        <h2>{t.modelsTitle}</h2>
      </div>
      <ModelList lang={lang} models={models} here={here} />
    </>
  );
}

/** The head office's Overview strip. Badges rather than a table: four to six
 *  pairs summarising the page, not measurements to compare row by row. The
 *  four-up variant already exists for the landing page's figures. */
function Overview({ lang, items }: { lang: Lang; items: NonNullable<ModelBody["overview"]> }) {
  return (
    <>
      <div className="sec-head">
        <h2>{copy[lang].overview}</h2>
      </div>
      {/* `.badges` carries the grid; `-four` and `-wide` only override its
          column count. Without the base class the strip fell back to block and
          printed six full-width rows. */}
      <div className={`badges badges-compact ${items.length === 4 ? "badges-four" : "badges-wide"}`}>
        {items.map((item) => (
          <div className="bd" key={item.label}>
            <b>{item.value}</b>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/** Typical Product and Verification Standards, in the head office's own
 *  pairing: emission on the left, immunity on the right. */
function Standards({ lang, groups }: { lang: Lang; groups: NonNullable<ModelBody["standards"]> }) {
  return (
    <>
      {groups.map((group, i) => (
        <div key={group.title} style={i > 0 ? { marginTop: "56px" } : undefined}>
          <div className="sec-head">
            {i === 0 && <span className="kicker">{copy[lang].standardsKicker}</span>}
            <h2>{group.title}</h2>
          </div>
          <div className="check-cols">
            {group.columns.map((column) => (
              <CheckColumn key={column.head} head={column.head} items={column.items} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function Panoramas({ panoramas }: { panoramas: NonNullable<TopicBody["panoramas"]> }) {
  return (
    <>
      <div className="sec-head">
        <h2>{panoramas.title}</h2>
        {/* How to use the strip belongs with the heading over all three, not
            repeated under each one. */}
        <p>{panoramas.hint}</p>
      </div>
      {chamberPanoramas.map((pano, i) => {
        const shot = panoramas.shots[pano.key];
        const label = `${pano.model} – ${pano.place}`;
        return (
          <div key={pano.key} style={i > 0 ? { marginTop: "56px" } : undefined}>
            <h3 className="sub-head">
              <b>{pano.model}</b>
              {` – ${pano.place}`}
            </h3>
            <figure className="figure pano">
              {/* The scroller takes the focus and the label: it is the element
                  the arrow keys pan, so it has to be reachable without a
                  pointer. */}
              <div className="pano-scroll" tabIndex={0} role="group" aria-label={label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(pano.src)}
                  alt={shot.alt}
                  width={panoramaSize.w}
                  height={panoramaSize.h}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>{shot.caption}</figcaption>
            </figure>
          </div>
        );
      })}
    </>
  );
}

function References({ lang, references }: { lang: Lang; references: NonNullable<TopicBody["references"]> }) {
  const t = copy[lang];
  return (
    <>
      <div className="sec-head">
        <span className="kicker">{t.referenceKicker}</span>
        <h2>{references.title}</h2>
      </div>
      {/* `EntryList`, not `.hairline-list`: a country's customers run to a dozen
          names and have to wrap, which is exactly the case the entry list
          exists for. */}
      <div className="entry-list">
        {referenceGroups.map((group, i) => (
          <div className="entry" key={group.country}>
            <span className="entry-idx">{String(i + 1).padStart(2, "0")}</span>
            <h4>{referenceCountryLabel[lang][group.country]}</h4>
            <p>{group.customers.join(" · ")}</p>
          </div>
        ))}
      </div>
      <p className="cs-note">{references.note}</p>
    </>
  );
}

function Stub({ lang, label }: { lang: Lang; label: string }) {
  const t = copy[lang];
  return (
    <div className="empty">
      <h4>{t.stubTitle}</h4>
      <p>{t.stubBody}</p>
      <a
        className="btn btn-red"
        href={`mailto:${contactEmail}?subject=${encodeURIComponent(t.subject(label))}`}
      >
        {t.stubCta}
      </a>
    </div>
  );
}

/**
 * Model names stay in the head office's spelling — see the note on
 * ChamberModel.
 *
 * A row opens rather than navigates: the plate and the "at a glance" pairs from
 * the model's own page slide out under it, and the panel is where the reader
 * decides. The panel used to offer the model page as well; it no longer does —
 * see the call to `ModelAccordion` below — so what the reader is offered there
 * is the enquiry and the basket. `lang` is still threaded down for both halves:
 * the panel reads the locale's `modelBody`, and the basket line the locale's
 * route.
 *
 * `here` is the slug of the page the list is on, and those rows carry no
 * `href`. Nothing draws it today, but the field is what the plain-row fallback
 * would navigate to, and a row on the RVC page linking to the RVC page is the
 * one case where that fallback would be wrong.
 *
 * The catalogue figures under the descriptor are deliberately not translated.
 * They are measurements and standard designations, and both have to match the
 * quotation and the drawings a reader compares them against.
 */
function ModelList({
  lang,
  models,
  here,
}: {
  lang: Lang;
  models: readonly ChamberModel[];
  here?: string;
}) {
  const t = copy[lang];
  const rows: AccordionRow[] = models.map((model, i) => {
    // The panel's contents are the model page's own opening plate and summary
    // strip, read from the same table that page renders. Nothing is authored
    // twice, and a model whose page has neither degrades to the plain row.
    const body = modelBody[lang][model.slug];
    const spec = model.spec &&
      [model.spec.size, model.spec.note, model.spec.range].filter((v): v is string => !!v);
    return {
      // The name, not the slug: seven reverberation chambers share a slug, and
      // two rows with one `id` would be two panels with one `aria-controls`.
      id: `${i + 1}-${model.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      name: model.name,
      desc: model.desc,
      spec,
      // The model page's own plate first, then the gallery extras. Both come
      // from the head office's page for this model; only the first has a
      // caption, and the panel does not print captions. `modelShots` is where
      // the one model that must not lead with its page's plate is handled.
      shots: body?.figure ? modelShots(lang, model, body.figure) : undefined,
      lead: body?.lead[0],
      // The page's summary strip minus the pairs that are about the page —
      // see `family` on ModelBody.overview.
      facts: body?.overview?.filter((f) => !f.family),
      href: model.slug === here ? undefined : localeRoute(lang, modelPath(model.slug)),
      quoteHref: `mailto:${contactEmail}?subject=${encodeURIComponent(
        t.modelQuoteSubject(model.name),
      )}`,
      // The basket's copy of the row. Its link is the model page unconditionally,
      // unlike the row's: `here` drops the link because a page should not offer
      // itself, but a basket read a week later on another page should still
      // know where the model lives.
      cart: {
        id: `chamber:${model.name}`,
        name: model.name,
        desc: model.desc,
        spec,
        from: t.cartFrom,
        href: localeRoute(lang, modelPath(model.slug)),
        lang,
      },
    };
  });

  return (
    <ModelAccordion
      plates="photo"
      lang={lang}
      rows={rows}
      /* No `more`, so the panel does not offer the model page. The label is
         what draws that button — `row.href` alone draws nothing — so withholding
         it takes the control off every chamber index at once, and putting it
         back is one prop. The enquiry and the basket stay: they are what a
         reader who has picked a model out of twelve actually wants next. */
      quote={t.modelQuote}
      gallery={{ prev: t.galleryPrev, next: t.galleryNext, frame: t.galleryFrame }}
    />
  );
}

function resolve(lang: Lang, view: ChamberView): {
  label: string;
  title: string;
  description: string;
  path: string;
  trail: TrailStep[];
  models: readonly ChamberModel[];
  /** A union rather than a common supertype: the two shapes add different
   *  optional bands to `PageBody`, and the band list narrows with `in` before
   *  it reads either. */
  body?: TopicBody | ModelBody;
} {
  const chambers = chambersOverviewMeta[lang];
  const root: TrailStep = { name: chambers.label, path: chambersPath };

  switch (view.kind) {
    case "overview":
      return {
        label: chambers.label,
        title: chambers.title,
        description: chambers.description,
        path: chambersPath,
        trail: [root],
        models: [],
        body: overviewBody[lang],
      };
    case "industry": {
      const label = industryLabel[lang][view.slug];
      const { description } = chamberIndustryMeta[lang][view.slug];
      const path = industryPath(view.slug);
      return {
        label,
        title: label,
        description,
        path,
        trail: [root, { name: label, path }],
        models: modelsByIndustry(view.slug),
        body: industryBody[lang][view.slug],
      };
    }
    case "type": {
      const { label, description } = typeMeta[lang][view.slug];
      const path = typePath(view.slug);
      return {
        label,
        title: label,
        description,
        path,
        trail: [root, { name: label, path }],
        models: modelsByType(view.slug),
        body: typeBody[lang][view.slug],
      };
    }
    case "topic": {
      const { label, description } = topicMeta[lang][view.slug];
      const path = topicPath(view.slug);
      return {
        label,
        title: label,
        description,
        path,
        trail: [root, { name: label, path }],
        models: [],
        body: topicBody[lang][view.slug],
      };
    }
    case "model": {
      const { label, description } = modelMeta[lang][view.slug];
      const path = modelPath(view.slug);
      const models = modelsBySlug(view.slug);
      // Three steps, not two: the model's own chamber type is the way back to
      // its siblings, and a reader who arrived from a search result has no
      // other route to them. Every model under one slug shares a type, so the
      // first is as good as any.
      //
      // Except where the type index leads nowhere but here — the shielded room
      // is the only model of its form, and the seven reverberation chambers
      // share this one page. There the step is not a step: the breadcrumb read
      // "Shielded Room › Shielded Room".
      const type = models[0].type;
      const typeIsThisPage = modelsByType(type).every((m) => m.slug === view.slug);
      return {
        label,
        title: label,
        description,
        path,
        trail: typeIsThisPage
          ? [root, { name: label, path }]
          : [root, { name: typeMeta[lang][type].label, path: typePath(type) }, { name: label, path }],
        models,
        body: modelBody[lang][view.slug],
      };
    }
  }
}

/** Re-exported so the routes can build their metadata without importing the
 *  whole meta surface. */
export { chamberModels };
