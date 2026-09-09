import { notFound } from "next/navigation";
import ChamberPage from "../../../../chamber-content";
import {
  chamberIndustries,
  chamberIndustryMeta,
  industryPath,
  isChamberIndustry,
} from "../../../../chamber-sections";
import { industryLabel } from "../../../../industries";
import { routeMetadata, siteViewport } from "../../../../site-metadata";

/** The five industries are known at build time; anything else is a 404 rather
 *  than an attempt to render an unknown slug. */
export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return chamberIndustries.map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  if (!isChamberIndustry(industry)) notFound();
  const { description } = chamberIndustryMeta.zh[industry];
  return routeMetadata("zh", industryPath(industry), industryLabel.zh[industry], description);
}

export default async function Page({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  if (!isChamberIndustry(industry)) notFound();
  return <ChamberPage lang="zh" view={{ kind: "industry", slug: industry }} />;
}
