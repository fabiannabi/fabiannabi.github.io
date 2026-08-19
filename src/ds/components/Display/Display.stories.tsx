import type { Meta, StoryObj } from "@storybook/react-vite";
import { Display } from "./Display";
import { displayDoc } from "./Display.docs";

const meta = {
  title: "Typography/Display",
  component: Display,
  parameters: { docs: { description: { component: displayDoc.summary } } },
  args: { children: "Fabian Alcala" },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    as: { control: "inline-radio", options: ["p", "span", "div", "dd"] },
  },
} satisfies Meta<typeof Display>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Display size="lg">Size lg</Display>
      <Display size="md">Size md</Display>
      <Display size="sm">Size sm</Display>
      <Display size="xs">Size xs</Display>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Three of the four are fluid, so resize the preview to see them move. Each carries its own tracking: the value that looks correct at 20px is loose at 50px, which is why it is not a prop.",
      },
    },
  },
};

export const NotAHeading: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 8 }}>
      <Display size="md">Fabian Alcala</Display>
      <h1 style={{ margin: 0, fontSize: 18 }}>The real h1, further down the page</h1>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The name is larger than the h1 and is not in the outline. Reaching for Heading to get the size here is what produces an h2 that precedes the h1 — the reason this component exists at all.",
      },
    },
  },
};
