import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisionProvider } from "../ds/a11y/VisionProvider";
import { Cover } from "../pages/Cover/Cover";

/* Order is the cascade: base tokens, then this page's palette, then the global
   rules that consume them, then page layout.

   No blueprint here. The x-ray moved to the profile and the design system,
   where a wireframe of the page is the point rather than a curiosity, so the
   cover carries neither its palette nor its drawing — about a kilobyte of CSS
   and the measuring pass that goes with it. The design system's non-colour
   scale stays: every component on this page is built from it. */
import "../styles/tokens.base.css";
import "../ds/tokens/scale.css";
import "../styles/tokens.cover.css";
import "../styles/global.css";
import "../styles/page-cover.css";
import "../ds/a11y/vision.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <VisionProvider>
      <Cover />
    </VisionProvider>
  </StrictMode>,
);
