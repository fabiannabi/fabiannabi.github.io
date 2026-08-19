import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./Table";
import { tableDoc } from "./Table.docs";

const COLUMNS = [
  { key: "token", header: "Token" },
  { key: "value", header: "Value" },
  { key: "ratio", header: "Contrast", numeric: true },
];

const ROWS = [
  { id: "text", cells: ["--ds-text", "slate-50", "15.63"] },
  { id: "muted", cells: ["--ds-text-muted", "slate-400", "6.07"] },
  { id: "subtle", cells: ["--ds-text-subtle", "slate-500", "4.88"] },
];

const meta = {
  title: "Data display/Table",
  component: Table,
  parameters: { docs: { description: { component: tableDoc.summary } } },
  args: { caption: "Text tones against the surface", columns: COLUMNS, rows: ROWS, rowHeaders: true },
  argTypes: { rowHeaders: { control: "boolean" }, hideCaption: { control: "boolean" } },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  render: (args) => (
    <div style={{ maxWidth: 260 }}>
      <Table {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Too narrow for its own content. The table scrolls on its own axis rather than widening the page, and the scroll container takes focus — tab to it and use the arrow keys, because a mouse can drag a wide table sideways and a keyboard cannot.",
      },
    },
  },
};
