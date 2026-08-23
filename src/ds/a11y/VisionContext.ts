import { createContext } from "react";

export type Vision = "none" | "protanopia" | "deuteranopia" | "tritanopia";

export type Deficiency = Exclude<Vision, "none">;

/**
 * Two values, because a control can point at a deficiency without one running.
 *
 * - `vision` is what is on screen. Read it to render.
 * - `choice` is which deficiency the controls are pointed at, whether or not it
 *   is running. It survives being switched off, so turning the simulation on
 *   again returns to the last deliberate pick.
 *
 * There was a third — `applied`, plus a `preview` that showed a deficiency
 * without committing to it — for an instrument that demonstrated itself under
 * the pointer. The instrument is gone and so is the split: while nothing can
 * show what was not chosen, "what is on screen" and "what was chosen" are one
 * value, and keeping two would have meant maintaining a distinction the page
 * can no longer produce.
 */
export type VisionState = {
  vision: Vision;
  choice: Deficiency;
  /** Applies. Passing "none" takes the simulation off. */
  select: (next: Vision) => void;
  /** Points the controls at a deficiency without applying it. */
  choose: (next: Deficiency) => void;
};

/* A no-op default, for the same reason XRayContext has one: a design system
   component has to render outside the provider — in a consumer's app, in a
   test, in a story — without the plumbing being mandatory. */
export const VisionContext = createContext<VisionState>({
  vision: "none",
  choice: "deuteranopia",
  select: () => undefined,
  choose: () => undefined,
});
