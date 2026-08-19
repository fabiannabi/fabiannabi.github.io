import type { ComponentDoc } from "../../docs/types";

export const buttonDoc: ComponentDoc = {
  name: "Button",
  slug: "button",
  category: "Actions",
  summary:
    "Triggers an action, or — with href — navigates while still looking like one. Same box, same states, one component that cannot drift from itself.",
  anatomy: ["Optional leading icon", "Label", "Focus ring", "Busy indicator when loading"],
  props: [
    {
      name: "variant",
      type: '"solid" | "outline" | "ghost" | "danger"',
      default: '"solid"',
      description: "Visual weight. One solid button per view — it is the primary action.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Control height. Matches the corresponding size on every other control.",
    },
    {
      name: "iconOnly",
      type: "boolean",
      default: "false",
      description:
        "Renders a square button with no visible label. Requires aria-label — the type will not compile without it.",
    },
    {
      name: "icon",
      type: "ReactNode",
      description: "Decorative leading glyph. The label carries the meaning, never the icon alone.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      description:
        "Sets aria-busy and blocks activation. The label stays visible so the button does not change width mid-action.",
    },
    {
      name: "fullWidth",
      type: "boolean",
      default: "false",
      description: "Stretches to the container. For narrow columns and mobile forms.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description:
        "Applies aria-disabled rather than the native attribute, so the control keeps its place in the tab order.",
    },
    {
      name: "href",
      type: "string",
      description:
        "Renders an anchor instead of a button, styled identically. A call to action looks like a button and navigates; the site kept a separate ActionLink for exactly that, and the two drifted into different radii, border weights and hovers.",
    },
  ],
  accessibility: [
    "With href it is a real anchor, so it lands in the links list rather than the buttons list, and middle-click and copy-link work. Styling is not semantics.",
    "Renders a native <button> with type=\"button\" unless told otherwise, so it never submits a form by accident.",
    "Disabled state uses aria-disabled, not the disabled attribute: a natively disabled button drops out of the tab order, which strands a keyboard user who had just focused it.",
    "Icon-only buttons cannot be constructed without an accessible name.",
    "Minimum target is 24×24 CSS px at every size, meeting WCAG 2.2 SC 2.5.8.",
    "The busy spinner stops under prefers-reduced-motion; aria-busy still communicates the state.",
  ],
  guidance: {
    do: [
      "Use one solid button per view — the primary action.",
      "Write the label as the action: “Save changes”, not “Submit”.",
      "Reach for danger only when the action destroys something, and pair it with a confirmation.",
    ],
    dont: [
      "Do not use a button to navigate. Use a link, so middle-click and open-in-new-tab work.",
      "Do not put the only meaning in an icon.",
      "Do not disable a submit button to communicate a validation error — say what is wrong instead.",
    ],
  },
};
