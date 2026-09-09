import { notFound } from "next/navigation";
import ChamberPage from "../../../../../chamber-content";
import {
  chamberTypes,
  isChamberType,
  typeMeta,
  typePath,
} from "../../../../../chamber-sections";
import { routeMetadata, siteViewport } from "../../../../../site-metadata";

export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return chamberTypes.map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isChamberType(type)) notFound();
  const { label, description } = typeMeta.en[type];
  return routeMetadata("en", typePath(type), label, description);
}

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isChamberType(type)) notFound();
  return <ChamberPage lang="en" view={{ kind: "type", slug: type }} />;
}
