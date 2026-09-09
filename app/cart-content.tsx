import { cartMeta, cartPath } from "./cart-sections";
import CartView from "./cart-view";
import { chambersPath } from "./chamber-sections";
import { mychamberPath } from "./mychamber-sections";
import PageShell, { type HeadShot } from "./page-shell";
import { closingLine } from "./page-closing";
import StructuredData from "./structured-data";
import { testSystemsPath } from "./test-system-sections";
import { localeRoute, type Lang } from "./site-config";

/* The head band. My Enquiry stood without a photograph until now, on the argument
   that the page's content is the reader's own list; in the bar, though, it sits
   beside My Chamber and CyberShield, and it was the one entry there whose head
   carried no photograph at all — the exception read as an omission rather than
   as an argument.
   The SAC-5 Plus panorama from Heideck: the third of the head office's three
   360° frames and the only one not already heading a band — the chambers index
   opens on SAC-10 Hybrid and My Chamber on FAC-3, so My Enquiry reads as their
   sibling without repeating either. The same 4:1 crop that survives a band this
   shallow, and its two antenna masts stand at the edges rather than the middle,
   which keeps the right half — the half the scrim clears — occupied. Framed a
   shade above centre: the absorber walls and the mast heads, not the floor. */
const cartShot: HeadShot = {
  src: "/chambers/images/pano-sac-5-plus.webp", w: 2000, h: 500, at: "50% 44%",
};

/**
 * The My Enquiry page. A server component that renders the chrome and hands the
 * basket view the three routes its empty state offers — the route tables stay
 * on this side of the boundary, as they do for MyChamber.
 */
export default function MyEnquiryPage({ lang }: { lang: Lang }) {
  const meta = cartMeta[lang];

  return (
    <>
      <StructuredData
        lang={lang}
        page="path"
        path={cartPath}
        trail={[{ name: meta.label, path: cartPath }]}
        description={meta.description}
      />
      <PageShell
        lang={lang}
        eyebrow="MY ENQUIRY"
        title={meta.title}
        intro={meta.description}
        shot={cartShot}
        closing={closingLine(lang, cartPath)}
      >
        <CartView
          lang={lang}
          links={{
            mychamber: localeRoute(lang, mychamberPath),
            chambers: localeRoute(lang, chambersPath),
            systems: localeRoute(lang, testSystemsPath),
          }}
        />
      </PageShell>
    </>
  );
}
