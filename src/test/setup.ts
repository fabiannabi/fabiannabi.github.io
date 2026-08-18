import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { installMatchMedia, resetMediaQueries } from "./media";

beforeEach(() => {
  resetMediaQueries();
  installMatchMedia();

  // jsdom has no IntersectionObserver; the nav marker needs one to exist.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds: readonly number[] = [];
    },
  );
});

afterEach(() => {
  cleanup();
  resetMediaQueries();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
