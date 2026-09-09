import type { NextConfig } from "next";

// The default build targets a Node server (Vercel or self-hosted). Setting
// STATIC_EXPORT=1 switches to a plain static build for GitHub Pages, so both
// deployment targets keep working from the same source.
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      trailingSlash: true,
      basePath: basePath || undefined,
      images: { unoptimized: true },
      // No `distDir` here, however tempting it looks. Under `output: "export"`
      // Next reads it as the *export* directory and forces the build directory
      // back to `.next` (`hasCustomExportOutput` in next/dist/export/utils).
      // So setting it does not keep a static build off the manifests an open
      // `next dev` is holding — the thing it would be for — and it does move
      // the export out of `out/`, where the tests and `deploy/upload.py` look.
      // Set to ".next-static" on 13 August 2026, that left `npm test` asserting
      // against a stale export and would have uploaded one: the export was in
      // `.next-static/` and `out/` still held the previous commit's build.
      // If a dev server does get poisoned by a concurrent build, restart it.
    }
  : {};

export default nextConfig;
