import type { ComponentDoc } from "../../docs/types";

export const chipDoc: ComponentDoc = {
  name: "Chip",
  slug: "chip",
  category: "Data display",
  summary:
    "A compact, interactive token — a filter the user can toggle, or a selection they can remove. If it cannot be interacted with, it is a Badge.",
  anatomy: ["Toggle button carrying the label", "Optional remove button with its own hit area"],
  props: [
    {
      name: "label",
      type: "string",
      required: true,
      description:
        "The chip's text. A string, not ReactNode — a chip has to stay on one line, and the remove button needs it to build its accessible name.",
    },
    {
      name: "onSelect",
      type: "() => void",
      description: "Makes the chip a toggle. Without it the chip renders as static content.",
    },
    {
      name: "selected",
      type: "boolean",
      default: "false",
      description: "Toggle state, exposed as aria-pressed.",
    },
    {
      name: "onRemove",
      type: "() => void",
      description: "Renders a separate remove button. The caller owns the removal.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Applied as aria-disabled so the chip stays reachable.",
    },
  ],
  accessibility: [
    "Selection and removal are two sibling buttons, never nested. A button inside a button is invalid HTML and browsers resolve it by dropping one — usually the one being pressed.",
    "The remove button's name includes the chip's label, so a row of ten chips does not produce ten identical “Remove” entries in a screen reader's element list.",
    "Selection is exposed with aria-pressed, and shown with a border and background change rather than colour alone.",
    "Both hit areas are independently ≥24×24, so a mis-tap cannot delete a filter the user meant to select.",
  ],
  guidance: {
    do: [
      "Use chips for filters the user applies and clears.",
      "Keep labels to one or two words.",
      "Show the selected chips first when the list is long.",
    ],
    dont: [
      "Do not use a chip for a static status — that is a Badge.",
      "Do not put the remove button inside the toggle.",
      "Do not use chips as navigation.",
    ],
  },
};
