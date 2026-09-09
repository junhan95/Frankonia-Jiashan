import { notFound } from "next/navigation";
import CompanyPage from "../../../../company-content";
import { companySections, isCompanySection } from "../../../../company-sections";
import { companyMetadata, siteViewport } from "../../../../site-metadata";

/** All five sections are known at build time; anything else is a 404 rather
 *  than an attempt to render an unknown slug. */
export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return companySections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isCompanySection(section)) notFound();
  return companyMetadata("en", section);
}

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isCompanySection(section)) notFound();
  return <CompanyPage lang="en" section={section} />;
}
