import { expect, test } from "playwright-test-coverage";

import { readValueFromRecentDummyEmail } from "../shared/dummy-emails";
import { resetDb } from "../shared/fixtures";
import { login, openLoginModal } from "../shared/nav";

const emailInputSelector = '[placeholder="claude\\@example\\.com"]';
const loginButtonSelector = "button[type=submit]:has-text('Log In')";
const verificationCodeInputSelector = '[placeholder="your-verification-code"]';
const accountDropdownButtonSelector = '[data-testid="account-dropdown-button"]';

test.beforeEach(async () => {
  await resetDb();
});

test("login works for an existing user (via verification code)", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const loginModal = await openLoginModal({ page, isMobile });

  const emailInput = loginModal.locator(emailInputSelector);
  const loginButton = loginModal.locator(loginButtonSelector);

  await emailInput.fill("alice@example.com");
  await loginButton.click();

  await expect(loginModal.locator("text=Check your inbox")).toBeVisible();

  const verificationCodeInput = loginModal.locator(
    verificationCodeInputSelector,
  );

  await verificationCodeInput.fill(
    await readValueFromRecentDummyEmail("Email verification code: "),
  );
  await verificationCodeInput.press("Enter");

  const accountDropdownButton = page.locator(accountDropdownButtonSelector);
  await expect(accountDropdownButton).toBeVisible();
  await expect(accountDropdownButton).toHaveText("A");
  await accountDropdownButton.click();

  const accountDropdownPopover = page.locator(
    '[data-testid="account-dropdown-popover"]',
  );

  await expect(accountDropdownPopover).toBeVisible();
  await expect(accountDropdownPopover).toContainText("Alice@alice");

  for (const [name, href] of [
    ["Dashboard", "/dashboard"],
    ["Your Profile", "/@alice"],
    ["API Keys", "/settings/api-keys"],
  ] as const) {
    const item = accountDropdownPopover.locator(`a:has-text("${name}")`);
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("href", href);
  }

  const logOutItem = accountDropdownPopover.locator(`span:has-text("Log Out")`);
  await expect(logOutItem).toBeVisible();
  await expect(logOutItem).toHaveAttribute("href", "");

  await logOutItem.click();

  await expect(accountDropdownButton).toBeHidden();

  await openLoginModal({ page, isMobile });
});

test("login works for an existing user (via magic link)", async ({
  context,
  isMobile,
  page,
}) => {
  await page.goto("/");
  const loginModal = await openLoginModal({ page, isMobile });

  const emailInput = loginModal.locator(emailInputSelector);

  await emailInput.fill("alice@example.com");
  await emailInput.press("Enter");

  await expect(loginModal.locator("text=Check your inbox")).toBeVisible();

  const magicLink = await readValueFromRecentDummyEmail("Magic Link: ");

  const page2 = await context.newPage();
  await page2.goto(magicLink);

  const accountDropdownButton2 = page2.locator(accountDropdownButtonSelector);
  await expect(accountDropdownButton2).toBeVisible();
  await expect(accountDropdownButton2).toHaveText("A");

  await page.reload();
  const accountDropdownButton = page.locator(accountDropdownButtonSelector);
  await expect(accountDropdownButton).toHaveText("A");
  await accountDropdownButton.click();

  const accountDropdownPopover = page.locator(
    '[data-testid="account-dropdown-popover"]',
  );

  await expect(accountDropdownPopover).toBeVisible();
  await expect(accountDropdownPopover).toContainText("Alice@alice");
  await accountDropdownPopover.locator(`span:has-text("Log Out")`).click();

  // If we are able to open login modal, are logged out
  await openLoginModal({ page, isMobile });
  // Same for another page (after a reload)
  await page2.reload();
  await openLoginModal({ page: page2, isMobile });
});

test("login modal screen 1 correctly handles interactions", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  const loginModal = await openLoginModal({ page, isMobile });
  await expect(page).toHaveURL("/");

  const emailInput = loginModal.locator(emailInputSelector);
  const loginButton = loginModal.locator(loginButtonSelector);
  const createAnAccount = loginModal.locator("text=Create an account");

  await expect(loginModal).toBeVisible();
  await expect(
    loginModal.locator("text=Sign in to theBlock Protocol"),
  ).toBeVisible();

  await expect(loginModal.locator("text=Not signed up yet?")).toBeVisible();
  await expect(createAnAccount).toBeVisible();
  await expect(createAnAccount).toHaveAttribute("href", "/signup");

  await expect(emailInput).toBeFocused();

  // Incorrect email (empty)
  await emailInput.press("Enter");
  await expect(createAnAccount).toHaveAttribute("href", "/signup");

  await expect(
    loginModal.locator("text=Please enter a email address"),
  ).toBeVisible();

  // @todo hide error status when a user starts typing & check this

  // Incorrect email (does not match email regex)
  await emailInput.click();
  await emailInput.fill("oops");
  await emailInput.press("Enter");
  await expect(createAnAccount).toHaveAttribute("href", "/signup?email=oops");

  await expect(
    loginModal.locator("text=Please enter a valid email address"),
  ).toBeVisible();

  // Incorrect email (not registered)
  await emailInput.click();
  await emailInput.fill("hello@world.oops");
  await emailInput.press("Enter");
  await expect(createAnAccount).toHaveAttribute(
    "href",
    "/signup?email=hello%40world.oops",
  );

  await expect(
    loginModal.locator("text=Could not find user with the provided email"),
  ).toBeVisible();

  await expect(loginButton).toBeDisabled();

  await loginModal.locator("text=Close").click();
  await expect(loginModal).toBeHidden();

  await openLoginModal({ page, isMobile });
  await expect(loginModal).toBeVisible();
  await expect(emailInput).toBeEmpty();
  await expect(emailInput).toBeFocused();
});

test.skip("login modal screen 2 correctly handles interactions", () => {
  // @todo write after finishing signup flow
});

test("Login page redirects logged in users to home page", async ({ page }) => {
  await page.goto("/docs");
  await login({ page });
  expect(page.url()).toMatch(/\/docs$/);

  await Promise.all([
    page.goto("/login"),
    page.waitForNavigation({
      url: (url) => url.pathname === "/",
    }),
  ]);
});
