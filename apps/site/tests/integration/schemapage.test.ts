import { resetSite } from "../shared/fixtures.js";
import { login } from "../shared/nav.js";
import { createSchema } from "../shared/schemas.js";
import { expect, test } from "../shared/wrapped-playwright.js";

test.beforeEach(async () => {
  await resetSite();
});

test("schema page should contain key elements", async ({ page }) => {
  await page.goto("/");

  await login({ page });

  const entityType = await createSchema({
    title: "TestSchema",
    page,
  });

  await page.goto(`/@alice/types/${entityType.schema.title}`);

  await expect(
    page.locator(`text=${entityType.schema.title} Schema`),
  ).toBeVisible();

  await expect(page.locator("text=@alice >")).toBeVisible();

  await expect(page.locator("text=@alice >")).toHaveAttribute(
    "href",
    "/@alice",
  );

  await expect(
    page.locator(
      "text=You can use this editor to build basic schemas, representing types of entities.",
    ),
  ).toBeVisible();

  await expect(
    page.locator(
      "text=You can use these entity types as the expected value for a property in another schema.",
    ),
  ).toBeVisible();

  await expect(page.locator(`text=${entityType.schema.$id}`)).toBeVisible();

  await expect(page.locator(`text=${entityType.schema.$id}`)).toHaveAttribute(
    "href",
    entityType.schema.$id,
  );

  await expect(page.locator(`a:has-text('this link')`)).toHaveAttribute(
    "href",
    `${entityType.schema.$id}?json`,
  );

  const schemaPropertiesTable = page.locator(
    "[data-testid='schema-properties-table']",
  );

  await expect(schemaPropertiesTable).toBeVisible();

  await expect(
    schemaPropertiesTable.locator('[placeholder="newProperty"]'),
  ).toBeVisible();

  await expect(
    schemaPropertiesTable.locator("text=Create Property"),
  ).toBeVisible();
});

test("authenticated user should be able to update their schema in schema page", async ({
  page,
}) => {
  await page.goto("/");

  await login({ page });

  const entityType = await createSchema({
    title: "TestSchema",
    page,
  });

  await page.goto(`/@alice/types/${entityType.schema.title}`);

  const schemaPropertiesTable = page.locator(
    "[data-testid='schema-properties-table']",
  );

  await expect(
    schemaPropertiesTable.locator('[placeholder="newProperty"]'),
  ).toBeVisible();

  await expect(
    schemaPropertiesTable.locator("text=Create Property"),
  ).toBeVisible();

  const property1Name = "label";

  await expect(
    schemaPropertiesTable.locator("tr", {
      has: page.locator(`input[value='${property1Name}']`),
    }),
  ).not.toBeVisible();

  await schemaPropertiesTable
    .locator('[placeholder="newProperty"]')
    .fill(property1Name);

  await schemaPropertiesTable.locator("text=Create Property").click();

  await expect(
    schemaPropertiesTable.locator("tr", {
      has: page.locator(`input[value='${property1Name}']`),
    }),
  ).toBeVisible();

  const property2Name = "value1";

  await schemaPropertiesTable
    .locator('[placeholder="newProperty"]')
    .fill(property2Name);

  await schemaPropertiesTable.locator("text=Create Property").click();

  const property2Row = schemaPropertiesTable.locator("tr", {
    has: page.locator(`input[value='${property2Name}']`),
  });

  await expect(property2Row).toBeVisible();

  await expect(property2Row.locator("text=Delete")).toBeVisible();

  await property2Row.locator("text=Delete").click();

  await expect(property2Row).not.toBeVisible();
});
