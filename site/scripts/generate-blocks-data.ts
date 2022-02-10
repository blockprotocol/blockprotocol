import chalk from "chalk";
import { writeFileSync } from "fs";
import path from "path";
import { readBlocksFromDisk } from "../src/lib/blocks";

const script = async () => {
  console.log(chalk.bold("Generating blocks data..."));

  const blocksInfo = readBlocksFromDisk();

  writeFileSync(
    path.join(process.cwd(), `blocks-data.json`),
    JSON.stringify(blocksInfo, null, "\t"),
  );

  console.log("✅ Blocks data generated");
};

export default script();
