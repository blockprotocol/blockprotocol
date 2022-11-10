import { expect, test } from "playwright-test-coverage";

import { openLoginModal, openMobileNav } from "../shared/nav.js";

test("page header navigation works", async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202542409311090/1202651551651725",
  );
  await page.goto("/");

  const navSelector = page.locator(
    isMobile ? "[data-testid='mobile-nav']" : "header",
  );

  if (isMobile) {
    await openMobileNav(page);
  }

  await navSelector.locator("text=Hub").click();
  await expect(page).toHaveURL("/hub");
  await expect(
    page.locator(
      'h1:has-text("Interactive, data-driven blocks to use in your projects")',
    ),
  ).toBeVisible();

  if (isMobile) {
    await openMobileNav(page);
  }

  await navSelector.locator("text=Documentation").click();
  await expect(page).toHaveURL("/docs");
  await expect(page.locator('h1:has-text("Introduction")')).toBeVisible();

  // TODO: Add alt to BP logo, ensure that the logo is not clickable from /
  await page.locator("header svg").first().click();
  await expect(page).toHaveURL("/");
  await expect(
    page.locator("text=The open standard for building block-based interfaces"),
  ).toBeVisible();

  if (isMobile) {
    await openMobileNav(page);
  }

  await navSelector.locator("text=Sign Up").click();
  await expect(page).toHaveURL("/signup");
  await expect(
    page.locator("text=Create your Block Protocol account"),
  ).toBeVisible();

  await openLoginModal({ page, isMobile });
  await expect(page).toHaveURL("/signup");
});

test("search modal is triggered by button press on desktop", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  if (isMobile) {
    await expect(
      page.locator("header >> button", { hasText: "Search" }),
      "Search button should not exist on mobile",
    ).not.toBeVisible();
    return;
  }

  await page.locator("header >> button", { hasText: "Search" }).click();
  await expect(
    page.locator('[data-testid="bp-search-modal"]'),
    "Clicking on search nav button should bring up search modal",
  ).toBeVisible();
});
