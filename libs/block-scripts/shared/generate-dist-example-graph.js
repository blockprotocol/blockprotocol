import path from "node:path";

import fs from "fs-extra";

import { blockDistDirPath, blockRootDirPath } from "./paths.js";
import { writeFormattedJson } from "./write-formatted-json.js";

/* @todo - Where do we validate these metadata files, should it be here? */

/**
 * @param {Record<string, any>} assetsManifest
 * @param {string} assetsManifestPath
 */
export const generateDistExampleGraph = async (
  assetsManifest,
  assetsManifestPath,
) => {
  const exampleGraphScriptName = assetsManifest["example-graph.js"];

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
        "The default export of the example-graph script must be a valid example graph, containing top-level 'entities' and 'blockEntityRecordId' properties.",
      );
    }
    await writeFormattedJson(distExampleGraphPath, exampleGraph);

    await fs.remove(sourceScriptExampleGraphPath);
    // eslint-disable-next-line no-param-reassign
    delete assetsManifest["example-graph.js"];

    await writeFormattedJson(assetsManifestPath, assetsManifest);
    return;
  } else if (await fs.pathExists(sourcePlainTextExampleGraphPath)) {
    await fs.copy(sourcePlainTextExampleGraphPath, distExampleGraphPath);
    return;
  }

  console.warn("No example graph file found. Skipping generation.");
};
