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

/* Roughly the width one monospace character occupies at --ds-text-xs, plus the
   name plate's own padding. Used only to decide whether a name fits inside a
   box; nothing measured is derived from it. */
const CHAR_PX = 6.8;
const PLATE_PADDING = 10;
const PLATE_MIN_HEIGHT = 12;

function measure(root: ParentNode): void {
  const elements = root.querySelectorAll<HTMLElement>("[data-ds-component]");

  elements.forEach((el, index) => {
    el.style.setProperty("--xray-delay", `${Math.min(index, STAGGER_CAP) * STAGGER_MS}ms`);

    /* A name plate clipped to "od" reads as a rendering bug, not as a label, and
       a wireframe full of them is worse than one with a few unnamed boxes. CSS
       cannot ask how wide its own text is, so the decision is made here, where
       the box has already been measured for the padding readout. */
    const rect = el.getBoundingClientRect();
    const name = el.dataset["dsComponent"] ?? "";
    const fits =
      rect.width >= name.length * CHAR_PX + PLATE_PADDING && rect.height >= PLATE_MIN_HEIGHT;
    el.dataset["dsPlate"] = fits ? "on" : "off";

    const cs = getComputedStyle(el);

    /* An inline component is typography, not structure, and the blueprint does
       not draw it. It has no rectangle to draw either: a <span> marking two
       words fragments across line boxes, so an outline comes out as a skewed L
       and a centred plate lands on a shape that does not exist. Flagged here
       because CSS cannot ask an element what its used display is. */
    if (cs.display === "inline") el.dataset["dsFlow"] = "inline";
    else delete el.dataset["dsFlow"];

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
    const box =
      block === 0 && inline === 0 ? "" : block === inline ? `${block}px` : `${block}px ${inline}px`;
    /* Published, not printed. The blueprint draws the padding as the gap
       between its two boxes; the number is here for anyone who wants to read it
       off the element, and putting it on screen is what made this an inspector. */
    el.dataset["dsBox"] = box;
  });
}

function clearMeasurements(root: ParentNode): void {
  for (const el of root.querySelectorAll<HTMLElement>("[data-ds-component]")) {
    for (const name of ["--xray-pbs", "--xray-pbe", "--xray-pis", "--xray-pie", "--xray-delay"]) {
      el.style.removeProperty(name);
    }
    delete el.dataset["dsBox"];
    delete el.dataset["dsPlate"];
    delete el.dataset["dsFlow"];
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
