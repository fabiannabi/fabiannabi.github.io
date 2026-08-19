import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Button.module.css";

export type ButtonVariant = "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

/* The union of both elements' attributes, with the handler widened to the one
   element type that can receive either. Narrowing it per tag would mean two
   component signatures, and two signatures is how the link and the button
   drifted apart in the first place. */
type NativeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "children" | "href" | "onClick"
> & {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

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
  /**
   * Rendered after the label, and nudged on hover. For the arrow on a call to
   * action: it points at where the control goes, so it belongs after the words
   * rather than in front of them.
   */
  iconEnd?: ReactNode;
  /**
   * Renders an anchor instead of a button, styled identically.
   *
   * This is what a call to action is: it looks like a button and it navigates.
   * The site had a separate ActionLink for exactly this and the two drifted —
   * different radius, different border weight, different hover. One component
   * with one prop cannot drift from itself.
   */
  href?: string;
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
  iconEnd,
  disabled,
  type = "button",
  href,
  ...rest
}: ButtonProps) {
  const Tag = href ? "a" : "button";
  const external = href?.startsWith("http") ?? false;

  return (
    <Tag
      {...rest}
      {...(href
        ? {
            href,
            /* Both, spelled out. `noreferrer` implies `noopener` in a current
               browser, but the pair is what an audit looks for and what an
               older engine actually needs. */
            ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
          }
        : { type })}
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
      onClick={(event: MouseEvent<HTMLElement>) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        rest.onClick?.(event);
      }}
      {...xray("Button", {
        variant,
        size,
        ...(href ? { as: "a" } : {}),
        ...(loading ? { loading } : {}),
        ...(iconOnly ? { iconOnly } : {}),
      })}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : icon}
      {iconOnly ? null : <span className={styles.label}>{children}</span>}
      {iconOnly ? children : null}
      {iconEnd ? (
        <span className={styles.iconEnd} aria-hidden="true">
          {iconEnd}
        </span>
      ) : null}
    </Tag>
  );
}
