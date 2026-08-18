import type { ComponentDoc } from "../../docs/types";

export const tabsDoc: ComponentDoc = {
  name: "Tabs",
  slug: "tabs",
  category: "Navigation",
  summary:
    "Switches between sibling panels in the same context. Not for navigation between pages, and not a substitute for a page the user can link to.",
  anatomy: ["Tablist", "Tab (one selected at a time)", "Selected indicator", "Tabpanel"],
  props: [
    {
      name: "defaultValue",
      type: "string",
      description: "Starting tab when uncontrolled.",
    },
    {
      name: "value",
      type: "string",
      description: "Selected tab when controlled. Pass with onValueChange.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Fires on selection, from click or from keyboard.",
    },
    {
      name: "activation",
      type: '"automatic" | "manual"',
      default: '"automatic"',
      description:
        "Automatic selects the tab that receives focus. Manual waits for Enter or Space — use it when opening a panel costs a request.",
    },
    {
      name: "Tabs.List label",
      type: "string",
      required: true,
      description: "Accessible name for the tablist. Required, not optional with a fallback.",
    },
    {
      name: "Tabs.Tab value",
      type: "string",
      required: true,
      description: "Ties the tab to its panel. Must match a Tabs.Panel value.",
    },
    {
      name: "Tabs.Tab disabled",
      type: "boolean",
      default: "false",
      description: "Announced via aria-disabled; the tab stays reachable by arrow key.",
    },
  ],
  accessibility: [
    "Implements the ARIA Authoring Practices tabs pattern: role=tablist, role=tab, role=tabpanel, with aria-selected and aria-controls wired to real ids.",
    "Roving tabindex — Tab enters the tablist once and then moves on to the panel. Arrow keys move between tabs and wrap at both ends; Home and End jump to the first and last.",
    "The panel is focusable, so tabbing out of the tablist lands on the content. Without that, a panel of plain text is unreachable by keyboard.",
    "The selected tab is marked by an indicator bar as well as a colour change, so selection does not depend on colour alone (SC 1.4.1).",
    "Tabs are ≥24px tall, meeting SC 2.5.8.",
  ],
  guidance: {
    do: [
      "Keep tab labels to one or two words, and keep them parallel in grammar.",
      "Use manual activation when a panel triggers a network request.",
      "Give the tablist a label that says what is being switched.",
    ],
    dont: [
      "Do not use tabs for steps in a sequence — that is a wizard, and the order matters.",
      "Do not hide content behind a tab that the user needs to compare with content in another tab.",
      "Do not use tabs for page-level navigation; those need real URLs.",
    ],
  },
};
