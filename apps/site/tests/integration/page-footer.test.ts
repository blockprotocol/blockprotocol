import { expect, test } from "../shared/wrapped-playwright.js";

test("page footer navigation works", async ({ page, browserName }) => {
  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202542409311090/1202651551651725",
  );
  await page.goto("/");

  await page.locator("footer").scrollIntoViewIfNeeded();

  // Socials
  const socialLinksSelector = page.locator(
    "[data-testid='footer-social-links']",
  );
  await expect(socialLinksSelector.locator("a").first()).toHaveAttribute(
    "href",
    "https://github.com/blockprotocol/blockprotocol",
  );
  await expect(socialLinksSelector.locator("a").nth(1)).toHaveAttribute(
    "href",
    "https://twitter.com/blockprotocol",
  );
  await expect(socialLinksSelector.locator("a").nth(2)).toHaveAttribute(
    "href",
    "/discord",
  );
  await expect(
    socialLinksSelector.locator("text=Star us on Github"),
  ).toHaveAttribute("href", "https://github.com/blockprotocol/blockprotocol");

  // Learn more section
  await expect(
    page.locator("footer >> a:has-text('Documentation')"),
  ).toHaveAttribute("href", "/docs");
  await expect(
    page.locator("footer >> a:has-text('Specification')"),
  ).toHaveAttribute("href", "/docs/spec");
  await expect(page.locator("footer >> a:has-text('Pricing')")).toHaveAttribute(
    "href",
    "/pricing",
  );
  await expect(
    page.locator("footer >> a:has-text('Contact Us')"),
  ).toHaveAttribute("href", "/contact");

  await page.locator("footer").scrollIntoViewIfNeeded();

  // Discover section
  await expect(
    page.locator("footer >> a:text-is('Open-source blocks')"),
  ).toHaveAttribute("href", "/hub");
  await expect(
    page.locator("footer >> a:text-is('Semantic types')"),
  ).toHaveAttribute("href", "/hub");
  await expect(
    page.locator("footer >> a:text-is('API services')"),
  ).toHaveAttribute("href", "/hub");

  // Publish section
  await expect(page.locator("footer >> a:text-is('a block')")).toHaveAttribute(
    "href",
    "/docs/developing-blocks#publish",
  );
  // await expect(page.locator("footer >> a:text-is('a type')")).toHaveAttribute(
  //   "href",
  //   "/",
  // );
  // await expect(
  //   page.locator("footer >> a:text-is('a service')"),
  // ).toHaveAttribute("href", "/");

  // Legal section
  // await expect(page.locator("footer >> a:text-is('Terms')")).toHaveAttribute(
  //   "href",
  //   "/legal/terms",
  // );
  // await expect(page.locator("footer >> a:text-is('Privacy')")).toHaveAttribute(
  //   "href",
  //   "/legal/privacy",
  // );
});
