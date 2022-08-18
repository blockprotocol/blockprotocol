import { expect, test } from "playwright-test-coverage";

import blocksData from "../../blocks-data.json";
import type { ExpandedBlockMetadata } from "../../src/lib/blocks";
import { resetDb } from "../shared/fixtures";
import { login } from "../shared/nav";

test.beforeEach(async () => {
  await resetDb();
});

test("key elements should be present when user views their account page", async ({
  page,
}) => {
  await page.goto("/@alice");

  await login({ page });

  await expect(page.locator('h3:has-text("Alice")')).toBeVisible();

  await expect(page.locator("text=@alice")).toBeVisible();

  for (const [testId, href] of [
    ["profile-page-overview-tab", "/@alice"],
    ["profile-page-blocks-tab", "/@alice/blocks"],
    ["profile-page-schemas-tab", "/@alice/schemas"],
  ] as const) {
    const item = page.locator(`[data-testid='${testId}']`);
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("href", href);
  }

  // Overview tab tests
  await page.locator("[data-testid='profile-page-overview-tab']").click();

  await expect(
    page.locator("text=You haven’t created any blocks or schemas yet"),
  ).toBeVisible();

  await expect(
    page.locator("text=Start building to see your creations show up here."),
  ).toBeVisible();

  await expect(page.locator("text=Build a block")).toBeVisible();

  await expect(page.locator("text=Build a block")).toHaveAttribute(
    "href",
    "/docs/developing-blocks",
  );

  await expect(page.locator("text=Create a schema")).toBeVisible();

  // Blocks tab tests
  await page.locator("[data-testid='profile-page-blocks-tab']").click();

  await expect(page).toHaveURL("/@alice/blocks");

  await page.locator("text=You haven’t created any blocks yet").click();

  await expect(
    page.locator("text=Start building to see your creations show up here."),
  ).toBeVisible();

  await expect(page.locator("text=Build a block")).toBeVisible();

  await expect(page.locator("text=Build a block")).toHaveAttribute(
    "href",
    "/docs/developing-blocks",
  );

  // Schema tab tests
  await page.locator("[data-testid='profile-page-schemas-tab']").click();

  await expect(
    page.locator("text=You haven’t created any schemas yet"),
  ).toBeVisible();

  await expect(
    page.locator("text=Start building to see your creations show up here."),
  ).toBeVisible();

  await expect(page.locator("text=Create a schema")).toBeVisible();
});

const codeBlockMetadata = (blocksData as ExpandedBlockMetadata[]).find(
  ({ name }) => name === "@hashintel/block-code",
);

if (!codeBlockMetadata) {
  throw new Error("Code block should be prepared before tests are run");
}

test("key elements should be present when guest user views account page", async ({
  page,
  isMobile,
}) => {
  await page.goto("/@hash");
  await expect(page.locator('h3:has-text("HASH")')).toBeVisible();
  await expect(page.locator("text=@hash")).toBeVisible();

  for (const [testId, href] of [
    ["profile-page-overview-tab", "/@hash"],
    ["profile-page-blocks-tab", "/@hash/blocks"],
    ["profile-page-schemas-tab", "/@hash/schemas"],
  ] as const) {
    const item = page.locator(`[data-testid='${testId}']`);
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("href", href);
  }

  const overviewCards = page.locator("[data-testid='overview-card']");
  let overviewCardCount = 0;
  await expect
    .poll(async () => {
      overviewCardCount = await overviewCards.count();
      return overviewCardCount;
    })
    .toBeGreaterThan(3);

  const codeBlockOverviewCard = page.locator("[data-testid='overview-card']", {
    hasText: codeBlockMetadata.displayName!,
  });

  await expect(codeBlockOverviewCard).toHaveAttribute(
    "href",
    codeBlockMetadata.blockSitePath,
  );

  if (isMobile) {
    await expect(codeBlockOverviewCard.locator("img").first()).toHaveAttribute(
      "src",
      codeBlockMetadata.icon!,
    );
  } else {
    await expect(codeBlockOverviewCard.locator("img").first()).toHaveAttribute(
      "src",
      codeBlockMetadata.image!,
    );

    await expect(codeBlockOverviewCard.locator("img").nth(1)).toHaveAttribute(
      "src",
      codeBlockMetadata.icon!,
    );
  }

  await expect(
    codeBlockOverviewCard.locator(`text=${codeBlockMetadata.description}`),
  ).toBeVisible();

  await expect(codeBlockOverviewCard.locator("text=Block")).toBeVisible();

  await expect(
    codeBlockOverviewCard.locator(`text=${codeBlockMetadata.version}`),
  ).toBeVisible();

  await page.locator("[data-testid='profile-page-blocks-tab']").click();

  await expect(page).toHaveURL("/@hash/blocks");

  const listViewCards = page.locator("[data-testid='list-view-card']");

  let blocksCount = 0;
  await expect
    .poll(async () => {
      blocksCount = await listViewCards.count();
      return blocksCount;
    })
    .toBeGreaterThan(3);
  await expect(page.locator(`text=Blocks${blocksCount}`)).toBeVisible();

  const codeBlockListViewCard = page.locator("[data-testid='list-view-card']", {
    hasText: codeBlockMetadata.displayName!,
  });

  await expect(codeBlockListViewCard).toHaveAttribute(
    "href",
    codeBlockMetadata.blockSitePath,
  );

  await expect(codeBlockListViewCard.locator("img")).toHaveAttribute(
    "src",
    codeBlockMetadata.icon!,
  );

  await expect(
    codeBlockListViewCard.locator(`text=${codeBlockMetadata.description}`),
  ).toBeVisible();

  await page.locator("[data-testid='profile-page-schemas-tab']").click();

  await expect(page).toHaveURL("/@hash/schemas");

  await expect(
    page.locator("text=@hash hasn’t published any schemas yet"),
  ).toBeVisible();

  await expect(
    page.locator("text=You can browse existing schemas on the Block Hub."),
  ).toBeVisible();

  await expect(page.locator("text=Browse the Block Hub")).toBeVisible();

  await expect(page.locator("text=Browse the Block Hub")).toHaveAttribute(
    "href",
    "/hub",
  );
});

test("navigation to invalid account page", async ({ page }) => {
  await page.goto("/@non-existent-user");
  await expect(page.locator("text=404")).toBeVisible();
  await expect(
    page.locator("text=This page could not be found."),
  ).toBeVisible();
});
