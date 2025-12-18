import { readValueFromRecentDummyEmail } from "../shared/dummy-emails.js";
import { resetSite } from "../shared/fixtures.js";
import { login, openLoginModal, openMobileNav } from "../shared/nav.js";
import {
  type Page,
  expect,
  test,
  tolerateCustomConsoleMessages,
} from "../shared/wrapped-playwright.js";

const emailInputSelector = '[placeholder="you\\@example\\.com"]';
const loginButtonSelector = "button[type=submit]:has-text('Log In')";
const verificationCodeInputSelector = '[placeholder="your-verification-code"]';
const accountDropdownButtonSelector = '[data-testid="account-dropdown-button"]';

const expectSignupButton = async ({
  page,
  isMobile,
}: {
  isMobile: boolean | undefined;
  page: Page;
}) => {
  if (isMobile) {
    await openMobileNav(page);
  }

  const signupButton = page.locator(
    isMobile
      ? "a:has-text('Create your account')"
      : "header >> text=Create your account",
  );

  await expect(signupButton).toBeVisible();
};

test.beforeEach(async ({ browserName }) => {
  await resetSite();

  // @todo triage: https://app.asana.com/0/1203312852763953/1203414492513784/f
  if (browserName === "webkit") {
    tolerateCustomConsoleMessages([
      /The resource http:\/\/localhost:\d+\/_next\/static\/css\/\w+\.css was preloaded using link preload but not used within a few seconds from the window's load event./,
    ]);
  }
});

test("login works for an existing user (via verification code)", async ({
  page,
  isMobile,
  browserName,
}) => {
  if (browserName === "firefox") {
    tolerateCustomConsoleMessages([
      /XML Parsing Error: syntax error/, // Location: http://localhost:3000/api/logout
    ]);
  }
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
    ["Account Settings", "/account/general"],
  ] as const) {
    const item = accountDropdownPopover.locator(`a:has-text("${name}")`);
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("href", href);
  }

  const logOutItem = accountDropdownPopover.locator(`span:has-text("Log Out")`);
  await expect(logOutItem).toBeVisible();
  expect(await logOutItem.getAttribute("href")).toBeNull();
  // @todo replace ↑ with ↓ when https://github.com/microsoft/playwright/issues/16270 is implemented
  // await expect(logOutItem).not.hasAttribute("href");

  await logOutItem.click();

  await expect(accountDropdownButton).toBeHidden();

  await openLoginModal({ page, isMobile });
});

test("login works for an existing user (via magic link)", async ({
  browserName,
  context,
  isMobile,
  page,
}) => {
  if (browserName === "firefox") {
    tolerateCustomConsoleMessages([
      /XML Parsing Error: syntax error/, // Location: http://localhost:3000/api/logout
    ]);
  }

  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202542409311090/1202652399221616",
  );

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

  // If we are able to open see signup button, are logged out
  await expectSignupButton({ page, isMobile });
  // Same for another page (after a reload)
  await page2.reload();
  await expectSignupButton({ page: page2, isMobile });
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

test("Login page redirects logged in users to dashboard", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202538466812818/1202652337622563/f",
  );

  await page.goto("/docs");
  await login({ page });
  expect(page.url()).toMatch(/\/docs$/);

  await Promise.all([
    page.goto("/login"),
    page.waitForNavigation({
      url: (url: URL) => url.pathname === "/dashboard",
    }),
  ]);
});

test("/api/me is retried twice", async ({ page, isMobile }) => {
  tolerateCustomConsoleMessages((existingCustomMatches) => [
    ...existingCustomMatches,
    /Failed to load resource: net::ERR_FAILED/,
    /Web Inspector blocked http:\/\/localhost:\d+\/api\/me from loading/,
    /Failed to load resource: the server responded with a status of 500 \(Internal Server Error\)/,
  ]);

  let requestCount = 0;
  await page.route(
    "/api/me",
    async (route: {
      abort: () => Promise<void>;
      fulfill: (options: { status: number; body: string }) => Promise<void>;
      continue: () => Promise<void>;
      fallback: () => Promise<void>;
    }) => {
      requestCount += 1;

      if (requestCount === 1) {
        await route.abort();
        return;
      }

      if (requestCount === 2) {
        await route.fulfill({ status: 500, body: "Internal Server Error" });
        return;
      }

      await route.fallback();
    },
  );

  await page.goto("/");
  await openLoginModal({ page, isMobile });
  expect(requestCount).toBe(3);
});
