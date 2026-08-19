import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void): (() => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches;

/* Server/prerender default: assume reduced. Starting an animation and then
   stopping it is worse than never starting one. */
const getServerSnapshot = (): boolean => true;

/**
 * Reactive, not read-once.
 *
 * CSS handles the declarative half via the media query in tokens.base.css, but
 * a rAF loop keeps running regardless of what the stylesheet says — nothing in
 * CSS can stop `requestAnimationFrame`. Every JS-driven animation on this site
 * reads this hook and refuses to start.
 *
 * Reading it once on mount was the earlier version, and it meant a visitor who
 * turned the OS setting on mid-visit kept the marquee moving until reload.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
