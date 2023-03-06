import slugify from "slugify";

import { resetSite } from "../shared/fixtures.js";
import { login } from "../shared/nav.js";
import { createSchema } from "../shared/schemas.js";
import { expect, test } from "../shared/wrapped-playwright.js";

test("user should be able to create an Entity Type", async ({ page }) => {
  await resetSite();

  await page.goto("/");

  await login({ page });

  await page.goto(`/@alice/all-types`);

  const existingSchemaName = "Testing";
  const newSchemaName = "Testing2";

  const existingSchemaWithMetadata = await createSchema({
    title: existingSchemaName,
    page,
  });

  await page.locator("button", { hasText: "Create an Entity Type" }).click();

  const schemaModal = page.locator("[data-testid='create-schema-modal']");

  await expect(schemaModal).toBeVisible();

  await expect(
    schemaModal.locator("text=Create New Entity Type"),
  ).toBeVisible();
  await expect(
    schemaModal.locator(
      "text=Types are used to define the structure of entities and their relationships to other entities.",
    ),
  ).toBeVisible();

  const input = await schemaModal.locator("input");

  await expect(input).toBeFocused();

  await input.fill(existingSchemaName);

  const textareas = await schemaModal.locator("textarea").all();

  expect(textareas.length).toBe(2);

  const textarea = textareas[0]!;

  await textarea.fill("Test description");

  await expect(schemaModal.locator('button:has-text("Create")')).toBeEnabled();

  await schemaModal.locator('button:has-text("Create")').click();

  await expect(
    page.locator("[data-testid='create-schema-modal']", {
      hasText: `Type title must be unique`,
    }),
  ).toBeVisible();

  await input.fill(newSchemaName);

  await expect(schemaModal.locator('button:has-text("Create")')).toBeEnabled();

  await schemaModal.locator('button:has-text("Create")').click();

  await expect(page).toHaveURL(
    `/@alice/types/entity-type/${slugify(newSchemaName, {
      lower: true,
      strict: true,
    })}/v/1`,
  );

  await expect(
    page.getByRole("heading", { name: `${newSchemaName} Entity Type` }),
  ).toBeVisible();

  await expect(page.locator("text=@alice >")).toBeVisible();
});
