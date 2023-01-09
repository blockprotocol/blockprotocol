import path from "node:path";

import fs from "fs-extra";

import { blockDistDirPath, blockRootDirPath } from "./paths.js";

export const generateDistExampleGraph = async () => {
  const exampleGraphInDistFilePath = path.resolve(
    blockDistDirPath,
    "example-graph.json",
  );
  const exampleGraphFilePath = path.resolve(
    blockRootDirPath,
    "example-graph.json",
  );

  if (await fs.pathExists(exampleGraphFilePath)) {
    await fs.copy(exampleGraphFilePath, exampleGraphInDistFilePath);
  }
};
