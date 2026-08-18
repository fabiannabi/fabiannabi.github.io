import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Profile } from "../pages/Profile/Profile";

import "../styles/tokens.base.css";
import "../styles/tokens.profile.css";
import "../styles/global.css";
import "../styles/page-profile.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <Profile />
  </StrictMode>,
);
