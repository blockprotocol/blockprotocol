import execa from "execa";
import { expect, test } from "playwright-test-coverage";

import { readValueFromRecentDummyEmail } from "../shared/dummy-emails";
import { login, openLoginModal } from "../shared/nav";

// @todo add loginUser util

test("viewing account page as authenticated user should have key elements", async ({
  page,
  isMobile,
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

// test("Viewing an account page as a guest user should contain key elements", async ({
//   page,
// }) => {
//   await page.goto("http://localhost:3000/@hash");
//   await expect(page.locator('h3:has-text("HASH")')).toBeVisible();
//   await expect(page.locator("text=@hash")).toBeVisible();

//   // @todo confirm cards are displayed here

//   // Confirm count matches number in tab

//   // @todo confirm Code card info is displayed

//   // @todo confirm links in each of the tabs are displayed

//   // Click h3:has-text("HASH")
//   await page.locator('h3:has-text("HASH")').click();

//   // Click text=@hash
//   await page.locator("text=@hash").click();

//   // Click a[role="tab"]:has-text("Overview")
//   await page.locator('a[role="tab"]:has-text("Overview")').click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash");

//   // Click p:has-text("Code")
//   await page.locator('p:has-text("Code")').click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash/blocks/code");

//   // Go to http://localhost:3000/@hash
//   await page.goto("http://localhost:3000/@hash");

//   // Click text=Write monospaced code with syntax highlighting in a range of programming and mar
//   await page
//     .locator(
//       "text=Write monospaced code with syntax highlighting in a range of programming and mar",
//     )
//     .click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash");

//   // Go to http://localhost:3000/@hash
//   await page.goto("http://localhost:3000/@hash");

//   // Click text=0.2.0 >> nth=0
//   await page.locator("text=0.2.0").first().click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash");

//   // Click text=CodeBlock >> span
//   await page.locator("text=CodeBlock >> span").click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash");

//   // Click a[role="tab"]:has-text("Blocks6")
//   await page.locator('a[role="tab"]:has-text("Blocks6")').click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash/blocks");

//   // Click #profile-tabpanel-1 div:has-text("CodeWrite monospaced code with syntax highlighting in a range of programming and") >> nth=0
//   await page
//     .locator(
//       '#profile-tabpanel-1 div:has-text("CodeWrite monospaced code with syntax highlighting in a range of programming and")',
//     )
//     .first()
//     .click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash/blocks");

//   // Go to http://localhost:3000/@hash/blocks
//   await page.goto("http://localhost:3000/@hash/blocks");

//   // Click p:has-text("Code")
//   await page.locator('p:has-text("Code")').click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash/blocks");

//   // Click a[role="tab"]:has-text("Schemas0")
//   await page.locator('a[role="tab"]:has-text("Schemas0")').click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash/schemas");

//   // Click text=@hash hasn’t published any schemas yet
//   await page.locator("text=@hash hasn’t published any schemas yet").click();

//   // Click text=You can browse existing schemas on the Block Hub.
//   await page
//     .locator("text=You can browse existing schemas on the Block Hub.")
//     .click();

//   // Click text=Browse the Block Hub
//   await page.locator("text=Browse the Block Hub").click();
//   await expect(page).toHaveURL("http://localhost:3000/@hash/schemas");

//   // Go to http://localhost:3000/@hash/schemas
//   await page.goto("http://localhost:3000/@hash/schemas");

//   // Go to http://localhost:3000/@no-user
//   await page.goto("http://localhost:3000/@no-user");
// });

test("viewing in invalid account should 404", async ({ page }) => {
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
