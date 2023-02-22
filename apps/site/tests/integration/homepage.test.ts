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
  ).toHaveAttribute("href", "/docs/embedding-blocks");

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
    "/docs/developing-blocks",
  );

  await expect(page.locator("text=Browse apps")).toHaveAttribute(
    "href",
    "/docs/using-blocks",
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
    "/docs/developing-blocks",
  );

  // Block slider
  await expect(page.locator('[data-testid="block-slider"]')).toBeVisible();

  // New blocks can get added, hence the usage of greater than instead of equal too
  expect(
    await page.locator('[data-testid="block-slider"] >> .slick-slide').count(),
  ).toBeGreaterThan(5);

  // Sign up section
  const finalCTA = page.locator('[data-testid="final-cta"]');

  // @todo: Add tests to handle authenticated users, they shouldn't see this section
  await expect(finalCTA).toBeVisible();

  await expect(finalCTA.locator("text=Create an account")).toBeVisible();
  await expect(
    finalCTA.locator("text=Publish blocks to the Þ Hub"),
  ).toBeVisible();
  await expect(finalCTA.locator("text=Add blocks to your app")).toBeVisible();
  await expect(
    finalCTA.locator("text=Take part in a growing, open source community"),
  ).toBeVisible();
  await expect(
    finalCTA.locator("text=Claim your favorite username"),
  ).toBeVisible();

  await expect(finalCTA.locator("text=Log in")).toHaveAttribute(
    "href",
    "/login",
  );
});
