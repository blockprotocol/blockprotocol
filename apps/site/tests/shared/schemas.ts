import { EntityTypeWithMetadata } from "@blockprotocol/graph";

import { type Page, expect } from "./wrapped-playwright.js";

/**
 * Provides a quick way to create entity types using direct API calls instead of UI
 */
export const createSchema = async ({
  title,
  page,
}: {
  title: string;
  page: Page;
}): Promise<EntityTypeWithMetadata> => {
  await page.waitForLoadState("networkidle");

  const response = await page.request.post("/api/types/entity-type/create", {
    data: {
      schema: {
        title,
      },
    },
    failOnStatusCode: true,
  });

  const { entityType } = (await response.json()) as {
    entityType: EntityTypeWithMetadata;
  };

  expect(entityType.schema.title).toBe(title);

  await page.reload();
  await page.waitForLoadState("networkidle");

  return entityType;
};
