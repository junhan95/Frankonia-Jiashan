import { notFound } from "next/navigation";
import TestSystemPage from "../../../../../test-system-content";
import {
  isTestCategory,
  testCategories,
  testCategoryMeta,
  testCategoryPath,
} from "../../../../../test-system-sections";
import { routeMetadata, siteViewport } from "../../../../../site-metadata";

export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return testCategories.map((test) => ({ test }));
}

export async function generateMetadata({ params }: { params: Promise<{ test: string }> }) {
  const { test } = await params;
  if (!isTestCategory(test)) notFound();
  const { label, description } = testCategoryMeta.en[test];
  return routeMetadata("en", testCategoryPath(test), label, description);
}

export default async function Page({ params }: { params: Promise<{ test: string }> }) {
  const { test } = await params;
  if (!isTestCategory(test)) notFound();
  return <TestSystemPage lang="en" view={{ kind: "test", slug: test }} />;
}
