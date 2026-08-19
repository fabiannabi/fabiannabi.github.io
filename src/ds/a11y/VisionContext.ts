import { createContext } from "react";

export type Vision = "none" | "protanopia" | "deuteranopia" | "tritanopia";

export type VisionState = {
  vision: Vision;
  select: (next: Vision) => void;
};

/* A no-op default, for the same reason XRayContext has one: a design system
   component has to render outside the provider — in a consumer's app, in a
   test, in a story — without the plumbing being mandatory. */
export const VisionContext = createContext<VisionState>({
  vision: "none",
  select: () => undefined,
});
