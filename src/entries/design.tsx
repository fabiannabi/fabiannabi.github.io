import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { XRayProvider } from "../ds/xray/XRayProvider";
import { Design } from "../pages/Design/Design";

/* The cascade, in dependency order: primitives, the non-colour scale, the
   semantic layer that aliases the primitives, the shared reset, this page's
   body rules, then the blueprint palette - which is a fourth theme and has to
   sit after the semantic layer it remaps - and finally the x-ray's own drawing
   rules, which must win over component styles when the blueprint is on. */
import "../ds/tokens/primitives.css";
import "../ds/tokens/scale.css";
import "../ds/tokens/semantic.css";
import "../styles/global.css";
import "../styles/page-design.css";
import "../ds/tokens/blueprint.css";
import "../ds/xray/xray.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <XRayProvider>
      <Design />
    </XRayProvider>
  </StrictMode>,
);
