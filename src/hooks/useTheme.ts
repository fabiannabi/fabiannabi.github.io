import { useThemeAttribute, type Theme } from "../ds/hooks/useThemeAttribute";

export type { Theme };

/**
 * The profile's theme. The mechanism lives in the design system — the site is a
 * consumer of it, which is the dependency direction a design system is supposed
 * to have with the product built on top of it.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  return useThemeAttribute({ attribute: "theme", storageKey: "theme" });
}
