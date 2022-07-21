import { expect, test } from "playwright-test-coverage";

const codeBlockUrl = "/@hash/blocks/code";

test("Updating block properties should update block preview", async ({
  page,
  isMobile,
}) => {
  await page.goto("/hub");

  await expect(
    page.locator('[data-testid="block-card"]', {
      hasText: "Code",
    }),
  ).toHaveAttribute("href", codeBlockUrl);

  await page.goto(codeBlockUrl);

  await expect(page.locator("iframe[title='block']")).toBeVisible();

  const blockFrameLocator = page.frameLocator("iframe[title='block']");

  // wait till block is rendered
  // @todo figure out why this doesn't come up on safari
  await expect(blockFrameLocator.locator("input")).toBeVisible({
    timeout: 10000,
  });

  const jsonEditor = page.locator("#simple-tabpanel-0 >> textarea");

  await expect(jsonEditor).not.toBeEmpty();

  const blockProperties = JSON.parse(await jsonEditor.inputValue());

  await expect(blockFrameLocator.locator("input")).toHaveValue(
    blockProperties.caption!,
  );

  if (isMobile) {
    await page.locator(".MuiTabs-root >> text=Source Code").click();
  }

  await page
    .locator("#simple-tabpanel-0 >> textarea")
    .fill(JSON.stringify({ ...blockProperties, caption: "New caption" }));

  if (isMobile) {
    await page.locator(".MuiTabs-root >> text=Preview").click();
  }

  await expect(blockFrameLocator.locator("input")).toHaveValue("New caption");
});
