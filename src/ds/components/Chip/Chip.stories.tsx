import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Chip } from "./Chip";
import { chipDoc } from "./Chip.docs";

const meta = {
  title: "Data display/Chip",
  component: Chip,
  parameters: { docs: { description: { component: chipDoc.summary } } },
  args: { label: "Email" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: { label: "read-only" },
  parameters: {
    docs: {
      description: {
        story: "With no handler the chip renders as inert text — no role, no tab stop.",
      },
    },
  },
};

export const Selectable: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(["Email"]);
    const toggle = (name: string): void =>
      setSelected((current) =>
        current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
      );

    return (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {["Email", "Call", "LinkedIn", "Meeting"].map((name) => (
          <Chip
            key={name}
            label={name}
            selected={selected.includes(name)}
            onSelect={() => toggle(name)}
          />
        ))}
      </div>
    );
  },
};

export const Removable: Story = {
  render: function Render() {
    const [chips, setChips] = useState(["owner:me", "stage:demo", "created:30d"]);

    return (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {chips.map((name) => (
          <Chip
            key={name}
            label={name}
            onRemove={() => setChips((current) => current.filter((item) => item !== name))}
          />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The remove button is a sibling of the toggle, never nested inside it, and its accessible name includes the chip's label so a row of chips does not produce identical “Remove” entries.",
      },
    },
  },
};
