import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type Theme = "dark" | "light";

const isTheme = (value: unknown): value is Theme => value === "dark" || value === "light";

/**
 * How long the fallback cross-fade runs, and it must match the transition in
 * global.css.
 *
 * Only browsers without view transitions ever see it. It was 360ms across eight
 * properties and it read as the page labouring, because a colour transition on
 * every element repaints all of them every frame and nothing about that is
 * compositable. Where the platform can do this properly, it does — see below.
 */
const SWITCH_MS = 200;

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
  const reduced = usePrefersReducedMotion();

  const [theme, setTheme] = useState<Theme>(() => {
    const current = document.documentElement.dataset[attribute];
    return isTheme(current) ? current : "dark";
  });

  const fade = useRef<number | undefined>(undefined);

  /* Declarative half: whatever the state says is on the element. It is also how
     the OS-preference path lands, and it runs on mount to adopt what the
     blocking script already painted. The animation is decided in toggle(),
     because only a press knows a change is coming before it happens. */
  useEffect(() => {
    document.documentElement.dataset[attribute] = theme;
  }, [attribute, theme]);

  useEffect(() => () => window.clearTimeout(fade.current), []);

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
    const next: Theme = theme === "dark" ? "light" : "dark";

    try {
      localStorage.setItem(storageKey, next);
    } catch {
      /* Private mode, or storage disabled. The toggle still works for the visit. */
    }

    const apply = (): void => {
      document.documentElement.dataset[attribute] = next;
      setTheme(next);
    };

    /* The platform's own cross-fade, and it is not a CSS transition on anything.
       startViewTransition takes a snapshot of the page as it is, lets the DOM
       change, snapshots it again, and blends the two textures on the compositor
       — so the work is one image fade whether the page has ten elements or the
       six hundred /design/ instruments. The property-by-property version below
       repaints every element on every frame of the change, which is exactly what
       read as the page labouring.

       flushSync because the snapshot is taken when this callback returns: React
       has to have committed by then or the "after" picture is the page before
       the change. */
    if (!reduced && typeof document.startViewTransition === "function") {
      document.startViewTransition(() => flushSync(apply));
      return;
    }

    /* Firefox before 144, Safari before 18, and anyone who asked for less
       motion. The flag hangs one colour transition off every element in
       global.css for exactly as long as the change takes, and takes it off
       again — the whole page has to move together or it tears, since body has
       carried a background transition for years and nothing else did. */
    const root = document.documentElement;

    if (!reduced) {
      root.dataset["themeSwitching"] = "";
      window.clearTimeout(fade.current);
      fade.current = window.setTimeout(() => {
        delete root.dataset["themeSwitching"];
      }, SWITCH_MS);
    }

    apply();
  }, [attribute, reduced, storageKey, theme]);

  return { theme, toggle };
}
