import { expect, test } from "playwright-test-coverage";

import { resetDb } from "../shared/fixtures";
import { login } from "../shared/nav";

test("dashboard page should not be accessible to guests", async ({ page }) => {
  await page.goto("/dashboard");

  await page.waitForNavigation({
    url: (url) => url.pathname === "/login",
  });
});

test("dashboard page should contain key elements", async ({ page }) => {
  await resetDb();

  await page.goto("/");
  await login({ page });
  await page.goto("/dashboard");

  await expect(page.locator("text=Welcome Back, Alice!")).toBeVisible();

  for (const [text, url] of [
    [
      "Read our quick start guide to building blocks",
      "/docs/developing-blocks",
    ],
    ["Test out blocks in the playground", "/hub"],
    ["Create a Schema", null],
    ["Generate your API key", "/settings/api-keys"],
    ["View your public profile", "/@alice"],
  ] as const) {
    const card = page.locator(
      url ? `a:has-text('${text}')` : `button:has-text('${text}')`,
    );
    await expect(card).toBeVisible();
    expect(await card.getAttribute("href")).toEqual(url);
  }

  await page.locator('[aria-label="settings-tabs"] >> text=API Keys').click();
  await expect(page).toHaveURL("/settings/api-keys");

  await page.locator('[aria-label="settings-tabs"] >> text=Dashboard').click();
  await expect(page).toHaveURL("/dashboard");
});
