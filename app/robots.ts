import type { MetadataRoute } from "next";
import { isIndexable, route, siteOrigin } from "./site-config";

export const dynamic = "force-static";

/**
 * Written for the day this site gets its own domain. On the current GitHub
 * Pages project path it is served at /Frankonia-Korea/robots.txt, which
 * crawlers do not read — they only fetch robots.txt from the host root. On
 * the staging URL indexing is therefore held back by the per-page robots meta
 * tag in site-metadata.ts instead.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Answer engines are welcome: the technical content is the point.
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: `${siteOrigin}${route("/")}sitemap.xml`,
    host: siteOrigin,
  };
}
