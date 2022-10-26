import { execa } from "execa";
import fs from "fs-extra";

import type { ExpandedBlockMetadata } from "../../src/lib/blocks.js";

export const resetDb = async () => {
  await execa("yarn", ["exe", "scripts/seed-db.ts"]);
};

export const getBlocksData = async (): Promise<ExpandedBlockMetadata[]> => {
  return await fs.readJson("./blocks-data.json");
};
