import execa from "execa";
import { expect, test } from "playwright-test-coverage";

import blocksData from "../../blocks-data.json";
import type { ExpandedBlockMetadata } from "../../src/lib/blocks";
import { login } from "../shared/nav";

test("viewing account page as authenticated user should have key elements", async ({
  page,
}) => {
  await execa("yarn", ["exe", "scripts/seed-db.ts"]);
  await page.goto("/");

  await login({ page });

  await page.goto("/@alice");

  await expect(page).toHaveURL("http://localhost:3000/@alice");

  await expect(page.locator('h3:has-text("Alice")')).toBeVisible();
  await expect(page.locator("text=@alice")).toBeVisible();

  for (const [testId, href] of [
    ["overview", "/@alice"],
    ["blocks", "/@alice/blocks"],
    ["schemas", "/@alice/schemas"],
  ] as const) {
    const item = page.locator(`[data-testid='profile-page-${testId}-tab']`);
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("href", href);
  }

  // Click text=Overview
  await page.locator("[data-testid='profile-page-overview-tab']").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice");

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
  await expect(page).toHaveURL("http://localhost:3000/@alice/blocks");
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

test("Viewing an account page as a guest user should contain key elements", async ({
  page,
  isMobile,
}) => {
  await page.goto("http://localhost:3000/@hash");
  await expect(page.locator('h3:has-text("HASH")')).toBeVisible();
  await expect(page.locator("text=@hash")).toBeVisible();

  for (const [testId, href] of [
    ["overview", "/@hash"],
    ["blocks", "/@hash/blocks"],
    ["schemas", "/@hash/schemas"],
  ] as const) {
    const item = page.locator(`[data-testid='profile-page-${testId}-tab']`);
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("href", href);
  }

  expect(
    await page.locator("[data-testid='overview-card']").count(),
  ).toBeGreaterThan(3);

  const codeBlockOverviewCard = page.locator("[data-testid='overview-card']", {
    hasText: codeBlockMetadata.displayName!,
  });

  await expect(codeBlockOverviewCard).toHaveAttribute(
    "href",
    codeBlockMetadata.blockPackagePath,
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

  // Click text=Overview
  await page.locator("[data-testid='profile-page-blocks-tab']").click();

  await expect(page).toHaveURL("http://localhost:3000/@hash/blocks");

  const blocksCount = await page
    .locator("[data-testid='list-view-card']")
    .count();

  expect(blocksCount).toBeGreaterThan(3);

  await expect(page.locator(`text=Blocks${blocksCount}`)).toBeVisible();

  const codeBlockListViewCard = page.locator("[data-testid='list-view-card']", {
    hasText: codeBlockMetadata.displayName!,
  });

  await expect(codeBlockListViewCard).toHaveAttribute(
    "href",
    codeBlockMetadata.blockPackagePath,
  );

  await expect(codeBlockListViewCard.locator("img")).toHaveAttribute(
    "src",
    codeBlockMetadata.icon!,
  );

  await expect(
    codeBlockListViewCard.locator(`text=${codeBlockMetadata.description}`),
  ).toBeVisible();

  await page.locator("[data-testid='profile-page-schemas-tab']").click();

  await expect(page).toHaveURL("http://localhost:3000/@hash/schemas");

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

test("viewing in invalid account should 404", async ({ page }) => {
  test.skip();
  await page.goto("http://localhost:3000/@no-user");
  await expect(page.locator("text=404")).toBeVisible();
  await expect(
    page.locator("text=This page could not be found."),
  ).toBeVisible();
});

// split this into 2?
// - schema creation
// - show error ---> creating schema that already exists
// - viewing entity type page

// await page
//     .locator(
//       "text=Invalid schema: User already has a schema with title Testing",
//     )
//     .click();

// test("user should be able to create schema", async ({ page }) => {
//   await login({ page });
//   await page.goto("/@alice/schemas");

//   await expect(page.locator("text=Create a schema")).toBeVisible();
//   await page.locator("text=Create a schema").click();

//   await expect(page.locator("text=Create New Schema")).toBeVisible();
//   await expect(
//     page.locator(
//       "text=Schemas are used to define the structure of entities - in other words, define a ‘type’ of entity",
//     ),
//   ).toBeVisible();

//   // Check if text input is focused

//   await expect(page.locator("text=Create New Schema >> input")).toBeFocused();

//   // await page.locator('label:has-text("Schema Title *")').click();

//   await page.locator("text=Create New Schema >> input").fill("Testing+schema");

//   await page
//     .locator('div[role="presentation"] button:has-text("Create")')
//     .click();

//   await expect(
//     page.locator(
//       "text=Invalid schema: Schema 'title' must start with an uppercase letter, and contain ",
//     ),
//   ).toBeVisible();

//   await expect(
//     page.locator('div[role="presentation"] button:has-text("Create")'),
//   ).toBeDisabled();

//   const schemaName = "Testing";

//   await page.locator("text=Create New Schema >> input").fill(schemaName);

//   await expect(
//     page.locator('div[role="presentation"] button:has-text("Create")'),
//   ).toBeEnabled();

//   await page
//     .locator('div[role="presentation"] button:has-text("Create")')
//     .click();

//   await expect(page).toHaveURL(
//     `http://localhost:3000/@alice/types/${schemaName}`,
//   );

//   // Schema page tests

//   await expect(page.locator(`text=${schemaName} Schema`)).toBeVisible();

//   await expect(page.locator("text=@alice >")).toBeVisible();

//   await expect(
//     page.locator(
//       "text=You can use this editor to build basic schemas, representing types of entities.",
//     ),
//   ).toBeVisible();

//   await expect(
//     page.locator(
//       "text=You can use these entity types as the expected value for a property in another schema.",
//     ),
//   ).toBeVisible();

//   const schemaPropertiesTable = page.locator(
//     "[data-testid='schema-properties-table']",
//   );

//   await expect(schemaPropertiesTable).toBeVisible();

//   await expect(
//     schemaPropertiesTable.locator('[placeholder="newProperty"]'),
//   ).toBeVisible();

//   await expect(
//     schemaPropertiesTable.locator("text=Create Property"),
//   ).toBeVisible();
//   const property1Name = "label";
//   await expect(
//     schemaPropertiesTable.locator("tr", {
//       has: page.locator(`input[value='${property1Name}']`),
//     }),
//   ).not.toBeVisible();
//   await schemaPropertiesTable
//     .locator('[placeholder="newProperty"]')
//     .fill(property1Name);
//   await schemaPropertiesTable.locator("text=Create Property").click();
//   await expect(
//     schemaPropertiesTable.locator("tr", {
//       has: page.locator(`input[value='${property1Name}']`),
//     }),
//   ).toBeVisible();

//   const property2Name = "value1";

//   await schemaPropertiesTable
//     .locator('[placeholder="newProperty"]')
//     .fill(property2Name);

//   await schemaPropertiesTable.locator("text=Create Property").click();

//   const property2Row = schemaPropertiesTable.locator("tr", {
//     has: page.locator(`input[value='${property2Name}']`),
//   });

//   await expect(property2Row).toBeVisible();

//   await expect(property2Row.locator("text=Delete")).toBeVisible();

//   await property2Row.locator("text=Delete").click();

//   await expect(property2Row).not.toBeVisible();

//   // Add code to fetch json url and confirm the following
//   // it has the right title
//   // it has the right author
//   // it has the right elements in "properties" object
// });
