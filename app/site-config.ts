// Shared routing for local development, static export and GitHub Pages.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export type Lang = "zh" | "en";

/** Chinese is the default; English has the /en prefix. */
export const languages = [
  ["zh", "中文", "简体中文", "/"],
  ["en", "EN", "English", "/en"],
] as const satisfies readonly (readonly [Lang, string, string, string])[];
export const defaultLang: Lang = "zh";
export const langPath = (lang: Lang) => languages.find(([code]) => code === lang)![3];
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";

// Jiashan handles sales enquiries; MyChamber retains the head office in copy.
export const contactEmail = "sales@emc-frankonia.com";
export const enquiryEmail = contactEmail;
export const enquiryCc = "sales@frankoniagroup.com";
export const contactPhone = "+86 573 8473 1555";
export const contactPhoneHref = "tel:+8657384731555";
export const headOfficeUrl = "https://frankonia-solutions.com";
export const isIndexable = process.env.NEXT_PUBLIC_INDEXABLE === "1";

// The local CyberShield summary is translated. Use the existing English
// product site until a Chinese destination has been confirmed.
const cyberShieldDestinations: Record<Lang, string> = {
  zh: "https://www.frankonia-cybershield.com/",
  en: "https://www.frankonia-cybershield.com/",
};
export const cyberShieldUrl = (lang: Lang) => cyberShieldDestinations[lang];

export const asset = (path: string) => `${basePath}${path}`;
export const route = (path: string) => {
  const withBase = `${basePath}${path}`;
  return withBase.endsWith("/") ? withBase : `${withBase}/`;
};
export const localeRoute = (lang: Lang, path = "") => {
  const prefix = langPath(lang);
  return route(prefix === "/" ? path || "/" : `${prefix}${path}`);
};
export const localeUrl = (lang: Lang, path = "") => `${siteOrigin}${localeRoute(lang, path)}`;
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
