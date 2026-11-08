import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";
import { headingDoc } from "./Heading.docs";

const meta = {
  title: "Typography/Heading",
  component: Heading,
  parameters: { docs: { description: { component: headingDoc.summary } } },
  args: { level: 2, children: "Components you can take apart" },
  argTypes: {
    level: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Heading level={2} size="xl">
        Size xl
      </Heading>
      <Heading level={2} size="lg">
        Size lg
      </Heading>
      <Heading level={2} size="md">
        Size md
      </Heading>
      <Heading level={2} size="sm">
        Size sm
      </Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Every heading here is an h2. Size is appearance; level is the document outline. Keeping them separate is what prevents an h4 chosen because it was the right size.",
      },
    },
  },
};
