import type { Decorator, Preview } from "@storybook/react-vite";
import { XRayProvider } from "../src/ds/xray/XRayProvider";

import "../src/ds/tokens/primitives.css";
import "../src/ds/tokens/scale.css";
import "../src/ds/tokens/semantic.css";
import "./storybook.css";
import "../src/ds/xray/xray.css";

/**
 * Every story runs inside the x-ray provider, so pressing X in the canvas turns
 * the blueprint on there too — the same overlay, over one component instead of
 * a page.
 */
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset["dsTheme"] = String(context.globals["dsTheme"] ?? "dark");
  return (
    <XRayProvider>
      <Story />
    </XRayProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    // Accessibility violations are reported as errors, not as a tab nobody opens.
    a11y: { test: "error" },
    docs: { toc: true },
    options: {
      storySort: {
        order: ["Actions", "Data display", "Navigation", "Feedback", "Typography"],
      },
    },
  },
  globalTypes: {
    dsTheme: {
      description: "Design system theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { dsTheme: "dark" },
  decorators: [withTheme],
};

export default preview;
