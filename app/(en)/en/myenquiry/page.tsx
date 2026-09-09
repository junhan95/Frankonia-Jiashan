import MyEnquiryPage from "../../../cart-content";
import { cartMeta, cartPath } from "../../../cart-sections";
import { routeMetadata, siteViewport } from "../../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { label, description } = cartMeta.en;
  return routeMetadata("en", cartPath, label, description);
}

export default function Page() {
  return <MyEnquiryPage lang="en" />;
}
