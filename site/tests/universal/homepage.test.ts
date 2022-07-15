import { expect, test } from "@playwright/test";

test("Home page should contain key elements", async ({ page }) => {
  await page.goto("/");

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
});
