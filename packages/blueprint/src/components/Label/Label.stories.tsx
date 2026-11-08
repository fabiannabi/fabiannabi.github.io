import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";
import { labelDoc } from "./Label.docs";

const meta = {
  title: "Typography/Label",
  component: Label,
  parameters: { docs: { description: { component: labelDoc.summary } } },
  args: { children: "Selected work" },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md"] },
    tone: { control: "inline-radio", options: ["default", "muted", "subtle", "accent"] },
    caps: { control: "boolean" },
    as: { control: "inline-radio", options: ["p", "span", "div", "h2", "h3"] },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Roles: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Label size="sm" caps tone="default">
        Section marker
      </Label>
      <Label size="xs" caps>
        Caption under a figure
      </Label>
      <Label size="md">A byline, in sentence case</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Tracking is derived from the size and the case, not passed in. Capitals lose their word shape and need more of it; the three places this replaced had each picked a value by eye, and adopting the rule collapsed five trackings into three.",
      },
    },
  },
};

export const AsAHeading: Story = {
  args: { as: "h2", caps: true, tone: "default" },
  parameters: {
    docs: {
      description: {
        story:
          "A section title that is styled as a small caps marker is still the section's title. The appearance is a label; the element carries the outline, so the section stays in the heading list.",
      },
    },
  },
};
