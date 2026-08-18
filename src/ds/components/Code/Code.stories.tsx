import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code } from "./Code";
import { codeDoc } from "./Code.docs";

const meta = {
  title: "Typography/Code",
  component: Code,
  parameters: { docs: { description: { component: codeDoc.summary } } },
  args: { children: 'variant="outline"' },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {};

export const Block: Story = {
  args: {
    block: true,
    label: "Button usage",
    children: `<Button variant="danger" onClick={remove}>
  Delete sequence
</Button>`,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A block scrolls on its own axis, so it is focusable and named — a scrollable region that cannot be reached by keyboard fails SC 2.1.1, and one that widens the page fails SC 1.4.10.",
      },
    },
  },
};
