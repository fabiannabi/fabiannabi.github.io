import type { ComponentDoc } from "../../docs/types";

export const tableDoc: ComponentDoc = {
  name: "Table",
  slug: "table",
  category: "Data display",
  summary:
    "Tabular data as a real table: a caption, scoped headers, and a scroll region a keyboard can reach. The props tables on this page are built from it.",
  anatomy: ["A caption naming the table", "Column headers", "Rows, optionally led by a row header"],
  props: [
    {
      name: "caption",
      type: "string",
      required: true,
      description:
        "Required, and not decorative. Without one the table is announced as its shape and nothing else, which is no use to someone landing on it from the table list.",
    },
    {
      name: "columns",
      type: "readonly TableColumn[]",
      required: true,
      description: "Each is a key, a header, and optionally numeric to align a column of figures.",
    },
    {
      name: "rows",
      type: "readonly TableRow[]",
      required: true,
      description: "Each is a stable id and one cell per column, in the same order as the columns.",
    },
    {
      name: "rowHeaders",
      type: "boolean",
      default: "false",
      description:
        "Treats the first cell of every row as its header. Use it whenever the first column identifies the row.",
    },
    {
      name: "hideCaption",
      type: "boolean",
      default: "false",
      description:
        "Hides the caption visually. It stays in the accessibility tree — this is not a way to skip writing one.",
    },
  ],
  accessibility: [
    "A real table element, not a grid of divs. The div version looks identical and gives a screen reader no way to say which column a value is in, and tabular data is exactly what people navigate cell by cell.",
    "Every column header carries scope=\"col\"; with rowHeaders the first cell of each row carries scope=\"row\", so a cell read in the middle of a wide table announces both the column and the row it belongs to.",
    "The scroll container is focusable and carries a role and an accessible name, because a region that scrolls has to be reachable from the keyboard (SC 2.1.1): a mouse can drag a wide table sideways and a keyboard cannot unless something inside can take focus.",
    "The table scrolls on its own axis rather than widening the page, so a long cell never forces the document to scroll horizontally (SC 1.4.10).",
    "The caption is clipped rather than removed when hidden. display: none would take it out of the accessibility tree, which is the one thing a caption is for.",
  ],
  guidance: {
    do: [
      "Write a caption that says what the table contains, not what it is.",
      "Turn on rowHeaders when the first column names the row.",
      "Mark figure columns numeric so they align on their last digit.",
    ],
    dont: [
      "Do not use it for layout. That is what grid is for, and a layout table is announced as data.",
      "Do not put an interactive element in a cell without a label of its own — “Edit” in row four is not a name.",
      "Do not nest a table inside a cell.",
    ],
  },
};
