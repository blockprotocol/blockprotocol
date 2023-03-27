import path from "node:path";

import fs from "fs-extra";

import { blockDistDirPath, blockRootDirPath } from "./paths.js";

/**
 * @param {Record<string, any>} assetsManifest
 */
export const generateDistExampleGraph = async (assetsManifest) => {
  const exampleGraphScriptName = assetsManifest["example-graph.cjs"];

  const distExampleGraphPath = path.resolve(
    blockDistDirPath,
    "example-graph.json",
  );

  const sourcePlainTextExampleGraphPath = path.resolve(
    blockRootDirPath,
    "example-graph.json",
  );
  const sourceScriptExampleGraphPath = exampleGraphScriptName
    ? path.resolve(blockDistDirPath, exampleGraphScriptName)
    : undefined;

  if (
    sourceScriptExampleGraphPath &&
    (await fs.pathExists(sourceScriptExampleGraphPath))
  ) {
    if (await fs.pathExists(sourcePlainTextExampleGraphPath)) {
      throw new Error(
        "Both example-graph.js and example-graph.json exist. Please only supply one of them.",
      );
    }

    const {
      default: { default: exampleGraph },
    } = await import(sourceScriptExampleGraphPath);

    if (exampleGraph === undefined || !exampleGraph.entities) {
      throw new Error(
        "The default export of the example-graph script must be a valid example graph, containing a top-level 'entities' property.",
      );
    }
    await fs.writeJson(distExampleGraphPath, exampleGraph);

    /* @todo - we should probably remove it from the `assets-manifest.json as well */
    await fs.remove(sourceScriptExampleGraphPath);
  } else if (await fs.pathExists(sourcePlainTextExampleGraphPath)) {
    await fs.copy(sourcePlainTextExampleGraphPath, distExampleGraphPath);
  }
};
