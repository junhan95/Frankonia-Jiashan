import Landing from "../landing";
import { pageMetadata, siteViewport } from "../site-metadata";

export const viewport = siteViewport;
export const metadata = pageMetadata("zh");

export default function Page() {
  return <Landing lang="zh" />;
}
