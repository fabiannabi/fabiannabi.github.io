import type { ComponentDoc } from "../../docs/types";

export const badgeDoc: ComponentDoc = {
  name: "Badge",
  slug: "badge",
  category: "Data display",
  summary:
    "A static label for the state of the thing beside it. Not interactive — if it can be clicked or dismissed, it is a Chip.",
  anatomy: ["Tinted surface", "Border", "Label"],
  props: [
    {
      name: "tone",
      type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"',
      default: '"neutral"',
      description: "Reinforces the meaning already carried by the label text.",
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "The label. Should read as a state: “Active”, “Overdue”, “Beta”.",
    },
    {
      name: "shape",
      type: '"square" | "pill"',
      default: '"square"',
      description:
        "pill is the standalone form: rounded, a control height so it lines up with a Toggle beside it, and room for a dot. The site kept a separate StatusPill for this, which was this component with a different radius.",
    },
    {
      name: "dot",
      type: "boolean",
      default: "false",
      description: "A leading dot. Decorative — the badge's own text carries the meaning.",
    },
    {
      name: "pulse",
      type: "boolean",
      default: "false",
      description:
        "Animates the dot, and implies it. Stops under prefers-reduced-motion through the stylesheet, so a visitor who asked for stillness gets a static dot rather than a slower one.",
    },
  ],
  accessibility: [
    "The dot is aria-hidden. It decorates the words, and announcing it would add noise and no meaning.",
    "Renders as inert text, with no role and no tab stop — it is content, not a control.",
    "The label carries the meaning and the tone reinforces it. A badge whose text is a bare number, distinguished only by its colour, would fail SC 1.4.1.",
    "Every tone's text and tinted surface are checked as a pair, in both themes, by the contrast audit.",
  ],
  guidance: {
    do: [
      "Write the state as a word.",
      "Keep to one badge per item.",
      "Use danger for a state that needs attention, not merely a negative one.",
    ],
    dont: [
      "Do not attach a click handler. Reach for Chip or Button.",
      "Do not use a badge as a counter without a label the reader can hear.",
      "Do not invent a tone per feature — six is the vocabulary.",
    ],
  },
};
