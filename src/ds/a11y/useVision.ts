import { useContext } from "react";
import { VisionContext, type VisionState } from "./VisionContext";

export function useVision(): VisionState {
  return useContext(VisionContext);
}
