import { expect, test } from "@playwright/test";

import blocksData from "../../blocks-data.json";

const codeBlock = blocksData.find(
  ({ name }) => name === "@hashintel/block-code",
);

test("Block page should contain key elements", async ({ page }) => {
  test.skip();
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

  await expect(
    page.locator(".MuiTabs-root >> text=Block Properties"),
  ).toBeVisible();

  await expect(page.locator("#simple-tabpanel-0 >> textarea")).toHaveValue(
    JSON.stringify(codeBlock.examples[0], null, 2),
  );

  // sandboxed block should be visible
  await expect(page.locator("iframe[title='block']")).toBeVisible(); // perhaps use waitFor?
  await expect(
    page.locator(
      `iframe[title='block'] >> text=${codeBlock.examples[0]!.caption}`,
    ),
  );

  await page.locator(".MuiTabs-root >> text=Block Schema").click();
  await expect(page.locator("#simple-tabpanel-1")).toBeVisible();

  // check if readme was displayed
  await expect(page.locator("article")).toBeVisible();

  await expect(page.locator("h2:has-text('Repository')")).toBeVisible();

  await expect(
    page.locator("a:below(h2:has-text('Repository'))").first(),
  ).toHaveAttribute("href", codeBlock.repository);

  await expect(page.locator("text=Explore more blocks")).toBeVisible();

  // Block slider
  await expect(page.locator('[data-testid="block-slider"]')).toBeVisible();

  // New blocks can get added, hence the usage of greater than instead of equal too
  expect(
    await page.locator('[data-testid="block-slider"] >> .slick-slide').count(),
  ).toBeGreaterThan(5);
});

// @todo add tests for BlockDataContainer

test("updating block properties should update block preview", async ({
  page,
}) => {
  expect(
    codeBlock,
    "Code block should be prepared before this test",
  ).toBeDefined();
  if (!codeBlock) {
    return;
  }

  await page.goto(codeBlock.blockPackagePath);

  await expect(
    page.locator(".MuiTabs-root >> text=Block Properties"),
  ).toBeVisible();

  await expect(page.locator("iframe[title='block']")).toBeVisible();

  const codeBlockExample = codeBlock.examples[0];

  await expect(page.locator("#simple-tabpanel-0 >> textarea")).toHaveValue(
    JSON.stringify(codeBlockExample, null, 2),
  );

  await expect(
    page
      .frameLocator("iframe[title='block']")
      .locator(`text=${codeBlockExample.caption}`),
  ).toBeVisible();

  await page
    .locator("#simple-tabpanel-0 >> textarea")
    .fill(JSON.stringify({ ...codeBlockExample, caption: "New caption" }));

  await expect(
    page.frameLocator("iframe[title='block']").locator(`text=New caption`),
  ).toBeVisible();
});

// test("should show an error message if an unsupported block is rendered", () => {});
