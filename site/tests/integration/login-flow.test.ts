import execa from "execa";
import { expect, test } from "playwright-test-coverage";

import { readValueFromRecentDummyEmail } from "../shared/dummy-emails";
import { openLoginModal } from "../shared/nav";

const emailInputSelector = '[placeholder="claude\\@example\\.com"]';
const loginButtonSelector = "button[type=submit]:has-text('Log In')";
const verificationCodeInputSelector = '[placeholder="your-verification-code"]';

test("login works for an existing user (via verification code)", async ({
  page,
  isMobile,
}) => {
  await execa("yarn", ["exe", "scripts/seed-db.ts"]);

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

  const accountDropdownButton = page.locator(
    '[data-testid="account-dropdown-button"]',
  );
  await accountDropdownButton.click();
  await expect(accountDropdownButton).toHaveText("A");

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

test.skip("login works for an existing user (via magic link)", async ({
  page,
  isMobile,
}) => {
  // @todo copy from above, open new page instead
});

test("login modal screen 1 correctly handles interactions", async ({
  browserName,
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

  // @todo Remove when Safari bug is fixed
  // (main page scrolls down when modal is closed, navbar disappears)
  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202542409311090/1202629133807661/f (internal)",
  );

  await openLoginModal({ page, isMobile });
  await expect(loginModal).toBeVisible();
  await expect(emailInput).toBeEmpty();
  await expect(emailInput).toBeFocused();
});

test.skip("login modal screen 2 correctly handles interactions", async ({
  page,
  isMobile,
}) => {
  // @todo uncomment
  //
  await expect(
    loginModal.locator(
      "text=We’ve sent an email with a verification code to alice@example.com.",
    ),
  ).toBeVisible();

  // Incorrect verification code (empty)
  await verificationCodeInput.click();
  await verificationCodeInput.fill("");
  await verificationCodeInput.press("Enter");
  await expect(
    page.locator("text=Please enter a valid verification code"),
  ).toBeVisible();
  // @todo hide error status when a user starts typing
  // Incorrect verification code (wrong format)
  await verificationCodeInput.fill("oops");
  await verificationCodeInput.press("Enter");
  await expect(
    page.locator("text=Please enter a valid verification code"),
  ).toBeVisible();
  await verificationCodeInput.fill("oops");
  await verificationCodeInput.press("Enter");
  await expect(
    page.locator("text=Please enter a valid verification code"),
  ).toBeVisible();
  // Click div[role="presentation"] >> text=Back
  await page.locator('div[role="presentation"] >> text=Back').click();
  // Click div[role="presentation"] >> text=Log In
  await page.locator('div[role="presentation"] >> text=Log In').click();
  // Click text=Use a different email address
  await page.locator("text=Use a different email address").click();
  // Click [aria-label="Close"]
  await page.locator('[aria-label="Close"]').click();
  // Click text=Create an account
  await page.locator("text=Create an account").click();
  await expect(page).toHaveURL("/");
  // Click header >> text=Log In
  await page.locator("header >> text=Log In").click();
  await expect(page).toHaveURL("/");
  // Click div[role="presentation"] >> text=Log In
  await page.locator('div[role="presentation"] >> text=Log In').click();
  // Click text=Use a different email address
  await page.locator("text=Use a different email address").click();
  // Click [aria-label="Close"]
  await page.locator('[aria-label="Close"]').click();
  // Click div[role="presentation"] >> text=Log In
  await page.locator('div[role="presentation"] >> text=Log In').click();
  // Click text=Resend Email
  await page.locator("text=Resend Email").click();
  // Click [placeholder="your-verification-code"]
  await verificationCodeInput.click();

  // verification code input vs paste
});
