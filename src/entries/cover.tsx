import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { XRayProvider } from "../ds/xray/XRayProvider";
import { Cover } from "../pages/Cover/Cover";

/* Order is the cascade: base tokens, then this page's palette, then the global
   rules that consume them, then page layout. The design system's non-colour
   scale comes along because the x-ray overlay is built from it — its colours
   still resolve from this page's palette, not the system's. */
import "../styles/tokens.base.css";
import "../ds/tokens/scale.css";
import "../styles/tokens.cover.css";
import "../styles/global.css";
import "../styles/page-cover.css";
import "../ds/xray/xray.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <XRayProvider>
      <Cover />
    </XRayProvider>
  </StrictMode>,
);
