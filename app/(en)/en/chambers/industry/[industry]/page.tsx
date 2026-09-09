import { notFound } from "next/navigation";
import ChamberPage from "../../../../../chamber-content";
import {
  chamberIndustries,
  chamberIndustryMeta,
  industryPath,
  isChamberIndustry,
} from "../../../../../chamber-sections";
import { industryLabel } from "../../../../../industries";
import { routeMetadata, siteViewport } from "../../../../../site-metadata";

export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return chamberIndustries.map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  if (!isChamberIndustry(industry)) notFound();
  const { description } = chamberIndustryMeta.en[industry];
  return routeMetadata("en", industryPath(industry), industryLabel.en[industry], description);
}

export default async function Page({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  if (!isChamberIndustry(industry)) notFound();
  return <ChamberPage lang="en" view={{ kind: "industry", slug: industry }} />;
}
