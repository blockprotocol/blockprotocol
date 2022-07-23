import { Locator, Page } from "playwright";
import { expect } from "playwright-test-coverage";

export const openMobileNav = async (page: Page) => {
  await page.locator("[data-testid='mobile-nav-trigger']").click();
  await expect(page.locator("[data-testid='mobile-nav']")).toBeVisible();
};

export const closeMobileNav = async (page: Page) => {
  await page.locator("[data-testid='mobile-nav-trigger']").click();
  await expect(page.locator("[data-testid='mobile-nav']")).not.toBeVisible();
};

export const openLoginModal = async ({
  isMobile,
  page,
}: {
  isMobile: boolean | undefined;
  page: Page;
}): Promise<Locator> => {
  if (isMobile) {
    await openMobileNav(page);
  }

  await page
    .locator(isMobile ? "button:has-text('Log In')" : "header >> text=Log In")
    .click();
  const loginModal = page.locator('[data-testid="login-modal"]');
  await expect(loginModal).toBeVisible();
  return loginModal;
};
