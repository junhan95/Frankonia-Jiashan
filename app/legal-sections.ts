import type { Lang } from "./site-config";

/**
 * The two pages German law requires of a commercially operated site: the
 * imprint (§5 TMG) and the privacy declaration (Art. 13 GDPR).
 *
 * They sit at `/imprint` and `/privacy` rather than under a `/legal` parent —
 * those are the addresses people and regulators look for, and two pages do not
 * need a branch of their own.
 */
export const legalSections = ["imprint", "privacy"] as const;

export type LegalSection = (typeof legalSections)[number];

export const legalPath = (section: LegalSection) => `/${section}`;

/** Nav label and meta description per locale. */
export const legalMeta: Record<Lang, Record<LegalSection, { label: string; description: string }>> = {
  en: {
    imprint: {
      label: "Imprint",
      description:
        "Company information for Frankonia Germany EMC Solutions GmbH and Frankonia EMC Test-Systems GmbH under §5 TMG — addresses, management, register and VAT numbers.",
    },
    privacy: {
      label: "Privacy Policy",
      description:
        "What this website does with personal data: no cookies, no tracking, no third-party requests. Controller, data protection officer, and your rights under the GDPR.",
    },
  },
  zh: {
    imprint: {
      label: "法律声明",
      description:
        "根据德国电信媒体法 (TMG) 第 5 条规定的商业信息 — Frankonia 德国 EMC Solutions GmbH 和 Frankonia EMC Test-Systems GmbH 的地址、代表、注册和增值税号。",
    },
    privacy: {
      label: "隐私政策",
      description:
        "本网站上的个人数据处理 — 无 Cookie、跟踪或外部请求。处理 GDPR 规定的负责人和个人数据保护官以及数据主体权利。",
    },
  },
};

/**
 * The company particulars, exactly as the head office publishes them at
 * frankonia-solutions.com/imprint. Outside the locale tables on purpose:
 * a registered company name, a register entry and a VAT number are identifiers,
 * not prose, and translating any part of them would make them wrong.
 *
 * Both entities are listed because the head office lists both.
 */
export const entities = [
  {
    name: "Frankonia Germany EMC Solutions GmbH",
    street: "Industriestraße 16",
    city: "91180 Heideck",
    country: "Germany",
    phone: "+49 9177 98-500",
    fax: "+49 9177 98-520",
    email: "info@frankoniagroup.com",
    directors: "Wolfgang Opitz, Dr. Daniel Feyerlein",
    vat: "DE 133565240",
    register: "Nuremberg HRB 8052",
    weee: null,
  },
  {
    name: "Frankonia EMC Test-Systems GmbH",
    street: "Daimlerstr. 17",
    city: "91301 Forchheim",
    country: "Germany",
    phone: "+49 9191 73666-0",
    fax: "+49 9191 73666-20",
    email: "sales@frankonia-emv.com",
    directors: "Peter Weidner, Thomas Weidner",
    vat: "DE 151302710",
    register: "Bamberg HRB 2301",
    weee: "DE 63547070",
  },
] as const;

/**
 * The data protection officer, named by the head office on its privacy page.
 * A person and an address, so it stays out of the locale tables as well.
 */
export const dataProtectionOfficer = {
  name: "Melanie Kolb",
  email: "kolb@grothprojekt.de",
} as const;

/**
 * The head office's own declarations. This site states what this site does;
 * the full terms of use and the complete data protection declaration are
 * maintained there and are linked rather than copied — a copy would be the
 * version that stops being updated.
 */
export const headOfficeLegal = {
  imprint: "https://frankonia-solutions.com/imprint/",
  privacy: "https://frankonia-solutions.com/company/dataprivacy/",
} as const;
