import type { Theme } from "../../hooks/useTheme";
import styles from "./ThemeToggle.module.css";

type Props = {
  theme: Theme;
  onToggle: () => void;
};

/**
 * The label says what the button will do, not what the current state is — "Switch
 * theme" leaves a screen reader user to guess which way. The glyph is decorative
 * and hidden, so the accessible name is the label and nothing else.
 */
export function ThemeToggle({ theme, onToggle }: Props) {
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
    >
      <span aria-hidden="true">{theme === "dark" ? "◐" : "◑"}</span>
    </button>
  );
}
