import { writeFileSync } from "fs";
import path from "path";
import { readBlocksFromDisk } from "../src/lib/blocks";

const blocksInfo = readBlocksFromDisk();

writeFileSync(
  path.join(process.cwd(), `blocks-data.json`),
  JSON.stringify(blocksInfo, null, "\t"),
);

console.log("✅ Generated blocks data");
