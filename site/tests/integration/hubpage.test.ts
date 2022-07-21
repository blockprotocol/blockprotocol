import { expect, test } from "@playwright/test";

import blocksData from "../../blocks-data.json";
import { ExpandedBlockMetadata } from "../../src/lib/blocks";

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

const codeBlock = blocksData.find(
  ({ name }) => name === "@hashintel/block-code",
) as ExpandedBlockMetadata | null;

test("Block Card should contain key elements", async ({ page }) => {
  expect(
    codeBlock,
    "Code block should be prepared before this test",
  ).toBeDefined();

  if (!codeBlock) {
    return;
  }

  await page.goto("/hub");

  const codeBlockLocator = page.locator('[data-testid="block-card"]', {
    hasText: codeBlock.displayName,
  });

  await expect(codeBlockLocator).toHaveAttribute(
    "href",
    codeBlock.blockPackagePath,
  );

  // there should be 2 images present => icon and preview image
  await expect(codeBlockLocator.locator("img")).toHaveCount(2);

  await expect(codeBlockLocator.locator("img").first()).toHaveAttribute(
    "src",
    codeBlock.image,
  );

  await expect(codeBlockLocator.locator("img").nth(1)).toHaveAttribute(
    "src",
    codeBlock.icon,
  );

  await expect(
    codeBlockLocator.locator(`text=${codeBlock.description}`),
  ).toBeVisible();

  await expect(
    codeBlockLocator.locator(`text=@${codeBlock.author}`),
  ).toBeVisible();

  await expect(
    codeBlockLocator.locator(`text=${codeBlock.version}`),
  ).toBeVisible();
});
