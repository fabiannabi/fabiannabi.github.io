import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";
import { tabsDoc } from "./Tabs.docs";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: { docs: { description: { component: tabsDoc.summary } } },
  argTypes: {
    activation: { control: "inline-radio", options: ["automatic", "manual"] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelStyle = { color: "var(--ds-text-muted)", fontSize: "var(--ds-text-sm)" };

export const Default: Story = {
  args: { defaultValue: "overview", children: null },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List label="Sequence detail">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="steps">Steps</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <p style={panelStyle}>
          Focus a tab, then use the arrow keys. They wrap at both ends; Home and End jump to the
          first and last. Tab leaves the tablist and lands here, on the panel.
        </p>
      </Tabs.Panel>
      <Tabs.Panel value="steps">
        <p style={panelStyle}>Only the selected panel is in the DOM.</p>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <p style={panelStyle}>Nothing hidden is announced or focusable.</p>
      </Tabs.Panel>
    </Tabs>
  ),
};

export const ManualActivation: Story = {
  ...Default,
  args: { defaultValue: "overview", activation: "manual", children: null },
  parameters: {
    docs: {
      description: {
        story:
          "Arrow keys move focus without selecting; Enter or Space commits. Use this when opening a panel costs a request, so arrowing past three tabs does not fire three of them.",
      },
    },
  },
};

export const WithDisabledTab: Story = {
  args: { defaultValue: "overview", children: null },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List label="Sequence detail">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="steps">Steps</Tabs.Tab>
        <Tabs.Tab value="archive" disabled>
          Archive
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <p style={panelStyle}>
          The disabled tab is still reachable by arrow key and still announced — it is unavailable,
          not invisible.
        </p>
      </Tabs.Panel>
      <Tabs.Panel value="steps">
        <p style={panelStyle}>Second panel.</p>
      </Tabs.Panel>
    </Tabs>
  ),
};
