import { notFound } from "next/navigation";
import TestSystemPage from "../../../../../test-system-content";
import {
  isTestProduct,
  testProductMeta,
  testProductPath,
  testProducts,
} from "../../../../../test-system-sections";
import { routeMetadata, siteViewport } from "../../../../../site-metadata";

export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return testProducts.map((product) => ({ product }));
}

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }) {
  const { product } = await params;
  if (!isTestProduct(product)) notFound();
  const { label, description } = testProductMeta.en[product];
  return routeMetadata("en", testProductPath(product), label, description);
}

export default async function Page({ params }: { params: Promise<{ product: string }> }) {
  const { product } = await params;
  if (!isTestProduct(product)) notFound();
  return <TestSystemPage lang="en" view={{ kind: "product", slug: product }} />;
}
