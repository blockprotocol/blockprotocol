import fs from "fs-extra";
import path from "node:path";

import { blockDistDirPath, blockRootDirPath } from "./paths.js";
import { writeFormattedJson } from "./write-formatted-json.js";

export const generateDistExampleGraph = async () => {
  const blockMetadataInDistPath = path.resolve(
    blockDistDirPath,
    "block-metadata.json",
  );
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

    const blockMetadata = (await fs.pathExists(blockMetadataInDistPath))
      ? await fs.readJson(blockMetadataInDistPath)
      : undefined;

    if (blockMetadata) {
      writeFormattedJson(path.resolve(blockMetadataInDistPath), {
        ...blockMetadata,
        exampleGraph: "example-graph.json",
      });
    }
  }
};
