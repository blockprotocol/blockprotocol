import { expect, test } from "@playwright/test";

test("Hub page should contain key elements", async ({ page }) => {
  await page.goto("/hub");

  await expect(
    page.locator(
      "h1 >> text=Interactive, data-driven blocks to use in your projects",
    ),
  ).toBeVisible();

  await expect(
    page.locator("text=All open-source and free to use"),
  ).toBeVisible();

  expect(
    await page.locator('[data-testid="block-card"]').count(),
  ).toBeGreaterThan(5);

  await expect(page.locator("text=build your own blocks")).toHaveAttribute(
    "href",
    "/docs/developing-blocks",
  );

  await expect(page.locator("text=Quickstart guide")).toHaveAttribute(
    "href",
    "/docs/developing-blocks",
  );

  await expect(page.locator("text=Read the Quick Start Guide")).toHaveAttribute(
    "href",
    "/docs/developing-blocks",
  );
});
