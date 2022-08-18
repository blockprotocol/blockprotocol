import {
  BlockMetadata,
  BlockMetadataRepository,
  JsonObject,
} from "@blockprotocol/core";
import fs from "fs-extra";
import { globby } from "globby";
import hostedGitInfo from "hosted-git-info";
import path from "node:path";

import { FRONTEND_URL } from "./config";

/** @todo type as JSON object */
export type BlockProps = object;

/**
 * This represents the block metadata created when blocks are built from source and served from the NextJS app
 */
export type BlockMetadataOnDisk = BlockMetadata & {
  unstable_hubInfo: {
    directory: string;
    checksum: string;
    commit: string;
    preparedAt: string;
  };
};

/**
 * This is the expanded block metadata that is served via the API
 * Relative file URLs are rewritten to be absolute, and other fields are added
 */
export type ExpandedBlockMetadata = BlockMetadata & {
  // the block's URL on blockprotocol.org
  blockSitePath: string;
  // the folder where the block's assets are stored, currently doubling up as a unique identifier for the block
  // @todo this needs rethinking when we introduce versions, as there will be multiple asset folders
  componentId: string;
  // an absolute URL to example-graph.json, if it exists
  exampleGraph?: string | null;
  lastUpdated?: string | null;
  // @[namespace]/[block-path] - unique identifier per block (across all versions)
  packagePath: string;
  // the repository URL as a string (including commit and folder info where appropriate)
  repository?: string;
  // metadata.schema rewritten to be an absolute URL
  schema?: string | null;
};

// The contents of the JSON file users provide when adding a block via PR, stored in the hub/ folder
export interface StoredBlockInfo {
  repository: string;
  commit: string;
  distDir?: string;
  folder?: string;
  workspace?: string;
}

// Generate an absolute url to a block file
const generateBlockFileUrl = (
  mediaPath: string | undefined | null,
  blockDistributionFolderUrl: string,
): string | null => {
  if (!mediaPath) {
    return null;
  }
  const regex = /^(?:[a-z]+:)?\/\//i;
  if (regex.test(mediaPath)) {
    return mediaPath;
  }

  return `${blockDistributionFolderUrl}/${mediaPath.replace(/^\//, "")}`;
};

// this only runs on the server-side because hosted-git-info uses some nodejs dependencies
const getRepositoryUrl = (
  repository: BlockMetadataRepository | undefined,
  commit: string,
  hubInfoDirPath: string | undefined,
): string | undefined => {
  if (typeof repository === "string") {
    const repositoryUrl = hostedGitInfo
      .fromUrl(repository)
      ?.browse(hubInfoDirPath ?? "", { committish: commit });

    if (repositoryUrl) {
      return repositoryUrl;
    }

    return undefined;
  }

  const { url, directory } = repository ?? {};

  if (url) {
    const repositoryUrl = hostedGitInfo
      .fromUrl(url)
      ?.browse(hubInfoDirPath ?? directory ?? "", { committish: commit });

    if (repositoryUrl) {
      return repositoryUrl;
    }
  }

  return undefined;
};

const enhanceBlockMetadata = (
  metadata: BlockMetadata,
  source: {
    blockDistributionFolderUrl: string;
    packagePath: string;
    repoUrl: string;
    repoCommit: string;
    repoDirectory?: string;
  },
  lastUpdated: string,
  includesExampleGraph: boolean,
): ExpandedBlockMetadata => {
  const {
    blockDistributionFolderUrl,
    packagePath,
    repoUrl,
    repoCommit,
    repoDirectory,
  } = source;

  const repository = getRepositoryUrl(
    repoUrl,
    repoCommit,
    repoDirectory,
  )?.replace(/\/$/, "");

  return {
    ...metadata,
    author: packagePath.split("/")[0]!.replace(/^@/, ""),
    blockSitePath: `/${packagePath.split("/").join("/blocks/")}`,
    // fallback while not all blocks have blockType defined
    blockType: metadata.blockType ?? { entryPoint: "react" },
    componentId: `${FRONTEND_URL}/blocks/${packagePath}`,
    // @todo should be redundant to block's package.json#name
    icon: generateBlockFileUrl(metadata.icon, blockDistributionFolderUrl),
    image: generateBlockFileUrl(metadata.image, blockDistributionFolderUrl),
    packagePath,
    repository,
    schema: generateBlockFileUrl(metadata.schema, blockDistributionFolderUrl)!,
    source: generateBlockFileUrl(metadata.source, blockDistributionFolderUrl)!,
    variants: metadata.variants?.length
      ? metadata.variants?.map((variant) => ({
          ...variant,
          icon: generateBlockFileUrl(variant.icon, blockDistributionFolderUrl)!,
        }))
      : null,
    exampleGraph: generateBlockFileUrl(
      includesExampleGraph ? "example-graph.json" : null,
      blockDistributionFolderUrl,
    ),
  };
};

