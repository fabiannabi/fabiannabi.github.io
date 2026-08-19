export { usePrefersReducedMotion } from "../ds/hooks/usePrefersReducedMotion";

/**
 * A thin re-export, the same shape as useTheme over useThemeAttribute.
 *
 * The hook belongs to the design system: every animated component in it reads
 * the flag, and the system has to work in a consumer's app that has never heard
 * of this site. The site imports it from here so that page code keeps importing
 * from src/hooks and the dependency still points the right way — the site
 * consumes the system, never the reverse.
 */
