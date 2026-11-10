import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Forge } from "../pages/Forge/Forge";

/* The same cascade as /mcp/: a case study with nothing to take apart, so no
   x-ray and no vision simulator. It shares the design page's stylesheet and
   theme key, so /design/, /mcp/ and /forge/ read as one site. The live Forge
   dashboard is a separate static app at /forge/showcase/. */
import "@fabiannabi/blueprint/tokens/primitives.css";
import "@fabiannabi/blueprint/tokens/scale.css";
import "@fabiannabi/blueprint/tokens/semantic.css";
import "../styles/global.css";
import "../styles/page-design.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <Forge />
  </StrictMode>,
);
