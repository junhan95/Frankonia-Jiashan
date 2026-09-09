import Landing from "../../landing";
import { pageMetadata, siteViewport } from "../../site-metadata";

export const viewport = siteViewport;
export const metadata = pageMetadata("en");

export default function Page() {
  return <Landing lang="en" />;
}
