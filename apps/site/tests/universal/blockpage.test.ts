import { expect, test } from "../shared/wrapped-playwright.js";

const codeBlockUrl = "/@hash/blocks/code";

test("Updating block properties should update block preview", async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202542409311090/1202651551651719 (internal)",
  );
  test.slow(); // @todo Remove after re-engineering block sandbox

  await page.goto("/hub");

  await expect(
    page.locator('[data-testid="block-card"]', {
      hasText: "Code",
    }),
  ).toHaveAttribute("href", codeBlockUrl);

  await page.goto(codeBlockUrl);

  const blockFrameLocator = page.frameLocator("iframe[title='block']");

  await expect(blockFrameLocator.locator("input")).toBeVisible({
    timeout: 30000, // @todo Remove after re-engineering block sandbox
  });

  const jsonEditor = page.locator(
    "[data-testid='block-properties-tabpanel'] >> textarea",
  );

  await expect(jsonEditor).not.toBeEmpty();

  // @todo 'caption' here must be replaced with the new property URI when the production one available
  // const blockProperties = JSON.parse(await jsonEditor.inputValue());
  //
  // await expect(blockFrameLocator.locator("input")).toHaveValue(
  //   blockProperties.caption!,
  // );
  //
  // if (isMobile) {
  //   await page.locator("text=Block Data").click();
  // }
  //
  // await page
  //   .locator("[data-testid='block-properties-tabpanel'] >> textarea")
  //   .fill(JSON.stringify({ ...blockProperties, caption: "New caption" }));

  if (isMobile) {
    await page.locator("text=Preview").click();
  }

  // await expect(blockFrameLocator.locator("input")).toHaveValue("New caption");

  // Readonly mode test
  await expect(
    blockFrameLocator.locator("button", { hasText: "Caption" }),
  ).toBeVisible();
  await page.locator("[data-testid='readonly-toggle']").click();
  await expect(
    blockFrameLocator.locator("button", { hasText: "Caption" }),
  ).not.toBeVisible();
});
