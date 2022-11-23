import { expect, test } from "../shared/wrapped-playwright.js";

test("Home page should contain key elements", async ({ page, isMobile }) => {
  await page.goto("/");

  await expect(
    page.locator(
      "text=The Block Protocol enables applications to make their interfaces infinitely extensible with interoperable components called blocks.",
    ),
  ).toBeVisible();

  await expect(
    page.locator("text=Users typically select blocks from a list"),
  ).toBeVisible();

  await expect(
    page.locator("text=Today, blocks are confined to single apps and websites"),
  ).toBeVisible();

  await expect(
    page.locator("text=export const App: BlockComponent<AppProps>"),
  ).toBeVisible();

  await expect(
    page.locator(
      "text=The Block Protocol makes building composable interfaces easy",
    ),
  ).toBeVisible();

  await expect(page.locator("text=Explore all Blocks")).toHaveAttribute(
    "href",
    "/hub",
  );

  await expect(page.locator("text=start building it today")).toHaveAttribute(
    "href",
    "/docs/developing-blocks",
  );

  // Block slider
  await expect(page.locator('[data-testid="block-slider"]')).toBeVisible();

  // New blocks can get added, hence the usage of greater than instead of equal too
  expect(
    await page.locator('[data-testid="block-slider"] >> .slick-slide').count(),
  ).toBeGreaterThan(5);

  if (!isMobile) {
    const finalCTA = page.locator('[data-testid="final-cta"]');

    // @todo: Add tests to handle authenticated users, they shouldn't see this section
    await expect(finalCTA).toBeVisible();

    await expect(
      finalCTA.locator("text=Read the block builder guide"),
    ).toHaveAttribute("href", "/docs/developing-blocks");

    await expect(
      finalCTA.locator("text=Read the embedding app guide"),
    ).toHaveAttribute("href", "/docs/embedding-blocks");

    await expect(finalCTA.locator("text=Log in")).toHaveAttribute(
      "href",
      "/login",
    );
  }
});
