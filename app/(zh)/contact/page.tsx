import ContactPage from "../../contact-content";
import { contactMeta, contactPath } from "../../contact-sections";
import { routeMetadata, siteViewport } from "../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { label, description } = contactMeta.zh;
  return routeMetadata("zh", contactPath, label, description);
}

export default function Page() {
  return <ContactPage lang="zh" />;
}
