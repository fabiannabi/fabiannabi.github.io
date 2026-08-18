import { useContext } from "react";
import { XRayContext, type XRayState } from "./XRayContext";

export function useXRay(): XRayState {
  return useContext(XRayContext);
}
