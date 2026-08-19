import type { ComponentDoc } from "../../docs/types";

export const visuallyHiddenDoc: ComponentDoc = {
  name: "VisuallyHidden",
  slug: "visuallyhidden",
  category: "Foundations",
  summary:
    "Content for assistive technology that is never painted. The one correct way to say something to a screen reader and not to the screen.",
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description:
        "What is announced.",
    },
    {
      name: "as",
      type: "ElementType",
      default: "\"span\"",
      description:
        "Defaults to a span. Pass \"p\" when the content is a paragraph, so the element matches what it holds.",
    },
  ],
  accessibility: [
    "Clips the element to a single pixel rather than hiding it. display: none and visibility: hidden remove it from the accessibility tree as well, which is the opposite of the point.",
    "Keeps the content in the DOM and in reading order, so it is announced where it belongs rather than at the end of the page.",
    "Used by RotatingHeadline to carry the real sentence, and by StackRail to stop a duplicated marquee from being read twice.",
  ],
  guidance: {
    do: [
      "Use it for the sentence a visual construction implies but does not spell out.",
      "Keep it short. It is read aloud in full.",
      "Put it where it belongs in reading order.",
    ],
    dont: [
      "Do not use it to hide something you would rather nobody read.",
      "Do not put interactive content inside it. A focusable element nobody can see is a trap.",
      "Do not reach for display: none as a shortcut.",
    ],
  },
};
