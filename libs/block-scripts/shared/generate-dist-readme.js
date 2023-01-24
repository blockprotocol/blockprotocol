import path from "node:path";

import fs from "fs-extra";

import { blockDistDirPath, blockRootDirPath } from "./paths.js";

export const generateDistReadme = async () => {
  const readmeInRootFilePath = path.resolve(blockRootDirPath, "README.md");
  const readmeInDistFilePath = path.resolve(blockDistDirPath, "README.md");

  if (await fs.pathExists(readmeInRootFilePath)) {
    const readme = await fs.readFile(readmeInRootFilePath, "utf8");

    if (!readme.startsWith("# Block template")) {
      await fs.writeFile(readmeInDistFilePath, readme, "utf8");
    }
  }
};
