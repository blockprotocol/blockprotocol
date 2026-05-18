import { expect, test } from "../shared/wrapped-playwright.js";

const openMobileNav = async (page: import("@playwright/test").Page) => {
  await page.locator("[data-testid='mobile-nav-trigger']").click();
  await expect(page.locator("[data-testid='mobile-nav']")).toBeVisible();
};

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
    page.locator('h4:has-text("Open-source components for")'),
  ).toBeVisible();

  if (isMobile) {
    await openMobileNav(page);
  }

  await navSelector.locator("text=Docs").click();
  await expect(page).toHaveURL("/docs");
  await expect(page.locator('h1:has-text("Introduction")')).toBeVisible();

  // TODO: Add alt to BP logo, ensure that the logo is not clickable from /
  await page.locator("header svg").first().click();
  await expect(page).toHaveURL("/");
  await expect(
    page.locator("text=The open standard for block-based apps"),
  ).toBeVisible();

  // Account-related navigation (Log In / Create your account) has been
  // removed from the header while signups to the Hub are paused. The
  // /login and /signup pages remain live so existing inbound links still
  // resolve, but they are no longer reachable from the global nav.
  await expect(navSelector.getByText("Log In", { exact: true })).toHaveCount(0);
  await expect(
    navSelector.getByText("Create your account", { exact: true }),
  ).toHaveCount(0);
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
