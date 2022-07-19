import { expect, test } from "@playwright/test";

test("page footer navigation works", async ({ page }) => {
  await page.goto("/");

  await page.locator("footer >> text=Block Hub").click();
  await expect(page).toHaveURL("/hub");

  await page.locator("footer >> text=Documentation").click();
  await page.waitForURL("/docs");

  // @todo fix tests
  await page.locator("footer >> text=Specification").click();
  await page.waitForURL("/docs/spec");
  // await expect(page).toHaveURL("/docs/spec");

  await page.locator("footer >> text=Publish a Block").click();
  await expect(page).toHaveURL("/docs/developing-blocks#publish");

  await page.locator("footer >> text=Contact Us").click();
  await expect(page).toHaveURL("/contact");
});
