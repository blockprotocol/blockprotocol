import fs from "fs-extra";
import path from "node:path";

import { blockDistDirPath, blockRootDirPath } from "./paths.js";
import { writeFormattedJson } from "./write-formatted-json.js";

/**
 * @param {Record<string, string>} extra
 */
export const generateDistBlockMetadata = async (extra) => {
  const packageJsonPath = path.resolve(blockRootDirPath, "./package.json");
  const variantsJsonPath = path.resolve(blockRootDirPath, "./variants.json");

  const {
    name,
    version,
    description,
    author,
    license,
    blockprotocol,
    peerDependencies,
  } = await fs.readJson(packageJsonPath);

  const variants = (await fs.pathExists(variantsJsonPath))
    ? await fs.readJson(variantsJsonPath)
    : undefined;

  const blockMetadata = {
    name,
    version,
    description,
    author,
    license,
    externals: peerDependencies,
    schema: "block-schema.json",
    exampleGraph: "example-graph.json",
    variants,
    ...blockprotocol,
    ...extra,
  };

  return writeFormattedJson(
    path.resolve(blockDistDirPath, "block-metadata.json"),
    blockMetadata,
  );
};
