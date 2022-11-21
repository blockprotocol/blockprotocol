import type { EntityType } from "../../src/lib/api/model/entity-type.model";
import type { Page } from "./wrapped-playwright.js";
import { expect } from "./wrapped-playwright.js";

/**
 * Provides a quick way to create entity types using direct API calls instead of UI
 */
export const createSchema = async ({
  title,
  page,
}: {
  title: string;
  page: Page;
}): Promise<EntityType> => {
  await page.waitForLoadState("networkidle");

  const response = await page.request.post("/api/types/create", {
    data: {
      schema: {
        title,
      },
    },
    failOnStatusCode: true,
  });

  const { entityType } = (await response.json()) as {
    entityType: EntityType;
  };

  expect(entityType.schema.title).toBe(title);

  await page.reload();
  await page.waitForLoadState("networkidle");

  return entityType;
};
