import { expect, test } from "@playwright/test";

test("page footer navigation works", async ({ page }) => {
  await page.goto("/");

  await page.locator("footer >> text=Block Hub").click();
  await expect(page).toHaveURL("/hub");

  //   uncomment when https://app.asana.com/0/1202542409311090/1202629493068301 is done
  //   await page.locator("footer >> a:has-text('Documentation')").click();
  //   await page.waitForURL("/docs");

  //   await page.locator("footer >> a:has-text('Specification')").click();
  //   await page.waitForURL("/docs/spec");

  //   await page.locator("footer>> a:has-text('Publish a Block')").click();
  //   await page.waitForURL("/docs/developing-blocks#publish");

  await page.locator("footer >> a:has-text('Contact Us')").click();
  await expect(page).toHaveURL("/contact");

  const socialLinksSelector = page.locator(
    "[data-testid='footer-social-links']",
  );

  await expect(socialLinksSelector.locator("a >> nth=0")).toHaveAttribute(
    "href",
    "https://twitter.com/blockprotocol",
  );

  await expect(socialLinksSelector.locator("a >> nth=1")).toHaveAttribute(
    "href",
    "/discord",
  );

  await expect(socialLinksSelector.locator("a >> nth=2")).toHaveAttribute(
    "href",
    "https://github.com/blockprotocol/blockprotocol",
  );

  await expect(
    socialLinksSelector.locator("text=Star us on Github"),
  ).toHaveAttribute("href", "https://github.com/blockprotocol/blockprotocol");
});
