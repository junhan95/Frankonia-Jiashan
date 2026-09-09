import LegalPage from "../../legal-content";
import { legalMeta, legalPath } from "../../legal-sections";
import { routeMetadata, siteViewport } from "../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { label, description } = legalMeta.zh.imprint;
  return routeMetadata("zh", legalPath("imprint"), label, description);
}

export default function Page() {
  return <LegalPage lang="zh" section="imprint" />;
}
