import type { Meta, StoryObj } from "@storybook/react-vite";
import { VisuallyHidden } from "./VisuallyHidden";
import { visuallyHiddenDoc } from "./VisuallyHidden.docs";

const meta = {
  title: "Foundations/VisuallyHidden",
  component: VisuallyHidden,
  parameters: { docs: { description: { component: visuallyHiddenDoc.summary } } },
  args: { children: "Only a screen reader receives this." },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <p>
      <VisuallyHidden {...args} />
      Nothing before this sentence is painted, and it is still in the accessibility tree.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Clipped to one pixel rather than hidden. display: none and visibility: hidden take it out of the accessibility tree too, which is the opposite of what it is for.",
      },
    },
  },
};
