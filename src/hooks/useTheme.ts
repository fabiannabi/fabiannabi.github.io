import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

const isTheme = (value: unknown): value is Theme => value === "dark" || value === "light";

/** Whatever the blocking script in profile/index.html already decided. */
const readCurrent = (): Theme => {
  const attr = document.documentElement.dataset["theme"];
  return isTheme(attr) ? attr : "dark";
};

/**
 * The theme is applied before React mounts, by an inline script in the entry
 * HTML — this hook adopts that value rather than deciding it, so there is no
 * flash of the wrong palette on load.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(readCurrent);

  useEffect(() => {
    document.documentElement.dataset["theme"] = theme;
  }, [theme]);

  // Follow the OS only while the visitor has not made a choice of their own.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (event: MediaQueryListEvent): void => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        stored = null;
      }
      if (!isTheme(stored)) setTheme(event.matches ? "light" : "dark");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* Private mode, or storage disabled. The toggle still works for the visit. */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
