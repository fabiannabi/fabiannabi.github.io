import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Alert.module.css";

export type AlertTone = "info" | "success" | "warning" | "danger";

type Props = {
  children: ReactNode;
  tone?: AlertTone;
  /** Short and specific. "Payment failed", not "Error". */
  title?: string;
  /** Renders a close button. Requires the caller to actually remove the alert. */
  onDismiss?: () => void;
  /** Overrides the accessible name of the dismiss button. */
  dismissLabel?: string;
};

/**
 * Each tone ships a distinct shape, not just a distinct colour. Four coloured
 * circles would fail SC 1.4.1 for anyone who cannot tell red from green — the
 * glyph and the visually hidden tone word are what actually carry the meaning.
 */
const GLYPHS: Record<AlertTone, ReactNode> = {
  info: <circle cx="8" cy="8" r="6.5" />,
  success: <polyline points="2.5,8.5 6.5,12.5 13.5,3.5" />,
  warning: <polygon points="8,1.5 15,14.5 1,14.5" />,
  danger: <polygon points="8,1 15,5 15,11 8,15 1,11 1,5" />,
};

const TONE_WORD: Record<AlertTone, string> = {
  info: "Information",
  success: "Success",
  warning: "Warning",
  danger: "Error",
};

export function Alert({ children, tone = "info", title, onDismiss, dismissLabel }: Props) {
  /* Warnings and errors interrupt; information and confirmations wait their
     turn. Announcing every success assertively is how a screen reader becomes
     something people switch off. */
  const isUrgent = tone === "warning" || tone === "danger";

  return (
    <div
      role={isUrgent ? "alert" : "status"}
      className={cx(styles.alert, styles[tone])}
      {...xray("Alert", { tone, ...(onDismiss ? { dismissible: true } : {}) })}
    >
      <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        {GLYPHS[tone]}
      </svg>

      <div className={styles.body}>
        {/* Read before the message, so the tone is not inferred from the colour. */}
        <span className={styles.toneWord}>{TONE_WORD[tone]}:</span>
        {title ? <p className={styles.title}>{title}</p> : null}
        <div className={styles.message}>{children}</div>
      </div>

      {onDismiss ? (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label={dismissLabel ?? `Dismiss ${TONE_WORD[tone].toLowerCase()}`}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
