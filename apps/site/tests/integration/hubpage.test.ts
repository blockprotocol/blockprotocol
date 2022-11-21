import { getBlocksData } from "../shared/fixtures.js";
import { expect, test } from "../shared/runtime.js";

const codeBlockMetadata = (await getBlocksData()).find(
  ({ pathWithNamespace }) => pathWithNamespace === "@hash/code",
);

if (!codeBlockMetadata) {
  throw new Error("Code block should be prepared before tests are run");
}

test("Hub page should contain key elements", async ({ page }) => {
  await page.goto("/hub");

  await expect(
    page.locator(
      "h1 >> text=Interactive, data-driven blocks to use in your projects",
    ),
  ).toBeVisible();

  await expect(
    page.locator("text=All open-source and free to use"),
  ).toBeVisible();

  expect(
    await page.locator('[data-testid="block-card"]').count(),
  ).toBeGreaterThan(5);

  const footerCTALocator = page.locator("data-test-id=footerCTA");
  await expect(footerCTALocator).toBeVisible();

  await expect(
    footerCTALocator.locator('text="quickstart guide"'),
  ).toHaveAttribute("href", "/docs/developing-blocks");

  await expect(
    footerCTALocator.locator('text="Read the quickstart guide"'),
  ).toHaveAttribute("href", "/docs/developing-blocks");
});

test("Block Card should contain key elements", async ({ page }) => {
  await page.goto("/hub");

  const codeBlockLocator = page.locator('[data-testid="block-card"]', {
    hasText: codeBlockMetadata.displayName!,
  });

  await expect(codeBlockLocator).toHaveAttribute(
    "href",
    codeBlockMetadata.blockSitePath!,
  );

  // there should be 2 images present => icon and preview image
  await expect(codeBlockLocator.locator("img")).toHaveCount(2);

  await expect(codeBlockLocator.locator("img").first()).toHaveAttribute(
    "src",
    codeBlockMetadata.image!,
  );

  await expect(codeBlockLocator.locator("img").nth(1)).toHaveAttribute(
    "src",
    codeBlockMetadata.icon!,
  );

  await expect(
    codeBlockLocator.locator(`text=${codeBlockMetadata.description}`),
  ).toBeVisible();

  await expect(
    codeBlockLocator.locator(`text=@${codeBlockMetadata.author}`),
  ).toBeVisible();

  await expect(
    codeBlockLocator.locator(`text=${codeBlockMetadata.version}`),
  ).toBeVisible();
});
