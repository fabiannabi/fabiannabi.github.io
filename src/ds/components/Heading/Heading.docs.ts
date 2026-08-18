import type { ComponentDoc } from "../../docs/types";

export const headingDoc: ComponentDoc = {
  name: "Heading",
  slug: "heading",
  category: "Typography",
  summary:
    "A section title. The level is the document outline; the size is the appearance. They are separate props, and that is the point.",
  props: [
    {
      name: "level",
      type: "1 | 2 | 3 | 4 | 5 | 6",
      required: true,
      description:
        "The semantic level. Chosen by the heading's position in the document, never by how large it should look.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      default: "matches the level",
      description: "The visual size. Override it when the design calls for it; the outline is unaffected.",
    },
  ],
  accessibility: [
    "Renders a real h1–h6, so it appears in the heading list that most screen reader users navigate by.",
    "Separating level from size removes the most common heading defect: an h4 chosen because it was the right size, leaving an outline that skips from h1 to h4.",
    "Text wrapping is balanced, so a two-line heading does not leave one word alone on the second line.",
  ],
  guidance: {
    do: [
      "Pick the level by walking the page, not by looking at it.",
      "Use one h1 per page.",
      "Override size when a structurally important heading should be visually quiet.",
    ],
    dont: [
      "Do not skip levels to get a smaller heading — set size instead.",
      "Do not use a heading for emphasis inside a paragraph.",
      "Do not put a heading on a section with no content under it.",
    ],
  },
};
