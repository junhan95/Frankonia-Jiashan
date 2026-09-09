import DownloadsPage from "../../downloads-content";
import { downloadsMeta, downloadsPath } from "../../downloads-sections";
import { routeMetadata, siteViewport } from "../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { label, description } = downloadsMeta.zh;
  return routeMetadata("zh", downloadsPath, label, description);
}

export default function Page() {
  return <DownloadsPage lang="zh" />;
}
