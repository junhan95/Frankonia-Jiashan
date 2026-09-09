import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { basePath } from "./site-config";

/**
 * Every link on the site, internal or not.
 *
 * The site is 139 static pages that share a header, a footer and a stylesheet,
 * and until now every one of the ~30 links in that header was a plain `<a>`.
 * A plain `<a>` throws all of that away on each click: the browser tears the
 * document down, re-parses 110 KB of HTML, re-runs 640 KB of framework script
 * and re-mounts a header that is byte-for-byte the one it just destroyed —
 * with a blank frame in the middle where the reader watches it happen.
 *
 * `next/link` keeps the document. It fetches the new route's RSC payload —
 * already on disk beside the HTML because `output: export` writes both — and
 * swaps only the part of the tree that differs. The header, the footer, the
 * stylesheet and the typefaces are never touched. And because the router
 * prefetches a route once its link is on screen, the payload for anywhere a
 * reader can see is usually already in memory when they click — but *which*
 * prefetch is the whole story here, and the note above the default `prefetch`
 * below is worth reading before changing it.
 *
 * This wrapper exists so that is the default rather than a decision made 69
 * times. An off-site href, a `mailto:`, a `tel:` or a same-page `#anchor` has
 * nothing for the router to do, and falls through to the `<a>` it always was.
 *
 * The one deliberate exception is `lang-switch.tsx`: the two locales have
 * separate root layouts, so crossing between them is a document load however
 * it is written.
 */
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Passed through to `next/link`. Read the note on the default below before
   *  setting this to `true` on any link — on this Next, `true` is not "more
   *  of the default". */
  prefetch?: boolean | "auto";
  href: string;
};

/**
 * `"auto"`, and never `true`. The difference is not a tuning decision — one of
 * these two values stops the navigation bar from working.
 *
 * The symptom, on Next 16.2.6 with `output: export`: a link the pointer has
 * hovered stops navigating. The click reaches the anchor, `next/link` calls
 * preventDefault on it so the browser does not follow the href either, and then
 * nothing happens — no request, no history entry, no error in the console. The
 * reader is left on the page they were on. Since a mouse cannot reach a menu
 * item without hovering it, that is the whole bar dead for anyone using one.
 *
 * The hover is what breaks it: `onMouseEnter` calls `onNavigationIntent`, which
 * reschedules that link's prefetch task at Intent priority (see
 * next/dist/client/components/links.js). A click with no real pointer over the
 * link — synthetic, or Enter on a focused anchor — still navigates, which is
 * why this survives checks driven from a script and is caught by a reader with
 * a mouse. It is also why the browser-pane checks missed it: an undisplayed
 * pane never fires the IntersectionObserver, so no link is ever "visible" and
 * `rescheduleLinkPrefetch` returns before it can schedule anything.
 *
 * But it is the *strategy*, not prefetching as such. `prefetch={true}` maps to
 * `FetchStrategy.Full`, which fetches a route as one dynamic request — and a
 * static export has no server to answer one, so the task never settles and the
 * navigation waits on it forever. `"auto"` maps to `FetchStrategy.PPR`, which
 * reads the per-segment files the export writes beside each page
 * (`__next._tree.txt`, `__next._head.txt`, one per segment). Those exist, so
 * the task completes and the click is served from cache.
 *
 * Measured on a production-shaped build (140 pages, no basePath) served over an
 * emulated 350 ms / 1.5 Mbit link, which is what Seoul → Hetzner looks like.
 * Median of five hover-then-click runs per cell, click to the frame the new
 * page is in:
 *
 *   prefetch    bar entry     panel child     landing load
 *   true        never         never           —
 *   false       936 ms        889 ms          25 requests, 2.2 MB
 *   "auto"      627 ms        677 ms          72 requests, 3.3 MB
 *
 * `"auto"` went through eighty-odd hover-navigations — every entry in the bar,
 * both panel kinds, throttled and not — without one hang; `true` hung on the
 * first attempt every time. First paint and LCP are unchanged between `false`
 * and `"auto"` (2.0 s / 7.2 s either way): the prefetches are low priority and
 * stay off the critical path. What they cost is the extra ~1.1 MB, and what
 * they buy is the 200–300 ms above.
 *
 * `false` is the safe fallback and costs only speed: set it here if a link is
 * ever seen hanging again. Re-test `true` on a later Next — the upstream fix
 * would make it the better default again.
 */
export default function SiteLink({ href, prefetch = "auto", ...rest }: Props) {
  if (!isRoute(href)) {
    return <a href={href} {...rest} />;
  }

  return <Link href={unbase(href)} prefetch={prefetch} {...rest} />;
}

/**
 * Whether this href is a route on this site.
 *
 * A route starts with a single slash. That excludes `//host/path`, every
 * absolute URL, `mailto:`/`tel:`, and the `#anchor` links the landing page and
 * the CyberShield page use to move within themselves — none of which the
 * router handles, and all of which an `<a>` handles correctly.
 *
 * Files served from `public/` also start with a slash, and the router would be
 * wrong about those: `/frankonia-catalogue.pdf` is a download, not a page. The
 * extension test catches them. Every real route on this site ends in `/`
 * (`trailingSlash: true`), so there is nothing to mistake in the other
 * direction.
 */
const isRoute = (href: string) =>
  href.startsWith("/") && !href.startsWith("//") && !/\.[a-z0-9]+$/i.test(href);

/**
 * Take the base path back off.
 *
 * `route()` in site-config prepends it because raw `<a href>` and `<img src>`
 * do not get Next's rewriting — and `next/link` is the one thing that does, so
 * handing it a prefixed href would produce `/Frankonia-Korea/Frankonia-Korea/`
 * on the GitHub Pages build. Stripping here rather than asking every caller to
 * pass a different href keeps one form of an internal route in the codebase:
 * the prefixed one, which is also what the canonical URLs and the sitemap
 * need. In production the base path is empty and this does nothing.
 */
const unbase = (href: string) =>
  basePath && href.startsWith(basePath) ? href.slice(basePath.length) || "/" : href;
