import { expect, test } from "@playwright/test";

test("page header navigation works", async ({ page }) => {
  await page.goto("/");

  await page.locator("header >> text=Block Hub").click();
  await expect(page).toHaveURL("/hub");

  await expect(
    page.locator(
      "h1 >> text=Interactive, data-driven blocks to use in your projects",
    ),
  ).toBeVisible();

  await page.locator("header >> text=Documentation").click();
  await expect(page).toHaveURL("/docs");
  await expect(page.locator('h1:has-text("Introduction")')).toBeVisible();

  await page.locator("header >> text=Log In").click();
  await expect(page).toHaveURL("/docs");
  await expect(page.locator("text=Sign in to theBlock Protocol")).toBeVisible();

  await page.locator("text=Close").click();
  await expect(page).toHaveURL("/docs");
  await expect(page.locator('h1:has-text("Introduction")')).toBeVisible();

  await page.locator("header >> text=Sign Up").click();
  await expect(page).toHaveURL("/signup");
  await expect(
    page.locator("text=Create your Block Protocol account"),
  ).toBeVisible();

  // TODO: Add alt to BP logo, ensure that the logo is not clickable from /
  await page.locator("header svg").first().click();
  await expect(page).toHaveURL("/");
  await expect(
    page.locator("text=The open standard for building block-based interfaces"),
  ).toBeVisible();
});
