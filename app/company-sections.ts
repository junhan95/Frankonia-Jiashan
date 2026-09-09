import type { Lang } from "./site-config";

/**
 * The Company section, in the order the navigation lists it. Kept free of
 * component imports so both the header and the page content can read it —
 * the header is a client component, and importing the page module there
 * would close an import cycle.
 *
 * All three are in the dropdown. Career was a fourth until the August 2026
 * review, when HQ asked for it to come off the Korean site — applications are
 * handled on the head office site, which is where the live vacancy postings
 * always were.
 *
 * Philosophy and History used to be two entries. They are one page now —
 * About: what the company is, then how it got there. Both were short of a
 * full page on their own and neither answered the question a reader opens the
 * Company menu with without the other. The slug `about` is the merged page;
 * `/company/philosophy` and `/company/history` no longer exist.
 */
export const companySections = [
  "about",
  "publications",
  "events",
] as const;

export type CompanySection = (typeof companySections)[number];

export const isCompanySection = (value: string): value is CompanySection =>
  (companySections as readonly string[]).includes(value);

/** Nav label and meta description per locale. Single source: the navigation,
 *  the page title and the search snippet all read from here. */
export const sectionMeta = {
  zh: {
    about: {
      label: "公司简介与历史",
      description:
        "我们凭借专业知识、灵活性、质量和高技术水平在世界各地创建面向未来的 EMC 解决方案。 Frankonia 追求和提供什么，以及自 1987 年成立以来的历史、产品和技术里程碑。",
    },
    publications: {
      label: "研究出版物",
      description:
        "Frankonia 研究人员和合作大学发表的有关吸波器和电波暗室的论文和贡献。",
    },
    events: {
      label: "活动/展览",
      description:
        "Frankonia参加的展览和研讨会的信息。",
    },
  },
  en: {
    about: {
      label: "About",
      description:
        "Expertise, flexibility, quality and a high degree of technology, generating future-proof solutions on a global scale. What Frankonia stands for and provides, and the timeline from the foundation in 1987 through the Frankosorb® absorber to the group's companies worldwide.",
    },
    publications: {
      label: "Publications",
      description:
        "Papers and articles on absorbers and anechoic chambers, published by Frankonia's researchers and their university partners.",
    },
    events: {
      label: "Events",
      description:
        "Exhibitions and seminars where Frankonia takes part.",
    },
  },
} as const satisfies Record<Lang, Record<CompanySection, { label: string; description: string }>>;

/** Path of a section relative to the locale root. */
export const sectionPath = (section: CompanySection) => `/company/${section}`;
