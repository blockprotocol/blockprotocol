import { expect, test } from "@playwright/test";

import blocksData from "../../blocks-data.json";

const codeBlock = blocksData.find(
  ({ name }) => name === "@hashintel/block-code",
);

const unsupportedBlock = blocksData.find(
  ({ name }) => name === "@hashintel/block-embed",
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

  const blockExample = codeBlock.examples[0] as Record<string, string>;

  // confirm block properties tab contains example data
  await expect(page.locator("#simple-tabpanel-0 >> textarea")).toHaveValue(
    JSON.stringify(blockExample, null, 2),
  );

  const blockFrameLocator = page.frameLocator("iframe[title='block']");

  await expect(blockFrameLocator.locator("input")).toHaveValue(
    blockExample.caption!,
  );

  await page
    .locator("#simple-tabpanel-0 >> textarea")
    .fill(JSON.stringify({ ...blockExample, caption: "New caption" }));

  await expect(blockFrameLocator.locator("input")).toHaveValue("New caption");
});

test("should show an error message if an unsupported block is rendered", async ({
  page,
}) => {
  expect(
    unsupportedBlock,
    `An unsupported block should be prepared before this test`,
  ).toBeDefined();
  if (!unsupportedBlock) {
    return;
  }

  await page.goto(unsupportedBlock.blockPackagePath);

  const blockExample = unsupportedBlock.examples[0] as Record<string, string>;

  // confirm block properties tab contains example data
  await expect(page.locator("#simple-tabpanel-0 >> textarea")).toHaveValue(
    JSON.stringify(blockExample, null, 2),
  );

  await expect(
    page.locator(
      "text=This block was written for an earlier version of the Block Protocol specification and cannot currently be displayed in the Hub.",
    ),
  ).toBeVisible();
});

// @todo: Add tests for a text-based block
