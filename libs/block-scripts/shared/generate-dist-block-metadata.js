import path from "node:path";

import fs from "fs-extra";

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
    repository,
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
    repository,
    author,
    license,
    externals: peerDependencies,
    variants,
    ...blockprotocol,
    ...extra,
    /*
     * @todo - deprecate support for the old `blockprotocol.schema` definition and migrate to only supporting
     *   `blockprotocol.codegen.targets` instead.
     */
    schema:
      Object.values(blockprotocol.codegen.targets).find((sources) =>
        sources.find((source) => source.blockEntity),
      )?.sourceTypeId ?? blockprotocol.schema,
  };

  return writeFormattedJson(
    path.resolve(blockDistDirPath, "block-metadata.json"),
    blockMetadata,
  );
};
