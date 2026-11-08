import type { Meta, StoryObj } from "@storybook/react-vite";
import { buttonDoc } from "./Button.docs";
import { Button } from "./Button";

const meta = {
  title: "Actions/Button",
  component: Button,
  parameters: {
    docs: { description: { component: buttonDoc.summary } },
  },
  args: { children: "Save changes" },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      <Button {...args} variant="solid">
        Save changes
      </Button>
      <Button {...args} variant="outline">
        Cancel
      </Button>
      <Button {...args} variant="ghost">
        Learn more
      </Button>
      <Button {...args} variant="danger">
        Delete sequence
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: "Saving" },
  parameters: {
    docs: {
      description: {
        story:
          "Sets aria-busy and blocks activation. The label stays visible so the button does not change width mid-action, and the spinner holds still under prefers-reduced-motion.",
      },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Unavailable" },
  parameters: {
    docs: {
      description: {
        story:
          "Applies aria-disabled rather than the native attribute. A natively disabled button drops out of the tab order, stranding a keyboard user who had just focused it.",
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    variant: "outline",
    "aria-label": "Delete sequence",
    children: (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor">
        <path d="M3 4h10M6.5 4V2.5h3V4M4.5 4l.6 9h5.8l.6-9" strokeLinecap="round" />
      </svg>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The type demands aria-label on an icon-only button — this story cannot be written without one. “Unnamed icon button” stops being a defect you find in an audit and becomes a compile error.",
      },
    },
  },
};
