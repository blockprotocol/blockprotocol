import { expect, test } from "playwright-test-coverage";

import blocksData from "../../blocks-data.json";
import { sleep } from "../shared/sleep";

const codeBlock = blocksData.find(
  ({ name }) => name === "@hashintel/block-code",
);

const unsupportedBlock = blocksData.find(
  ({ name }) => name === "@hashintel/block-embed",
);

test("Block page should contain key elements", async ({ page, isMobile }) => {
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

  const blockExample = codeBlock.examples[0] as Record<string, string>;

  if (isMobile) {
    //
    await expect(page.locator("text=Source Code")).toBeVisible();
    await page.locator("text=Source Code").click();
    await expect(page.locator("text=Data Source")).toBeVisible();
    await expect(page.locator("#simple-tabpanel-0 >> textarea")).toHaveValue(
      JSON.stringify(blockExample, null, 2),
    );

    await page.locator("text=Data Source").click();
    await page.locator("text=Block Schema").click();

    await expect(page.locator("#simple-tabpanel-1")).toBeVisible();

    await page.locator("text=Preview").click();

    await expect(page.locator("iframe[title='block']")).toBeVisible();

    await expect(
      page.locator(`iframe[title='block'] >> text=${blockExample.caption}`),
    ).toHaveValue(blockExample.caption!);
  } else {
    await expect(page.locator("text=Block Properties")).toBeVisible();
    await expect(page.locator("#simple-tabpanel-0 >> textarea")).toHaveValue(
      JSON.stringify(blockExample, null, 2),
    );

    await page.locator("text=Block Schema").click();
    await expect(page.locator("#simple-tabpanel-1")).toBeVisible();

    await expect(page.locator("iframe[title='block']")).toBeVisible();
    await expect(
      page.frameLocator("iframe[title='block']").locator("input"),
    ).toHaveValue(blockExample.caption!);
  }

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
  isMobile,
}) => {
  expect(
    codeBlock,
    "Code block should be prepared before this test",
  ).toBeDefined();
  if (!codeBlock) {
    return;
  }

  await page.goto(codeBlock.blockPackagePath);

  await expect(page.locator("iframe[title='block']")).toBeVisible();

  const blockExample = codeBlock.examples[0] as Record<string, string>;

  const blockFrameLocator = page.frameLocator("iframe[title='block']");

  if (isMobile) {
    // hack to ensure block is loaded in iframe before the next step on mobile
    // @todo figure a better way to do this
    await sleep(1000);
  }

  await expect(blockFrameLocator.locator("input")).toHaveValue(
    blockExample.caption!,
  );

  if (isMobile) {
    await page.locator(".MuiTabs-root >> text=Source Code").click();
  }

  // confirm block properties tab contains example data
  await expect(page.locator("#simple-tabpanel-0 >> textarea")).toHaveValue(
    JSON.stringify(blockExample, null, 2),
  );

  await page
    .locator("#simple-tabpanel-0 >> textarea")
    .fill(JSON.stringify({ ...blockExample, caption: "New caption" }));

  if (isMobile) {
    await page.locator(".MuiTabs-root >> text=Preview").click();
  }

  await expect(blockFrameLocator.locator("input")).toHaveValue("New caption");
});

test("should show an error message if an unsupported block is rendered", async ({
  page,
  isMobile,
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

  if (isMobile) {
    await page.locator(".MuiTabs-root >> text=Source Code").click();
  }

  // confirm block properties tab contains example data
  await expect(page.locator("#simple-tabpanel-0 >> textarea")).toHaveValue(
    JSON.stringify(blockExample, null, 2),
  );

  if (isMobile) {
    await page.locator(".MuiTabs-root >> text=Preview").click();
  }

  await expect(
    page.locator(
      "text=This block was written for an earlier version of the Block Protocol specification and cannot currently be displayed in the Hub.",
    ),
  ).toBeVisible();
});

// @todo: Add tests for a text-based block
