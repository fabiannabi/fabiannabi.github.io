import { createContext } from "react";

export type XRayState = {
  enabled: boolean;
  toggle: () => void;
  /** True while the blueprint is animating in or out. */
  animating: boolean;
};

/* Default is a no-op rather than a thrown error: a design system component must
   render outside the provider — in a consumer's app, in a test, in a Storybook
   story — without the x-ray plumbing being mandatory. */
export const XRayContext = createContext<XRayState>({
  enabled: false,
  toggle: () => undefined,
  animating: false,
});
