import MyChamberPage from "../../../mychamber-content";
import { mychamberMeta, mychamberPath } from "../../../mychamber-sections";
import { routeMetadata, siteViewport } from "../../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { label, description } = mychamberMeta.en;
  return routeMetadata("en", mychamberPath, label, description);
}

export default function Page() {
  return <MyChamberPage lang="en" />;
}
