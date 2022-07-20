import { expect, test } from "@playwright/test";

import blocksData from "../../blocks-data.json";

const codeBlock = blocksData.find(
  ({ name }) => name === "@hashintel/block-code",
);

test("", async ({ page }) => {
  expect(
    codeBlock,
    "Code block should be prepared before this test",
  ).toBeDefined();
  if (!codeBlock) {
    return;
  }
  await page.goto(codeBlock.blockPackagePath);

  await expect(
    page.locator(`h1:has-text('${codeBlock.displayName}')`),
  ).toBeVisible();

  await expect(
    page.locator(`p:has-text('${codeBlock.description}')`),
  ).toBeVisible();

  await expect(page.locator(`text=@${codeBlock.author}`)).toBeVisible();
  await expect(page.locator(`text=@${codeBlock.author}`)).toHaveAttribute(
    "href",
    `/@${codeBlock.author}`,
  );
  await expect(page.locator(`text=V${codeBlock.version}`)).toBeVisible();

  // check if readme was displayed
  await expect(page.locator("article"));

  await expect(page.locator("h2:has-text=('Repository')"));

  await expect(
    page.locator("a:below(h2:has-text=('Repository'))"),
  ).toHaveAttribute("href", codeBlock.repository);

  await expect(page.locator("text=Explore more blocks")).toBeVisible();

  // Block slider
  await expect(page.locator('[data-testid="block-slider"]')).toBeVisible();

  // New blocks can get added, hence the usage of greater than instead of equal too
  expect(
    await page.locator('[data-testid="block-slider"] >> .slick-slide').count(),
  ).toBeGreaterThan(5);

  // Check code
  // Check title
});
