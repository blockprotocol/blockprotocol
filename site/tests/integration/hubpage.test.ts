import { expect, test } from "playwright-test-coverage";

import blocksData from "../../blocks-data.json";
import type { ExpandedBlockMetadata } from "../../src/lib/blocks";

const codeBlockMetadata = (blocksData as ExpandedBlockMetadata[]).find(
  ({ name }) => name === "@hashintel/block-code",
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

  await expect(page.locator("text=Quickstart guide")).toHaveAttribute(
    "href",
    "/docs/developing-blocks",
  );

  await expect(page.locator("text=Read the Quick Start Guide")).toHaveAttribute(
    "href",
    "/docs/developing-blocks",
  );
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
