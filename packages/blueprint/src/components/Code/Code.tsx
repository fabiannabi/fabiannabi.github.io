import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Code.module.css";

type Props = {
  children: ReactNode;
  /** A block renders <pre><code> and scrolls on its own axis. */
  block?: boolean;
  /** Announced to assistive technology before the sample. */
  label?: string;
};

export function Code({ children, block = false, label }: Props) {
  if (!block) {
    return (
      <code className={styles.inline} {...xray("Code", {})}>
        {children}
      </code>
    );
  }

  return (
    <pre
      className={cx(styles.block)}
      /* Focusable because it scrolls: a scrollable region that cannot be
         reached or scrolled by keyboard fails SC 2.1.1. */
      tabIndex={0}
      role="region"
      aria-label={label ?? "Code sample"}
      {...xray("Code", { block: true })}
    >
      <code>{children}</code>
    </pre>
  );
}
