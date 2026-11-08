import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle";
import { toggleDoc } from "./Toggle.docs";

const meta = {
  title: "Actions/Toggle",
  component: Toggle,
  parameters: { docs: { description: { component: toggleDoc.summary } } },
  args: { pressed: false, onToggle: () => undefined, children: "X-ray" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    pressed: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = { args: { pressed: true } };

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <Toggle pressed={on} onToggle={() => setOn(!on)} shortcut="X">
        X-ray
      </Toggle>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The label does not flip. aria-pressed carries the state, so a screen reader announces it rather than leaving it to be read off the fill.",
      },
    },
  },
};

export const TwoUnrelatedUses: Story = {
  render: () => {
    const [theme, setTheme] = useState(false);
    const [xray, setXray] = useState(true);
    return (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Toggle
          pressed={theme}
          onToggle={() => setTheme(!theme)}
          iconOnly
          aria-label="Switch to light theme"
          icon={<span aria-hidden="true">◐</span>}
        >
          Switch to light theme
        </Toggle>
        <Toggle pressed={xray} onToggle={() => setXray(!xray)} shortcut="X">
          X-ray
        </Toggle>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The site's theme switch and the design system's own blueprint control. Two unrelated concepts, one control — which is the test of whether something belongs in a system. One use would have made this a component nobody needed.",
      },
    },
  },
};
