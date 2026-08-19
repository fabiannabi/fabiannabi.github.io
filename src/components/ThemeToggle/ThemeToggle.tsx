import { Toggle } from "../../ds/components/Toggle/Toggle";
import type { Theme } from "../../ds/hooks/useThemeAttribute";

type Props = {
  theme: Theme;
  onToggle: () => void;
};

/**
 * The site's theme switch.
 *
 * It is not a design system component and it never should have been: "theme" is
 * a concept this app has, and a system that knows what a theme is has taken a
 * position on the app's model. What the system owns is the control — Toggle —
 * and this is a dozen lines of app on top of it.
 *
 * The label says what the button will do rather than what the theme currently
 * is. "Switch theme" leaves a screen reader user to guess which way it goes.
 */
export function ThemeToggle({ theme, onToggle }: Props) {
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <Toggle
      pressed={theme === "light"}
      onToggle={onToggle}
      iconOnly
      aria-label={`Switch to ${next} theme`}
      icon={<span aria-hidden="true">{theme === "dark" ? "◐" : "◑"}</span>}
    >
      {`Switch to ${next} theme`}
    </Toggle>
  );
}
