import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("./");

  await expect(
    page.locator(
      "text=The Block Protocol enables applications to make their interfaces infinitely extensible with interoperable components called blocks.",
    ),
  ).toBeVisible();

  await expect(
    page.locator("text=Users typically select blocks from a list"),
  ).toBeVisible();

  await expect(
    page.locator("text=Today, blocks are confined to single apps and websites"),
  ).toBeVisible();

  await expect(
    page.locator("text=export const App: BlockComponent<AppProps>"),
  ).toBeVisible();

  await expect(
    page.locator(
      "text=The Block Protocol makes building composable interfaces easy",
    ),
  ).toBeVisible();

  // Click div:nth-child(3) > .MuiSvgIcon-root
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click div:nth-child(3) > .MuiSvgIcon-root > path
  await page.locator("div:nth-child(3) > .MuiSvgIcon-root > path").click();

  // Click text=start building it today.
  await page.locator("text=start building it today.").click();
  await expect(page).toHaveURL("./docs/developing-blocks#introduction");

  // Go to ./docs/developing-blocks
  await page.goto("./docs/developing-blocks");

  // Go to ./docs/developing-blocks#choosing-your-approach
  await page.goto("./docs/developing-blocks#choosing-your-approach");

  // Go to ./docs/developing-blocks#i-want-to-use-a-different-technology
  await page.goto(
    "./docs/developing-blocks#i-want-to-use-a-different-technology",
  );

  // Go to ./docs/developing-blocks#i-don't-want-to-use-typescript
  await page.goto("./docs/developing-blocks#i-don't-want-to-use-typescript");

  // Go to ./docs/developing-blocks#creating-a-block
  await page.goto("./docs/developing-blocks#creating-a-block");

  // Go to ./docs/developing-blocks#the-development-environment
  await page.goto("./docs/developing-blocks#the-development-environment");

  // Go to ./docs/developing-blocks#lifecycle-of-a-block
  await page.goto("./docs/developing-blocks#lifecycle-of-a-block");

  // Go to ./docs/developing-blocks#using-the-graph-service
  await page.goto("./docs/developing-blocks#using-the-graph-service");

  // Go to ./docs/developing-blocks#updating-the-blockentity
  await page.goto("./docs/developing-blocks#updating-the-blockentity");

  // Go to ./docs/developing-blocks#exploring-the-data-store
  await page.goto("./docs/developing-blocks#exploring-the-data-store");

  // Go to ./docs/developing-blocks#linking-entities-to-the-blockentity
  await page.goto(
    "./docs/developing-blocks#linking-entities-to-the-blockentity",
  );

  // Go to ./docs/developing-blocks#going-further
  await page.goto("./docs/developing-blocks#going-further");

  // Go to ./docs/developing-blocks#build
  await page.goto("./docs/developing-blocks#build");

  // Go to ./docs/developing-blocks#publish
  await page.goto("./docs/developing-blocks#publish");

  // Go to ./docs/developing-blocks#my-block-source-is-in-a-subfolder
  await page.goto("./docs/developing-blocks#my-block-source-is-in-a-subfolder");

  // Go to ./docs/developing-blocks#my-block-requires-building-from-its-source
  await page.goto(
    "./docs/developing-blocks#my-block-requires-building-from-its-source",
  );
});
