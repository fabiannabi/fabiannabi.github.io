import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisionProvider } from "@fabiannabi/blueprint/a11y/VisionProvider";
import { XRayProvider } from "@fabiannabi/blueprint/xray/XRayProvider";
import { Design } from "../pages/Design/Design";

/* The cascade, in dependency order: primitives, the non-colour scale, the
   semantic layer that aliases the primitives, the shared reset, this page's
   body rules, then the blueprint palette - which is a fourth theme and has to
   sit after the semantic layer it remaps - and finally the x-ray's own drawing
   rules, which must win over component styles when the blueprint is on. */
import "@fabiannabi/blueprint/tokens/primitives.css";
import "@fabiannabi/blueprint/tokens/scale.css";
import "@fabiannabi/blueprint/tokens/semantic.css";
import "../styles/global.css";
import "../styles/page-design.css";
import "@fabiannabi/blueprint/tokens/blueprint.css";
import "@fabiannabi/blueprint/xray/xray.css";
import "@fabiannabi/blueprint/a11y/vision.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <VisionProvider>
      <XRayProvider>
        <Design />
      </XRayProvider>
    </VisionProvider>
  </StrictMode>,
);
