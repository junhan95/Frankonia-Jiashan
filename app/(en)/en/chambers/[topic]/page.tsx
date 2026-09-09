import { notFound } from "next/navigation";
import ChamberPage from "../../../../chamber-content";
import {
  chamberTopics,
  isChamberTopic,
  topicMeta,
  topicPath,
} from "../../../../chamber-sections";
import { routeMetadata, siteViewport } from "../../../../site-metadata";

export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return chamberTopics.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  if (!isChamberTopic(topic)) notFound();
  const { label, description } = topicMeta.en[topic];
  return routeMetadata("en", topicPath(topic), label, description);
}

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  if (!isChamberTopic(topic)) notFound();
  return <ChamberPage lang="en" view={{ kind: "topic", slug: topic }} />;
}
