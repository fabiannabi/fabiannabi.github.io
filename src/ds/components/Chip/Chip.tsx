import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Chip.module.css";

type Props = {
  /** A chip holds a short string, not arbitrary nodes — it has to stay one line. */
  label: string;
  /** Makes the chip a toggle. Without it the chip is static content. */
  onSelect?: () => void;
  selected?: boolean;
  /** Renders a separate remove button. Never nested inside the toggle. */
  onRemove?: () => void;
  disabled?: boolean;
};

/**
 * Selection and removal are two buttons side by side, never one inside the
 * other. A nested button is invalid HTML, and browsers resolve it by dropping
 * one — usually the one the user was trying to press.
 */
export function Chip({ label, onSelect, selected = false, onRemove, disabled = false }: Props) {
  const interactive = Boolean(onSelect);

  return (
    <span
      className={cx(styles.chip, selected && styles.selected, disabled && styles.disabled)}
      {...xray("Chip", {
        ...(interactive ? { interactive: true } : {}),
        ...(selected ? { selected } : {}),
        ...(onRemove ? { removable: true } : {}),
      })}
    >
      {interactive ? (
        <button
          type="button"
          className={styles.main}
          aria-pressed={selected}
          aria-disabled={disabled || undefined}
          onClick={() => {
            if (!disabled) onSelect?.();
          }}
        >
          {label}
        </button>
      ) : (
        <span className={styles.main}>{label}</span>
      )}

      {onRemove ? (
        <button
          type="button"
          className={styles.remove}
          /* Names the chip, not just the action: a row of ten "Remove" buttons
             is ten identical entries in a screen reader's element list. */
          aria-label={`Remove ${label}`}
          aria-disabled={disabled || undefined}
          onClick={() => {
            if (!disabled) onRemove();
          }}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      ) : null}
    </span>
  );
}
