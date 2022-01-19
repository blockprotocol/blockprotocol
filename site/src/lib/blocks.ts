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

export type BlockRegistryInfo = {
  workspace: string;
  repository: string;
  branch: string;
  distDir: string;
  timestamp: string;
};

// This is temporarily used to populate each block with a preview image
// It wouldn't be needed once the image is added to each block's block-metadata.json file
const BLOCK_IMAGES = [
  {
    name: "@hashintel/block-table",
    image: "/assets/table-block.svg",
  },
  {
    name: "@hashintel/block-code",
    image: "/assets/code-block.svg",
  },
  {
    name: "@hashintel/block-header",
    image: "/assets/heading-block.svg",
  },
  {
    name: "@hashintel/block-image",
    image: "/assets/image-block.png",
  },
  {
    name: "@hashintel/block-paragraph",
    image: "/assets/default-block-img.svg",
  },
  {
    name: "@hashintel/block-person",
    image: "/assets/default-block-img.svg",
  },
  {
    name: "@hashintel/block-divider",
    image: "/assets/divider-block.svg",
  },
  {
    name: "@hashintel/block-embed",
    image: "/assets/default-block-img.svg",
  },
  {
    name: "@hashintel/block-video",
    image: "/assets/default-block-img.svg",
  },
];

export const readBlocksFromDisk = (): BlockMetadata[] => {
  /* eslint-disable global-require -- dependencies are required at runtime to avoid bundling them w/ nextjs */
  const fs = require("fs");
  const glob = require("glob");
  /* eslint-enable global-require */

  const registryInfo: BlockRegistryInfo[] = glob
    .sync(`${process.cwd()}/../registry/**/*.json`)
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
      lastUpdated: registryInfo.find(
        ({ workspace }) => workspace === metadata.name,
      )?.timestamp,
      image:
        BLOCK_IMAGES.find(({ name }) => name === metadata.name)?.image ?? null,
    }));
};
