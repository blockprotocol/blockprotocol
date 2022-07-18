import { expect, test } from "@playwright/test";

const links = {
  exploreAllBlocks: "/hub",
  developingBlocks: "/docs/developing-blocks",
  embeddingBlocks: "/docs/embedding-blocks",
  login: "/login",
};

test("Home page should contain key elements", async ({ page }) => {
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
    links.exploreAllBlocks,
  );

  await expect(page.locator("text=start building it today")).toHaveAttribute(
    "href",
    links.developingBlocks,
  );

  // Block slider
  await expect(page.locator('[data-testid="block-slider"]')).toBeVisible();

  // New blocks can get added, hence the usage of greater than instead of equal too
  expect(
    await page.locator('[data-testid="block-slider"] >> .slick-slide').count(),
  ).toBeGreaterThan(5);

  const finalCTA = page.locator('[data-testid="final-cta"]');

  // @todo: Add tests to handle authenticated users, they shouldn't see this section
  await expect(finalCTA).toBeVisible();

  await expect(
    finalCTA.locator("text=Read the block builder guide"),
  ).toHaveAttribute("href", links.developingBlocks);

  await expect(
    finalCTA.locator("text=Read the embedding app guide"),
  ).toHaveAttribute("href", links.embeddingBlocks);

  await expect(finalCTA.locator("text=Log in")).toHaveAttribute(
    "href",
    links.login,
  );
});

test("Home page key interactions work", async ({ page }) => {
  await page.goto("/");

  const searchModalLocator = page.locator('[data-testid="bp-search-modal"]');
  await expect(searchModalLocator).not.toBeVisible();
  await page.keyboard.press("/");
  await expect(
    searchModalLocator,
    "Pressing '/' should trigger search modal",
  ).toBeVisible();
  await expect(
    searchModalLocator.locator('[placeholder="Search..."]'),
    "Input should be focused when search modal is opened",
  ).toBeFocused();

  await searchModalLocator.locator(".MuiBackdrop-root").click();

  await page.locator("header >> button", { hasText: "Search" }).click();

  await expect(
    searchModalLocator,
    "Clicking on search nav button should bring up search modal",
  ).toBeVisible();
});

// Registry section
// Explore all blocks => url
// Start building it today => url
// Check footer links, confirm they are correct

// Pressing / should bring up search modal

// authenticated user should not see signup form (comes before footer)
