import { execa } from "execa";
import fs from "fs-extra";
import { globby } from "globby";

import type { ExpandedBlockMetadata } from "../../src/lib/blocks.js";

const getFileTimestamp = async (filePath: string) => {
  const stat = await fs.stat(filePath);
  return stat.mtimeMs;
};

/**
 * Playwright tests may occasionally fail due to browser flakiness (mostly
 * happens on Webkit). Before an integration test is re-run, the database is
 * reset and data like user ids is regenerated. When tests revisit a page with
 * getStaticProps, `next start` may return cached HTML or JSON. Server responses
 * may contain field values that are no longer valid, which in turn may produce
 * broken DOM. To avoid this, we delete cached results of `getStaticProps` after
 * seeding the database.
 *
 * For this trick to work, `next.config.js → experimental → isrMemoryCacheSize`
 * needs to be set to zero. This value should not affect Vercel deployments. Docs:
 * https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#self-hosting-isr
 */
const deleteIsrFilesCreatedAfterNextBuild = async () => {
  const buildTimestamp = await getFileTimestamp(".next/trace"); // last file created by `next build`

  const files = await globby(".next", {
    ignore: [
      ".next/cache/blocks", // See scripts named copy-blocks-from-ci-cache and copy-blocks-to-ci-cache
    ],
  });

  for (const file of files) {
    const timestamp = await getFileTimestamp(file);
    if (timestamp > buildTimestamp) {
      console.log(`Deleting ${file}`);
      await fs.remove(file);
    }
  }
};

export const resetSite = async () => {
  await execa("yarn", ["exe", "scripts/seed-db.js"]);
  await deleteIsrFilesCreatedAfterNextBuild();
};

export const getBlocksData = async (): Promise<ExpandedBlockMetadata[]> => {
  return await fs.readJson("./blocks-data.json");
};
