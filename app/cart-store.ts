"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "./site-config";

/**
 * My Enquiry — what is in the basket, and the one place that knows it.
 *
 * ## Where it lives
 *
 * In `localStorage`, and nowhere else. This site is a static export with no
 * back end: there is no session to hang a basket off, and posting a reader's
 * shortlist to a third party would put their project plans somewhere neither
 * they nor Frankonia chose. So the list is theirs, on their machine, until
 * they press the button that writes the mail — the same contract the MyChamber
 * enquiry works under, and the reason the page says so out loud.
 *
 * The consequence is honest and worth stating rather than hiding: the basket
 * does not follow a reader to another device, and clearing site data empties
 * it. Neither matters for what it is for, which is one visit ending in one
 * enquiry.
 *
 * ## Why a store rather than component state
 *
 * Three components read this and none of them contains the others: the icon in
 * the header, the add button on a MyChamber result card or a model row, and
 * the cart page itself. Lifting the state to a common ancestor would mean the
 * header, which is a server component on all 130 pages, and every page under
 * it becoming client components to carry a context provider through — for a
 * list that four elements read.
 *
 * `useSyncExternalStore` instead. It is what React offers for exactly this: a
 * value that lives outside the tree, with a server snapshot for the export.
 * The server snapshot is empty, so the HTML in the file has no basket in it
 * and the first client render matches it; the real list arrives immediately
 * after hydration.
 *
 * The `storage` event keeps two tabs of the site in step, which is not an edge
 * case here — reading a model page in one tab and the cart in another is how
 * someone actually shops.
 */

/** Bumped if the shape below ever changes. A reader with an old basket then
 *  gets an empty one rather than a broken one — `parse` drops what it cannot
 *  read, and the key it cannot read is one it never looked at. */
const KEY = "frankonia.jiashan.mycart.v1";

/**
 * A basket is a shortlist, not an order book. Forty is far past any real
 * enquiry and exists so a stuck script cannot fill a reader's storage quota.
 */
const LIMIT = 40;

export type CartItem = {
  /**
   * Stable across visits and unique in the basket, so adding the same product
   * twice replaces rather than stacks. Nobody buys two of a chamber, and a
   * quantity column would be a promise this site cannot keep — the price of
   * any of this is a conversation, not a number.
   *
   * Namespaced by branch (`chamber:SAC-3 Plus`, `system:MTS 1500`) because the
   * two catalogues are maintained separately and a designation that appeared
   * in both would otherwise collide.
   */
  id: string;
  /** The model designation, never translated — it is what a reader matches
   *  against the drawings and the quotation. */
  name: string;
  /** The one-line descriptor, in the locale it was added from. */
  desc?: string;
  /** Catalogue figures, one line each — the same strings the model row and the
   *  MyChamber card print. */
  spec?: readonly string[];
  /** What the branch or the page pinned down beyond the designation:
   *  MyChamber's variant line, and the answers that led to it. */
  config?: readonly string[];
  /** Where it was added from, in the reader's words — "My Chamber", the name of
   *  a chamber-type index. Printed in the mail so the engineer reading it can
   *  see how the shortlist was arrived at. */
  from?: string;
  /** The product's own page, locale-prefixed and base-path-prefixed. */
  href?: string;
  /** The locale the copy above was captured in. The basket may hold items
   *  added on both, and the mail says which. */
  lang: Lang;
  /** Added at. The list is kept in this order — the order the reader built it
   *  in is the only order that is theirs rather than ours. */
  at: number;
};

/** An item as a caller states it. The clock is the store's business. */
export type CartSeed = Omit<CartItem, "at">;

/* ------------------------------------------------------------------ *
 * The store
 * ------------------------------------------------------------------ */

/** One frozen empty array, so an empty basket is referentially stable and
 *  `useSyncExternalStore` does not see a new value on every read. */
const EMPTY: readonly CartItem[] = Object.freeze([]);

let items: readonly CartItem[] = EMPTY;
/** Whether `items` has been read out of storage yet. Reading is deferred to
 *  the first snapshot rather than done at module scope: this file is imported
 *  by components the server renders, where there is no `localStorage`. */
let loaded = false;

const listeners = new Set<() => void>();
const emit = () => { for (const listener of listeners) listener(); };

/** Anything that is not an item the current version wrote is dropped rather
 *  than repaired. The basket is a convenience; a half-understood one that
 *  renders `undefined` into an enquiry mail is worse than an empty one. */
const parse = (raw: string | null): readonly CartItem[] => {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return EMPTY;
    const clean = value.filter(
      (item): item is CartItem =>
        !!item &&
        typeof item === "object" &&
        typeof (item as CartItem).id === "string" &&
        typeof (item as CartItem).name === "string" &&
        typeof (item as CartItem).at === "number",
    );
    return clean.length === 0 ? EMPTY : Object.freeze(clean.slice(0, LIMIT));
  } catch {
    return EMPTY;
  }
};

const snapshot = (): readonly CartItem[] => {
  if (!loaded) {
    loaded = true;
    try {
      items = parse(window.localStorage.getItem(KEY));
    } catch {
      // Storage disabled or full. The basket then lives for this page only,
      // which is a worse experience than the one intended and still a working
      // one — every write below fails the same way and is caught there.
      items = EMPTY;
    }
  }
  return items;
};

/** Empty, on the server and for the first client render that has to match the
 *  exported HTML. */
const serverSnapshot = (): readonly CartItem[] => EMPTY;

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  // Another tab of the same site wrote the basket. `key === null` is the whole
  // store being cleared, which counts.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== KEY) return;
    loaded = false;
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
};

const write = (next: readonly CartItem[]) => {
  items = Object.freeze(next);
  loaded = true;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Quota, or private browsing with storage denied. The in-memory list is
    // already updated, so the page stays consistent with itself for this
    // visit; the alternative is a button that appears to do nothing.
  }
  emit();
};

/* ------------------------------------------------------------------ *
 * What components use
 * ------------------------------------------------------------------ */

/** The basket, in the order it was built. */
export const useCart = (): readonly CartItem[] =>
  useSyncExternalStore(subscribe, snapshot, serverSnapshot);

/** Add, or replace an item already under the same id — see `CartItem.id`.
 *  A replacement keeps its original position, so re-adding a chamber after
 *  changing an answer does not move it to the bottom of a list the reader has
 *  already read. */
export const addItem = (seed: CartSeed) => {
  const current = snapshot();
  const item: CartItem = { ...seed, at: Date.now() };
  const at = current.findIndex((existing) => existing.id === item.id);
  if (at >= 0) {
    const next = [...current];
    next[at] = { ...item, at: current[at].at };
    write(next);
    return;
  }
  write([...current, item].slice(-LIMIT));
};

export const removeItem = (id: string) =>
  write(snapshot().filter((item) => item.id !== id));

export const clearCart = () => write(EMPTY);
