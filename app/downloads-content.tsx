import DownloadCards from "./download-cards";
import {
  downloadCopy,
  downloadSets,
  downloadsMeta,
  downloadsPath,
  type DownloadGroup,
  type DownloadSet,
} from "./downloads-sections";
import StructuredData from "./structured-data";
import PageShell from "./page-shell";
import { closingLine } from "./page-closing";
import type { Lang } from "./site-config";

/**
 * The downloads hub.
 *
 * Until now this route rendered through `ChamberPage` and produced the same
 * "documents on request" stub every unwritten chamber page produced — a page
 * whose own title, whose search snippet and whose entry in the Contact menu
 * all promised files, and which then offered an email address instead. The
 * files exist; the hub now serves them.
 *
 * The shape is the head office's: a thumbnail of the cover, the document's
 * title under it, and the whole thing is the link. What is added here is the
 * line a download page needs and its page does not carry — format, extent and
 * weight — because a reader on a metered connection is deciding whether to
 * start a 16 MB transfer, and most of these files are over 2 MB.
 *
 * The hub is the chamber download area. The head office's other one, the
 * test-system product catalogues, is not published here or anywhere else on
 * the site — see the note over `downloadAreas` in downloads-sections.
 *
 * Which files, where they come from, and what was changed on the way is in
 * docs/source/downloads.md.
 */

const copy = {
  zh: {
    eyebrow: "DOWNLOADS",
    lead: [
      "Frankonia 的腔室目录和证书以 PDF 形式提供。暗室目录和相册可直接从该网站下载，服务组合和 ISO 9001 证书可从我们的服务器下载。",
      "如果所需材料未列出，或者您需要特定型号的规格或图纸，请联系我们。负责工程师会检查并回复。",
    ],
  },
  en: {
    eyebrow: "DOWNLOADS",
    lead: [
      "Frankonia's chamber catalogues and certificates, as PDF. The chamber catalogue and the photobook are served from this site; the service portfolio and the ISO 9001 certificate come from the head office's own server.",
      "If what you need is not here — a specification, a drawing, a standard for one particular model — tell us and an engineer will go through it and come back to you.",
    ],
  },
} as const;

export default function DownloadsPage({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const { label, description } = downloadsMeta[lang];

  return (
    <>
      <StructuredData
        lang={lang}
        page="path"
        path={downloadsPath}
        trail={[{ name: label, path: downloadsPath }]}
        description={description}
      />
      <PageShell lang={lang} eyebrow={t.eyebrow} title={label} intro={description} closing={closingLine(lang, downloadsPath)}>
        <section>
          <div className="wrap">
            <div className="prose">
              {t.lead.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
        </section>

        {/* The head office's download areas that belong here, in its own
            order. `.alt` on the first because the lead band above it is plain —
            the same alternation every other page here runs, counted rather
            than written down. */}
        {downloadSets.map((set, i) => (
          <section key={set.key} className={i % 2 === 0 ? "alt" : undefined}>
            <div className="wrap">
              <Set lang={lang} set={set} />
            </div>
          </section>
        ))}
      </PageShell>
    </>
  );
}

/** One download area: its heading, then its groups. */
function Set({ lang, set }: { lang: Lang; set: DownloadSet }) {
  const c = downloadCopy[lang];
  const setKey = set.key as keyof typeof c.setTitle;

  return (
    <>
      <div className="sec-head">
        <span className="kicker">{c.setKicker[setKey]}</span>
        <h2>{c.setTitle[setKey]}</h2>
      </div>
      {set.groups.map((group) => (
        <Group key={group.key} lang={lang} set={set} group={group} />
      ))}
    </>
  );
}

/**
 * One heading from the head office's page, and the files under it.
 *
 * The sub-head is dropped where a set has only one group: a lone group's
 * heading and the band's own `h2` are the same words two lines apart, which is
 * a heading repeating itself.
 */
function Group({ lang, set, group }: { lang: Lang; set: DownloadSet; group: DownloadGroup }) {
  const c = downloadCopy[lang];
  const only = set.groups.length === 1;
  const groupKey = `${set.key}/${group.key}` as keyof typeof c.groupTitle;

  return (
    <div className="list-group">
      {!only && <h3 className="sub-head">{c.groupTitle[groupKey]}</h3>}
      <DownloadCards lang={lang} files={group.files} />
    </div>
  );
}
