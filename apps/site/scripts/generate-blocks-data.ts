import path from "node:path";

import chalk from "chalk";
import fs from "fs-extra";

import { readBlocksFromDisk } from "../src/lib/blocks";

const script = async () => {
  console.log(chalk.bold("Generating blocks data..."));

  const blocksInfo = await readBlocksFromDisk();

  const blocksDataFilePath = path.join(process.cwd(), `blocks-data.json`);
  await fs.writeJson(blocksDataFilePath, blocksInfo, { spaces: "\t" });

  console.log(`✅ Blocks data generated: ${blocksDataFilePath}`);
};

await script();
