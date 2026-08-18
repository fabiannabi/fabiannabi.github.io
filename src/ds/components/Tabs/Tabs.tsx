import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import { TabsContext, type TabsActivation, panelId, tabId, useTabs } from "./TabsContext";
import styles from "./Tabs.module.css";

/* ------------------------------------------------------------------ root -- */

type TabsProps = {
  children: ReactNode;
  /** Uncontrolled starting tab. */
  defaultValue?: string;
  /** Controlled value. Pass with onValueChange. */
  value?: string;
  onValueChange?: (value: string) => void;
  /**
   * Automatic selects the tab that receives focus, which is right when panels
   * are cheap. Manual requires Enter or Space — use it when showing a panel
   * costs a request, so arrowing past three tabs does not fire three of them.
   */
  activation?: TabsActivation;
};

export function Tabs({
  children,
  defaultValue = "",
  value: controlled,
  onValueChange,
  activation = "automatic",
}: TabsProps) {
  const baseId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;

  const select = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const context = useMemo(
    () => ({ value, select, activation, baseId }),
    [value, select, activation, baseId],
  );

  return (
    <TabsContext.Provider value={context}>
      <div className={styles.tabs} {...xray("Tabs", { activation })}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/* ------------------------------------------------------------------ list -- */

type ListProps = {
  children: ReactNode;
  /** Names the tablist. Required: an unlabelled list of tabs is an unlabelled landmark. */
  label: string;
};

function List({ children, label }: ListProps) {
  const { activation, select } = useTabs("List");
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Roving tabindex, per the ARIA APG. Tab enters the tablist once and moves on
   * to the panel; the arrow keys move between tabs. Wrapping at both ends is
   * what the pattern specifies, and it is what makes End/Home unsurprising.
   */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const tabs = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    if (tabs.length === 0) return;

    const current = tabs.findIndex((tab) => tab === document.activeElement);
    if (current === -1) return;

    let next = -1;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;

    event.preventDefault();
    const target = tabs[next];
    if (!target) return;

    target.focus();
    if (activation === "automatic") {
      const value = target.dataset["value"];
      if (value) select(value);
    }
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      className={styles.list}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------- tab -- */

type TabProps = {
  children: ReactNode;
  value: string;
  disabled?: boolean;
};

function Tab({ children, value, disabled = false }: TabProps) {
  const { value: selected, select, baseId } = useTabs("Tab");
  const isSelected = selected === value;

  return (
    <button
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      data-value={value}
      aria-selected={isSelected}
      aria-controls={panelId(baseId, value)}
      aria-disabled={disabled || undefined}
      /* The roving part: exactly one tab is in the tab order at a time. */
      tabIndex={isSelected ? 0 : -1}
      className={cx(styles.tab, isSelected && styles.selected)}
      onClick={() => {
        if (!disabled) select(value);
      }}
      {...xray("Tabs.Tab", { value, ...(isSelected ? { selected: true } : {}) })}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------- panel -- */

type PanelProps = {
  children: ReactNode;
  value: string;
};

function Panel({ children, value }: PanelProps) {
  const { value: selected, baseId } = useTabs("Panel");
  if (selected !== value) return null;

  return (
    <div
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      /* Focusable so that Tab out of the tablist lands on the content. Without
         it a panel of plain text is unreachable by keyboard. */
      tabIndex={0}
      className={styles.panel}
      {...xray("Tabs.Panel", { value })}
    >
      {children}
    </div>
  );
}

Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;
