import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const isTheme = (value: unknown): value is Theme => value === "dark" || value === "light";

type Options = {
  /** dataset key on <html>. The site uses "theme"; the design system "dsTheme". */
  attribute: string;
  storageKey: string;
};

/**
 * Adopts whatever theme a blocking script in the document head already applied,
 * rather than deciding it in an effect — deciding here means a frame of the
 * wrong palette on every load, and the flash is the bug.
 *
 * Parameterised because the design system and the site each own an independent
 * theme attribute: /design/ can be read in light while the profile stays dark.
 */
export function useThemeAttribute({ attribute, storageKey }: Options): {
  theme: Theme;
  toggle: () => void;
} {
  const [theme, setTheme] = useState<Theme>(() => {
    const current = document.documentElement.dataset[attribute];
    return isTheme(current) ? current : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset[attribute] = theme;
  }, [attribute, theme]);

  // Follow the OS only while the visitor has not made a choice of their own.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (event: MediaQueryListEvent): void => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(storageKey);
      } catch {
        stored = null;
      }
      if (!isTheme(stored)) setTheme(event.matches ? "light" : "dark");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [storageKey]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* Private mode, or storage disabled. The toggle still works for the visit. */
      }
      return next;
    });
  }, [storageKey]);

  return { theme, toggle };
}
