import type { ComponentDoc } from "../../docs/types";

export const textDoc: ComponentDoc = {
  name: "Text",
  slug: "text",
  category: "Typography",
  summary: "Body copy and labels. One component for every non-heading string in the interface.",
  props: [
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg"',
      default: '"md"',
      description: "Steps on the type scale. There is no arbitrary size.",
    },
    {
      name: "tone",
      type: '"default" | "muted" | "subtle" | "accent" | "danger"',
      default: '"default"',
      description:
        "Every tone is contrast-checked against both surfaces in both themes. There is no fainter option because the value that would look right measures about 2:1.",
    },
    {
      name: "weight",
      type: '"regular" | "medium" | "bold"',
      default: '"regular"',
      description: "Emphasis within body copy.",
    },
    {
      name: "as",
      type: '"p" | "span" | "div" | "label"',
      default: '"p"',
      description: "The element. Use span when the text sits inside a sentence.",
    },
    {
      name: "measure",
      type: "boolean",
      default: "false",
      description: "Caps the line length at about 65 characters.",
    },
  ],
  accessibility: [
    "Tones are constrained to values that pass 4.5:1 on both the base and raised surfaces, in both themes. A design system that ships an unreadable grey has shipped the defect to every team at once.",
    "Sizes come from a scale rather than arbitrary pixel values, so text stays proportional when a user changes their browser font size.",
    "Rendering as a label is supported so form text is associated rather than merely adjacent.",
  ],
  guidance: {
    do: [
      "Use measure on any paragraph the user is expected to read.",
      "Use tone to establish hierarchy before reaching for size.",
      "Use as=\"span\" when the text is part of a larger sentence.",
    ],
    dont: [
      "Do not use size to convey importance — that is what a heading is for.",
      "Do not stack muted on top of a tinted surface without checking the pair.",
      "Do not set colour directly; pick a tone.",
    ],
  },
};
