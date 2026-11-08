import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisionProvider } from "@fabiannabi/blueprint/a11y/VisionProvider";
import { XRayProvider } from "@fabiannabi/blueprint/xray/XRayProvider";
import { Profile } from "../pages/Profile/Profile";

import "../styles/tokens.base.css";
import "@fabiannabi/blueprint/tokens/scale.css";
import "../styles/tokens.profile.css";
import "../styles/global.css";
import "../styles/page-profile.css";
import "@fabiannabi/blueprint/tokens/blueprint.css";
import "@fabiannabi/blueprint/xray/xray.css";
import "@fabiannabi/blueprint/a11y/vision.css";

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
