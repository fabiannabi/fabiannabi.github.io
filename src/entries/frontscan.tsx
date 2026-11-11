import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Frontscan } from "../pages/Frontscan/Frontscan";

/* The same cascade as /forge/: a product page with nothing to take apart, so no
   x-ray and no vision simulator. It shares the design page's stylesheet and
   theme key, so /design/, /mcp/, /forge/ and /frontscan/ read as one site. */
import "@fabiannabi/blueprint/tokens/primitives.css";
import "@fabiannabi/blueprint/tokens/scale.css";
import "@fabiannabi/blueprint/tokens/semantic.css";
import "../styles/global.css";
import "../styles/page-design.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <Frontscan />
  </StrictMode>,
);
