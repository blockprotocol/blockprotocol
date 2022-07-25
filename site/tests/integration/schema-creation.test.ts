import { expect, test } from "playwright-test-coverage";

import { resetDb } from "../shared/fixtures";
import { login } from "../shared/nav";
import { createSchema } from "../shared/schemas";

// split this into 2?
// - schema creation
// - show error ---> creating schema that already exists
// - viewing entity type page

test("user should be able to create schema", async ({ page }) => {
  await resetDb();

  await page.goto("/");

  await login({ page });

  await page.goto("/dashboard");

  const schemaName1 = "Testing";
  const schemaName2 = "Testing2";

  await createSchema({
    title: schemaName1,
    page,
  });

  await page.locator("button", { hasText: "Create a Schema" }).click();

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

  //   @todo test if error displays when user inputs an existing schema

  await expect(schemaModal.locator('button:has-text("Create")')).toBeDisabled();

  await schemaModal.locator("input").fill(schemaName1);

  await expect(schemaModal.locator('button:has-text("Create")')).toBeEnabled();

  await schemaModal.locator('button:has-text("Create")').click();

  await page
    .locator(
      `text=Invalid schema: User already has a schema with title ${schemaName1}`,
    )
    .click();

  await schemaModal.locator("input").fill(schemaName2);

  await expect(schemaModal.locator('button:has-text("Create")')).toBeEnabled();

  await schemaModal.locator('button:has-text("Create")').click();

  await expect(page).toHaveURL(
    `http://localhost:3000/@alice/types/${schemaName2}`,
  );

  await expect(page.locator(`text=${schemaName2} Schema`)).toBeVisible();

  await expect(page.locator("text=@alice >")).toBeVisible();
});
