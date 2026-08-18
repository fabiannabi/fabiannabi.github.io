import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { badgeDoc } from "./Badge.docs";

const meta = {
  title: "Data display/Badge",
  component: Badge,
  parameters: { docs: { description: { component: badgeDoc.summary } } },
  args: { children: "Active" },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "accent", "info", "success", "warning", "danger"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Badge>Draft</Badge>
      <Badge tone="accent">Beta</Badge>
      <Badge tone="info">Scheduled</Badge>
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Paused</Badge>
      <Badge tone="danger">Bounced</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The label carries the meaning and the tone reinforces it. A badge whose text is a bare number, distinguished only by colour, would fail SC 1.4.1.",
      },
    },
  },
};
