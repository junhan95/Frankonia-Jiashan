"use client";

import { cartMeta, cartPath } from "./cart-sections";
import { clearCart, removeItem, useCart } from "./cart-store";
import { localeRoute, type Lang } from "./site-config";
import SiteLink from "./site-link";

/**
 * My Enquiry in the header — the icon, the count on it, and the panel that opens
 * under it.
 *
 * It sits outside `nav.menu`, between the menu and the language switch, and
 * that placement is the point: the menu is where a reader goes to find
 * something, and this is where they go to see what they have already found.
 * It is also why it survives the 1240px fold that hides the menu into the
 * drawer — a basket a reader cannot see on a phone is a basket they forget
 * they filled. The panel does not survive it (there is no hover on touch);
 * below that width the icon is a link to the page and nothing else.
 *
 * The panel opens on hover and on focus, like every other panel in this bar.
 * It is a peek rather than a second cart page: the names, a way to take one
 * back out, and the way through to the page that can actually send them. Five
 * at most, because a panel that scrolls is a page.
 *
 * The only client component in the header besides the drawer and the language
 * switch. It carries no route table and no label set — `cart-sections` is two
 * dozen lines — so the bar stays server-rendered around it.
 */

/* Every word a reader sees here says "enquiry", never "cart". The feature was
   renamed in the head office's August review and the rename reached the label,
   the page title and the metadata but not this panel — so the bar said "cart"
   while the page it opened said "My Enquiry", which is what the September
   review picked up. The class names below are still `.cart-*`: they are not
   copy, and renaming them would touch the stylesheet for no reader's benefit. */
const copy = {
  zh: {
    heading: "所含产品",
    empty: "暂无商品。",
    hint: "如果您从“My Chamber”结果或模型列表中保存它们，它们将被收集到此处。",
    more: (n: number) => `另有 ${n} 项`,
    open: "打开我的询盘",
    clear: "空",
    remove: (name: string) => `移除 ${name}`,
  },
  en: {
    heading: "In your enquiry",
    empty: "Nothing in your enquiry yet.",
    hint: "Add a chamber from a My Chamber result or from any model list and it collects here.",
    more: (n: number) => `and ${n} more`,
    open: "Open My Enquiry",
    clear: "Empty it",
    remove: (name: string) => `Remove ${name}`,
  },
} as const;

/** How many names the panel prints before it stops counting them out. */
const PEEK = 5;

export default function CartButton({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const meta = cartMeta[lang];
  const items = useCart();
  const href = localeRoute(lang, cartPath);
  const shown = items.slice(0, PEEK);
  const rest = items.length - shown.length;

  return (
    <div className="cart">
      <SiteLink
        className={items.length > 0 ? "cart-btn has-items" : "cart-btn"}
        href={href}
        aria-label={items.length > 0 ? meta.aria(items.length) : meta.ariaEmpty}
      >
        {/* A clipboard, not a shopping trolley. A trolley promises a checkout
            and a price, and this list ends in a written enquiry — the icon was
            the loudest remaining piece of the old MyCart name. */}
        <svg className="cart-ico" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.4 4.6H6.5A1.5 1.5 0 0 0 5 6.1v13a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-13a1.5 1.5 0 0 0-1.5-1.5h-1.9" />
          <path d="M9.7 2.8h4.6a1 1 0 0 1 1 1v1.8H8.7V3.8a1 1 0 0 1 1-1z" />
          <path d="M8.7 10.6h6.6M8.7 14.1h6.6M8.7 17.5h3.5" />
        </svg>
        {/* Hidden from assistive technology because the link's own name above
            already carries the count in words. */}
        {items.length > 0 && (
          <span className="cart-count" aria-hidden="true">{items.length}</span>
        )}
      </SiteLink>

      <div className="cart-peek">
        <div className="cart-panel">
          {items.length === 0 ? (
            <div className="cart-panel-empty">
              <b>{t.empty}</b>
              <span>{t.hint}</span>
            </div>
          ) : (
            <>
              <h6 className="cart-panel-h">
                {t.heading}
                <span>{items.length}</span>
              </h6>
              <ul className="cart-peek-list">
                {shown.map((item) => (
                  <li key={item.id}>
                    <span className="cart-peek-name">
                      <b>{item.name}</b>
                      {item.desc && <span>{item.desc}</span>}
                    </span>
                    <button
                      type="button"
                      className="cart-x"
                      aria-label={t.remove(item.name)}
                      onClick={() => removeItem(item.id)}
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              {rest > 0 && <p className="cart-peek-more">{t.more(rest)}</p>}
            </>
          )}
          <div className="cart-panel-foot">
            <SiteLink href={href}>{t.open}<span aria-hidden="true"> →</span></SiteLink>
            {items.length > 0 && (
              <button type="button" className="cart-clear" onClick={clearCart}>
                {t.clear}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
