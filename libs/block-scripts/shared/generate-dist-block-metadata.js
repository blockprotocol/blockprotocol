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
    schema: "block-schema.json",
    variants,
    ...blockprotocol,
    ...extra,
  };

  /* @todo - deprecate support for the old `schema` definitions and migrate to this being the primary implementation */
  for (const sources of Object.values(blockprotocol.codegen.targets)) {
    for (const source of sources) {
      if (source.blockEntity) {
        blockMetadata.schema = source.sourceTypeId;
        break;
      }
    }
  }

  return writeFormattedJson(
    path.resolve(blockDistDirPath, "block-metadata.json"),
    blockMetadata,
  );
};
