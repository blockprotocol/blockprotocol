import { readValueFromRecentDummyEmail } from "../shared/dummy-emails.js";
import { resetSite } from "../shared/fixtures.js";
import { login, openMobileNav } from "../shared/nav.js";
import {
  expect,
  test,
  tolerateCustomConsoleMessages,
} from "../shared/wrapped-playwright.js";

test("sign up flow works", async ({ browserName, isMobile, page }) => {
  await resetSite();
  await page.goto("/");

  if (isMobile) {
    await openMobileNav(page);
  }

  await page
    .locator(
      isMobile
        ? "a:has-text('Create your account')"
        : "header >> text=Create your account",
    )
    .click();

  await expect(page).toHaveURL("/signup");

  await expect(page.locator("text=Create an account")).toBeVisible();

  await expect(page.locator("text=Publish blocks on the Hub")).toBeVisible();

  await expect(
    page.locator("text=Take part in a growing, open source community"),
  ).toBeVisible();

  await expect(page.locator("text=Claim your favorite username")).toBeVisible();

  const emailInput = page.locator('[placeholder="you\\@example\\.com"]');
  await emailInput.fill("alice@example.com");
  await emailInput.press("Enter");

  await expect(
    page.locator("text=An existing user is associated with the email address"),
  ).toBeVisible();

  await emailInput.fill("alice@example.org");

  const continueButton = page.locator("text=Continue");
  await continueButton.click();
  await expect(page).toHaveURL("/signup");

  await expect(page.locator("text=Check your inbox")).toBeVisible();
  const verificationCodeInput = page.locator(
    '[placeholder="your-verification-code"]',
  );
  await verificationCodeInput.fill(
    await readValueFromRecentDummyEmail("Email verification code: "),
  );
  await verificationCodeInput.press("Enter");

  await expect(page.locator("text=alice@example.org")).toBeVisible();
  await expect(page.locator("text=Add your account details")).toBeVisible();
  await expect(page).toHaveURL("/signup");

  const usernameInput = page.locator('[placeholder="e.g. alice123"]');
  await usernameInput.fill("alice");
  await page.locator('[placeholder="e.g. alice123"]').press("Tab");

  await expect(
    page.locator("text=This user has already been taken"),
  ).toBeVisible();

  await usernameInput.fill("alice2");

  const preferredNameInput = page.locator('[placeholder="e.g. Alice"]');
  await preferredNameInput.click();

  await expect(
    page.locator('text=This user has already been taken"'),
  ).not.toBeVisible();

  await preferredNameInput.fill("Alice");

  // @todo Remove when Safari bug is fixed
  // (main page scrolls down when modal is closed, navbar disappears)
  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202542409311090/1202629133807661/f (internal)",
  );

  await continueButton.click();
  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.locator('[data-testid="account-dropdown-button"]'),
  ).toBeVisible();
});

test("Sign Up page redirects logged in users to dashboard", async ({
  browserName,
  page,
}) => {
  if (browserName === "firefox") {
    tolerateCustomConsoleMessages([/\[error\] Error$/]);
  }

  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202538466812818/1202652337622563/f",
  );

  await page.goto("/docs");
  await login({ page });
  expect(page.url()).toMatch(/\/docs$/);

  tolerateCustomConsoleMessages((existingCustomMatches) => [
    ...existingCustomMatches,
    /Error: Abort fetching component for route: "\/dashboard\/\[\[...slugs\]\]"/,
  ]);

  await Promise.all([
    page.goto("/signup"),
    page.waitForNavigation({
      url: (url: URL) => url.pathname === "/dashboard",
    }),
  ]);
});
