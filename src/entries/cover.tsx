import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Cover } from "../pages/Cover/Cover";

/* Order is the cascade: base tokens, then this page's palette, then the global
   rules that consume them, then page layout. */
import "../styles/tokens.base.css";
import "../styles/tokens.cover.css";
import "../styles/global.css";
import "../styles/page-cover.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <Cover />
  </StrictMode>,
);
