import { notFound } from "next/navigation";
import ChamberPage from "../../../../chamber-content";
import {
  chamberModelSlugs,
  isChamberModelSlug,
  modelMeta,
  modelPath,
} from "../../../../chamber-sections";
import { routeMetadata, siteViewport } from "../../../../site-metadata";

export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return chamberModelSlugs.map((model) => ({ model }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  if (!isChamberModelSlug(model)) notFound();
  const { label, description } = modelMeta.zh[model];
  return routeMetadata("zh", modelPath(model), label, description);
}

export default async function Page({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  if (!isChamberModelSlug(model)) notFound();
  return <ChamberPage lang="zh" view={{ kind: "model", slug: model }} />;
}
