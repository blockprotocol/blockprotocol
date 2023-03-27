import path from "node:path";

import fs from "fs-extra";

import { blockDistDirPath, blockRootDirPath } from "./paths.js";

/* @todo - Where do we validate these metadata files, should it be here? */

/**
 * @param {Record<string, any>} assetsManifest
 * @param {string} assetsManifestPath
 */
export const generateDistExampleGraph = async (
  assetsManifest,
  assetsManifestPath,
) => {
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

    await fs.remove(sourceScriptExampleGraphPath);
    // eslint-disable-next-line no-param-reassign
    delete assetsManifest["example-graph.cjs"];

    await fs.writeJson(assetsManifestPath, assetsManifest, { spaces: 2 });
    return;
  } else if (await fs.pathExists(sourcePlainTextExampleGraphPath)) {
    await fs.copy(sourcePlainTextExampleGraphPath, distExampleGraphPath);
    return;
  }

  /* @todo - Should this be optional? */
  throw new Error(
    "No example graph found. Please supply either a `./src/example-graph.ts`, or an `./example-graph.json` file.",
  );
};
