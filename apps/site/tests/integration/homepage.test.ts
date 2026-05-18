import { expect, test } from "../shared/wrapped-playwright.js";

test("Home page should contain key elements", async ({ page }) => {
  await page.goto("/");

  // Header section
  await expect(
    page.locator(
      "text=The Þ Block Protocol enables applications to make their interfaces infinitely extensible with interoperable components known as blocks",
    ),
  ).toBeVisible();

  // What are blocks section
  await expect(page.locator("text=What are blocks?")).toBeVisible();

  await expect(
    page.locator("text=Users typically select blocks from a list"),
  ).toBeVisible();

  // Confined blocks section
  await expect(
    page.locator("text=Today, blocks are confined to single apps and websites"),
  ).toBeVisible();

  // Interoperable blocks
  await expect(
    page.locator("text=Block Protocol blocks are interoperable"),
  ).toBeVisible();

  // Zero applicaiton devs section
  await expect(
    page.locator(
      "text=Give your users access to an ever-growing library of high-quality blocks.",
    ),
  ).toBeVisible();

  await expect(
    page.locator("text=Learn more about embedding Þ blocks"),
  ).toHaveAttribute("href", "/docs/blocks/environments#your-own-application");

  // Composable interfaces section
  await expect(page.locator("[data-testid='WordPress-button']")).toBeVisible();
  await page.hover(`[data-testid='WordPress-button']`);
  await expect(page.locator("[data-testid='WordPress-tooltip']")).toBeVisible();

  await expect(
    page.locator("[data-testid='GitHub Blocks-button']"),
  ).toBeVisible();
  await page.hover(`[data-testid='GitHub Blocks-button']`);
  await expect(
    page.locator("[data-testid='GitHub Blocks-tooltip']"),
  ).toBeVisible();

  await expect(page.locator("[data-testid='HASH-button']")).toBeVisible();
  await page.hover(`[data-testid='HASH-button']`);
  await expect(page.locator("[data-testid='HASH-tooltip']")).toBeVisible();

  await expect(page.locator("[data-testid='Figma-button']")).toBeVisible();
  await page.hover(`[data-testid='Figma-button']`);
  await expect(page.locator("[data-testid='Figma-tooltip']")).toBeVisible();

  await expect(
    page.locator("[data-testid='Vote on what’s next-button']"),
  ).toBeVisible();
  await page.hover(`[data-testid='Vote on what’s next-button']`);
  await expect(
    page.locator("[data-testid='Vote on what’s next-tooltip']"),
  ).toBeVisible();

  await expect(
    page.locator("text=Build blocks that work across the web"),
  ).toBeVisible();

  await expect(
    page.locator("text=Tap into blocks in any supporting application"),
  ).toBeVisible();

  await expect(page.locator("text=Build a block")).toHaveAttribute(
    "href",
    "/docs/blocks/develop",
  );

  await expect(page.locator("text=Browse apps")).toHaveAttribute(
    "href",
    "/docs/blocks/environments",
  );

  await expect(page.locator("text=Browse blocks")).toHaveAttribute(
    "href",
    "/hub",
  );

  // Any framework section
  await expect(
    page.locator("text=Build blocks in any framework"),
  ).toBeVisible();

  await expect(
    page.locator("text=export const App: BlockComponent<AppProps>"),
  ).toBeVisible();

  // Carousel section
  await expect(page.locator("text=Browse all Blocks")).toHaveAttribute(
    "href",
    "/hub",
  );

  await expect(page.locator("text=build it!")).toHaveAttribute(
    "href",
    "/docs/blocks/develop",
  );

  // Block slider
  await expect(page.locator('[data-testid="block-slider"]')).toBeVisible();

  // More blocks can be mirrored, hence the usage of greater than instead of equal too
  expect(
    await page.locator('[data-testid="block-slider"] >> .slick-slide').count(),
  ).toBeGreaterThan(4);

  // Final CTA section — no longer prompts users to sign up while we focus
  // on HASH; just points at the Hub and docs.
  const finalCTA = page.locator('[data-testid="final-cta"]');

  await expect(finalCTA).toBeVisible();

  await expect(
    finalCTA.locator("text=Build with the Block Protocol"),
  ).toBeVisible();
  await expect(finalCTA.locator("text=Add blocks to your app")).toBeVisible();
  await expect(
    finalCTA.locator("text=Contribute to a growing, open source community"),
  ).toBeVisible();
  await expect(
    finalCTA.locator("text=Claim your favorite username"),
  ).toBeVisible();

  await expect(finalCTA.locator("text=Browse the Hub")).toHaveAttribute(
    "href",
    "/hub",
  );
  await expect(finalCTA.locator("text=Read the docs")).toHaveAttribute(
    "href",
    "/docs",
  );
});
