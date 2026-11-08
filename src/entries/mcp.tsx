import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Mcp } from "../pages/Mcp/Mcp";

/* Same cascade as /design/ without the x-ray and the vision simulator: this page
   explains the MCP and has nothing to take apart. It shares the design page's
   stylesheet and theme key, so the two read as one site. */
import "@fabiannabi/blueprint/tokens/primitives.css";
import "@fabiannabi/blueprint/tokens/scale.css";
import "@fabiannabi/blueprint/tokens/semantic.css";
import "../styles/global.css";
import "../styles/page-design.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <Mcp />
  </StrictMode>,
);
