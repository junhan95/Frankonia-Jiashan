import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import ContactBand from "./contact-band";
import { headerCopy } from "./landing";
import { asset, type Lang } from "./site-config";

/**
 * One photograph behind a page head.
 *
 * The landing hero cycles four of these and pans each one; a page head holds a
 * single frame and does not move it. The band is a third of the hero's height
 * and a reader passes through it on the way to the page rather than landing on
 * it, so a camera move here would be motion nobody asked to watch — and every
 * sub-page would be running one.
 *
 * `at` is the frame's `object-position`. The default centre is wrong more often
 * than not: what is worth seeing in a chamber is the absorber wall and the mast,
 * not the floor, and cropping a 4:3 photograph into a band this shallow throws
 * away most of the height.
 */
export type HeadShot = { src: string; w: number; h: number; at?: string };

/**
 * Chrome for every page that is not the landing page: header, a compact page
 * head (the landing hero at a third of the height, so a sub-page reads as the
 * same site without competing with it), the content, the page's closing
 * statement, then the shared contact band and footer.
 */
export default function PageShell({
  lang,
  eyebrow,
  title,
  intro,
  shot,
  closing,
  bandActions,
  children,
}: {
  lang: Lang;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  /** The backdrop for the head band. Carried by the first page of each branch
   *  in the nav bar; the pages below them keep the plain soft band. */
  shot?: HeadShot;
  /** The one sentence the page ends on, from `closingLine(lang, path)`. Every
   *  page has one; the type allows its absence because the `/mycart` redirect
   *  is not a page anybody reads to the end. */
  closing?: string;
  /** Replaces the contact band's two buttons. Only the contact page needs it. */
  bandActions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = headerCopy(lang);

  return (
    <>
      <SiteHeader lang={lang} t={t} />

      <main id="main">
        <div className={shot ? "page-head page-head--photo" : "page-head"}>
          {/* Decorative, as on the landing hero: the h1 under it says what the
              page is, and naming the photograph would put a caption in front of
              that sentence. The wrapper is what keeps the scrim on top — see
              `.page-head-media` in globals.css.

              This is the largest thing above the fold on the page, so it is a
              real <img> in the parsed HTML at high priority rather than a CSS
              background that waits for the stylesheet to resolve. */}
          {shot && (
            <div className="page-head-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="page-head-shot"
                src={asset(shot.src)}
                alt=""
                width={shot.w}
                height={shot.h}
                style={shot.at ? { objectPosition: shot.at } : undefined}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          )}
          <div className="wrap">
            <span className="tag">{eyebrow}</span>
            <h1>{title}</h1>
            {intro && <p>{intro}</p>}
          </div>
        </div>

        {children}

        {/* The closing statement. A band of its own and never tinted, which is
            how the About page has ended since the head office's own layout was
            carried over — the short primary rule is the separator, so it reads
            as an ending whether the band above it was plain or `.alt`. See
            page-closing.ts for what the sentence is for. */}
        {closing && (
          <section className="closing">
            <div className="wrap">
              <div className="statement">
                <p>{closing}</p>
              </div>
            </div>
          </section>
        )}

        <ContactBand lang={lang} t={t} actions={bandActions} />
      </main>

      <SiteFooter lang={lang} t={t} />
    </>
  );
}
