import PageShell from "./page-shell";
import SiteLink from "./site-link";
import StructuredData from "./structured-data";
import { cartMeta, cartPath, legacyCartPath } from "./cart-sections";
import { localeRoute, type Lang } from "./site-config";

/**
 * The old `/mycart` address, kept alive.
 *
 * The feature was renamed MyCart → My Enquiry in the head office's August
 * review, but the route was not renamed with it, so the September one found the
 * bar saying one thing and the address bar another. `/myenquiry` is the address
 * now; this page is what the old one became, because it was linked from the
 * review mails and from whatever anyone bookmarked in between.
 *
 * A meta refresh rather than a server redirect: this is a static export with no
 * server in front of it to answer with a 301. React hoists the tag into <head>
 * wherever it is rendered. The link underneath is not decoration — it is what a
 * reader gets if the refresh is blocked.
 *
 * Full chrome rather than a bare tag, because every page in this export carries
 * the bar, the language switcher and its own JSON-LD, and the tests hold that
 * invariant for all of them. Nobody should see this page for longer than it
 * takes to leave it, but a page that lands here with no way out is worse than
 * one that costs a few kilobytes.
 */
export default function CartRedirect({ lang }: { lang: Lang }) {
  const href = localeRoute(lang, cartPath);
  const meta = cartMeta[lang];
  const t = copy[lang];

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${href}`} />
      <StructuredData
        lang={lang}
        page="path"
        path={legacyCartPath}
        trail={[{ name: meta.label, path: legacyCartPath }]}
        description={meta.description}
      />
      <PageShell lang={lang} eyebrow="MY ENQUIRY" title={meta.title} intro={t.moved}>
        <section className="wrap redirect-note">
          <p>{t.wait}</p>
          <SiteLink className="btn btn-red" href={href}>{t.go}</SiteLink>
        </section>
      </PageShell>
    </>
  );
}

const copy = {
  zh: {
    moved: "本页地址已更改为/myenquiry。",
    wait: "过一会儿就会自动移动。如果它没有移动，请单击下面的按钮。",
    go: "打开我的询盘",
  },
  en: {
    moved: "This page has a new address: /myenquiry.",
    wait: "You are being taken there now. If nothing happens, use the button below.",
    go: "Open My Enquiry",
  },
} as const;
