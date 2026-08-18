import { type ReactNode, useState } from "react";
import { Alert } from "../../ds/components/Alert/Alert";
import { Badge } from "../../ds/components/Badge/Badge";
import { Button } from "../../ds/components/Button/Button";
import { Chip } from "../../ds/components/Chip/Chip";
import { Code } from "../../ds/components/Code/Code";
import { Heading } from "../../ds/components/Heading/Heading";
import { Tabs } from "../../ds/components/Tabs/Tabs";
import { Text } from "../../ds/components/Text/Text";
import styles from "./examples.module.css";

/* Live, stateful examples. Screenshots go stale and cannot be tabbed through;
   these are the actual components, so switching the theme or the x-ray on
   affects the documentation exactly as it affects the product. */

function Row({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowItems}>{children}</div>
    </div>
  );
}

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false" className={styles.glyph}>
    <path d="M3 4h10M6.5 4V2.5h3V4M4.5 4l.6 9h5.8l.6-9" />
  </svg>
);

function ButtonExample() {
  return (
    <>
      <Row label="variant">
        <Button>Save changes</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="ghost">Learn more</Button>
        <Button variant="danger" icon={<TrashIcon />}>
          Delete sequence
        </Button>
      </Row>
      <Row label="size">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Row>
      <Row label="state">
        <Button loading>Saving</Button>
        <Button disabled>Unavailable</Button>
        <Button iconOnly aria-label="Delete sequence" variant="outline">
          <TrashIcon />
        </Button>
      </Row>
    </>
  );
}

function ChipExample() {
  const [selected, setSelected] = useState<string[]>(["Email"]);
  const [removed, setRemoved] = useState<string[]>([]);
  const filters = ["Email", "Call", "LinkedIn", "Meeting"];

  const toggle = (name: string): void =>
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );

  return (
    <>
      <Row label="selectable">
        {filters.map((name) => (
          <Chip
            key={name}
            label={name}
            selected={selected.includes(name)}
            onSelect={() => toggle(name)}
          />
        ))}
      </Row>
      <Row label="removable">
        {["owner:me", "stage:demo"]
          .filter((name) => !removed.includes(name))
          .map((name) => (
            <Chip key={name} label={name} onRemove={() => setRemoved((r) => [...r, name])} />
          ))}
        {removed.length > 0 ? (
          <Button size="sm" variant="ghost" onClick={() => setRemoved([])}>
            Reset
          </Button>
        ) : null}
      </Row>
      <Row label="static">
        <Chip label="read-only" />
        <Chip label="disabled" disabled onSelect={() => undefined} />
      </Row>
    </>
  );
}

function BadgeExample() {
  return (
    <Row label="tone">
      <Badge>Draft</Badge>
      <Badge tone="accent">Beta</Badge>
      <Badge tone="info">Scheduled</Badge>
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Paused</Badge>
      <Badge tone="danger">Bounced</Badge>
    </Row>
  );
}

function TabsExample() {
  return (
    <div className={styles.block}>
      <Tabs defaultValue="overview">
        <Tabs.List label="Sequence detail">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="steps">Steps</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
          <Tabs.Tab value="archive" disabled>
            Archive
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <Text size="sm" tone="muted">
            Arrow keys move between tabs and wrap at both ends. Home and End jump to the first and
            last. Tab leaves the tablist and lands here, on the panel.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="steps">
          <Text size="sm" tone="muted">
            Only the selected panel is in the DOM, so nothing hidden is announced or focusable.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <Text size="sm" tone="muted">
            Set activation to manual when opening a panel costs a request.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

function AlertExample() {
  const [shown, setShown] = useState(true);

  return (
    <div className={styles.stack}>
      <Alert tone="info" title="Sync scheduled">
        The next contact sync runs in about twelve minutes.
      </Alert>
      <Alert tone="success" title="Sequence published">
        Three hundred contacts will enter step one tomorrow morning.
      </Alert>
      <Alert tone="warning" title="Sending window closes soon">
        Steps queued after 5pm local time will send tomorrow.
      </Alert>
      {shown ? (
        <Alert tone="danger" title="Payment failed" onDismiss={() => setShown(false)}>
          We could not charge the card ending 4242. Update it to avoid interruption.
        </Alert>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setShown(true)}>
          Restore dismissed alert
        </Button>
      )}
    </div>
  );
}

function HeadingExample() {
  return (
    <div className={styles.stack}>
      <Heading level={2} size="xl">
        Level 2, size xl
      </Heading>
      <Heading level={3} size="lg">
        Level 3, size lg
      </Heading>
      <Heading level={4} size="sm">
        Level 4 at size sm — structurally important, visually quiet
      </Heading>
    </div>
  );
}

function TextExample() {
  return (
    <div className={styles.stack}>
      <Text measure>
        Default tone at the medium step. Body copy caps its measure at about 65 characters, because
        past roughly 75 the eye loses the start of the next line.
      </Text>
      <Text tone="muted" size="sm">
        Muted, small — secondary information.
      </Text>
      <Text tone="subtle" size="xs">
        Subtle, extra small — timestamps and metadata.
      </Text>
      <Text tone="accent" weight="medium" size="sm">
        Accent, medium weight.
      </Text>
      <Text tone="danger" size="sm">
        Danger — a validation message that says what is wrong.
      </Text>
    </div>
  );
}

function CodeExample() {
  return (
    <div className={styles.stack}>
      <Text size="sm" tone="muted">
        Inline, as in <Code>variant=&quot;outline&quot;</Code>, inside a sentence.
      </Text>
      <Code block label="Button usage">{`<Button variant="danger" onClick={remove}>
  Delete sequence
</Button>`}</Code>
    </div>
  );
}

export const EXAMPLES: Record<string, ReactNode> = {
  button: <ButtonExample />,
  chip: <ChipExample />,
  badge: <BadgeExample />,
  tabs: <TabsExample />,
  alert: <AlertExample />,
  heading: <HeadingExample />,
  text: <TextExample />,
  code: <CodeExample />,
};
