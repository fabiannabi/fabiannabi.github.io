import type { ComponentDoc } from "../../docs/types";

export const alertDoc: ComponentDoc = {
  name: "Alert",
  slug: "alert",
  category: "Feedback",
  summary:
    "Communicates the status of a task or the state of the system, in place. For something that needs an answer before the user continues, use a dialog.",
  anatomy: ["Tone icon", "Optional title", "Message", "Optional dismiss button"],
  props: [
    {
      name: "tone",
      type: '"info" | "success" | "warning" | "danger"',
      default: '"info"',
      description:
        "Sets the colour, the glyph, and — importantly — whether the alert interrupts a screen reader.",
    },
    {
      name: "title",
      type: "string",
      description: 'Short and specific. "Payment failed", not "Error".',
    },
    {
      name: "onDismiss",
      type: "() => void",
      description:
        "Renders a close button. The component does not remove itself; the caller owns that state.",
    },
    {
      name: "dismissLabel",
      type: "string",
      default: '"Dismiss {tone}"',
      description: "Overrides the accessible name of the close button.",
    },
  ],
  accessibility: [
    "warning and danger render role=\"alert\", which interrupts. info and success render role=\"status\", which waits for a pause. Announcing every success assertively is how a screen reader becomes something people switch off.",
    "Each tone has a distinct glyph shape, not just a distinct colour, and the tone word is present as visually hidden text — so the meaning survives for anyone who cannot distinguish red from green (SC 1.4.1).",
    "The dismiss button is a real button with an accessible name and a 24×24 target.",
    "Text and its tinted surface are contrast-checked as a pair in both themes by the audit script.",
  ],
  guidance: {
    do: [
      "Put the alert next to the thing it is about.",
      "Say what happened and what to do next.",
      "Use danger only for something that failed or is about to be lost.",
    ],
    dont: [
      "Do not stack four alerts. If everything is important, nothing is.",
      "Do not use an alert for a message the user must acknowledge — that is a dialog.",
      "Do not rely on the colour to carry the meaning; write it in the text.",
    ],
  },
};
