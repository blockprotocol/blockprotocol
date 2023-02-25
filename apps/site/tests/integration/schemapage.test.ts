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

  await page.goto(entityType.schema.$id);

  await expect(page.locator(`text=${entityType.schema.title}`)).toBeVisible();

  await expect(page.locator("text=@alice >")).toBeVisible();

  await expect(page.locator("text=@alice >")).toHaveAttribute(
    "href",
    "/@alice",
  );

  await expect(page.locator(`text=${entityType.schema.$id}`)).toBeVisible();

  await expect(page.locator(`text=${entityType.schema.$id}`)).toHaveAttribute(
    "href",
    entityType.schema.$id,
  );

  await expect(page.locator(`text=Properties`)).toBeVisible();

  await expect(page.locator(`text=Links`)).toBeVisible();
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

  await page.goto(entityType.schema.$id);

  await expect(page.locator("text=Add a property")).toBeVisible();

  await expect(
    page.locator(`input[placeholder='Search for a property type'`),
  ).not.toBeVisible();

  await page.locator("text=Add a property").click();

  await expect(
    page.locator(`input[placeholder='Search for a property type']`),
  ).toBeVisible();

  const propertyName = "value1";

  await page
    .locator(`input[placeholder='Search for a property type'`)
    .fill(propertyName);

  const createButtonText = `Create ${propertyName}`;

  await expect(page.locator(`text='${createButtonText}'`)).toBeVisible();

  await page.locator(`text=${createButtonText}`).click();

  await expect(page.locator("text=Select acceptable values")).toBeVisible();
});
