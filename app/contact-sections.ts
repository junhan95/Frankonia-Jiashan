import { contactEmail, type Lang } from "./site-config";

/**
 * Contact — the route, the copy the navigation and the search snippet read
 * from, and the offices the page prints.
 *
 * Contact used to be an anchor: every "Get a Quote" on the site scrolled to the
 * red band at the foot of the landing page, which offered one mail address and
 * one German switchboard number. The head office publishes a contact page with
 * four entities on it, and there is now a Korean office besides — five ways in,
 * none of which fit in a band with two buttons. So the band keeps its job of
 * inviting the enquiry and this page answers "who do I write to".
 */

/** Path, relative to the locale root. */
export const contactPath = "/contact";

export const contactMeta = {
  zh: {
    label: "联系我们",
    description:
      "Frankonia 全球五处办公室的联系方式：中国嘉善、德国海德克及福希海姆、印度金奈和韩国。获取报价与技术咨询，以及提交需求时应提供的信息。",
  },
  en: {
    label: "Contact",
    description:
      "Contact details for all five Frankonia offices — Jiashan in China, Heideck and Forchheim in Germany, Chennai in India, and Korea. Where to send a quotation or technical enquiry, and what to put in it.",
  },
} as const satisfies Record<Lang, { label: string; description: string }>;

/**
 * Display order: Jiashan, Heideck, Forchheim, Chennai, Korea.
 *
 * Outside the locale tables, like the imprint's `entities`: a registered
 * company name and a postal address are identifiers, not prose, and translating
 * either would make it wrong.
 *
 * Two normalisations against the head office's printout, both presentational:
 *
 *  - `Industriestraße 16` is spelled out rather than abbreviated to
 *    `Industriestr. 16`, because the footer and the imprint already print it
 *    that way on all 84 pages and one site should not give one address two
 *    spellings.
 *  - Phone numbers are grouped the way the rest of this site groups them
 *    (`+49 9177 98-500`) rather than the head office's `+49 (0) 9177 / 98 -
 *    500`. The digits are untouched; the national trunk `(0)` is dropped, which
 *    is what makes the printed number the same number `tel:` dials.
 *
 * `address: null` is the Korean office, which has no premises to publish yet.
 * The page renders that as a stated gap rather than leaving the row looking
 * like a field someone forgot to fill in.
 */
export type Office = {
  id: string;
  name: string;
  address: string | null;
  email: string;
  /** As printed. */
  phone: string;
  /** The same number as a dialler takes it: E.164, no spaces or dashes. */
  phoneHref: string;
};

export const offices = [
  {
    id: "jiashan",
    name: "Jiashan Frankonia EMC Co., Ltd.",
    address: "No.55, Hongqiao Rd, Zone 4, Jiashan, Zhejiang 314100, China",
    email: contactEmail,
    phone: "+86 573 8473 1555",
    phoneHref: "tel:+8657384731555",
  },
  {
    id: "heideck",
    name: "Frankonia Germany EMC Solutions GmbH",
    address: "Industriestraße 16, 91180 Heideck, Germany",
    email: "sales@frankoniagroup.com",
    phone: "+49 9177 98-500",
    phoneHref: "tel:+49917798500",
  },
  {
    id: "forchheim",
    name: "Frankonia EMC Test-Systems GmbH",
    address: "Daimlerstr. 17, 91301 Forchheim, Germany",
    email: "sales@frankonia-emv.com",
    phone: "+49 9191 73666-0",
    phoneHref: "tel:+499191736660",
  },
  {
    id: "chennai",
    name: "Frankonia India EMC Solutions Pvt. Ltd.",
    address: "18/1 Old 10/1 Lakshmanan Street, T. Nagar, Chennai 600017, India",
    email: "sales@frankoniagroup.com",
    phone: "+91 44 2815 3370",
    phoneHref: "tel:+914428153370",
  },
  {
    id: "korea",
    name: "Frankonia Korea EMC Solutions",
    address: null,
    email: "Junhan.Park@frankoniagroup.com",
    phone: "+82 10 9458-9328",
    phoneHref: "tel:+821094589328",
  },
] as const satisfies readonly Office[];

/** The Korean office on its own, for the places that link to it by name. */
export const koreaOffice = offices.find((o) => o.id === "korea")!;
