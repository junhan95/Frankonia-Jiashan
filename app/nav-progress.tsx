"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The bar that says a click landed.
 *
 * A client navigation has no chrome of its own. When a reader clicks an `<a>`
 * the browser paints a spinner in the tab, moves the address bar and greys the
 * page out; when they click a `next/link`, the router calls preventDefault and
 * none of that happens — the page sits there, unchanged, until the payload
 * arrives and the new tree renders in one frame. Under a warm prefetch that is
 * the point: the page changes instantly. Over the link a Korean reader has to
 * Hetzner it is 0.5 – 1.5 seconds of a page that looks like it ignored them,
 * and the honest reading of a page that ignores you is that the click missed.
 *
 * So: a three-pixel red line across the top of the viewport while the router
 * is fetching, and nothing else. It is deliberately not a spinner over the
 * page — the old page is still perfectly readable and covering it would take
 * something away for no reason.
 *
 * Two details that matter more than the bar itself:
 *
 * It waits 140 ms before appearing. Most navigations here finish inside that,
 * and a bar that flashes for two frames on every click is worse than no bar:
 * it reads as a glitch. Only a wait long enough to notice gets an indicator.
 *
 * It never fills. The transition eases toward 90% over eight seconds and stops
 * there, because the router cannot say how far along it is and a bar that sits
 * full while nothing happens is a lie. Arrival is the jump to 100% and the
 * fade, which is the only moment the bar tells the truth about progress.
 */
export default function NavProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  // Whether a click is still waiting on the router. Held in a ref rather than
  // in `phase` because the click handler is registered once and would close
  // over a stale copy of state, and because a navigation that finishes before
  // the 140 ms delay never changes `phase` at all.
  const waiting = useRef(false);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Anything the browser handles itself: a middle click, a modified click
      // that opens a tab, a click something else has already claimed.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      const url = new URL(anchor.href, window.location.href);

      // Off-site, and `mailto:`/`tel:` with it — the router is not involved.
      if (url.origin !== window.location.origin) return;
      // A file out of `public/`. It may download rather than navigate, which
      // would leave the bar running with nothing to wait for.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
      // A same-page `#anchor`, or the page the reader is already on. Neither
      // changes the pathname, so neither would ever end the wait.
      if (url.pathname === window.location.pathname) return;

      clear();
      waiting.current = true;
      timers.current = [
        window.setTimeout(() => setPhase("start"), 140),
        // A navigation that never commits — the reader hit Escape, or the
        // fetch died — must not leave a bar on the screen for the rest of the
        // session.
        window.setTimeout(() => {
          waiting.current = false;
          setPhase("idle");
        }, 15000),
      ];
    };

    // Capture, so this runs before `next/link`'s own handler and is not lost
    // to a stopPropagation anywhere in between.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, []);

  // The pathname changes when the router commits the new tree, which is the
  // frame the reader sees the new page in. On mount `waiting` is false, so the
  // first run of this effect does nothing.
  useEffect(() => {
    if (!waiting.current) return;
    clear();
    waiting.current = false;
    setPhase((current) => (current === "idle" ? "idle" : "done"));
    timers.current = [window.setTimeout(() => setPhase("idle"), 320)];
  }, [pathname]);

  // The bar mounts at zero width and is moved to 90% on the next frame — a
  // transition needs two committed values to run between, and both in one
  // render would simply paint the second one.
  useEffect(() => {
    if (phase !== "start") return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("loading"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [phase]);

  if (phase === "idle") return null;

  return (
    // Decorative: it reports the wait, and the page that arrives is what says
    // where the reader ended up.
    <div className={`nav-progress nav-progress--${phase}`} aria-hidden="true">
      <i />
    </div>
  );
}

/** `start` is the mounted-but-not-yet-moving frame the transition needs. */
type Phase = "idle" | "start" | "loading" | "done";
