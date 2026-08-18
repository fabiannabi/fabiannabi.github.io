import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Button.module.css";

export type ButtonVariant = "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type NativeProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type Common = NativeProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretches to the container. Use in a narrow column, not in a toolbar. */
  fullWidth?: boolean;
  /** Marks the control busy and blocks activation without removing it from the tab order. */
  loading?: boolean;
  /** Rendered before the label. Decorative — the label carries the meaning. */
  icon?: ReactNode;
};

/**
 * An icon-only button MUST carry an accessible name, so the type demands one.
 * "Unnamed icon button" is one of the six defects every component library audit
 * finds; making it a compile error is cheaper than finding it in an audit.
 */
type Labelled = Common & { iconOnly: true; "aria-label": string };
type Standard = Common & { iconOnly?: false };

export type ButtonProps = Labelled | Standard;

export function Button({
  children,
  variant = "solid",
  size = "md",
  fullWidth = false,
  loading = false,
  iconOnly = false,
  icon,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        iconOnly && styles.iconOnly,
      )}
      /* Not `disabled`: a disabled button leaves the tab order, so a keyboard
         user who tabbed to it loses their place mid-submit. aria-disabled keeps
         it focusable and announced, and the handler is blocked below. */
      aria-disabled={disabled || loading ? true : undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        rest.onClick?.(event);
      }}
      {...xray("Button", { variant, size, ...(loading ? { loading } : {}), ...(iconOnly ? { iconOnly } : {}) })}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : icon}
      {iconOnly ? null : <span className={styles.label}>{children}</span>}
      {iconOnly ? children : null}
    </button>
  );
}
