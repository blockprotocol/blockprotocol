import { readValueFromRecentDummyEmail } from "./dummy-emails.js";
import { type Locator, type Page, expect } from "./wrapped-playwright.js";

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

/**
 * Provides a quick way to login using direct API calls instead of UI
 */
export const login = async ({
  email = "alice@example.com",
  page,
}: {
  email?: string;
  page: Page;
}) => {
  await page.waitForLoadState("networkidle");
  const response1 = await page.request.post("/api/send-login-code", {
    data: { email },
    failOnStatusCode: true,
  });

  const { userId, verificationCodeId } = (await response1.json()) as {
    userId: string;
    verificationCodeId: string;
  };

  const code = await readValueFromRecentDummyEmail("Email verification code: ");

  await page.request.post("/api/login-with-login-code", {
    data: { code, userId, verificationCodeId },
    failOnStatusCode: true,
  });

  await page.reload();
  await page.waitForLoadState("networkidle");

  await expect(
    page.locator('[data-testid="account-dropdown-button"]'),
  ).toBeVisible();
};
