import { BlockMetadata } from "blockprotocol";

/** @todo type as JSON object */
export type BlockProps = object;

export type ExpandedBlockMetadata = BlockMetadata & {
  packagePath: string;
  lastUpdated?: string;
};

export type BuildConfig = {
  workspace: string;
  repository: string;
  branch: string;
  distDir: string;
  timestamp: string;
};

const getBlockMediaUrl = (
  mediaPath: string | undefined | null,
  packagePath: string,
): string | null => {
  if (!mediaPath) {
    return null;
  }
  const regex = new RegExp("^(?:[a-z]+:)?//", "i");
  if (regex.test(mediaPath)) {
    return mediaPath;
  }

  return `/blocks/${packagePath}/${mediaPath}`;
};
/**
 * used to read block metadata from disk.
 *
 */
export const readBlocksFromDisk = (): ExpandedBlockMetadata[] => {
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
    .map((metadata: ExpandedBlockMetadata) => ({
      ...metadata,
      icon: getBlockMediaUrl(metadata.icon, metadata.packagePath),
      image: getBlockMediaUrl(metadata.image, metadata.packagePath),
      lastUpdated: buildConfig.find(
        ({ workspace }) => workspace === metadata.name,
      )?.timestamp,
    }));
};

export const readBlockDataFromDisk = ({
  packagePath,
  schema,
  source,
}: ExpandedBlockMetadata) => {
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
