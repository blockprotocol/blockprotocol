import { resetSite } from "../shared/fixtures.js";
import { login } from "../shared/nav.js";
import { createSchema } from "../shared/schemas.js";
import { expect, test } from "../shared/wrapped-playwright.js";

test("user should be able to create schema", async ({ page }) => {
  await resetSite();

  await page.goto("/");

  await login({ page });

  await page.goto(`/@alice/all-types`);

  const existingSchemaName = "Testing";
  const newSchemaName = "Testing2";

  await createSchema({
    title: existingSchemaName,
    page,
  });

  await page.locator("button", { hasText: "Create a Type" }).click();

  const schemaModal = page.locator("[data-testid='create-schema-modal']");

  await expect(schemaModal).toBeVisible();

  await expect(schemaModal.locator("text=Create New Schema")).toBeVisible();
  await expect(
    schemaModal.locator(
      "text=Schemas are used to define the structure of entities - in other words, define a ‘type’ of entity",
    ),
  ).toBeVisible();

  await expect(schemaModal.locator("input")).toBeFocused();

  await schemaModal.locator("input").fill("Testing+schema");

  await schemaModal.locator('button:has-text("Create")').click();

  await expect(
    schemaModal.locator(
      "text=Invalid schema: Schema 'title' must start with an uppercase letter, and contain ",
    ),
  ).toBeVisible();

  await expect(schemaModal.locator('button:has-text("Create")')).toBeDisabled();

  await schemaModal.locator("input").fill(existingSchemaName);

  await expect(schemaModal.locator('button:has-text("Create")')).toBeEnabled();

  await schemaModal.locator('button:has-text("Create")').click();

  await page
    .locator(
      `text=Invalid schema: User already has a schema with title ${existingSchemaName}`,
    )
    .click();

  await schemaModal.locator("input").fill(newSchemaName);

  await expect(schemaModal.locator('button:has-text("Create")')).toBeEnabled();

  await schemaModal.locator('button:has-text("Create")').click();

  await expect(page).toHaveURL(`/@alice/types/${newSchemaName}`);

  await expect(page.locator(`text=${newSchemaName} Schema`)).toBeVisible();

  await expect(page.locator("text=@alice >")).toBeVisible();
});
