import ContactPage from "../../../contact-content";
import { contactMeta, contactPath } from "../../../contact-sections";
import { routeMetadata, siteViewport } from "../../../site-metadata";

export const viewport = siteViewport;

export function generateMetadata() {
  const { label, description } = contactMeta.en;
  return routeMetadata("en", contactPath, label, description);
}

export default function Page() {
  return <ContactPage lang="en" />;
}
