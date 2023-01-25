import { expect, test } from "../shared/wrapped-playwright.js";

const searchModalSelector = '[data-testid="bp-search-modal"]';

test("is triggered by pressing / on desktop", async ({ page, isMobile }) => {
  const searchModal = page.locator(searchModalSelector);

  await page.goto("/");
  await expect(searchModal).not.toBeVisible();
  await page.keyboard.press("/");

  if (isMobile) {
    await expect(
      searchModal,
      "Search modal should not be visible on mobile",
    ).not.toBeVisible();
    return;
  }

  await expect(
    searchModal,
    "Pressing '/' should trigger search modal",
  ).toBeVisible();
  await expect(
    searchModal.locator('[placeholder="Search…"]'),
    "Input should be focused when search modal is opened",
  ).toBeFocused();

  // close modal
  await searchModal.locator(".MuiBackdrop-root").click({
    position: {
      x: 32,
      y: 32,
    },
  });
});

test("is not triggered by pressing / within an input or a textarea", async ({
  page,
}) => {
  const searchModal = page.locator(searchModalSelector);

  await page.goto("/");

  await page.focus('input[placeholder="you@example.com"]');
  await page.keyboard.press("/");

  await expect(
    searchModal,
    "Search modal should not be visible when pressing '/' within an input",
  ).not.toBeVisible();

  await page.goto("/@hash/blocks/code");

  const jsonEditor = page.locator(
    "[data-testid='block-properties-tabpanel'] >> textarea",
  );

  await jsonEditor.focus();
  await page.keyboard.type("te/st");

  await expect(
    searchModal,
    "Search modal should not be visible when pressing '/' within a textarea",
  ).not.toBeVisible();
});
