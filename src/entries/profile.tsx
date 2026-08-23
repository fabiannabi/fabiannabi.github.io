import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisionProvider } from "../ds/a11y/VisionProvider";
import { XRayProvider } from "../ds/xray/XRayProvider";
import { Profile } from "../pages/Profile/Profile";

import "../styles/tokens.base.css";
import "../ds/tokens/scale.css";
import "../styles/tokens.profile.css";
import "../styles/global.css";
import "../styles/page-profile.css";
import "../ds/tokens/blueprint.css";
import "../ds/xray/xray.css";
import "../ds/a11y/vision.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <VisionProvider>
      <XRayProvider>
        <Profile />
      </XRayProvider>
    </VisionProvider>
  </StrictMode>,
);
