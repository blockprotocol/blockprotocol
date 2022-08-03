import { expect, test } from "playwright-test-coverage";

test("Updating block properties should update block preview", async ({
  page,
}) => {
  await page.goto("/@hash/blocks/code");

  const blockFrameLocator = page.frameLocator("iframe[title='block']");

  await expect(blockFrameLocator.locator("input")).toBeVisible({
    timeout: 10000,
  });

  const jsonEditor = page.locator(
    "[data-testid='block-properties-tabpanel'] >> textarea",
  );

  await expect(jsonEditor).not.toBeEmpty();

  const blockProperties = JSON.parse(await jsonEditor.inputValue());

  await expect(blockFrameLocator.locator("input")).toHaveValue(
    blockProperties.caption!,
  );
});
