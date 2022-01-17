import type { NextApiHandler } from "next/";

/** @todo type as JSON object */
export type BlockProps = object;

/** @todo make part of blockprotocol package and publish */
export type BlockVariant = {
  description?: string;
  displayName?: string;
  icon?: string;
  properties?: BlockProps;
};

/** @todo make part of blockprotocol package and publish */
export type BlockMetadata = {
  author?: string;
  description?: string;
  displayName?: string;
  externals?: Record<string, string>;
  icon?: string;
  image?: string;
  lastUpdated?: string;
  license?: string;
  name: string;
  schema?: string;
  source?: string;
  variants?: BlockVariant[];
  version?: string;

  // @todo should be redundant to block's package.json#name
  packagePath: string;
};

export type BuildConfig = {
  workspace: string;
  repository: string;
  branch: string;
  distDir: string;
  timestamp: string;
};

/**
 * used to read block metadata from disk.
 *
 * @todo nextjs api endpoints don't have access to nextjs' public folder on vercel
 *    fix this to fetch from the URL instead (or some other way)
 */
export const readBlocksFromDisk = (): BlockMetadata[] => {
  /* eslint-disable global-require -- dependencies are required at runtime to avoid bundling them w/ nextjs */
  const fs = require("fs");
  const glob = require("glob");
  /* eslint-enable global-require */

  const buildConfig: BuildConfig[] = glob
    .sync(`${process.cwd()}/../hub/**/*.json`)
    .map((path: string) => ({
      ...JSON.parse(fs.readFileSync(path, { encoding: "utf8" })),
    }));

  return glob
    .sync(`${process.cwd()}/public/blocks/**/block-metadata.json`)
    .map((path: string) => ({
      // @todo should be redundant to block's package.json#name
      packagePath: path.split("/").slice(-3, -1).join("/"),
      ...JSON.parse(fs.readFileSync(path, { encoding: "utf8" })),
    }))
    .map((metadata: BlockMetadata) => ({
      ...metadata,
      image: `/blocks/${metadata.packagePath}/${metadata.image}`,
      lastUpdated: buildConfig.find(
        ({ workspace }) => workspace === metadata.name,
      )?.timestamp,
    }));
};

export const readBlockDataFromDisk = ({
  packagePath,
  schema,
  source,
}: BlockMetadata) => {
  /* eslint-disable global-require -- dependencies are required at runtime to avoid bundling them w/ nextjs */
  const fs = require("fs");
  // @todo update to also return the metadata information
  // @see https://github.com/blockprotocol/blockprotocol/pull/66#discussion_r784070161
  return {
    schema: JSON.parse(
      fs.readFileSync(
        `${process.cwd()}/public/blocks/${packagePath}/${schema}`,
        { encoding: "utf8" },
      ),
    ),
    source: fs.readFileSync(
      `${process.cwd()}/public/blocks/${packagePath}/${source}`,
      "utf8",
    ),
  };
};

let cachedBlocksFromDisk: Array<BlockMetadata> | null = null;

const blocks: NextApiHandler<BlockMetadata[]> = (_req, res) => {
  cachedBlocksFromDisk = cachedBlocksFromDisk ?? readBlocksFromDisk();
  res.status(200).json(cachedBlocksFromDisk);
};

export default blocks;
