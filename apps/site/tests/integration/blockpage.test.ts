import { expect, test } from "../shared/wrapped-playwright.js";

test("Block page should contain key elements", async ({
  page,
  isMobile,
  browserName,
}) => {
  await page.goto(codeBlock.blockSitePath);

  await expect(
    page.locator(`h1:has-text("${codeBlock.displayName!}")`),
  ).toBeVisible();

  await expect(
    page.locator(`p:has-text("${codeBlock.description!}")`),
  ).toBeVisible();

  await expect(page.locator(`text=@${codeBlock.author!}`)).toBeVisible();
  await expect(page.locator(`text=@${codeBlock.author!}`)).toHaveAttribute(
    "href",
    `/@${codeBlock.author!}`,
  );
  await expect(page.locator(`text=V${codeBlock.version!}`)).toBeVisible();

  const blockExample = codeBlock.examples?.[0] as Record<string, string>;

  if (isMobile) {
    await page.locator("text=Block Data").click();
    await expect(page.locator("text=Block Properties")).toBeVisible();
  } else {
    await expect(page.locator("text=Block Properties")).toBeVisible();
  }

  const stringifiedJson = JSON.stringify(blockExample, null, 2);

  await expect(
    page.locator("[data-testid='block-properties-tabpanel'] >> textarea"),
  ).toHaveValue(stringifiedJson);

  await page
    .locator("[data-testid='block-properties-tabpanel'] >> textarea")
    .press("Tab");

  // when tab key is pressed, it should insert '\t' to textarea instead of switching focus
  await expect(
    page.locator("[data-testid='block-properties-tabpanel'] >> textarea"),
  ).toHaveValue(`${stringifiedJson}\t`);

  if (isMobile) {
    await page.locator("text=Block Properties").click();
    await page.locator("text=Block Schema").click();
  } else {
    await page.locator("text=Block Schema").click();
  }
  await expect(
    page.locator("[data-testid='block-schema-tabpanel']"),
  ).toBeVisible();
  await expect(
    page.locator("[data-testid='block-schema-tabpanel']"),
  ).not.toBeEmpty();

  if (isMobile) {
    await page.locator("text=Preview").click();
  }

  // @todo: remove conditional when https://app.asana.com/0/1202542409311090/1202651551651719 is fixed
  if (browserName !== "webkit") {
    await expect(
      page.frameLocator("iframe[title='block']").locator("input"),
    ).toBeVisible({
      timeout: 30000, // @todo Remove after re-engineering block sandbox
    });
    await expect(
      page.frameLocator("iframe[title='block']").locator("input"),
    ).toHaveValue(blockExample.caption!);
  }

  // check if readme was displayed
  await expect(page.locator("article")).toBeVisible();

  await expect(page.locator("h2:has-text('Repository')")).toBeVisible();

  await expect(
    page.locator("a:below(h2:has-text('Repository'))").first(),
  ).toHaveAttribute("href", codeBlock.repository!);

  await expect(page.locator("text=Explore more blocks")).toBeVisible();

  await expect(page.locator('[data-testid="block-slider"]')).toBeVisible();

  // New blocks can get added, hence the usage of greater than instead of equal too
  expect(
    await page.locator('[data-testid="block-slider"] >> .slick-slide').count(),
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

test("should show an error message if an unsupported block is rendered", async ({
  page,
  isMobile,
}) => {
  await page.goto(unsupportedBlock.blockSitePath);

  const blockExample = unsupportedBlock.examples![0] as Record<string, string>;

  if (isMobile) {
    await page.locator("text=Block Data").click();
  }

  // confirm block properties tab contains example data
  await expect(
    page.locator("[data-testid='block-properties-tabpanel'] >> textarea"),
  ).toHaveValue(JSON.stringify(blockExample, null, 2));

  if (isMobile) {
    await page.locator("text=Preview").click();
  }

  await expect(
    page.locator(
      "text=This block was written for an earlier version of the Block Protocol specification and cannot currently be displayed in the Hub.",
    ),
  ).toBeVisible();
});

// @todo: Add tests for a text-based block
// @todo: Add tests for a block with example-graph
