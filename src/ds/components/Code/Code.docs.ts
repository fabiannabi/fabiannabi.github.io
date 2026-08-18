import type { ComponentDoc } from "../../docs/types";

export const codeDoc: ComponentDoc = {
  name: "Code",
  slug: "code",
  category: "Typography",
  summary: "A code sample, inline in a sentence or as a standalone block.",
  props: [
    {
      name: "block",
      type: "boolean",
      default: "false",
      description: "Renders <pre><code> with its own horizontal scroll instead of inline <code>.",
    },
    {
      name: "label",
      type: "string",
      default: '"Code sample"',
      description: "Accessible name for the block, announced before the sample.",
    },
  ],
  accessibility: [
    "A code block scrolls, so it is focusable and has a region role with a name — a scrollable area that cannot be reached or scrolled by keyboard fails SC 2.1.1.",
    "The block takes its own scroll axis, so a long line never widens the page and forces horizontal scrolling on the document (SC 1.4.10).",
    "Inline code keeps a relative font size, so it scales with the surrounding text.",
  ],
  guidance: {
    do: [
      "Label a block with what it shows.",
      "Keep inline code to identifiers and short expressions.",
      "Let long lines scroll rather than wrapping mid-token.",
    ],
    dont: [
      "Do not put a whole file in a block on a docs page.",
      "Do not use code styling for emphasis.",
      "Do not remove the focus ring from a scrollable block.",
    ],
  },
};
