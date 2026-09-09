import type { Lang } from "./site-config";

/**
 * My Enquiry — the route and the copy the navigation, the page head and the search
 * snippet all read from.
 *
 * A sibling of MyChamber rather than a part of it. MyChamber answers one
 * question — which chamber is yours — and ends in one enquiry about one model.
 * A laboratory being fitted out is rarely one model: a semi-anechoic chamber
 * and the amplifier and the antenna mast that go in it are one project and one
 * quotation, and until now the only way to ask for all three was to write the
 * mail by hand. My Enquiry is that basket, and the enquiry it sends names
 * everything in it.
 *
 * The label is never translated, for the same reason MyChamber's is not: it is
 * the name of the feature, and the bar should not name two different things in
 * the two locales.
 *
 * The route table lives here rather than in cart-store.ts so the header, the
 * sitemap and the page can import the path without pulling the client store —
 * and its `localStorage` access — into their module graph.
 */

/** Path, relative to the locale root.
 *
 *  `/myenquiry`, not the `/mycart` this started as: the head office renamed the
 *  feature in the August review and the September one found the old name still
 *  in the address bar. `legacyCartPath` below keeps that address alive as a
 *  redirect, because it was linked from review mails before the rename. */
export const cartPath = "/myenquiry";

/** The address the feature had until the rename. Rendered as a redirect page in
 *  both locales — see app/(en)/mycart/page.tsx. */
export const legacyCartPath = "/mycart";

export const cartMeta = {
  zh: {
    label: "My Enquiry",
    title: "My Enquiry",
    description:
      "我们存储您感兴趣的试验箱和测试系统，仅选择您需要的，并在一份报价查询中发送它们。该列表只会保留在此浏览器中，并且在您发送之前不会发送到任何地方。",
    /** Accessible name of the bar's icon. The count is in the name because the
     *  badge beside it is `aria-hidden` — a number with no word next to it is
     *  not something a screen reader can make sense of. */
    aria: (n: number) => `我的询盘 — 包含的产品 ${n}个`,
    ariaEmpty: "我的询盘 — 没有包含任何产品",
  },
  en: {
    label: "My Enquiry",
    title: "My Enquiry",
    description:
      "Keep the chambers and test systems you are weighing up in one place, then send the ones you want as a single quotation enquiry. The list stays in this browser and goes nowhere until you send it.",
    aria: (n: number) => `My Enquiry — ${n} item${n === 1 ? "" : "s"}`,
    ariaEmpty: "My Enquiry — empty",
  },
} as const satisfies Record<
  Lang,
  { label: string; title: string; description: string; aria: (n: number) => string; ariaEmpty: string }
>;
