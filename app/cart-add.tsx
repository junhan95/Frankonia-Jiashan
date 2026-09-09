"use client";

import { addItem, removeItem, useCart, type CartSeed } from "./cart-store";
import type { Lang } from "./site-config";

/**
 * The one control that puts a product in My Enquiry, wherever a product is
 * described — a MyChamber result card, a model row on a chamber index, an
 * instrument row on a test-system page.
 *
 * One component rather than a button written out at each of those places,
 * because the thing that is easy to get wrong is not the markup: it is that
 * the button has to say what it will do *and* what state it is already in.
 * A basket control that only ever reads "Add" leaves a reader who has added
 * something clicking it a second time to find out.
 *
 * So it is a toggle, and it says so — pressed, it reads "In My Enquiry" and its
 * hover reads "remove". `aria-pressed` states the same thing to a screen
 * reader, which is what makes the changing label an affordance rather than a
 * surprise.
 *
 * `item` arrives already assembled from the server component that knows the
 * product; nothing here reads the catalogue.
 */

const copy = {
  zh: {
    add: "添加到我的询价",
    added: "已包含在我的询价中",
    remove: "从我的询价中减去",
  },
  en: {
    add: "Add to My Enquiry",
    added: "In My Enquiry",
    remove: "Remove from My Enquiry",
  },
} as const;

export default function CartAdd({
  lang,
  item,
  className = "cart-add",
}: {
  lang: Lang;
  item: CartSeed;
  /** The base class. `.cart-add` is the compact pill the MyChamber cards and
   *  the cart page use; the model rows pass `btn btn-outline`, because the
   *  enquiry beside it there is a full-size pill and a control a size down
   *  would read as the lesser of the two. Either way `on` is added while the
   *  item is in the basket. */
  className?: string;
}) {
  const t = copy[lang];
  const inCart = useCart().some((existing) => existing.id === item.id);

  return (
    <button
      type="button"
      className={inCart ? `${className} on` : className}
      aria-pressed={inCart}
      title={inCart ? t.remove : undefined}
      onClick={() => (inCart ? removeItem(item.id) : addItem(item))}
    >
      <svg className="cart-add-ico" viewBox="0 0 20 20" aria-hidden="true">
        {inCart ? (
          <path d="M4 10.5l3.8 3.8L16 6" />
        ) : (
          <>
            {/* The clipboard the header control carries, with the plus that
                says this adds a line to it. Not a trolley — see cart-button. */}
            <path d="M6.9 3.6H5.3A1.2 1.2 0 0 0 4.1 4.8v11.4a1.2 1.2 0 0 0 1.2 1.2h9.4a1.2 1.2 0 0 0 1.2-1.2V4.8a1.2 1.2 0 0 0-1.2-1.2h-1.6" />
            <path d="M8.1 2.2h3.8a.9.9 0 0 1 .9.9v1.5H7.2V3.1a.9.9 0 0 1 .9-.9z" />
            <path d="M10 8.8v4.4M7.8 11h4.4" />
          </>
        )}
      </svg>
      {inCart ? t.added : t.add}
    </button>
  );
}
