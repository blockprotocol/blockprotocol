import { resetSite } from "../shared/fixtures.js";
import { login } from "../shared/nav.js";
import {
  expect,
  test,
  tolerateCustomConsoleMessages,
} from "../shared/wrapped-playwright.js";

test("dashboard page should not be accessible to guests", async ({ page }) => {
  tolerateCustomConsoleMessages([
    /Error: Abort fetching component for route: "\/login"/,
  ]);

  await Promise.all([
    page.goto("/dashboard"),
    page.waitForNavigation({
      url: (url: URL) => url.pathname === "/login",
    }),
  ]);
});

test("dashboard page should contain key elements", async ({ page }) => {
  await resetSite();

  await page.goto("/");
  await login({ page });
  await page.goto("/dashboard");

  await expect(page.locator("text=Welcome, Alice!")).toBeVisible();

  for (const [text, url] of [
    ["Build a block", "/docs/blocks/develop"],
    ["Create a Type", "/@alice/types"],
    ["Create and manage API keys", "/account/api"],
    ["View your public profile", "/@alice"],
    ["Browse blocks for inspiration", "/hub"],
  ] as const) {
    const card = page.locator(`[data-testid="dashboard-card"]`).filter({
      has: page
        .locator(`[data-testid="dashboard-card-title"]`)
        .filter({ hasText: text }),
    });

    await expect(card).toBeVisible();
    expect(await card.getAttribute("href")).toEqual(url);
  }

  await page.locator('[aria-label="settings-tabs"] >> text=My Account').click();
  await expect(page).toHaveURL("/account/general");

  await page.locator('[aria-label="settings-tabs"] >> text=Dashboard').click();
  await expect(page).toHaveURL("/dashboard");
});
