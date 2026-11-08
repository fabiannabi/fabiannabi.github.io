import type { ComponentDoc } from "../../docs/types";

export const displayDoc: ComponentDoc = {
  name: "Display",
  slug: "display",
  category: "Typography",
  summary:
    "Display type that is not a heading: a name at the top of a page, the figure in a statistic. Heading owns the outline, this owns the scale.",
  props: [
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg"',
      default: '"md"',
      description:
        "xs is a fixed subtitle. sm, md and lg are fluid — a figure, a name, and the top of a page — and each carries its own tracking.",
    },
    {
      name: "as",
      type: '"p" | "span" | "div" | "dd"',
      default: '"p"',
      description:
        "The element. Deliberately excludes h1–h6: this must not be able to affect the outline.",
    },
  ],
  accessibility: [
    "Cannot render a heading element, which is the whole reason it exists. Reaching for Heading to get a large size is what produces an h2 that precedes the h1.",
    "Tracking is bound to the size rather than exposed as a prop, so display type cannot be set with body tracking at 50px, where it stops resolving into words.",
    "Fluid sizes are clamped at both ends, so the type never falls below its minimum on a narrow screen or grows past its maximum on a wide one.",
  ],
  guidance: {
    do: [
      "Use it for type that is large but is not a section title.",
      "Pair sm with a Label to build a statistic — or use Stat, which already does.",
      "Let the size choose the tracking.",
    ],
    dont: [
      "Do not use it for a section title. That is Heading, and the outline depends on it.",
      "Do not use it for body copy that happens to need emphasis. That is Text with a weight.",
      "Do not put a sentence in it. Every size here assumes a few words.",
    ],
  },
};
