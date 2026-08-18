import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text";
import { textDoc } from "./Text.docs";

const meta = {
  title: "Typography/Text",
  component: Text,
  parameters: { docs: { description: { component: textDoc.summary } } },
  args: {
    children:
      "Body copy caps its measure at about 65 characters, because past roughly 75 the eye loses the start of the next line.",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    tone: { control: "inline-radio", options: ["default", "muted", "subtle", "accent", "danger"] },
    weight: { control: "inline-radio", options: ["regular", "medium", "bold"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { measure: true } };

export const Tones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Text>Default — primary copy.</Text>
      <Text tone="muted">Muted — secondary information.</Text>
      <Text tone="subtle">Subtle — timestamps and metadata.</Text>
      <Text tone="accent">Accent — a link or a highlighted value.</Text>
      <Text tone="danger">Danger — a validation message.</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Every tone clears 4.5:1 on both the base and the raised surface, in both themes. There is deliberately no fainter option: the value that would look right measures about 2:1.",
      },
    },
  },
};
