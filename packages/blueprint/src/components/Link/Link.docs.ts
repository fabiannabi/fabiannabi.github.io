import type { ComponentDoc } from "../../docs/types";

export const linkDoc: ComponentDoc = {
  name: "Link",
  slug: "link",
  category: "Navigation",
  summary:
    "A destination. Gets the target size and the underline right, which is where a hand-styled anchor usually goes wrong.",
  props: [
    { name: "href", type: "string", required: true, description: "Where it goes." },
    {
      name: "font",
      type: '"sans" | "mono"',
      default: '"sans"',
      description: "mono for a list of destinations, sans inside a sentence.",
    },
    {
      name: "tone",
      type: '"default" | "muted" | "subtle"',
      default: '"default"',
      description:
        "All three are measured against both surfaces by the contrast audit, hovered as well as at rest.",
    },
    {
      name: "size",
      type: '"sm" | "md"',
      default: '"sm"',
      description: "sm is a destination in a list; md reads at body size, inside a sentence.",
    },
  ],
  accessibility: [
    "The hit area is at least 24×24 CSS px (WCAG 2.2 SC 2.5.8), reached with padding and inline-flex rather than line-height — line-height makes the text look like it has room around it while leaving the target the height of the glyphs, and a 2.1-era checker passes both.",
    "The underline is present at every state and only changes colour, so hovering never reflows the line. Underline-on-hover-only is the more common version and it is the one that shifts.",
    "Hover is a colour change against the same surface, and that pair is in the contrast audit: a hover state is not exempt from 1.4.3.",
  ],
  guidance: {
    do: [
      "Use it for anything that navigates.",
      "Use mono for a row of destinations, where the even width does the aligning.",
      "Let the tone carry the hierarchy instead of the size.",
    ],
    dont: [
      "Do not use it for an action. A link that does not go anywhere is a Button.",
      "Do not remove the underline inside a paragraph — colour alone is not an indicator (1.4.1).",
      "Do not nest another interactive element inside it.",
    ],
  },
};
