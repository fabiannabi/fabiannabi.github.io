import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { XRayContext } from "./XRayContext";

/** Must match --ds-duration-slow in scale.css. */
const EXIT_MS = 360;

/**
 * How long the leaving state is held, and it must match --xray-undevelop in
 * blueprint.css.
 *
 * It was EXIT_MS, which is a control's duration: at 360ms a full-screen fade is
 * closer to a cut than to a mode being put away. It was then --xray-develop,
 * the entrance's own, and that read as slow — an entrance has something to show
 * and can take its time over it, while an exit is a reader saying they are done
 * looking. Two thirds of the way in.
 */
const LEAVE_MS = 480;

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

/**
 * What one element needs written to it, worked out before anything is written.
 *
 * The split is the whole point of this type existing. See measure().
 */
type Measurement = {
  el: HTMLElement;
  /** In the viewport when the mode was turned on, so worth animating in. */
  draw: boolean;
  delay: string;
  plate: "on" | "off";
  inline: boolean;
  padding: readonly [string, string, string, string];
  box: string;
};

function measure(root: ParentNode): void {
  const elements = [...root.querySelectorAll<HTMLElement>("[data-ds-component]")];

  /* Read everything, then write everything, and never interleave the two.
     This used to be one loop that set a custom property, called
     getBoundingClientRect, set an attribute, called getComputedStyle and then
     set four more properties — per element. Every write invalidates layout and
     every read immediately forces it back, so the cost was one synchronous
     reflow per instrumented element, all of it landing in the frame the mode
     turns on in. Measured on /design/, which stamps 599 of them: 24 frames in
     the first second, worst gap 150ms. The blueprint is a claim about knowing
     how the browser works and it was thrashing layout to make it.

     Reads first, into plain values. Nothing below this loop touches the DOM. */
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  /* The stagger runs over what is being drawn rather than over the document, or
     a page whose first visible component is its fortieth would start its
     animation already finished. */
  let drawIndex = 0;

  const measurements: Measurement[] = elements.map((el) => {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);

    const draw =
      rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < viewportWidth;
    const index = draw ? drawIndex++ : 0;

    /* A name plate clipped to "od" reads as a rendering bug, not as a label, and
       a wireframe full of them is worse than one with a few unnamed boxes. CSS
       cannot ask how wide its own text is, so the decision is made here, where
       the box has already been measured for the padding readout. */
    const name = el.dataset["dsComponent"] ?? "";
    const fits =
      rect.width >= name.length * CHAR_PX + PLATE_PADDING && rect.height >= PLATE_MIN_HEIGHT;

    // Logical, because the profile mirrors for RTL and so does the blueprint.
    const blockStart = cs.getPropertyValue("padding-block-start") || cs.paddingTop;
    const blockEnd = cs.getPropertyValue("padding-block-end") || cs.paddingBottom;
    const inlineStart = cs.getPropertyValue("padding-inline-start") || cs.paddingLeft;
    const inlineEnd = cs.getPropertyValue("padding-inline-end") || cs.paddingRight;

    const block = round(blockStart);
    const inline = round(inlineStart);

    return {
      el,
      draw,
      delay: `${Math.min(index, STAGGER_CAP) * STAGGER_MS}ms`,
      plate: fits ? "on" : "off",
      /* An inline component is typography, not structure, and the blueprint
         does not draw it. It has no rectangle to draw either: a <span> marking
         two words fragments across line boxes, so an outline comes out as a
         skewed L and a centred plate lands on a shape that does not exist.
         Read here because CSS cannot ask an element what its used display is. */
      inline: cs.display === "inline",
      padding: [blockStart, blockEnd, inlineStart, inlineEnd],
      box:
        block === 0 && inline === 0
          ? ""
          : block === inline
            ? `${block}px`
            : `${block}px ${inline}px`,
    };
  });

  // Writes only. Nothing here reads back, so layout is invalidated once.
  for (const m of measurements) {
    m.el.style.setProperty("--xray-delay", m.delay);
    m.el.dataset["dsPlate"] = m.plate;
    if (m.draw) m.el.dataset["dsDraw"] = "";
    else delete m.el.dataset["dsDraw"];
    if (m.inline) m.el.dataset["dsFlow"] = "inline";
    else delete m.el.dataset["dsFlow"];

    m.el.style.setProperty("--xray-pbs", m.padding[0]);
    m.el.style.setProperty("--xray-pbe", m.padding[1]);
    m.el.style.setProperty("--xray-pis", m.padding[2]);
    m.el.style.setProperty("--xray-pie", m.padding[3]);

    /* Published, not printed. The blueprint draws the padding as the gap
       between its two boxes; the number is here for anyone who wants to read it
       off the element, and putting it on screen is what made this an
       inspector. */
    m.el.dataset["dsBox"] = m.box;
  }
}

function clearMeasurements(root: ParentNode): void {
  for (const el of root.querySelectorAll<HTMLElement>("[data-ds-component]")) {
    for (const name of ["--xray-pbs", "--xray-pbe", "--xray-pis", "--xray-pie", "--xray-delay"]) {
      el.style.removeProperty(name);
    }
    delete el.dataset["dsBox"];
    delete el.dataset["dsDraw"];
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
    }, LEAVE_MS);

    return () => window.clearTimeout(exitTimer.current);
  }, [enabled, reduced]);

  // Padding is not viewport-invariant, so a resize invalidates every number.
  useEffect(() => {
    if (!enabled) return;
    const onResize = (): void => measure(document);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [enabled]);

  /* The X key is the only way into the blueprint now that both switches are
     out, and on a built page that is a trap rather than a shortcut: a reader
     who presses it by accident gets a page redrawn as a wireframe with nothing
     visible to press to get back. So it is the development server only, which
     is what makes this a work in progress rather than a hidden feature. Delete
     the guard and put a Toggle back and the mode returns whole. */
  useEffect(() => {
    if (!import.meta.env.DEV) return;

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