/**
 * used to read and enhance block metadata from disk.
 */
export const readBlocksFromDisk = async (): Promise<
  ExpandedBlockMetadata[]
> => {
  const blockMetadataFilePaths = await globby(
    path.resolve(process.cwd(), `public/blocks/**/block-metadata.json`),
  );

  const result: ExpandedBlockMetadata[] = [];
  for (const blockMetadataFilePath of blockMetadataFilePaths) {
    const packagePath = blockMetadataFilePath
      .split("/")
      .slice(-3, -1)
      .join("/");

    const partialMetadata: BlockMetadataOnDisk = await fs.readJson(
      blockMetadataFilePath,
      {
        encoding: "utf8",
      },
    );

    const storedBlockInfo: StoredBlockInfo = await fs.readJson(
      path.resolve(process.cwd(), `../hub/${packagePath}.json`),
      { encoding: "utf8" },
    );

    const exampleGraphFileExists = await fs.pathExists(
      blockMetadataFilePath.replace(
        "block-metadata.json",
        "example-graph.json",
      ),
    );

    const blockDistributionFolderUrl = `${FRONTEND_URL}/blocks/${packagePath}`;

    const expandedMetadata: ExpandedBlockMetadata = enhanceBlockMetadata(
      partialMetadata,
      {
        blockDistributionFolderUrl,
        packagePath,
        repoCommit: storedBlockInfo.commit,
        repoDirectory: partialMetadata.unstable_hubInfo?.directory,
        repoUrl: storedBlockInfo.repository,
      },
      partialMetadata.unstable_hubInfo.preparedAt,
      exampleGraphFileExists,
    );

    result.push(expandedMetadata);
  }

  return result;
};

// Blocks which are currently not compliant with the spec, and are thus misleading examples
const blocksToHide = [
  "@hash/callout",
  "@hash/embed",
  "@hash/header",
  "@hash/paragraph",
];

/** Helps consistently hide certain blocks from the hub and user profile pages */
export const excludeHiddenBlocks = (
  blocks: ExpandedBlockMetadata[],
): ExpandedBlockMetadata[] => {
  return blocks.filter(
    ({ packagePath }) => !blocksToHide.includes(packagePath),
  );
};

export const retrieveBlockFileContent = async ({
  packagePath,
  schema: metadataSchemaUrl,
  source: metadataSourceUrl,
  exampleGraph: metadataExampleGraphUrl,
}: ExpandedBlockMetadata): Promise<{
  schema: JsonObject;
  source: string;
  exampleGraph: JsonObject | null;
}> => {
  const schema = metadataSchemaUrl.startsWith(FRONTEND_URL)
    ? JSON.parse(
        await fs.readFile(
          path.resolve(
            process.cwd(),
            `public/blocks/${packagePath}/${metadataSchemaUrl.substring(
              metadataSchemaUrl.lastIndexOf("/") + 1,
            )}`,
          ),
          { encoding: "utf8" },
        ),
      )
    : await fetch(metadataSchemaUrl).then((response) => response.json());

  const source = metadataSourceUrl.startsWith(FRONTEND_URL)
    ? await fs.readFile(
        path.resolve(
          process.cwd(),
          `public/blocks/${packagePath}/${metadataSourceUrl.substring(
            metadataSourceUrl.lastIndexOf("/") + 1,
          )}`,
        ),
        { encoding: "utf8" },
      )
    : await fetch(metadataSourceUrl).then((response) => response.text());

  let exampleGraph = null;

  if (metadataExampleGraphUrl) {
    exampleGraph = metadataExampleGraphUrl.startsWith(FRONTEND_URL)
      ? JSON.parse(
          fs.readFileSync(
            `${process.cwd()}/public/blocks/${packagePath}/${metadataExampleGraphUrl.substring(
              metadataExampleGraphUrl.lastIndexOf("/") + 1,
            )}`,
            { encoding: "utf8" },
          ),
        )
      : await fetch(metadataExampleGraphUrl).then((response) =>
          response.json(),
        );
  }

  return {
    schema,
    source,
    exampleGraph,
  };
};

export const readBlockReadmeFromDisk = async (
  blockMetadata: ExpandedBlockMetadata,
): Promise<string | undefined> => {
  try {
    return fs.readFileSync(
      `${process.cwd()}/public/blocks/${
        blockMetadata.packagePath
      }/README.vercel-hack.md`,
      "utf8",
    );
  } catch {
    return undefined;
  }
};
