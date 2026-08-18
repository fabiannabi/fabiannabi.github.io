import { vi } from "vitest";

/**
 * jsdom has no matchMedia, and every animation on this site asks it whether it
 * is allowed to run. Kept in its own module so tests can import
 * `setMediaQuery` without pulling the setup file's lifecycle hooks back in.
 *
 * The default answer to every query is `false` — motion allowed, dark theme —
 * so a test that does not opt in exercises the animated path rather than
 * silently taking the reduced-motion branch.
 */

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const LIGHT_SCHEME = "(prefers-color-scheme: light)";

let matches: Record<string, boolean> = {};
const listeners = new Map<string, Set<() => void>>();

export function setMediaQuery(query: string, value: boolean): void {
  matches[query] = value;
  for (const listener of listeners.get(query) ?? []) listener();
}

export function resetMediaQueries(): void {
  matches = {};
  listeners.clear();
}

export function installMatchMedia(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return matches[query] ?? false;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: () => void) => {
        const set = listeners.get(query) ?? new Set();
        set.add(listener);
        listeners.set(query, set);
      },
      removeEventListener: (_type: string, listener: () => void) => {
        listeners.get(query)?.delete(listener);
      },
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}
