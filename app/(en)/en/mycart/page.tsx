import CartRedirect from "../../../cart-redirect";
import { cartMeta, legacyCartPath } from "../../../cart-sections";
import { routeMetadata, siteViewport } from "../../../site-metadata";

export const viewport = siteViewport;

/** The old address keeps the page's own name so a reader who lands here from a
 *  bookmark sees the destination in the tab, not a dead route. */
export function generateMetadata() {
  const { label, description } = cartMeta.en;
  return routeMetadata("en", legacyCartPath, label, description);
}

export default function Page() {
  return <CartRedirect lang="en" />;
}
