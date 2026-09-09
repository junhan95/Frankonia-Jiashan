import { contactPath } from "./contact-sections";
import SiteLink from "./site-link";
import { contactEmail, localeRoute, type Lang } from "./site-config";

/** Strings the contact band needs, wherever it is reused. */
export type BandCopy = {
  ctK: string;
  ctH: string;
  ctP: string;
  ctB1: string;
  ctB2: string;
};

/**
 * The band that closes every page, the landing included — the last step of the
 * polarity ladder before the footer (디자인.md §3.3).
 *
 * It was red until the September round. It is `--canvas-soft` now: the head
 * office asked for the light colours and for red to stop being a surface, and
 * a page that ends canvas → soft → ink says the same thing this band was
 * saying without shouting it. The primary button turned red in the same move —
 * see `.band` in globals.css.
 *
 * It used to be the site's entire contact story: a mail link and the German
 * switchboard, on a page whose reader might be in Seoul. Inviting the enquiry
 * is the band's job and carrying five addresses is not, so the primary button
 * opens the contact page and the mail link stays as the shortcut for a reader
 * who already knows what they want to write.
 *
 * Its own file rather than page-shell's, because the landing page renders this
 * band too and page-shell reads the landing's copy table — putting the
 * component there would close an import cycle between the two.
 *
 * `actions` replaces the pair on the one page where the primary button would
 * otherwise link to itself.
 */
export default function ContactBand({
  lang,
  t,
  actions,
}: {
  lang: Lang;
  t: BandCopy;
  actions?: React.ReactNode;
}) {
  return (
    <div className="band" id="contact">
      <span className="kicker">{t.ctK}</span>
      <h2>{t.ctH}</h2>
      <p>{t.ctP}</p>
      <div className="btns">
        {actions ?? (
          <>
            <SiteLink className="btn btn-red" href={localeRoute(lang, contactPath)}>{t.ctB1}</SiteLink>
            <a className="btn btn-outline" href={`mailto:${contactEmail}`}>{t.ctB2}</a>
          </>
        )}
      </div>
    </div>
  );
}
