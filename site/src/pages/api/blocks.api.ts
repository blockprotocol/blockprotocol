
import type { NextApiHandler } from "next/"

/** @sync @hashintel/block-protocol */
export type BlockProps = object;

/** @sync @hashintel/block-protocol */
export type BlockVariant = {
  description?: string;
  icon?: string;
  name?: string;
  properties?: BlockProps;
};

/** @sync @hashintel/block-protocol */
export type BlockMetadata = {
  author?: string;
  description?: string;
  externals?: Record<string, string>;
  icon?: string;
  license?: string;
  name?: string;
  packageName: string;
  schema?: string;
  source?: string;
  variants?: BlockVariant[];
  version?: string;
};

/**
 * used to read block metadata from disk. dependencies are required at the
 * last moment to avoid bundle them w/ nextjs
 */
export const readBlocksFromDisk = (): BlockMetadata[] => {
  const fs = require("fs");
  const glob = require("glob");
  
  return glob
    .sync(`${process.cwd()}/public/blocks/**/metadata.json`)
    .map((path: string) => ({
      // @todo possible redundant w/ .name property
      packageName: path.split("/").slice(-3, -1).join("/"),
      ...JSON.parse(fs.readFileSync(path, { encoding: "utf8" })),
    }));
};

let cachedBlocksFromDisk: Array<BlockMetadata> | null = null;

const blocks: NextApiHandler<BlockMetadata[]> = (_req, res) => {
  cachedBlocksFromDisk || (cachedBlocksFromDisk = readBlocksFromDisk());
  res.status(200).json(cachedBlocksFromDisk);
}

export default blocks;