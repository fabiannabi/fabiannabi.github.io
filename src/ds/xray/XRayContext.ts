import { createContext } from "react";

export type XRayState = {
  enabled: boolean;
  toggle: () => void;
  /** True while the blueprint is animating in or out. */
  animating: boolean;
};

/* There was a hover preview here for an afternoon, and it came out again.
   Redrawing the entire page as a blueprint is not a thing to do to somebody who
   was scrolling — the pointer crosses the header on the way past and the page
   flashes — and on touch there is no hover at all: a tap fires pointerenter and
   then click, so the preview is a frame of blueprint nobody asked for on the
   way to the press they did ask for. The colour simulation keeps its preview
   because it changes how the page looks; this one changes what the page is. */

/* Default is a no-op rather than a thrown error: a design system component must
   render outside the provider — in a consumer's app, in a test, in a Storybook
   story — without the x-ray plumbing being mandatory. */
export const XRayContext = createContext<XRayState>({
  enabled: false,
  toggle: () => undefined,
  animating: false,
});
