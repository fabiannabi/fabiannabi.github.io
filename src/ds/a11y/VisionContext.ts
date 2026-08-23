import { createContext } from "react";

export type Vision = "none" | "protanopia" | "deuteranopia" | "tritanopia";

export type Deficiency = Exclude<Vision, "none">;

/**
 * Three values rather than one, because "what the page is rendering" and "what
 * the reader asked for" stopped being the same thing the moment an instrument
 * could preview itself.
 *
 * - `vision` is what is on screen. Read it to render.
 * - `applied` is what somebody chose on purpose. Read it to label a control, or
 *   a button says "Back to normal" while a cursor happens to rest on an eye.
 * - `choice` is which deficiency the instruments are pointed at, whether or not
 *   it is running. It is what a one-touch control applies.
 */
export type VisionState = {
  vision: Vision;
  applied: Vision;
  choice: Deficiency;
  /** Applies, deliberately. Passing "none" takes the simulation off. */
  select: (next: Vision) => void;
  /** Points the instruments at a deficiency without applying it. */
  choose: (next: Deficiency) => void;
  /** Shows one until it is called with null. Never changes what was applied. */
  preview: (next: Vision | null) => void;
};

/* A no-op default, for the same reason XRayContext has one: a design system
   component has to render outside the provider — in a consumer's app, in a
   test, in a story — without the plumbing being mandatory. */
export const VisionContext = createContext<VisionState>({
  vision: "none",
  applied: "none",
  choice: "deuteranopia",
  select: () => undefined,
  choose: () => undefined,
  preview: () => undefined,
});
