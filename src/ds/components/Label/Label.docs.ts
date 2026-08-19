import type { ComponentDoc } from "../../docs/types";

export const labelDoc: ComponentDoc = {
  name: "Label",
  slug: "label",
  category: "Typography",
  summary:
    "Mono micro-typography: the byline under a name, the caption under a figure, the marker above a section.",
  props: [
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lead"',
      default: '"sm"',
      description: "xs is a caption under a figure, sm a section marker, md a byline.",
    },
    {
      name: "tone",
      type: '"default" | "muted" | "subtle" | "accent" | "danger" | "inherit"',
      default: '"muted"',
      description: "Every tone is measured against both surfaces by the contrast audit.",
    },
    {
      name: "caps",
      type: "boolean",
      default: "false",
      description:
        "Small caps for a marker rather than a sentence. Tracking opens up automatically, because capitals need more of it than lower case at the same size.",
    },
    {
      name: "as",
      type: '"p" | "span" | "div" | "h2" | "h3"',
      default: '"p"',
      description:
        "A section marker is often the section's real heading. The appearance is a label; the element still has to be able to carry the outline.",
    },
  ],
  accessibility: [
    "Renders a real heading element when asked, so a section whose title is set as a small caps marker still appears in the heading list.",
    "Capitals come from text-transform, not from typing them: the accessible string stays sentence case, so an abbreviation is not announced letter by letter because the design wanted caps.",
    "Tracking is derived from size and case rather than exposed, so capitals cannot be set at body tracking, where they stop resolving into words.",
  ],
  guidance: {
    do: [
      "Use caps for a marker: a section title, a caption under a figure.",
      "Pass as='h2' when the marker is the section's title.",
      "Keep it to a few words.",
    ],
    dont: [
      "Do not set a sentence in caps. Word shape is most of reading speed.",
      "Do not type the capitals yourself.",
      "Do not use it as a form control's label — that belongs to the control.",
    ],
  },
};
