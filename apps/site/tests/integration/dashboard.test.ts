import { expect, test } from "playwright-test-coverage";

import { resetDb } from "../shared/fixtures.js";
import { login } from "../shared/nav.js";

test("dashboard page should not be accessible to guests", async ({ page }) => {
  await Promise.all([
    page.goto("/dashboard"),
    page.waitForNavigation({
      url: (url) => url.pathname === "/login",
    }),
  ]);
});

test("dashboard page should contain key elements", async ({ page }) => {
  await resetDb();

  await page.goto("/");
  await login({ page });
  await page.goto("/dashboard");

  await expect(page.locator("text=Welcome Back, Alice!")).toBeVisible();

  for (const [text, url] of [
    [
      "Publish a block",
      process.env.NEXT_PUBLIC_NPM_PUBLISHING
        ? "/blocks/publish"
        : "/@alice/blocks",
    ],
    ["Build a block", "/docs/developing-blocks"],
    ["Create a Type", null],
    ["Create and manage API keys", "/settings/api-keys"],
    ["View your public profile", "/@alice"],
    ["Manage blocks", "/@alice/blocks"],
    ["Manage types", "/@alice/schemas"],
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

  await page.locator('[aria-label="settings-tabs"] >> text=API Keys').click();
  await expect(page).toHaveURL("/settings/api-keys");

  await page.locator('[aria-label="settings-tabs"] >> text=Dashboard').click();
  await expect(page).toHaveURL("/dashboard");
});
