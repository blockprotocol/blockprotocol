import { expect, test } from "@playwright/test";

test("example integration test", async ({ page }) => {
  await page.goto("./");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Block Protocol/);
});
