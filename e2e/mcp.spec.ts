import { expect, test } from "@playwright/test";

test.describe("Blueprint MCP page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/mcp/");
  });

  test("says what the MCP is for, with the five tools", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("A design system coding agents can read");
    const tools = page.getByRole("table", { name: "Blueprint MCP tools" });
    for (const name of ["list_components", "get_component", "find_token", "check_contrast", "lint_ui"]) {
      await expect(tools.getByRole("rowheader", { name })).toBeVisible();
    }
  });

  test("shows the same button before and after, with the linter's verdict", async ({ page }) => {
    await expect(page.getByRole("region", { name: "Code an agent wrote without the MCP" })).toContainText('variant="primary"');
    await expect(page.getByRole("region", { name: "What the linter reports on it" })).toContainText("icon-only-label");
    await expect(page.getByRole("region", { name: "The same button, on-system" })).toContainText('aria-label="Delete project"');
  });

  test("links to npm, the source and the threat model", async ({ page }) => {
    const links = page.getByRole("navigation", { name: "Blueprint MCP links" });
    await expect(links.getByRole("link", { name: /npm/ })).toHaveAttribute("href", /npmjs\.com\/package\/@fabiannabi\/blueprint-mcp/);
    await expect(links.getByRole("link", { name: /Source/ })).toHaveAttribute("href", /packages\/blueprint-mcp/);
    await expect(links.getByRole("link", { name: /Security/ })).toHaveAttribute("href", /SECURITY\.md/);
  });

  test("shares its theme with the design system page", async ({ page }) => {
    await page.getByRole("button", { name: /switch to (light|dark) theme/i }).click();
    const theme = await page.locator("html").getAttribute("data-ds-theme");
    await page.goto("/design/");
    await expect(page.locator("html")).toHaveAttribute("data-ds-theme", theme ?? "");
  });

  test("does not scroll sideways at 380px", async ({ page }) => {
    await page.setViewportSize({ width: 380, height: 900 });
    await page.goto("/mcp/");
    const fits = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    );
    expect(fits).toBe(true);
  });
});
