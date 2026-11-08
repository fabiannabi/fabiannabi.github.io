import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./Link";
import { linkDoc } from "./Link.docs";

const meta = {
  title: "Navigation/Link",
  component: Link,
  parameters: { docs: { description: { component: linkDoc.summary } } },
  args: { href: "#link", children: "Read the full profile" },
  argTypes: {
    font: { control: "inline-radio", options: ["sans", "mono"] },
    tone: { control: "inline-radio", options: ["default", "muted", "subtle"] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ARowOfDestinations: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Link href="#link" font="mono" tone="muted">
        LinkedIn
      </Link>
      <Link href="#link" font="mono" tone="muted">
        GitHub
      </Link>
      <Link href="#link" font="mono" tone="muted">
        Email
      </Link>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Hover one. The underline is present at every state and only changes colour, so the line never reflows — underline-on-hover-only is the more common version and it is the one that shifts the text by a pixel.",
      },
    },
  },
};

export const TargetSize: Story = {
  render: () => (
    <div style={{ outline: "1px dashed currentColor", display: "inline-flex" }}>
      <Link href="#link" font="mono" tone="muted">
        24px tall
      </Link>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The dashed box is the hit area, not the text box. It gets to 24px (SC 2.5.8) with padding rather than line-height, because line-height makes the text look like it has room while leaving the target the height of the glyphs — and a 2.1-era checker passes both.",
      },
    },
  },
};
