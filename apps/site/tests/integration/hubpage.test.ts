import { expect, test } from "../shared/wrapped-playwright.js";

test("Hub page should contain key elements", async ({ page }) => {
  await page.goto("/hub");

  await expect(page.locator("text=Open-source components for")).toBeVisible();

  expect(
    await page.locator('[data-testid="block-card"]').count(),
  ).toBeGreaterThanOrEqual(1);

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
    hasText: "Code",
  });

  await expect(codeBlockLocator).toHaveAttribute("href", "/@hash/blocks/code");

  // there should be 2 images present => icon and preview image
  await expect(codeBlockLocator.locator("img")).toHaveCount(2);

  await expect(codeBlockLocator.locator("img").first()).toHaveAttribute(
    "src",
    /\/blocks\/hash\/code\/public\/preview\.svg$/,
  );

  await expect(codeBlockLocator.locator("img").nth(1)).toHaveAttribute(
    "src",
    /\/blocks\/hash\/code\/public\/code\.svg$/,
  );

  await expect(
    codeBlockLocator.locator(
      `text="Write monospaced code with syntax highlighting in a range of programming and markup languages"`,
    ),
  ).toBeVisible();

  await expect(codeBlockLocator.locator(`text=@hash`)).toBeVisible();

  await expect(codeBlockLocator.locator(`text=0.2.0`)).toBeVisible();
});
