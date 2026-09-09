import { sectionMeta, sectionPath, type CompanySection } from "./company-sections";
import { asset, contactEmail, contactPhone, localeUrl, route, siteOrigin, type Lang } from "./site-config";

/**
 * Answer engines and search have to infer entities from prose unless they are
 * stated outright. Everything below is already visible on the page — the
 * founding year, the countries supplied, the standards listed on the cards,
 * the head office address and phone number in the footer — so this only
 * restates it in a machine-readable form. Nothing is asserted here that a
 * reader cannot also see, which is the schema.org rule and the reason the
 * entity still carries no registration number.
 */

const homeUrl = `${siteOrigin}${route("/")}`;
const orgId = `${homeUrl}#organization`;
const siteId = `${homeUrl}#website`;

const localeTag: Record<Lang, string> = { zh: "zh-CN", en: "en" };

/** The Jiashan office, matching the contact page and shared footer. */
const localOffice = {
  "@type": "PostalAddress",
  streetAddress: "No.55, Hongqiao Rd, Zone 4",
  postalCode: "314100",
  addressLocality: "Jiashan",
  addressRegion: "Zhejiang",
  addressCountry: "CN",
};

/* Not a second copy of the number: the rule this file works under is that it
   may only state what the page already prints, and the footer prints whatever
   site-config holds. Keeping its own literal here was how the landing came to
   dial one number while claiming another. */
const telephone = contactPhone;

const organisation = {
  "@type": "Organization",
  "@id": orgId,
  name: "Frankonia",
  alternateName: "Frankonia Group",
  legalName: "Jiashan Frankonia EMC Co., Ltd.",
  url: homeUrl,
  sameAs: ["https://frankonia-solutions.com/"],
  image: `${siteOrigin}${asset("/og.png")}`,
  description:
    "EMC anechoic chamber and test system solutions in Jiashan, China, part of the Frankonia Group.",
  knowsLanguage: ["zh", "en"],
  address: localOffice,
  telephone,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: contactEmail,
    telephone,
    availableLanguage: ["zh", "en"],
  },
};

/** Product families, described by the standards the cards already name. */
const products = (items: readonly ProductInput[]) =>
  items.map(({ id, name, description, standards }) => ({
    "@type": "Product",
    "@id": `${homeUrl}#${id}`,
    name,
    description,
    brand: { "@id": orgId },
    manufacturer: { "@id": orgId },
    additionalProperty: standards.map((value) => ({
      "@type": "PropertyValue",
      name: "Standard",
      value,
    })),
  }));

export type ProductInput = {
  id: string;
  name: string;
  description: string;
  standards: readonly string[];
};

/** A page that states its own path and breadcrumb trail rather than having
 *  them derived here — the chamber branch nests two levels and would otherwise
 *  need its route table duplicated in this file. `trail` excludes the site
 *  root, which is prepended below. */
export type TrailStep = { name: string; path: string };

type Props = {
  lang: Lang;
  description: string;
} & (
  | { page: "landing"; productLines: readonly ProductInput[] }
  | { page: "cybershield" }
  | { page: "company"; section: CompanySection }
  | { page: "path"; path: string; trail: readonly TrailStep[] }
);

export default function StructuredData(props: Props) {
  const { lang, description } = props;
  const path =
    props.page === "landing"
      ? ""
      : props.page === "cybershield"
        ? "/cybershield"
        : props.page === "path"
          ? props.path
          : sectionPath(props.section);
  const pageUrl = localeUrl(lang, path);

  const graph: Record<string, unknown>[] = [
    organisation,
    {
      "@type": "WebSite",
      "@id": siteId,
      url: homeUrl,
      name: "Frankonia",
      publisher: { "@id": orgId },
      inLanguage: Object.values(localeTag),
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      isPartOf: { "@id": siteId },
      inLanguage: localeTag[lang],
      about: { "@id": orgId },
      description,
      primaryImageOfPage: `${siteOrigin}${asset("/og.png")}`,
    },
  ];

  if (props.page === "landing") {
    graph.push(...products(props.productLines));
  }

  if (props.page === "cybershield") {
    graph.push({
      "@type": "Product",
      "@id": `${homeUrl}#cybershield`,
      name: "Frankonia CyberShield",
      description,
      brand: { "@id": orgId },
      manufacturer: { "@id": orgId },
      category: "RF shielded enclosures for data centres",
      hasMeasurement: {
        "@type": "QuantitativeValue",
        name: "Shielding attenuation, 10 kHz to 40 GHz",
        value: 120,
        unitText: "dB",
      },
      additionalProperty: ["EN 50147-1", "IEEE 299"].map((value) => ({
        "@type": "PropertyValue",
        name: "Standard",
        value,
      })),
    });
  }

  if (props.page === "company") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Frankonia", item: localeUrl(lang) },
        { "@type": "ListItem", position: 2, name: sectionMeta[lang][props.section].label, item: pageUrl },
      ],
    });
  }

  if (props.page === "path") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Frankonia", item: localeUrl(lang) },
        ...props.trail.map((step, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: step.name,
          item: localeUrl(lang, step.path),
        })),
      ],
    });
  }

  return (
    <script
      type="application/ld+json"
      // The payload is built from literals in this repository, not user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
