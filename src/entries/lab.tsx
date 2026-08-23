import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisionProvider } from "../ds/a11y/VisionProvider";
import { Lab } from "../lab/Lab";

/**
 * The prototype's entry, and deliberately **not** listed in vite.config.ts.
 *
 * Vite's dev server serves any HTML file under the project root, so /lab/ works
 * in `pnpm dev`; `vite build` only compiles the entries it is given, so this
 * one is never built, never weighed and never deployed. That is the whole
 * mechanism, and it is why a prototype can live in the repo without arguing
 * with the cover's 8 kB budget.
 */

import "../styles/tokens.base.css";
import "../ds/tokens/scale.css";
import "../styles/tokens.cover.css";
import "../styles/global.css";
import "../ds/a11y/vision.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <VisionProvider>
      <Lab />
    </VisionProvider>
  </StrictMode>,
);
