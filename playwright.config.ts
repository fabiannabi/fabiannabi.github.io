import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against the real build, not the dev server — the thing that ships is the
 * thing under test.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Omitted rather than set to undefined, so Playwright's own default applies
  // locally. `exactOptionalPropertyTypes` treats those as different things.
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "reduced-motion",
      use: {
        ...devices["Desktop Chrome"],
        contextOptions: { reducedMotion: "reduce" },
      },
    },
  ],
  webServer: {
    /* The port is pinned in package.json so that a Lighthouse run and this
       suite hit the same server. Repeating the flags here made it the second
       source of truth for one number. */
    command: "pnpm build && pnpm preview",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
