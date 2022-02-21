import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { readBlocksFromDisk } from "../src/lib/blocks";

const script = async () => {
  console.log(chalk.bold("Generating blocks data..."));

  const blocksInfo = readBlocksFromDisk();

  const blocksDataFilePath = path.join(process.cwd(), `blocks-data.json`);
  await fs.writeJson(blocksDataFilePath, blocksInfo, { spaces: "\t" });

  console.log(`✅ Blocks data generated: ${blocksDataFilePath}`);
};

export default script();
