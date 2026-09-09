import {
  downloadCopy,
  fileSize,
  isOffsite,
  type DownloadFile,
} from "./downloads-sections";
import { asset, type Lang } from "./site-config";

/**
 * A grid of download cards.
 *
 * It lives here rather than inside `downloads-content` because the two head
 * office download areas are no longer printed in the same place: the chamber
 * area is the downloads hub, the test-system catalogues are printed at the
 * foot of the EMC Test Systems index, beside the request card that used to be
 * the only thing there. Both draw this. The reason for the split is in
 * docs/source/downloads.md §4.
 */

const copy = {
  zh: {
    /** Under the thumbnail, in the meta line. */
    pages: (n: number) => `${n} 页`,
    offsite: "总部服务器",
    /** Read by a screen reader in place of the bare title, so the link says
     *  what pressing it does. */
    label: (title: string, size: string) => `${title} — PDF ${size} 下载`,
  },
  en: {
    pages: (n: number) => (n === 1 ? "1 page" : `${n} pages`),
    offsite: "Head office",
    label: (title: string, size: string) => `${title} — download PDF, ${size}`,
  },
} as const;

export default function DownloadCards({
  lang,
  files,
}: {
  lang: Lang;
  files: readonly DownloadFile[];
}) {
  return (
    <div className="dl-grid">
      {files.map((file) => <Card key={file.key} lang={lang} file={file} />)}
    </div>
  );
}

/**
 * One file.
 *
 * The whole card is the anchor, as the chamber and test-system rows are: a
 * thumbnail that lifts on hover and a heading that turns red is a promise of a
 * click, and on this page every part of it keeps that promise.
 *
 * `target="_blank"` on all fifteen, not only the off-site ones. A PDF followed
 * in the same tab replaces the site with a viewer the reader then has to back
 * out of — and the two served from here are 16 MB and 15 MB, which is a long
 * blank tab if it is the one they were reading. `rel="noopener"` and no
 * `noreferrer` on the off-site ones, as on the footer's head-office link.
 */
function Card({ lang, file }: { lang: Lang; file: DownloadFile }) {
  const t = copy[lang];
  const c = downloadCopy[lang];
  const size = fileSize(file.bytes);
  const offsite = isOffsite(file);

  return (
    <a
      className="dl"
      href={offsite ? file.href : asset(file.href)}
      target="_blank"
      rel="noopener"
      aria-label={t.label(file.title, size)}
    >
      <div className="dl-shot">
        {/* Decorative: it is the cover of the document the heading names, so a
            description of it would be the heading read twice. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(file.cover.src)}
          alt=""
          width={file.cover.w}
          height={file.cover.h}
          loading="lazy"
          decoding="async"
        />
        {file.docLang && <span className="dl-lang">{file.docLang}</span>}
      </div>
      <div className="dl-body">
        <h4>{file.title}</h4>
        <p>{c.blurb[file.key as keyof typeof c.blurb]}</p>
        <div className="dl-meta">
          <span>PDF</span>
          <span>{t.pages(file.pages)}</span>
          <span>{size}</span>
          {offsite && <span className="dl-offsite">{t.offsite}</span>}
        </div>
      </div>
    </a>
  );
}
