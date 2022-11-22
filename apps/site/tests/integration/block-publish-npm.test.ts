import { publishBlock } from "../shared/blocks.js";
import { resetSite } from "../shared/fixtures.js";
import { login } from "../shared/nav.js";
import type { Page } from "../shared/wrapped-playwright.js";
import {
  expect,
  test,
  tolerateCustomConsoleMessages,
} from "../shared/wrapped-playwright.js";

const fillBlockDetails = async (
  page: Page,
  npmPackageName: string,
  blockName: string,
) => {
  await page.locator('input[name="npmPackageName"]').fill(npmPackageName);

  await page.locator('input[name="blockName"]').fill(blockName);
};

const dummyBlockName = "my-amazing-block";
const validNpmPackage = "test-npm-block";

test.beforeEach(async ({ page }) => {
  await resetSite();

  await page.goto("/");

  // @todo triage: https://app.asana.com/0/1203312852763953/1203414492513784/f
  tolerateCustomConsoleMessages([
    /Failed to load resource: the server responded with a status of 500 \(Internal Server Error\)/,
  ]);

  await login({ page });
});

test("user should be able to publish block & see it on the list", async ({
  page,
}) => {
  test.skip(
    !process.env.NEXT_PUBLIC_NPM_PUBLISHING,
    "NEXT_PUBLIC_NPM_PUBLISHING is not set",
  );

  await page.goto("/blocks");

  // block list empty state should be visible
  await expect(
    page.locator("text=You haven't published a block yet"),
  ).toBeVisible();

  await page.locator("text=Add new block").click();

  // select npm
  await page.locator("text=Continue").click();

  await fillBlockDetails(page, validNpmPackage, dummyBlockName);

  // check if the block-url on the rule-list is updated with the block name
  await expect(
    page.locator(
      `ul:has-text('Choose a URL slug for your block') > li:has-text('blockprotocol.org/@alice/${dummyBlockName}')`,
    ),
  ).toBeVisible();

  // Click text=Publish block to hub
  await page.locator("text=Publish block to hub").click();

  // check success alert
  await expect(
    page.locator("text=your block was published successfully"),
  ).toBeVisible();

  await expect(page.locator("[data-testid=list-view-card]")).toBeVisible();
  await expect(page.locator("[data-testid=list-view-card]")).toContainText(
    "test-npm-block block",
  );
});

test("user should not be able to publish an invalid npm-package", async ({
  page,
}) => {
  test.skip(
    !process.env.NEXT_PUBLIC_NPM_PUBLISHING,
    "NEXT_PUBLIC_NPM_PUBLISHING is not set",
  );

  await page.goto("/blocks/publish/npm");

  await fillBlockDetails(page, "react", dummyBlockName);

  // Click text=Publish block to hub
  await page.locator("text=Publish block to hub").click();

  await expect(page.locator("text=No block-metadata.json")).toBeVisible();
});

test("user should not be able to publish an already-used npm-package", async ({
  page,
}) => {
  test.skip(
    !process.env.NEXT_PUBLIC_NPM_PUBLISHING,
    "NEXT_PUBLIC_NPM_PUBLISHING is not set",
  );

  /** @todo update 'already-taken' name check so that it can be checked in these tests (e.g. by having the check activated by custom environment variable, not `isProduction`) */
  await publishBlock({
    page,
    blockName: dummyBlockName,
    npmPackageName: validNpmPackage,
  });

  await page.goto("/blocks/publish/npm");

  await fillBlockDetails(page, validNpmPackage, `another-block-name`);

  await page.locator("text=Publish block to hub").click();

  await expect(
    page.locator(`text=npm package '${validNpmPackage}' is already linked`),
  ).toBeVisible();
});

test("user should not be able to publish an block with already-taken name", async ({
  page,
}) => {
  test.skip(
    !process.env.NEXT_PUBLIC_NPM_PUBLISHING,
    "NEXT_PUBLIC_NPM_PUBLISHING is not set",
  );

  await publishBlock({
    page,
    blockName: dummyBlockName,
    npmPackageName: validNpmPackage,
  });

  await page.goto("/blocks/publish/npm");

  await fillBlockDetails(page, validNpmPackage, dummyBlockName);

  await page.locator("text=Publish block to hub").click();

  await expect(
    page.locator(
      `text=Block name '${dummyBlockName}' already exists in account alice`,
    ),
  ).toBeVisible();
});
