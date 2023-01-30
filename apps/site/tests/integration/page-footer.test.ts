import { expect, test } from "../shared/wrapped-playwright.js";

test("page footer navigation works", async ({ page, browserName }) => {
  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202542409311090/1202651551651725",
  );
  await page.goto("/");

  await page.locator("footer").scrollIntoViewIfNeeded();

  const socialLinksSelector = page.locator(
    "[data-testid='footer-social-links']",
  );
  await expect(socialLinksSelector.locator("a").first()).toHaveAttribute(
    "href",
    "https://twitter.com/blockprotocol",
  );
  await expect(socialLinksSelector.locator("a").nth(1)).toHaveAttribute(
    "href",
    "/discord",
  );
  await expect(socialLinksSelector.locator("a").nth(2)).toHaveAttribute(
    "href",
    "https://github.com/blockprotocol/blockprotocol",
  );
  await expect(
    socialLinksSelector.locator("text=Star us on Github"),
  ).toHaveAttribute("href", "https://github.com/blockprotocol/blockprotocol");

  await expect(
    page.locator("footer >> a:has-text('Contact Us')"),
  ).toHaveAttribute("href", "/contact");

  await page.locator("footer").scrollIntoViewIfNeeded();

  await expect(page.locator("footer >> a:text-is('Þ Hub')")).toHaveAttribute(
    "href",
    "/hub",
  );

  await expect(
    page.locator("footer >> a:has-text('Documentation')"),
  ).toHaveAttribute("href", "/docs");

  await expect(
    page.locator("footer >> a:has-text('Specification')"),
  ).toHaveAttribute("href", "/docs/spec");

  await expect(
    page.locator("footer >> a:has-text('Publish a Block')"),
  ).toHaveAttribute("href", "/docs/developing-blocks#publish");
});
