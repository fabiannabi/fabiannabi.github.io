import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Alert } from "./Alert";
import { alertDoc } from "./Alert.docs";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: { docs: { description: { component: alertDoc.summary } } },
  args: { children: "The next contact sync runs in about twelve minutes." },
  argTypes: {
    tone: { control: "inline-radio", options: ["info", "success", "warning", "danger"] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { title: "Sync scheduled" } };

export const Tones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Alert tone="info" title="Sync scheduled">
        The next contact sync runs in about twelve minutes.
      </Alert>
      <Alert tone="success" title="Sequence published">
        Three hundred contacts will enter step one tomorrow morning.
      </Alert>
      <Alert tone="warning" title="Sending window closes soon">
        Steps queued after 5pm local time will send tomorrow.
      </Alert>
      <Alert tone="danger" title="Payment failed">
        We could not charge the card ending 4242.
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Each tone has its own glyph shape, not just its own colour, and carries the tone word as visually hidden text. Turn the colour off and the meaning is still there.",
      },
    },
  },
};

export const Urgency: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Alert tone="success" title="role=status">
        Waits for a pause in what the screen reader is already saying.
      </Alert>
      <Alert tone="danger" title="role=alert">
        Interrupts. Reserved for warnings and errors.
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Announcing every success assertively is how a screen reader becomes something people switch off, so only warning and danger interrupt.",
      },
    },
  },
};

export const Dismissible: Story = {
  render: function Render() {
    const [shown, setShown] = useState(true);
    if (!shown) {
      return (
        <button type="button" onClick={() => setShown(true)}>
          Bring it back
        </button>
      );
    }
    return (
      <Alert tone="danger" title="Payment failed" onDismiss={() => setShown(false)}>
        The dismiss button is named after what it dismisses, not just “Close”.
      </Alert>
    );
  },
};
