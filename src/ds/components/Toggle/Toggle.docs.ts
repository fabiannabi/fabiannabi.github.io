import type { ComponentDoc } from "../../docs/types";

export const toggleDoc: ComponentDoc = {
  name: "Toggle",
  slug: "toggle",
  category: "Actions",
  summary:
    "A mode that stays on: a theme, an overlay, a filter. It knows nothing about what it switches, which is what lets it be in the system at all.",
  props: [
    { name: "pressed", type: "boolean", required: true, description: "Whether the mode is on." },
    {
      name: "onToggle",
      type: "() => void",
      required: true,
      description: "Called on activation. The component holds no state of its own.",
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description:
        "The label. Says what the control does, not what state it is in — a button whose text flips between Show and Hide asks the reader to work out which one they are looking at.",
    },
    {
      name: "icon",
      type: "ReactNode",
      description: "Rendered before the label. Decorative: the label carries the meaning.",
    },
    {
      name: "shortcut",
      type: "string",
      description:
        "A keyboard hint, rendered in a kbd and hidden below 640px, where there is no keyboard to press it on. Announced through aria-keyshortcuts and kept out of the accessible name.",
    },
    {
      name: "iconOnly",
      type: "boolean",
      default: "false",
      description:
        "Drops the visible label. The type then demands an aria-label, the same bargain Button makes: an unnamed icon button is a compile error rather than an audit finding.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description:
        "md is a control height, sm is the 24px floor, lg is 44px — for a control whose problem is being found rather than fitting in.",
    },
    {
      name: "pressedLabel",
      type: "ReactNode",
      description:
        "A different label while the mode is on, for a control that has to offer the way back. Passing it drops aria-pressed, because a button labelled \"Exit x-ray\" and announced as pressed says two contradictory things about one state.",
    },
  ],
  accessibility: [
    "The shortcut is exposed with aria-keyshortcuts and its kbd is hidden, so the control is named \"X-ray\" rather than \"X-ray X\". A visual hint is not part of what a button is.",
    "State lives in the label or in aria-pressed, never in both, and the component decides so a caller cannot ship the contradiction. Without pressedLabel the label is stable and aria-pressed carries the state; with it, the label carries the state and aria-pressed is dropped.",
    "Carries aria-pressed, so the state is in the accessibility tree. A screen reader announces \"X-ray, toggle button, pressed\" instead of leaving it to be read off a fill colour.",
    "The pressed fill is reinforcement, never the only signal (SC 1.4.1) — the state is announced, and where there is an icon its inner shape fills too.",
    "A real button, so it answers to Space and Enter and appears in the tab order without any of that being reimplemented.",
    "Sized from --ds-control-*, not from --ds-target-min: the 24px floor is the accessibility minimum, not a size, and sizing to the floor is what left it a head shorter than the Badge beside it.",
  ],
  guidance: {
    do: [
      "Use it for a mode that persists, not for an action that happens once.",
      "Label it with what it switches, and let aria-pressed carry whether it is on.",
      "Let the caller own the state and the concept — this component should not know what a theme is.",
    ],
    dont: [
      "Do not flip the label between on and off states.",
      "Do not use it for a form field. A checkbox is a checkbox.",
      "Do not ship it icon-only without an accessible name — the type will not let you.",
    ],
  },
};
