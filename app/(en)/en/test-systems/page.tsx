import TestSystemPage from "../../../test-system-content";
import { testSystemsOverviewMeta, testSystemsPath } from "../../../test-system-sections";
import { routeMetadata, siteViewport } from "../../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { title, description } = testSystemsOverviewMeta.en;
  return routeMetadata("en", testSystemsPath, title, description);
}

export default function Page() {
  return <TestSystemPage lang="en" view={{ kind: "overview" }} />;
}
