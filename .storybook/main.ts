import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/ds/**/*.mdx", "../src/ds/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },

  // No reason for a CI build to phone home.
  core: { disableTelemetry: true },

  /* Props tables are generated from the TypeScript types and the TSDoc comment
     above each prop, so the API in Storybook cannot drift from the API in the
     source. The hand-written docs in src/ds/docs carry the guidance that a type
     cannot express — when to reach for the component, and when not to. */
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !prop.parent?.fileName.includes("node_modules"),
    },
  },

  viteFinal: (viteConfig) => {
    /* The site is a multi-page build with three HTML entries. Storybook supplies
       its own entry, and inheriting ours makes it try to bundle the site inside
       the component explorer. */
    if (viteConfig.build?.rollupOptions) {
      delete viteConfig.build.rollupOptions.input;
    }
    return viteConfig;
  },
};

export default config;
