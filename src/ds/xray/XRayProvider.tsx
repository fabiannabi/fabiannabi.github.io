import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { XRayContext } from "./XRayContext";

/** Must match --ds-duration-slow in scale.css. */
const EXIT_MS = 360;

const round = (value: string): number => Math.round(parseFloat(value) || 0);

/**
 * Reads the padding the browser actually computed and publishes it back to the
 * element, so the blueprint can draw the content box and print the numbers.
 *
 * This is measured rather than declared on purpose: a component's padding comes
 * from a token, through a size variant, possibly overridden by a media query.
 * The only honest source for "what is the spacing here" is the used value.
 */
/* A stagger, capped. Reading the blueprint assemble is the point; waiting for
   the sixtieth element to arrive is not. */
const STAGGER_MS = 12;
const STAGGER_CAP = 16;

function measure(root: ParentNode): void {
  const elements = root.querySelectorAll<HTMLElement>("[data-ds-component]");

  elements.forEach((el, index) => {
    el.style.setProperty("--xray-delay", `${Math.min(index, STAGGER_CAP) * STAGGER_MS}ms`);

    const cs = getComputedStyle(el);

    // Logical, because the profile mirrors for RTL and so does the blueprint.
    const blockStart = cs.getPropertyValue("padding-block-start") || cs.paddingTop;
    const blockEnd = cs.getPropertyValue("padding-block-end") || cs.paddingBottom;
    const inlineStart = cs.getPropertyValue("padding-inline-start") || cs.paddingLeft;
    const inlineEnd = cs.getPropertyValue("padding-inline-end") || cs.paddingRight;

    el.style.setProperty("--xray-pbs", blockStart);
    el.style.setProperty("--xray-pbe", blockEnd);
    el.style.setProperty("--xray-pis", inlineStart);
    el.style.setProperty("--xray-pie", inlineEnd);

    const block = round(blockStart);
    const inline = round(inlineStart);
    el.dataset["dsBox"] =
      block === 0 && inline === 0 ? "" : block === inline ? `${block}px` : `${block}px ${inline}px`;
  });
}

function clearMeasurements(root: ParentNode): void {
  for (const el of root.querySelectorAll<HTMLElement>("[data-ds-component]")) {
    for (const name of ["--xray-pbs", "--xray-pbe", "--xray-pis", "--xray-pie", "--xray-delay"]) {
      el.style.removeProperty(name);
    }
    delete el.dataset["dsBox"];
  }
}

const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export function XRayProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [animating, setAnimating] = useState(false);
  const exitTimer = useRef<number | undefined>(undefined);

  const toggle = useCallback(() => setEnabled((current) => !current), []);

  useEffect(() => {
    const root = document.documentElement;
    window.clearTimeout(exitTimer.current);

    if (enabled) {
      measure(document);
      root.dataset["xray"] = "on";
      if (reduced) return;

      setAnimating(true);
      exitTimer.current = window.setTimeout(() => setAnimating(false), EXIT_MS);
      return () => window.clearTimeout(exitTimer.current);
    }

    // Nothing was ever turned on, so there is nothing to animate away.
    if (!root.dataset["xray"]) return;

    if (reduced) {
      delete root.dataset["xray"];
      clearMeasurements(document);
      return;
    }

    /* Held in a "leaving" state for one duration so the outlines can animate
       out. Removing the attribute immediately would make the blueprint vanish
       on a frame, which reads as a bug rather than a mode. */
    root.dataset["xray"] = "leaving";
    setAnimating(true);
    exitTimer.current = window.setTimeout(() => {
      delete root.dataset["xray"];
      clearMeasurements(document);
      setAnimating(false);
    }, EXIT_MS);

    return () => window.clearTimeout(exitTimer.current);
  }, [enabled, reduced]);

  // Padding is not viewport-invariant, so a resize invalidates every number.
  useEffect(() => {
    if (!enabled) return;
    const onResize = (): void => measure(document);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [enabled]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== "x" && event.key !== "X") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const value = useMemo(() => ({ enabled, toggle, animating }), [enabled, toggle, animating]);

  return <XRayContext.Provider value={value}>{children}</XRayContext.Provider>;
}
