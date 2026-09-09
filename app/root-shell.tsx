import "./globals.css";
import NavProgress from "./nav-progress";
import type { Lang } from "./site-config";

/** Separate root layouts ensure each exported page has the correct language
 * and loads only the fonts needed by its locale. */
export default function RootShell({ lang, fontClass, children }: Readonly<{
  lang: Lang; fontClass: string; children: React.ReactNode;
}>) {
  return (
    <html lang={lang === "zh" ? "zh-CN" : "en"} className={fontClass} data-scroll-behavior="smooth">
      <body>
        <NavProgress />
        {children}
      </body>
    </html>
  );
}
