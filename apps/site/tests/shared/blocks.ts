import type { Page } from "playwright";
import { expect } from "playwright-test-coverage";

import type { ExpandedBlockMetadata } from "../../src/lib/blocks.js";

/**
 * Provides a quick way to publish blocks using direct API calls instead of UI
 */
export const publishBlock = async ({
  npmPackageName,
  blockName,
  page,
}: {
  npmPackageName: string;
  blockName: string;
  page: Page;
}): Promise<ExpandedBlockMetadata> => {
  await page.waitForLoadState("networkidle");

  const response = await page.request.post("/api/blocks/create", {
    data: {
      npmPackageName,
      blockName,
    },
    failOnStatusCode: true,
  });

  const { block } = (await response.json()) as {
    block: ExpandedBlockMetadata;
  };

  expect(block.name).toBe(blockName);

  await page.reload();
  await page.waitForLoadState("networkidle");

  return block;
};
