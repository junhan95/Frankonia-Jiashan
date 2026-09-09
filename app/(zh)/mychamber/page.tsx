import MyChamberPage from "../../mychamber-content";
import { mychamberMeta, mychamberPath } from "../../mychamber-sections";
import { routeMetadata, siteViewport } from "../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { label, description } = mychamberMeta.zh;
  return routeMetadata("zh", mychamberPath, label, description);
}

export default function Page() {
  return <MyChamberPage lang="zh" />;
}
