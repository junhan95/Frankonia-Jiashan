import LegalPage from "../../legal-content";
import { legalMeta, legalPath } from "../../legal-sections";
import { routeMetadata, siteViewport } from "../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { label, description } = legalMeta.zh.privacy;
  return routeMetadata("zh", legalPath("privacy"), label, description);
}

export default function Page() {
  return <LegalPage lang="zh" section="privacy" />;
}
